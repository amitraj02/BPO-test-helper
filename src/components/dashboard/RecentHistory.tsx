'use client';

import React from 'react';
import Link from 'next/link';
import { TestResult } from '@/types/results';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, Trash2 } from 'lucide-react';
import { deleteTestResult } from '@/lib/storage/local-storage';

interface RecentHistoryProps {
  history: TestResult[];
  onRefresh: () => void;
}

export default function RecentHistory({ history, onRefresh }: RecentHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Clock className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Test History Yet</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Complete any assessment module to see your question review, rubric score breakdown, and progress tracking here.
        </p>
      </div>
    );
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteTestResult(id);
    onRefresh();
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Assessment Attempts</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Click any attempt to inspect question explanations & rubric</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {history.length} {history.length === 1 ? 'Attempt' : 'Attempts'}
        </span>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
        {history.slice(0, 7).map((item) => {
          const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <div
              key={item.id}
              className="p-4 sm:px-6 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.passed
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {item.passed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {item.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{dateStr}</span>
                    <span>•</span>
                    <span>{Math.round(item.timeSpentSeconds / 60)} min elapsed</span>
                    {item.totalQuestions && (
                      <>
                        <span>•</span>
                        <span>{item.correctCount}/{item.totalQuestions} correct</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <span
                    className={`text-base font-extrabold ${
                      item.passed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {item.percentage}%
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {item.passed ? 'Benchmark Met' : 'Needs Practice'}
                  </p>
                </div>

                <Link
                  href={`/results/${item.id}`}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/70 text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors"
                  title="View Detailed Results"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  title="Delete Result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
