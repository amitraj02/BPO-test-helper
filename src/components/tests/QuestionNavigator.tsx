'use client';

import React from 'react';
import { Flag, CheckCircle2, Circle } from 'lucide-react';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, any>;
  questionIds: string[];
  flaggedIds: Set<string>;
  onSelectQuestion: (index: number) => void;
  onToggleFlag: (id: string) => void;
}

export default function QuestionNavigator({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  flaggedIds,
  onSelectQuestion,
  onToggleFlag,
}: QuestionNavigatorProps) {
  const currentId = questionIds[currentIndex];
  const isCurrentFlagged = flaggedIds.has(currentId);

  const answeredCount = Object.keys(answers).filter(
    (k) => answers[k]?.selectedOption !== undefined || answers[k]?.textResponse?.trim()
  ).length;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Question Palette
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>

        <button
          onClick={() => onToggleFlag(currentId)}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isCurrentFlagged
              ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900'
          }`}
        >
          <Flag className={`w-3.5 h-3.5 ${isCurrentFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
          <span>{isCurrentFlagged ? 'Flagged' : 'Flag Question'}</span>
        </button>
      </div>

      {/* Grid of questions */}
      <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
        {questionIds.map((id, idx) => {
          const isCurrent = idx === currentIndex;
          const isAnswered =
            answers[id]?.selectedOption !== undefined || answers[id]?.textResponse?.trim();
          const isFlagged = flaggedIds.has(id);

          return (
            <button
              key={id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center border ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                  : isFlagged
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                  : isAnswered
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Flagged</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
}
