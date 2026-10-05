import { MCQQuestion } from '@/types/question';
import { QuestionReviewItem, TestResult } from '@/types/results';
import { UserAnswerRecord } from '@/types/test';

export function calculateMCQScore(
  questions: MCQQuestion[],
  userAnswers: Record<string, UserAnswerRecord>,
  timeSpentSeconds: number,
  category: any,
  difficulty: any,
  title: string
): TestResult {
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const questionReviews: QuestionReviewItem[] = questions.map((q) => {
    const record = userAnswers[q.id];
    const selected = record?.selectedOption;
    const isAnswered = selected !== undefined && selected !== null;
    const isCorrect = isAnswered && selected === q.correctAnswer;

    if (!isAnswered) {
      unansweredCount++;
    } else if (isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      userAnswer: isAnswered ? selected : undefined,
      correctAnswer: q.correctAnswer,
      isCorrect: Boolean(isCorrect),
      explanation: q.explanation,
      topic: q.topic
    };
  });

  const totalQuestions = questions.length;
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = percentage >= 75; // Standard BPO pass benchmark is 75-80%

  // Topic breakdown to find strengths and weaknesses
  const topicStats: Record<string, { total: number; correct: number }> = {};
  questions.forEach((q) => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { total: 0, correct: 0 };
    }
    topicStats[q.topic].total += 1;
    const rec = userAnswers[q.id];
    if (rec?.selectedOption === q.correctAnswer) {
      topicStats[q.topic].correct += 1;
    }
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  Object.entries(topicStats).forEach(([topic, stat]) => {
    const topicPct = (stat.correct / stat.total) * 100;
    if (topicPct >= 80) {
      strengths.push(`${topic} (${Math.round(topicPct)}% accuracy)`);
    } else if (topicPct < 70) {
      weaknesses.push(`${topic} (${Math.round(topicPct)}% accuracy)`);
    }
  });

  let generalFeedback = '';
  if (percentage >= 90) {
    generalFeedback = 'Outstanding performance! You demonstrate exceptional proficiency aligned with Concentrix US non-voice quality standards.';
  } else if (percentage >= 75) {
    generalFeedback = 'Solid passing score! You have a good grasp of the foundational principles, but reviewing your incorrect answers will help secure top interview marks.';
  } else if (percentage >= 50) {
    generalFeedback = 'Moderate score. Several questions revealed gaps in core concepts. Focus on the recommended topics below to improve.';
  } else {
    generalFeedback = 'Needs significant improvement. Concentrix assessments typically require 75%+ to qualify for subsequent rounds. Please practice with foundational exercises.';
  }

  const recommendedTopics = weaknesses.length > 0 ? weaknesses.map(w => w.split(' (')[0]) : ['Advanced Sentence Formation', 'De-escalation Idioms'];

  return {
    id: `result_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    category,
    title,
    difficulty,
    timestamp: Date.now(),
    timeSpentSeconds,
    score: correctCount,
    totalPossibleScore: totalQuestions,
    percentage,
    passed,
    totalQuestions,
    correctCount,
    incorrectCount,
    unansweredCount,
    questionReviews,
    generalFeedback,
    strengths,
    weaknesses,
    recommendedTopics
  };
}

export function calculateTypingMetrics(
  passage: string,
  typedText: string,
  timeElapsedSeconds: number,
  totalTimeAllocatedSeconds: number
) {
  const safeElapsedSeconds = Math.max(1, timeElapsedSeconds);
  const elapsedMinutes = safeElapsedSeconds / 60;

  let correctChars = 0;
  let incorrectChars = 0;

  const minLength = Math.min(passage.length, typedText.length);
  for (let i = 0; i < minLength; i++) {
    if (typedText[i] === passage[i]) {
      correctChars++;
    } else {
      incorrectChars++;
    }
  }

  // If user typed beyond passage length, those count as incorrect
  if (typedText.length > passage.length) {
    incorrectChars += (typedText.length - passage.length);
  }

  const totalTypedChars = typedText.length;
  // Standard formula: WPM = (Correct characters / 5) / Elapsed time in minutes
  const grossWpm = Math.round((totalTypedChars / 5) / elapsedMinutes);
  const netWpm = Math.max(0, Math.round((correctChars / 5) / elapsedMinutes));
  const accuracy = totalTypedChars > 0 ? Math.min(100, Math.max(0, Math.round((correctChars / totalTypedChars) * 100))) : 0;

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalCharactersTyped: totalTypedChars,
    correctCharacters: correctChars,
    incorrectCharacters: incorrectChars,
    timeElapsedSeconds: safeElapsedSeconds,
    totalTimeSeconds: totalTimeAllocatedSeconds
  };
}
