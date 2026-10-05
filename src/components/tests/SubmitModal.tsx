'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  totalQuestions: number;
  answeredCount: number;
  unansweredCount: number;
  flaggedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export default function SubmitModal({
  isOpen,
  totalQuestions,
  answeredCount,
  unansweredCount,
  flaggedCount,
  onCancel,
  onConfirm,
  isSubmitting = false,
}: SubmitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
          <HelpCircle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Submit Assessment?
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your completion status before finalizing your score. Once submitted, answers cannot be edited.
        </p>

        {/* Stats card */}
        <div className="grid grid-cols-3 gap-2 my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
          <div>
            <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {answeredCount}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Answered</p>
          </div>
          <div>
            <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400">
              {flaggedCount}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Flagged</p>
          </div>
          <div>
            <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
              {unansweredCount}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Unanswered</p>
          </div>
        </div>

        {unansweredCount > 0 && (
          <div className="flex items-start space-x-2 text-xs text-amber-700 dark:text-amber-400 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 mb-5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              You have {unansweredCount} unanswered questions. Unanswered questions will receive 0 points.
            </span>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Back to Test
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Evaluating...' : 'Confirm Submission'}
          </button>
        </div>
      </div>
    </div>
  );
}
