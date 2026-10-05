'use client';

import React from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

interface TestHeaderProps {
  title: string;
  category: string;
  difficulty: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeRemainingSeconds: number | null;
  onFinishClick: () => void;
  isSubmitting?: boolean;
}

export default function TestHeader({
  title,
  category,
  difficulty,
  currentQuestionIndex,
  totalQuestions,
  timeRemainingSeconds,
  onFinishClick,
  isSubmitting = false,
}: TestHeaderProps) {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeRemainingSeconds !== null && timeRemainingSeconds <= 120;
  const isCriticalTime = timeRemainingSeconds !== null && timeRemainingSeconds <= 30;

  return (
    <div className="sticky top-16 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Title & Progress */}
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-base text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                {title}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                {difficulty}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
        </div>

        {/* Right: Timer & Submit */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          {timeRemainingSeconds !== null && (
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wide ${
                isCriticalTime
                  ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800 animate-pulse'
                  : isLowTime
                  ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>{formatTime(timeRemainingSeconds)}</span>
            </div>
          )}

          <button
            onClick={onFinishClick}
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Test'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
