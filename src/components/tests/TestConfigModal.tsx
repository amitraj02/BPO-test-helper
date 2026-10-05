'use client';

import React, { useState } from 'react';
import { Difficulty, QuestionCategory } from '@/types/question';
import { Sparkles, Clock, HelpCircle, Flame, ArrowRight, X } from 'lucide-react';

interface TestConfigModalProps {
  isOpen: boolean;
  category: QuestionCategory;
  categoryTitle: string;
  defaultCount?: number;
  defaultDurationMinutes?: number;
  onClose: () => void;
  onStart: (difficulty: Difficulty, count: number, durationMinutes: number) => void;
}

export default function TestConfigModal({
  isOpen,
  category,
  categoryTitle,
  defaultCount = 10,
  defaultDurationMinutes = 15,
  onClose,
  onStart,
}: TestConfigModalProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [count, setCount] = useState<number>(defaultCount);
  const [durationMinutes, setDurationMinutes] = useState<number>(defaultDurationMinutes);

  if (!isOpen) return null;

  const countOptions = category === 'mock' ? [45] : [10, 20, 30];
  const durationOptions = [10, 15, 20, 30];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test Configuration</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {categoryTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize assessment parameters. AI generates fresh questions on demand matching your selections.
        </p>

        {/* Difficulty Selection */}
        <div className="mt-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {(['easy', 'intermediate', 'advanced'] as Difficulty[]).map((level) => {
              const isSelected = difficulty === level;
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Count */}
        {category !== 'mock' && (
          <div className="mt-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Number of Questions
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {countOptions.map((cnt) => {
                const isSelected = count === cnt;
                return (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setCount(cnt)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    {cnt} Questions
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Time Duration */}
        <div className="mt-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
            Test Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {durationOptions.map((dur) => {
              const isSelected = durationMinutes === dur;
              return (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDurationMinutes(dur)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {dur} Min
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80">
          <button
            onClick={() => onStart(difficulty, count, durationMinutes)}
            className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.01]"
          >
            <span>Generate & Start Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
