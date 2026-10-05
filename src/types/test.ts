import { Difficulty, QuestionCategory } from './question';

export interface TestConfig {
  category: QuestionCategory;
  difficulty: Difficulty;
  questionCount: number;
  durationMinutes: number;
  isTimed: boolean;
  topicFilter?: string;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOption?: number; // 0, 1, 2, 3 for MCQ
  textResponse?: string; // for email / HR / scenario
  timeSpentSeconds: number;
  isFlagged?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  content: string;
  timestamp: string;
}

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number; // percentage (0 - 100)
  totalCharactersTyped: number;
  correctCharacters: number;
  incorrectCharacters: number;
  timeElapsedSeconds: number;
  totalTimeSeconds: number;
}
