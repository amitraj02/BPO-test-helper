import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getOpenAIClient, getOpenAIModel } from '@/lib/ai/client';
import { buildChatSimulationPrompt } from '@/lib/ai/prompts/chat';

const RequestSchema = z.object({
  scenario: z.object({
    id: z.string(),
    scenarioTitle: z.string(),
    customerName: z.string(),
    customerSentiment: z.string(),
    accountDetails: z.object({
      orderId: z.string(),
      productName: z.string(),
      purchaseDate: z.string(),
      accountEmail: z.string(),
    }),
    scenarioContext: z.string(),
    initialMessage: z.string(),
    systemGoal: z.string(),
  }),
  history: z.array(
    z.object({
      sender: z.enum(['customer', 'agent', 'system']),
      content: z.string(),
    })
  ),
  latestAgentMessage: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid chat parameters', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { scenario, history, latestAgentMessage } = parsed.data;
    const openai = getOpenAIClient();

    if (openai) {
      try {
        const { systemPrompt } = buildChatSimulationPrompt(scenario as any, history);
        
        const openAiMessages: any[] = [
          { role: 'system', content: systemPrompt },
          ...history.map((h) => ({
            role: h.sender === 'customer' ? 'assistant' : 'user',
            content: h.content,
          })),
          { role: 'user', content: latestAgentMessage },
        ];

        const response = await openai.chat.completions.create({
          model: getOpenAIModel(),
          messages: openAiMessages,
          temperature: 0.7,
          max_tokens: 200,
        });

        const reply = response.choices[0]?.message?.content?.trim();
        if (reply) {
          return NextResponse.json({
            source: 'ai',
            reply,
          });
        }
      } catch (err) {
        console.warn('AI chat completion failed, fallback responder active:', err);
      }
    }

    // Contextual Scripted Fallback Responder
    const text = latestAgentMessage.toLowerCase();
    const agentTurnCount = history.filter((m) => m.sender === 'agent').length + 1;

    let fallbackReply = '';

    if (text.includes('address') || text.includes('zip') || text.includes('street')) {
      fallbackReply = `Yes, my delivery address is 742 Evergreen Terrace, Springfield, OR 97477. Can you verify if that matches what the driver had on the manifest?`;
    } else if (text.includes('email') || text.includes('verify') || text.includes('account')) {
      fallbackReply = `My account email is indeed ${scenario.accountDetails.accountEmail}. Please let me know what the system shows.`;
    } else if (text.includes('replacement') || text.includes('reship') || text.includes('overnight')) {
      fallbackReply = `That would be a huge relief! Yes, please dispatch a replacement right away via expedited shipping so I receive it by Friday. Will you email me the new tracking code?`;
    } else if (text.includes('refund') || text.includes('credit')) {
      fallbackReply = `A refund back to my card would be acceptable if replacement stock isn't available. How many business days will it take for the funds to reflect?`;
    } else if (text.includes('apologize') || text.includes('sorry') || text.includes('understand')) {
      fallbackReply = `Thank you for understanding. I know it's not your personal fault, but I really need this resolved today. What are our concrete options right now?`;
    } else if (agentTurnCount >= 4) {
      fallbackReply = `Alright, I appreciate you taking ownership of this ticket. I will monitor my inbox for the confirmation email and tracking updates. Thank you for your assistance today!`;
    } else {
      fallbackReply = `Okay, what are the next steps to ensure this is fixed? I really don't want to have to follow up on this again tomorrow.`;
    }

    return NextResponse.json({
      source: 'fallback',
      reply: fallbackReply,
    });
  } catch (error: any) {
    console.error('Chat API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
