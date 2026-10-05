import { HRQuestion } from '@/types/question';

export const fallbackHRQuestions: HRQuestion[] = [
  {
    id: 'hr-01',
    topic: 'Introduction & Background',
    question: 'Tell me about yourself and your background.',
    context: 'Standard Round 1 HR screening question used to assess your communication clarity, self-awareness, and background relevance.',
    keyPointsExpected: [
      'Brief introduction with education and professional background',
      'Relevant skills: written English proficiency, typing speed, analytical attention to detail',
      'Why you are interested in a non-voice customer support career',
      'Professional demeanor without rambling personal details'
    ],
    tipsForCandidate: 'Keep your response between 90 and 120 seconds (approx. 150-200 words). Use the Present-Past-Future framework: who you are now, relevant experience or education, and why this role is the natural next step.',
    sampleStrongAnswer: 'I have a strong academic foundation in English and business communications, alongside proven typing proficiency exceeding 50 words per minute with 98% accuracy. I enjoy structured problem-solving and written communication, which makes me well-suited for non-voice customer support where precision and clarity matter. In my previous coursework and customer-facing interactions, I learned how to dissect complex customer inquiries, de-escalate tension, and write concise, empathetic responses. I am excited to apply my written communication skills and analytical focus to deliver high-quality support in a global BPO environment.'
  },
  {
    id: 'hr-02',
    topic: 'Process Preference',
    question: 'Why do you specifically prefer a Non-Voice (Email/Chat) process over Voice support?',
    context: 'Checks whether you understand the specific strengths and challenges of written customer service.',
    keyPointsExpected: [
      'Appreciation for written precision and clarity',
      'Strong typing agility and ability to multi-task across multiple chat windows or ticketing systems',
      'Desire to document and craft well-thought-out, professional resolutions',
      'Comfort with fast-paced written digital communication'
    ],
    tipsForCandidate: 'Never say you dislike talking or are afraid of the phone. Instead, frame non-voice as your core strength: you excel at structured writing, active reading, and prompt, error-free written assistance.',
    sampleStrongAnswer: 'I prefer non-voice because writing allows me to leverage my strongest skills: structured analysis, grammatical accuracy, and empathetic composition. In email and chat environments, every word creates a lasting impression. I thrive in managing concurrent workflows, conducting rapid knowledge base lookups, and tailoring concise instructions that customers can read and follow at their own pace without ambiguity.'
  },
  {
    id: 'hr-03',
    topic: 'Company Knowledge',
    question: 'Why do you want to join Concentrix?',
    context: 'Checks whether you have researched Concentrix’s global reputation, culture, and career advancement opportunities.',
    keyPointsExpected: [
      'Knowledge that Concentrix is a leading global technology and customer experience (CX) solutions enterprise',
      'Value placed on professional training, career growth, and global client processes',
      'Commitment to delivering exceptional customer satisfaction in US market operations'
    ],
    tipsForCandidate: 'Mention Concentrix’s focus on tech-powered customer experience (CX) and positive workplace culture. Emphasize your desire to grow within an industry leader.',
    sampleStrongAnswer: 'Concentrix is internationally recognized as a premier leader in tech-enabled customer experience solutions, partnering with some of the world’s most respected Fortune 500 brands. What excites me most about Concentrix is the structured training and clear internal growth pathways. Joining a US non-voice process here will expose me to world-class customer service standards, rigorous quality benchmarks, and a supportive team environment where performance and dedication are rewarded.'
  },
  {
    id: 'hr-04',
    topic: 'Handling Pressure & Angry Customers',
    question: 'How do you handle an extremely angry or demanding customer via email or chat?',
    context: 'Crucial for operations interview (Round 6) to test emotional resilience and de-escalation techniques.',
    keyPointsExpected: [
      'Remain calm and not take customer frustration personally',
      'Validate their feelings using sincere empathy (HEAT or LAST method: Listen, Apologize, Solve, Thank)',
      'Focus on the solution rather than defending mistakes',
      'Adhere to company escalation protocols when required'
    ],
    tipsForCandidate: 'Show that you understand angry customers are frustrated with the issue, not you personally. Emphasize active de-escalation and prompt resolution.',
    sampleStrongAnswer: 'When dealing with an upset customer in email or chat, the first rule is not to take their frustration personally. I immediately validate their situation with genuine empathy—for example, saying, "I understand how urgent this is for you, and I am here to help get this resolved." Next, I review their history carefully to avoid asking them to repeat details. I outline a concrete, step-by-step resolution or timeline so they feel in control. Keeping a respectful, reassuring tone throughout transforms negative sentiment into trust.'
  },
  {
    id: 'hr-05',
    topic: 'Operational Flexibility & Night Shifts',
    question: 'US BPO processes often operate during US business hours. Are you comfortable working 24/7 rotational night shifts?',
    context: 'Round 1 HR screening requirement for US non-voice campaigns.',
    keyPointsExpected: [
      'Unequivocal readiness to work rotational night shifts',
      'Healthy sleep schedule management and reliable transport/work setup',
      'Understanding of US timezone alignment (EST/CST/PST)'
    ],
    tipsForCandidate: 'Give a firm, positive affirmation. Mention that you have planned your personal schedule and lifestyle to be fully rested and productive during night shifts.',
    sampleStrongAnswer: 'Yes, absolutely. I am 100% comfortable with rotational night shifts and US business hours. I understand that serving North American clients requires alignment with US time zones. I maintain a disciplined lifestyle with a dedicated daytime sleep routine, ensuring that I am fully alert, energized, and focused throughout my assigned shifts.'
  },
  {
    id: 'hr-06',
    topic: 'Focus & Routine Tasks',
    question: 'Non-voice support involves reviewing tickets and repetitive data entry. How do you stay motivated and maintain quality?',
    context: 'Checks for discipline, focus, and long-term retention.',
    keyPointsExpected: [
      'Focus on individual customer impact rather than repetitive mechanics',
      'Commitment to high quality metrics (FCR, CSAT, AHT)',
      'Continuous self-improvement through personal goal setting'
    ],
    tipsForCandidate: 'Frame repetitive tasks as an opportunity for mastery and speed. Mention how setting mini-goals keeps each hour engaging.',
    sampleStrongAnswer: 'I view each ticket as a unique person needing assistance, not just a number in a queue. Even if the underlying issue is common, the customer on the other end is experiencing it uniquely. I keep myself motivated by setting personal hourly benchmarks for accuracy, first-contact resolution, and typing efficiency. This mindset helps me maintain high quality and zero typographical errors even during high-volume periods.'
  }
];
