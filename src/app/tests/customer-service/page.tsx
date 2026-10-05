'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MCQQuestion, Difficulty } from '@/types/question';
import { UserAnswerRecord } from '@/types/test';
import { calculateMCQScore } from '@/lib/utils/scoring';
import { saveTestResult } from '@/lib/storage/local-storage';
import TestHeader from '@/components/tests/TestHeader';
import QuestionNavigator from '@/components/tests/QuestionNavigator';
import MCQCard from '@/components/tests/MCQCard';
import SubmitModal from '@/components/tests/SubmitModal';
import TestConfigModal from '@/components/tests/TestConfigModal';
import { Headphones, Loader2 } from 'lucide-react';

export default function CustomerServiceTestPage() {
  const router = useRouter();

  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswerRecord>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [startTime, setStartTime] = useState<number>(0);

  const startTest = async (diff: Difficulty, count: number, durationMinutes: number) => {
    setIsConfigOpen(false);
    setIsLoading(true);
    setDifficulty(diff);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: 'customer-service',
          difficulty: diff,
          count: count,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setTimeRemainingSeconds(durationMinutes * 60);
        setStartTime(Date.now());
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.error('Failed to load customer service questions:', err);
      alert('Unable to load questions. Please check connection and try again.');
      setIsConfigOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeRemainingSeconds === null || timeRemainingSeconds <= 0 || questions.length === 0 || isSubmitting) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeRemainingSeconds, isSubmitting, questions.length]);

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: optionIndex,
        timeSpentSeconds: 0,
      },
    }));
  };

  const handleToggleFlag = (id: string) => {
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmitTest = () => {
    if (isSubmitting || questions.length === 0) return;
    setIsSubmitting(true);
    setIsSubmitModalOpen(false);

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const result = calculateMCQScore(
      questions,
      answers,
      elapsedSeconds,
      'customer-service',
      difficulty,
      'Customer Service Scenarios Assessment'
    );

    saveTestResult(result);
    router.push(`/results/${result.id}`);
  };

  if (isConfigOpen) {
    return (
      <TestConfigModal
        isOpen={isConfigOpen}
        category="customer-service"
        categoryTitle="Customer Service Situational Scenarios"
        defaultCount={10}
        defaultDurationMinutes={10}
        onClose={() => router.push('/dashboard')}
        onStart={startTest}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <Headphones className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Preparing Support Scenarios...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Generating realistic customer conflict, empathy, and escalation cases</span>
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const questionIds = questions.map((q) => q.id);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <TestHeader
        title="Customer Service Scenarios"
        category="customer-service"
        difficulty={difficulty}
        currentQuestionIndex={currentIndex}
        totalQuestions={questions.length}
        timeRemainingSeconds={timeRemainingSeconds}
        onFinishClick={() => setIsSubmitModalOpen(true)}
        isSubmitting={isSubmitting}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            {currentQ && (
              <MCQCard
                question={currentQ}
                questionNumber={currentIndex + 1}
                totalQuestions={questions.length}
                selectedOption={answers[currentQ.id]?.selectedOption}
                onSelectOption={handleSelectOption}
                onPrevious={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                onNext={() => {
                  if (currentIndex < questions.length - 1) {
                    setCurrentIndex((prev) => prev + 1);
                  } else {
                    setIsSubmitModalOpen(true);
                  }
                }}
                isFirst={currentIndex === 0}
                isLast={currentIndex === questions.length - 1}
              />
            )}
          </div>

          <div className="lg:col-span-4 space-y-4">
            <QuestionNavigator
              totalQuestions={questions.length}
              currentIndex={currentIndex}
              answers={answers}
              questionIds={questionIds}
              flaggedIds={flaggedIds}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              onToggleFlag={handleToggleFlag}
            />

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                Core Principle:
              </span>
              Always prioritize customer validation and empathy before explaining policy limits. Avoid defensive phrases.
            </div>
          </div>
        </div>
      </main>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        totalQuestions={questions.length}
        answeredCount={answeredCount}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedIds.size}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={handleSubmitTest}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
