import { Difficulty, QuestionCategory } from '@/types/question';

export function buildGenerateQuestionsPrompt(
  category: QuestionCategory,
  difficulty: Difficulty,
  count: number,
  topicFilter?: string
) {
  const seed = Math.random().toString(36).substring(7);

  const systemPrompt = `You are a premier assessment architect specializing in recruitment tests for Concentrix US BPO Non-Voice processes (Email and Chat Support).
You generate realistic, challenging, high-quality assessment questions tailored to test candidates for customer empathy, English proficiency, reasoning, and support operations.
All output MUST be strict, valid JSON conforming exactly to the requested schema. Do not output markdown code blocks or conversational text, only raw valid JSON.`;

  let specificInstructions = '';

  if (category === 'english') {
    specificInstructions = `Generate ${count} distinct multiple-choice questions focusing on English Grammar and Vocabulary for US business communication.
Difficulty level: ${difficulty}.
Include topics: Subject-verb agreement, tenses, prepositions, articles, sentence correction, business vocabulary, synonyms/antonyms, and professional tone.
Ensure exactly 4 options per question. Correct answer must be index 0, 1, 2, or 3.
Random variation salt: ${seed}.`;
  } else if (category === 'aptitude') {
    specificInstructions = `Generate ${count} distinct multiple-choice questions for Aptitude and Logical Reasoning in a BPO environment.
Difficulty level: ${difficulty}.
Include topics: Percentages, ratios, averages, number series, arithmetic, and logical sequencing.
Ensure exactly 4 options per question. Correct answer must be index 0, 1, 2, or 3.
Random variation salt: ${seed}.`;
  } else if (category === 'customer-service') {
    specificInstructions = `Generate ${count} realistic US customer service situational scenarios for a non-voice (email/chat) representative.
Difficulty level: ${difficulty}.
Topics: Handling angry customers, missing information, order delay disputes, policy boundaries, and first-contact resolution.
Ensure exactly 4 options per question. Correct answer must be index 0, 1, 2, or 3.
Random variation salt: ${seed}.`;
  } else {
    specificInstructions = `Generate ${count} multiple-choice questions for ${category} at ${difficulty} level.`;
  }

  const jsonFormatGuidance = `
JSON Format to return:
{
  "questions": [
    {
      "id": "gen_${category}_1",
      "category": "${category}",
      "difficulty": "${difficulty}",
      "topic": "Topic Name",
      "question": "Clear question text here?",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of why this option is correct and others are incorrect."
    }
  ]
}`;

  const userPrompt = `${specificInstructions}\n${topicFilter ? `Focus specifically on: ${topicFilter}\n` : ''}${jsonFormatGuidance}`;

  return { systemPrompt, userPrompt };
}

export function buildGenerateReadingPrompt(difficulty: Difficulty) {
  const seed = Math.random().toString(36).substring(7);

  const systemPrompt = `You are an assessment writer for US BPO Non-Voice training. Generate a business reading passage (approx 200-280 words) dealing with e-commerce policies, customer service escalation guidelines, or SLA standards, along with 4 or 5 comprehension multiple-choice questions. Output strictly valid JSON.`;

  const userPrompt = `Generate a realistic passage at difficulty '${difficulty}'. Seed: ${seed}.
Format:
{
  "id": "read_${seed}",
  "passageTitle": "Passage Title",
  "passageText": "The full text of the passage...",
  "category": "reading",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "topic": "Main Idea / Specific Details / Inference / Vocabulary",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Why this answer is right based on the text."
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}
