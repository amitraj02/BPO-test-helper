export function buildEmailEvaluationPrompt(
  scenarioTitle: string,
  customerEmail: string,
  candidateEmail: string,
  instructions: string[]
) {
  const systemPrompt = `You are a Senior Quality Assurance Lead and Trainer for Concentrix US BPO Non-Voice operations.
You evaluate candidate email responses to customer support tickets using a strict 100-point rubric:
1. Grammar and spelling (max 25 points): Deduct for typographical errors, punctuation blunders, run-on sentences, improper tense.
2. Professional tone (max 20 points): Warm, respectful, non-defensive, polite, formal yet approachable.
3. Clarity and readability (max 20 points): Short paragraphs, bullet points when appropriate, logical flow, zero confusing corporate jargon.
4. Completeness (max 20 points): Addresses every single concern raised by the customer and fulfills candidate instructions. Do not reward meaningless fluff or verbosity.
5. Customer empathy (max 15 points): Acknowledges customer frustration genuinely, validates their feelings, and takes ownership.

Return STRICT JSON ONLY. No markdown formatting outside the JSON string.`;

  const userPrompt = `
Scenario: ${scenarioTitle}
Customer's Email:
"""
${customerEmail}
"""

Required Instructions for Candidate:
${instructions.map((ins, i) => `${i + 1}. ${ins}`).join('\n')}

Candidate's Submitted Email:
"""
${candidateEmail}
"""

Evaluate this email thoroughly.
Return valid JSON matching this schema:
{
  "overallScore": number (sum of 5 criteria, 0 to 100),
  "breakdown": {
    "grammarSpelling": { "score": number (0-25), "max": 25, "feedback": "string" },
    "professionalTone": { "score": number (0-20), "max": 20, "feedback": "string" },
    "clarityReadability": { "score": number (0-20), "max": 20, "feedback": "string" },
    "completeness": { "score": number (0-20), "max": 20, "feedback": "string" },
    "customerEmpathy": { "score": number (0-15), "max": 15, "feedback": "string" }
  },
  "strengths": ["bullet 1", "bullet 2"],
  "mistakes": ["specific mistake or oversight 1", "specific mistake 2"],
  "suggestedCorrections": ["specific actionable correction 1", "specific actionable correction 2"],
  "improvedExample": "A model 100/100 email response to this customer that candidate can learn from."
}`;

  return { systemPrompt, userPrompt };
}

export function buildChatEvaluationPrompt(
  scenarioContext: string,
  conversationTranscript: { sender: string; content: string }[]
) {
  const systemPrompt = `You are an Operations QA Manager auditing a live customer support chat simulation in a US BPO context.
Evaluate the candidate's performance across 6 key metrics (Total 100 points):
- Communication (20 pts): Clarity, brevity, correct spelling.
- Empathy (20 pts): Validating frustration, understanding the emotional distress.
- Accuracy (15 pts): Factual correctness, proper account verification.
- Problem Solving (15 pts): Logical troubleshooting and realistic resolution pathways.
- Professionalism (15 pts): Patience, politeness, adherence to support etiquette.
- Resolution (15 pts): Did the interaction reach a satisfactory close or clear next steps?

Output strictly valid JSON.`;

  const transcriptText = conversationTranscript
    .map((m) => `${m.sender.toUpperCase()}: ${m.content}`)
    .join('\n\n');

  const userPrompt = `
Scenario Context: ${scenarioContext}

Conversation Transcript:
${transcriptText}

Evaluate the candidate (AGENT) rigorously.
Return JSON format:
{
  "overallScore": number (0-100),
  "criteria": {
    "communication": { "score": number (0-20), "max": 20, "notes": "string" },
    "empathy": { "score": number (0-20), "max": 20, "notes": "string" },
    "accuracy": { "score": number (0-15), "max": 15, "notes": "string" },
    "problemSolving": { "score": number (0-15), "max": 15, "notes": "string" },
    "professionalism": { "score": number (0-15), "max": 15, "notes": "string" },
    "resolution": { "score": number (0-15), "max": 15, "notes": "string" }
  },
  "summary": "Overall summary of performance",
  "strengths": ["Strength 1", "Strength 2"],
  "areasToImprove": ["Area 1", "Area 2"],
  "idealResponsesSuggested": [
    {
      "agentMessage": "Recommended phrasing for a critical moment in this chat",
      "whyBetter": "Explanation of why this achieves higher CSAT and clarity"
    }
  ]
}`;

  return { systemPrompt, userPrompt };
}

export function buildHREvaluationPrompt(
  question: string,
  candidateAnswer: string,
  keyPoints: string[]
) {
  const systemPrompt = `You are an HR Interviewer assessing an answer for a Concentrix US Non-Voice support interview.
Evaluate the candidate's answer for clarity, relevance, grammar, and professionalism. Output strictly valid JSON.`;

  const userPrompt = `
Question: ${question}
Expected Key Points: ${keyPoints.join('; ')}

Candidate's Answer:
"${candidateAnswer}"

Return JSON:
{
  "score": number (0-100),
  "clarityRating": "Poor" | "Average" | "Good" | "Excellent",
  "feedback": "constructive 2-3 sentences",
  "strengths": ["string"],
  "missedPoints": ["string"],
  "suggestedImprovement": "How the candidate can polish their answer"
}`;

  return { systemPrompt, userPrompt };
}
