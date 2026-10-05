import { Difficulty, QuestionCategory } from './question';

export interface QuestionReviewItem {
  id: string;
  question: string;
  userAnswer?: string | number;
  correctAnswer?: string | number;
  options?: string[];
  isCorrect: boolean;
  explanation: string;
  topic: string;
  feedback?: string;
}

export interface EmailEvaluation {
  overallScore: number; // 0 - 100
  breakdown: {
    grammarSpelling: { score: number; max: 25; feedback: string };
    professionalTone: { score: number; max: 20; feedback: string };
    clarityReadability: { score: number; max: 20; feedback: string };
    completeness: { score: number; max: 20; feedback: string };
    customerEmpathy: { score: number; max: 15; feedback: string };
  };
  strengths: string[];
  mistakes: string[];
  suggestedCorrections: string[];
  improvedExample: string;
}

export interface ChatEvaluation {
  overallScore: number; // 0 - 100
  criteria: {
    communication: { score: number; max: 20; notes: string };
    empathy: { score: number; max: 20; notes: string };
    accuracy: { score: number; max: 15; notes: string };
    problemSolving: { score: number; max: 15; notes: string };
    professionalism: { score: number; max: 15; notes: string };
    resolution: { score: number; max: 15; notes: string };
  };
  summary: string;
  strengths: string[];
  areasToImprove: string[];
  idealResponsesSuggested: { agentMessage: string; whyBetter: string }[];
}

export interface TestResult {
  id: string;
  category: QuestionCategory;
  title: string;
  difficulty: Difficulty;
  timestamp: number;
  timeSpentSeconds: number;
  totalTimeAllocatedSeconds?: number;
  
  // Scoring
  score: number; // Percentage or points
  totalPossibleScore: number;
  percentage: number;
  passed: boolean;
  
  // MCQ / Standard test fields
  totalQuestions?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  
  // Module specific results
  questionReviews?: QuestionReviewItem[];
  emailEvaluation?: EmailEvaluation;
  chatEvaluation?: ChatEvaluation;
  typingMetrics?: {
    grossWpm: number;
    netWpm: number;
    accuracy: number;
    correctCharacters: number;
    incorrectCharacters: number;
  };
  
  // Mock test composite sections
  mockSectionResults?: {
    sectionName: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];

  // Feedback & Next Steps
  generalFeedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}
