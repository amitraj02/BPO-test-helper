import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient, getOpenAIModel } from '@/lib/ai/client';
import {
  buildEmailEvaluationPrompt,
  buildChatEvaluationPrompt,
  buildHREvaluationPrompt,
} from '@/lib/ai/prompts/evaluate';
import { EmailEvaluation, ChatEvaluation } from '@/types/results';

const EmailEvalSchema = z.object({
  type: z.literal('email'),
  scenarioTitle: z.string(),
  customerEmail: z.string(),
  candidateEmail: z.string(),
  instructions: z.array(z.string()),
});

const ChatEvalSchema = z.object({
  type: z.literal('chat'),
  scenarioContext: z.string(),
  conversationTranscript: z.array(
    z.object({
      sender: z.string(),
      content: z.string(),
    })
  ),
});

const HREvalSchema = z.object({
  type: z.literal('hr'),
  question: z.string(),
  candidateAnswer: z.string(),
  keyPoints: z.array(z.string()),
});

const RequestSchema = z.discriminatedUnion('type', [
  EmailEvalSchema,
  ChatEvalSchema,
  HREvalSchema,
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid evaluation payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const openai = getOpenAIClient();

    // 1. Email Evaluation
    if (data.type === 'email') {
      if (openai) {
        try {
          const { systemPrompt, userPrompt } = buildEmailEvaluationPrompt(
            data.scenarioTitle,
            data.customerEmail,
            data.candidateEmail,
            data.instructions
          );

          const response = await openai.chat.completions.create({
            model: getOpenAIModel(),
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const result: EmailEvaluation = JSON.parse(content);
            return NextResponse.json({ source: 'ai', evaluation: result });
          }
        } catch (err) {
          console.warn('AI email evaluation failed, fallback evaluator triggered:', err);
        }
      }

      // Intelligent Offline Fallback Evaluator for Email
      const text = data.candidateEmail.trim();
      const wordCount = text.split(/\s+/).filter(Boolean).length;
      const lower = text.toLowerCase();

      // Check greetings and signoffs
      const hasGreeting = /^(dear|hello|hi|good\s(morning|afternoon|day))/i.test(text);
      const hasSignoff = /(sincerely|best\sregards|warm\sregards|regards|thank\syou|customer\ssupport)/i.test(text);
      
      // Empathy keywords
      const empathyMatches = ['understand', 'apologize', 'sorry', 'frustration', 'inconvenience', 'patience'].filter(k => lower.includes(k));
      
      // Solution keywords
      const solutionMatches = ['refund', 'replace', 'track', 'investigate', 'resolve', 'credit', 'expedited', 'dispatch'].filter(k => lower.includes(k));

      // Calculate rubric points
      let grammarScore = 23;
      if (wordCount < 30) grammarScore = 14;
      else if (wordCount > 300) grammarScore = 19;

      let toneScore = hasGreeting && hasSignoff ? 19 : 14;
      let empathyScore = Math.min(15, Math.max(6, empathyMatches.length * 3.5 + 4));
      let completenessScore = Math.min(20, Math.max(8, solutionMatches.length * 4 + (wordCount > 60 ? 4 : 0)));
      let clarityScore = wordCount >= 50 && wordCount <= 220 ? 19 : 14;

      const overall = Math.round(grammarScore + toneScore + clarityScore + completenessScore + empathyScore);

      const strengths: string[] = [];
      const mistakes: string[] = [];
      const corrections: string[] = [];

      if (hasGreeting && hasSignoff) {
        strengths.push('Proper professional greeting and sign-off included.');
      } else {
        mistakes.push('Missing either a formal greeting or a clear customer support closing.');
        corrections.push('Always open with "Dear [Customer Name]" or "Hello [Customer Name]" and close with "Sincerely, [Your Name] | Support Team".');
      }

      if (empathyMatches.length >= 2) {
        strengths.push('Good empathetic acknowledgment of the customer distress.');
      } else {
        mistakes.push('Low empathy expression; customer felt unacknowledged.');
        corrections.push('Acknowledge frustration first before explaining policy (e.g. "I completely understand how critical this delivery is for you").');
      }

      if (wordCount < 40) {
        mistakes.push('Response is too brief and fails to answer all points.');
        corrections.push('Provide a thorough 80-150 word response clearly outlining the next steps.');
      } else {
        strengths.push(`Good response length (${wordCount} words) providing sufficient context.`);
      }

      const fallbackEval: EmailEvaluation = {
        overallScore: Math.min(100, Math.max(20, overall)),
        breakdown: {
          grammarSpelling: { score: Math.round(grammarScore), max: 25, feedback: 'Sentence structure and spelling are mostly clear and readable.' },
          professionalTone: { score: Math.round(toneScore), max: 20, feedback: hasGreeting && hasSignoff ? 'Polite and respectful tone throughout.' : 'Needs a more polished professional format.' },
          clarityReadability: { score: Math.round(clarityScore), max: 20, feedback: 'Structure communicates key details effectively without overwhelming jargon.' },
          completeness: { score: Math.round(completenessScore), max: 20, feedback: solutionMatches.length >= 2 ? 'Directly addresses customer inquiry with concrete solutions.' : 'Could be more specific regarding exact resolutions.' },
          customerEmpathy: { score: Math.round(empathyScore), max: 15, feedback: empathyMatches.length > 0 ? 'Acknowledges the emotional impact on the customer.' : 'Add more compassionate reassurance.' },
        },
        strengths: strengths.length ? strengths : ['Clear direct intention to help'],
        mistakes: mistakes.length ? mistakes : ['Minor formatting adjustments needed'],
        suggestedCorrections: corrections.length ? corrections : ['Ensure full confirmation details are noted.'],
        improvedExample: `Dear Valued Customer,

Thank you for bringing this urgent matter to our attention. I completely understand how frustrating and stressful this situation is, especially with your time-sensitive deadline.

I have thoroughly checked your order records and prioritized an immediate investigation with our dispatch depot. Furthermore, I have processed an instant refund for your express shipping fees and arranged a priority replacement to be expedited to your doorstep.

You will receive an updated carrier tracking link within the next 2 hours. Please rest assured that I am monitoring your ticket personally until the package is securely in your hands.

Sincerely,
Customer Experience Specialist
Concentrix Global Support Desk`,
      };

      return NextResponse.json({ source: 'fallback', evaluation: fallbackEval });
    }

    // 2. Chat Evaluation
    if (data.type === 'chat') {
      if (openai) {
        try {
          const { systemPrompt, userPrompt } = buildChatEvaluationPrompt(
            data.scenarioContext,
            data.conversationTranscript
          );

          const response = await openai.chat.completions.create({
            model: getOpenAIModel(),
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const result: ChatEvaluation = JSON.parse(content);
            return NextResponse.json({ source: 'ai', evaluation: result });
          }
        } catch (err) {
          console.warn('AI chat evaluation failed, falling back:', err);
        }
      }

      // Intelligent Chat Fallback Evaluator
      const agentMessages = data.conversationTranscript.filter((m) => m.sender === 'agent');
      const agentCount = agentMessages.length;
      const combinedAgentText = agentMessages.map((m) => m.content).join(' ').toLowerCase();

      const hasEmpathy = ['understand', 'sorry', 'apologize', 'frustration'].some((w) => combinedAgentText.includes(w));
      const hasVerification = ['order', 'email', 'verify', 'address', 'details', 'check'].some((w) => combinedAgentText.includes(w));
      const hasSolution = ['replacement', 'refund', 'tracking', 'trace', 'resolve', 'update'].some((w) => combinedAgentText.includes(w));

      const commScore = agentCount >= 3 ? 18 : 12;
      const empScore = hasEmpathy ? 18 : 10;
      const accScore = hasVerification ? 14 : 9;
      const probScore = hasSolution ? 14 : 9;
      const profScore = 14;
      const resScore = agentCount >= 3 && hasSolution ? 14 : 9;

      const overall = commScore + empScore + accScore + probScore + profScore + resScore;

      const fallbackChatEval: ChatEvaluation = {
        overallScore: overall,
        criteria: {
          communication: { score: commScore, max: 20, notes: 'Clear language and good conversational turn-taking.' },
          empathy: { score: empScore, max: 20, notes: hasEmpathy ? 'Demonstrated good sensitivity to the customer situation.' : 'Could express deeper empathy early in the chat.' },
          accuracy: { score: accScore, max: 15, notes: 'Verified key customer context accurately.' },
          problemSolving: { score: probScore, max: 15, notes: 'Followed logical troubleshooting steps.' },
          professionalism: { score: profScore, max: 15, notes: 'Maintained courteous support demeanor.' },
          resolution: { score: resScore, max: 15, notes: 'Provided actionable closure or next steps for the customer.' },
        },
        summary: `Handled ${agentCount} agent turns with ${overall}% overall performance index.`,
        strengths: [
          'Maintained polite customer service language',
          'Prompt response structure suitable for non-voice chat speed',
        ],
        areasToImprove: [
          'Always state the exact estimated timeframe for resolution',
          'Offer proactive escalation or replacement options earlier in high-stress interactions',
        ],
        idealResponsesSuggested: [
          {
            agentMessage: 'I understand how distressing this is. Let me immediately open an emergency carrier trace and arrange a replacement so you are not left waiting.',
            whyBetter: 'De-escalates customer tension instantly by taking personal ownership.',
          },
        ],
      };

      return NextResponse.json({ source: 'fallback', evaluation: fallbackChatEval });
    }

    // 3. HR Evaluation
    if (data.type === 'hr') {
      if (openai) {
        try {
          const { systemPrompt, userPrompt } = buildHREvaluationPrompt(
            data.question,
            data.candidateAnswer,
            data.keyPoints
          );

          const response = await openai.chat.completions.create({
            model: getOpenAIModel(),
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            return NextResponse.json({ source: 'ai', evaluation: JSON.parse(content) });
          }
        } catch (err) {
          console.warn('AI HR evaluation failed:', err);
        }
      }

      // Intelligent HR Fallback Evaluator
      const wordCount = data.candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
      let score = 80;
      if (wordCount < 40) score = 55;
      else if (wordCount > 70) score = 88;

      return NextResponse.json({
        source: 'fallback',
        evaluation: {
          score,
          clarityRating: score >= 80 ? 'Good' : 'Average',
          feedback: `Your answer is ${wordCount} words. You communicated your thoughts clearly with appropriate professional terminology.`,
          strengths: ['Directly answered the question', 'Maintained a positive, constructive tone'],
          missedPoints: ['Could integrate specific BPO metrics like CSAT or First Contact Resolution'],
          suggestedImprovement: 'Structure your answer using the STAR method (Situation, Task, Action, Result) to make your response even more memorable to the interviewer.',
        },
      });
    }

    return NextResponse.json({ error: 'Unknown evaluation type' }, { status: 400 });
  } catch (error: any) {
    console.error('Evaluation route error:', error);
    return NextResponse.json(
      { error: 'Evaluation failed', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
