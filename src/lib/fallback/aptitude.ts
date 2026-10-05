import { MCQQuestion } from '@/types/question';

export const fallbackAptitudeQuestions: MCQQuestion[] = [
  {
    id: 'apt-01',
    category: 'aptitude',
    difficulty: 'easy',
    topic: 'Percentages',
    question: 'A customer support team resolved 420 out of 500 email tickets received in a day. What was their ticket resolution percentage?',
    options: ['80%', '82%', '84%', '86%'],
    correctAnswer: 2,
    explanation: '(420 / 500) × 100 = 0.84 × 100 = 84% resolution rate.'
  },
  {
    id: 'apt-02',
    category: 'aptitude',
    difficulty: 'intermediate',
    topic: 'Number Series',
    question: 'What is the next number in the series: 7, 14, 28, 56, 112, ___?',
    options: ['168', '214', '224', '248'],
    correctAnswer: 2,
    explanation: 'Each number is multiplied by 2 (7×2=14, 14×2=28, 28×2=56, 56×2=112, 112×2=224).'
  },
  {
    id: 'apt-03',
    category: 'aptitude',
    difficulty: 'intermediate',
    topic: 'Ratios',
    question: 'The ratio of email queries to live chat queries handled by an agent is 5 : 3. If the agent handled a total of 96 interactions today, how many were live chats?',
    options: ['32', '36', '40', '48'],
    correctAnswer: 1,
    explanation: 'Total parts = 5 + 3 = 8. Each part = 96 / 8 = 12 interactions. Live chats = 3 parts × 12 = 36 live chats.'
  },
  {
    id: 'apt-04',
    category: 'aptitude',
    difficulty: 'easy',
    topic: 'Averages',
    question: 'A representative answered 45, 52, 48, 60, and 55 emails over Monday to Friday. What was the average number of emails handled per day?',
    options: ['50', '52', '53', '54'],
    correctAnswer: 1,
    explanation: 'Sum = 45 + 52 + 48 + 60 + 55 = 260. Average = 260 / 5 = 52 emails per day.'
  },
  {
    id: 'apt-05',
    category: 'aptitude',
    difficulty: 'intermediate',
    topic: 'Discounts & Pricing',
    question: 'A product originally priced at $120 is offered with a 25% discount. If an additional 10% coupon is applied to the discounted price, what is the final price?',
    options: ['$81', '$84', '$88', '$90'],
    correctAnswer: 0,
    explanation: 'After 25% discount: $120 × 0.75 = $90. After 10% extra coupon on $90: $90 × 0.90 = $81.'
  },
  {
    id: 'apt-06',
    category: 'aptitude',
    difficulty: 'advanced',
    topic: 'Logical Reasoning',
    question: 'All non-voice agents are trained in English writing. Some trained writers are fluent in Spanish. Which conclusion definitely follows?',
    options: [
      'All non-voice agents are fluent in Spanish.',
      'Some non-voice agents might be fluent in Spanish.',
      'No non-voice agent is fluent in Spanish.',
      'All Spanish speakers are non-voice agents.'
    ],
    correctAnswer: 1,
    explanation: 'Since all non-voice agents belong to the set of trained writers, and some trained writers are fluent in Spanish, it is possible (might be) that some non-voice agents are fluent in Spanish, but not guaranteed for all.'
  },
  {
    id: 'apt-07',
    category: 'aptitude',
    difficulty: 'easy',
    topic: 'Basic Arithmetic',
    question: 'If an agent types 240 words in 4 minutes, what is their typing speed in words per minute (WPM)?',
    options: ['45 WPM', '50 WPM', '60 WPM', '70 WPM'],
    correctAnswer: 2,
    explanation: 'WPM = 240 words / 4 minutes = 60 words per minute.'
  },
  {
    id: 'apt-08',
    category: 'aptitude',
    difficulty: 'intermediate',
    topic: 'Number Series',
    question: 'Find the missing number: 4, 9, 16, 25, 36, ___',
    options: ['45', '48', '49', '54'],
    correctAnswer: 2,
    explanation: 'The series represents consecutive squares: 2²=4, 3²=9, 4²=16, 5²=25, 6²=36, 7²=49.'
  },
  {
    id: 'apt-09',
    category: 'aptitude',
    difficulty: 'advanced',
    topic: 'Time & Work',
    question: 'Agent A can complete a quality audit of 60 tickets in 3 hours. Agent B can do it in 6 hours. Working together, how many hours will they take to complete the audit?',
    options: ['1.5 hours', '2 hours', '2.5 hours', '4.5 hours'],
    correctAnswer: 1,
    explanation: 'Rate of A = 1/3 per hour. Rate of B = 1/6 per hour. Combined rate = 1/3 + 1/6 = 3/6 = 1/2. Time = 1 / (1/2) = 2 hours.'
  },
  {
    id: 'apt-10',
    category: 'aptitude',
    difficulty: 'intermediate',
    topic: 'Logical Sequences',
    question: 'Which word completes the analogy: KEYBOARD : INPUT :: MONITOR : ________?',
    options: ['PRINT', 'OUTPUT', 'STORE', 'PROCESS'],
    correctAnswer: 1,
    explanation: 'A keyboard is an input device; a monitor is an output device.'
  }
];
