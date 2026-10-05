'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingTestItem, Difficulty } from '@/types/question';
import { UserAnswerRecord } from '@/types/test';
import { calculateMCQScore } from '@/lib/utils/scoring';
import { saveTestResult } from '@/lib/storage/local-storage';
import TestHeader from '@/components/tests/TestHeader';
import QuestionNavigator from '@/components/tests/QuestionNavigator';
import SubmitModal from '@/components/tests/SubmitModal';
import { FileText, Loader2, BookOpen, Sparkles, ArrowLeft, ArrowRight, Tag, ZoomIn, ZoomOut } from 'lucide-react';

export default function ReadingTestPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passageItem, setPassageItem] = useState<ReadingTestItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, UserAnswerRecord>>({});
  const [flaggedIds, setFlaggedIds] = useState<Set<string>>(new Set());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(600); // 10 minutes
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  useEffect(() => {
    async function loadReadingPassage() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'reading', difficulty: 'intermediate' }),
        });
        const data = await res.json();
        if (data.passageItem) {
          setPassageItem(data.passageItem);
          setStartTime(Date.now());
        }
      } catch (err) {
        console.error('Failed to load reading test:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadReadingPassage();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeRemainingSeconds === null || timeRemainingSeconds <= 0 || !passageItem || isSubmitting) return;

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
  }, [timeRemainingSeconds, isSubmitting, passageItem]);

  const handleSelectOption = (idx: number) => {
    if (!passageItem) return;
    const currentQ = passageItem.questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        questionId: currentQ.id,
        selectedOption: idx,
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
    if (isSubmitting || !passageItem) return;
    setIsSubmitting(true);
    setIsSubmitModalOpen(false);

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    
    // Adapt reading questions to standard MCQ questions
    const adaptedQuestions: any[] = passageItem.questions.map((q) => ({
      id: q.id,
      category: 'reading',
      difficulty: passageItem.difficulty,
      topic: q.topic,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    }));

    const result = calculateMCQScore(
      adaptedQuestions,
      answers,
      elapsedSeconds,
      'reading',
      passageItem.difficulty,
      `Reading Comprehension: ${passageItem.passageTitle}`
    );

    saveTestResult(result);
    router.push(`/results/${result.id}`);
  };

  if (isLoading || !passageItem) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Loading Reading Assessment...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Generating business scenario passage and comprehension questions</span>
        </p>
      </div>
    );
  }

  const currentQ = passageItem.questions[currentIndex];
  const questionIds = passageItem.questions.map((q) => q.id);
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = passageItem.questions.length - answeredCount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      <TestHeader
        title={`Reading: ${passageItem.passageTitle}`}
        category="reading"
        difficulty={passageItem.difficulty}
        currentQuestionIndex={currentIndex}
        totalQuestions={passageItem.questions.length}
        timeRemainingSeconds={timeRemainingSeconds}
        onFinishClick={() => setIsSubmitModalOpen(true)}
        isSubmitting={isSubmitting}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Passage Viewer */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Reference Reading Passage
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1"
                  title="Toggle Text Size"
                >
                  {fontSize === 'normal' ? <ZoomIn className="w-3.5 h-3.5" /> : <ZoomOut className="w-3.5 h-3.5" />}
                  <span className="text-[10px] font-semibold">{fontSize === 'normal' ? 'A+' : 'A-'}</span>
                </button>
              </div>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              {passageItem.passageTitle}
            </h4>

            <div
              className={`text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 whitespace-pre-line max-h-[500px] overflow-y-auto pr-2 ${
                fontSize === 'large' ? 'text-base' : 'text-sm'
              }`}
            >
              {passageItem.passageText}
            </div>
          </div>

          {/* Right Column: Question & Option Cards */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[440px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {currentQ.topic}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Question {currentIndex + 1} of {passageItem.questions.length}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-6">
                  {currentQ.question}
                </h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = answers[currentQ.id]?.selectedOption === idx;
                    const letters = ['A', 'B', 'C', 'D'];

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-start space-x-3 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 ring-1 ring-indigo-500 font-semibold text-indigo-950 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                          }`}
                        >
                          {letters[idx]}
                        </span>
                        <span className="pt-0.5 leading-snug">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prev / Next */}
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => {
                    if (currentIndex < passageItem.questions.length - 1) {
                      setCurrentIndex((prev) => prev + 1);
                    } else {
                      setIsSubmitModalOpen(true);
                    }
                  }}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm"
                >
                  <span>{currentIndex === passageItem.questions.length - 1 ? 'Finish Section' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Palette */}
            <QuestionNavigator
              totalQuestions={passageItem.questions.length}
              currentIndex={currentIndex}
              answers={answers}
              questionIds={questionIds}
              flaggedIds={flaggedIds}
              onSelectQuestion={(idx) => setCurrentIndex(idx)}
              onToggleFlag={handleToggleFlag}
            />
          </div>
        </div>
      </main>

      <SubmitModal
        isOpen={isSubmitModalOpen}
        totalQuestions={passageItem.questions.length}
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
