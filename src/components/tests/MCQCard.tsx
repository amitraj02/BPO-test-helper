'use client';

import React from 'react';
import { MCQQuestion } from '@/types/question';
import { ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface MCQCardProps {
  question: MCQQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelectOption: (optionIndex: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const optionPrefixes = ['A', 'B', 'C', 'D'];

export default function MCQCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onPrevious,
  onNext,
  isFirst,
  isLast,
}: MCQCardProps) {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[460px]">
      <div>
        {/* Header tags */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
            <Tag className="w-3.5 h-3.5" />
            <span>{question.topic}</span>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {questionNumber} / {totalQuestions}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-relaxed mb-8">
          {question.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((optionText, idx) => {
            const isSelected = selectedOption === idx;

            return (
              <button
                key={idx}
                onClick={() => onSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-150 flex items-start space-x-4 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm ring-1 ring-indigo-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {optionPrefixes[idx]}
                </span>
                <span
                  className={`text-sm sm:text-base leading-snug pt-0.5 ${
                    isSelected
                      ? 'font-semibold text-indigo-950 dark:text-indigo-200'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {optionText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Prev / Next controls */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all"
        >
          <span>{isLast ? 'Review & Finish' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
