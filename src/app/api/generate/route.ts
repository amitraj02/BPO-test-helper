import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient, getOpenAIModel } from '@/lib/ai/client';
import { buildGenerateQuestionsPrompt, buildGenerateReadingPrompt } from '@/lib/ai/prompts/generate';
import { fallbackEnglishQuestions } from '@/lib/fallback/english';
import { fallbackAptitudeQuestions } from '@/lib/fallback/aptitude';
import { fallbackCustomerServiceQuestions } from '@/lib/fallback/customer-service';
import { fallbackReadingPassages } from '@/lib/fallback/reading';
import { fallbackEmailScenarios } from '@/lib/fallback/email';
import { fallbackChatScenarios } from '@/lib/fallback/chat';
import { fallbackHRQuestions } from '@/lib/fallback/hr';
import { MCQQuestion } from '@/types/question';

const RequestSchema = z.object({
  category: z.enum([
    'english',
    'reading',
    'typing',
    'email',
    'chat',
    'aptitude',
    'customer-service',
    'hr',
    'mock',
  ]),
  difficulty: z.enum(['easy', 'intermediate', 'advanced']).default('intermediate'),
  count: z.number().min(1).max(50).default(10),
  topicFilter: z.string().optional(),
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

    const { category, difficulty, count, topicFilter } = parsed.data;
    const openai = getOpenAIClient();

    // If category is reading, email, chat, or hr, handle appropriately
    if (category === 'reading') {
      if (openai) {
        try {
          const { systemPrompt, userPrompt } = buildGenerateReadingPrompt(difficulty);
          const response = await openai.chat.completions.create({
            model: getOpenAIModel(),
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          });

          const content = response.choices[0]?.message?.content;
          if (content) {
            const data = JSON.parse(content);
            return NextResponse.json({ source: 'ai', passageItem: data });
          }
        } catch (err) {
          console.warn('AI reading generation failed, falling back:', err);
        }
      }
      // Fallback
      const passage = fallbackReadingPassages[Math.floor(Math.random() * fallbackReadingPassages.length)];
      return NextResponse.json({ source: 'fallback', passageItem: passage });
    }

    if (category === 'email') {
      const scenario = fallbackEmailScenarios[Math.floor(Math.random() * fallbackEmailScenarios.length)];
      return NextResponse.json({ source: 'fallback', scenario });
    }

    if (category === 'chat') {
      const scenario = fallbackChatScenarios[Math.floor(Math.random() * fallbackChatScenarios.length)];
      return NextResponse.json({ source: 'fallback', scenario });
    }

    if (category === 'hr') {
      return NextResponse.json({ source: 'fallback', questions: fallbackHRQuestions.slice(0, count) });
    }

    // MCQ based generation (english, aptitude, customer-service)
    if (openai) {
      try {
        const { systemPrompt, userPrompt } = buildGenerateQuestionsPrompt(
          category,
          difficulty,
          count,
          topicFilter
        );

        const response = await openai.chat.completions.create({
          model: getOpenAIModel(),
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        });

        const raw = response.choices[0]?.message?.content;
        if (raw) {
          const parsedJson = JSON.parse(raw);
          if (Array.isArray(parsedJson.questions) && parsedJson.questions.length > 0) {
            return NextResponse.json({
              source: 'ai',
              questions: parsedJson.questions.slice(0, count),
            });
          }
        }
      } catch (aiErr) {
        console.warn('AI generation error, serving verified fallback questions:', aiErr);
      }
    }

    // Robust Fallback Question Retrieval
    let pool: MCQQuestion[] = [];
    if (category === 'english') {
      pool = [...fallbackEnglishQuestions];
    } else if (category === 'aptitude') {
      pool = [...fallbackAptitudeQuestions];
    } else if (category === 'customer-service') {
      pool = [...fallbackCustomerServiceQuestions];
    } else {
      pool = [...fallbackEnglishQuestions];
    }

    // Shuffle pool to ensure unique variety per test attempt
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    return NextResponse.json({
      source: 'fallback',
      questions: selected,
    });
  } catch (error: any) {
    console.error('Question generation route error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
