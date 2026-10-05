import OpenAI from 'openai';

let openaiClientInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_openai_api_key_here') {
    return null;
  }

  if (!openaiClientInstance) {
    openaiClientInstance = new OpenAI({
      apiKey: apiKey.trim(),
      baseURL: process.env.OPENAI_BASE_URL || undefined,
    });
  }

  return openaiClientInstance;
}

export function getOpenAIModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-4o-mini';
}
