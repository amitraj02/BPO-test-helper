export type Difficulty = 'easy' | 'intermediate' | 'advanced';

export type QuestionCategory =
  | 'english'
  | 'reading'
  | 'typing'
  | 'email'
  | 'chat'
  | 'aptitude'
  | 'customer-service'
  | 'hr'
  | 'mock';

export interface MCQQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  topic: string;
  question: string;
  options: [string, string, string, string]; // Exactly 4 options
  correctAnswer: 0 | 1 | 2 | 3; // Index of correct option
  explanation: string;
  estimatedTimeSeconds?: number;
}

export interface ReadingPassageQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
  topic: string;
}

export interface ReadingTestItem {
  id: string;
  passageTitle: string;
  passageText: string;
  category: 'reading';
  difficulty: Difficulty;
  questions: ReadingPassageQuestion[];
}

export interface EmailScenario {
  id: string;
  scenarioTitle: string;
  customerName: string;
  orderNumber: string;
  urgency: 'Standard' | 'High' | 'Critical';
  issueCategory: 'Delayed Order' | 'Refund Request' | 'Account Lockout' | 'Billing Dispute' | 'Defective Item' | 'Service Complaint';
  customerEmailBody: string;
  candidateInstructions: string[];
  evaluationCriteria: {
    grammarSpelling: number; // 25
    professionalTone: number; // 20
    clarityReadability: number; // 20
    completeness: number; // 20
    customerEmpathy: number; // 15
  };
}

export interface ChatScenario {
  id: string;
  scenarioTitle: string;
  customerName: string;
  customerSentiment: 'Frustrated' | 'Mildly Frustrated' | 'Angry' | 'Confused' | 'Urgent';
  accountDetails: {
    orderId: string;
    productName: string;
    purchaseDate: string;
    accountEmail: string;
  };
  scenarioContext: string;
  initialMessage: string;
  systemGoal: string;
}

export interface HRQuestion {
  id: string;
  topic: string;
  question: string;
  context: string;
  keyPointsExpected: string[];
  tipsForCandidate: string;
  sampleStrongAnswer: string;
}

export interface TypingPassage {
  id: string;
  title: string;
  category: string;
  text: string;
  durationMinutes: number; // 1, 2, 3, 5
}
