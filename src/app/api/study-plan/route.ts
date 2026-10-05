import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient, getOpenAIModel } from '@/lib/ai/client';

const RequestSchema = z.object({
  totalTests: z.number(),
  averageScore: z.number(),
  weakTopics: z.array(z.string()),
  categoryBreakdown: z.record(z.string(), z.number()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid parameters', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { totalTests, averageScore, weakTopics } = parsed.data;
    const openai = getOpenAIClient();

    if (openai) {
      try {
        const systemPrompt = `You are an elite BPO training director preparing candidates for Concentrix US Non-Voice assessment rounds.
Based on the candidate's stats and identified weak topics, provide an actionable, structured 5-day study plan. Output strictly JSON.`;

        const userPrompt = `
Stats:
- Tests Taken: ${totalTests}
- Average Score: ${averageScore}%
- Weak Topics Identified: ${weakTopics.length > 0 ? weakTopics.join(', ') : 'General non-voice speed and de-escalation'}

Return JSON:
{
  "readinessScore": number (0-100),
  "readinessLevel": "Ready for Interview" | "On Track" | "Needs Practice",
  "focusSummary": "2-sentence high level priority summary",
  "dailySchedule": [
    {
      "day": 1,
      "focus": "Topic or skill",
      "recommendedModule": "english" | "reading" | "typing" | "email" | "chat" | "aptitude" | "customer-service" | "hr" | "mock",
      "targetMinutes": 30,
      "actionItems": ["Action 1", "Action 2"]
    }
  ],
  "topProTips": ["Tip 1", "Tip 2", "Tip 3"]
}`;

        const response = await openai.chat.completions.create({
          model: getOpenAIModel(),
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.4,
        });

        const content = response.choices[0]?.message?.content;
        if (content) {
          return NextResponse.json({ source: 'ai', plan: JSON.parse(content) });
        }
      } catch (err) {
        console.warn('AI study plan generation failed, using structured fallback:', err);
      }
    }

    // Dynamic High Quality Fallback Study Plan
    const readinessLevel = averageScore >= 80 ? 'Ready for Interview' : averageScore >= 65 ? 'On Track' : 'Needs Practice';
    const readinessScore = Math.min(100, Math.max(30, Math.round(averageScore)));

    const fallbackPlan = {
      readinessScore,
      readinessLevel,
      focusSummary: weakTopics.length > 0
        ? `Focus primarily on strengthening ${weakTopics.slice(0, 2).join(' and ')} while maintaining 50+ WPM typing speed.`
        : `Your scores indicate consistent capability. Polish high-stakes email resolution and live chat handling to ensure a top-tier score.`,
      dailySchedule: [
        {
          day: 1,
          focus: 'English Grammar & US Business Idioms',
          recommendedModule: 'english',
          targetMinutes: 30,
          actionItems: [
            'Practice Subject-Verb agreement and preposition rules',
            'Complete two 20-question English assessments',
            'Review all incorrect question explanations in your results history',
          ],
        },
        {
          day: 2,
          focus: 'Typing Speed & Accuracy Benchmark',
          recommendedModule: 'typing',
          targetMinutes: 25,
          actionItems: [
            'Complete three 3-minute typing tests targeting 50+ WPM',
            'Focus on maintaining 95%+ accuracy rather than reckless typing',
            'Practice common customer support macro phrases',
          ],
        },
        {
          day: 3,
          focus: 'Customer De-escalation & Email Writing',
          recommendedModule: 'email',
          targetMinutes: 40,
          actionItems: [
            'Complete 2 email assessments (Delayed Order and Refund Dispute)',
            'Ensure all emails include empathetic opening, clear action plan, and professional signoff',
            'Check against the 100-point rubric to eliminate punctuation errors',
          ],
        },
        {
          day: 4,
          focus: 'Live Chat Support Simulation & Aptitude',
          recommendedModule: 'chat',
          targetMinutes: 35,
          actionItems: [
            'Engage in 2 live simulated customer chat scenarios',
            'Practice multi-turn troubleshooting and address verification',
            'Complete 15 aptitude & reasoning questions on percentages and series',
          ],
        },
        {
          day: 5,
          focus: 'Full Mock Assessment & HR Interview',
          recommendedModule: 'mock',
          targetMinutes: 50,
          actionItems: [
            'Take a comprehensive Full Mock Assessment under timed conditions',
            'Practice typing out your answers to the top 6 HR interview questions',
            'Review final composite analytics to confirm readiness',
          ],
        },
      ],
      topProTips: [
        'Never argue with the customer in written text. Validate first, then provide solutions.',
        'Concentrix US processes value First Contact Resolution (FCR); always anticipate the customer\'s next question.',
        'Keep sentences concise—long, complicated paragraphs increase customer confusion and lower QA scores.',
      ],
    };

    return NextResponse.json({ source: 'fallback', plan: fallbackPlan });
  } catch (error: any) {
    console.error('Study plan error:', error);
    return NextResponse.json(
      { error: 'Failed to generate study plan', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
