'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTestResultById } from '@/lib/storage/local-storage';
import { TestResult } from '@/types/results';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Target,
  FileText,
  AlertTriangle,
  Lightbulb,
  Check
} from 'lucide-react';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params?.id as string;

  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (!testId) return;
    const loaded = getTestResultById(testId);
    if (loaded) {
      setResult(loaded);
      if (loaded.passed) {
        // Trigger celebratory confetti for passing score
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  }, [testId]);

  if (!result) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Assessment Result Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This result may have been cleared from local storage.</p>
        <Link
          href="/dashboard"
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 print:p-0 print:m-0">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assessment Complete
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {result.title}
          </h1>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <Link
            href="/dashboard"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            <span>Candidate Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${
          result.passed
            ? 'bg-gradient-to-br from-emerald-500/10 via-white to-indigo-500/5 dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 border-emerald-300 dark:border-emerald-800/80'
            : 'bg-gradient-to-br from-rose-500/10 via-white to-amber-500/5 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 border-rose-300 dark:border-rose-800/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                  result.passed
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border-rose-300'
                }`}
              >
                {result.passed ? '✓ Concentrix Benchmark Passed' : '⚠ Below 75% Cutoff'}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(result.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
              Overall Score: {result.percentage}%
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-xl leading-relaxed">
              {result.generalFeedback}
            </p>
          </div>

          <div className="flex sm:flex-col items-baseline sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
            <div className="text-left sm:text-right">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {result.score}
              </span>
              <span className="text-slate-400 font-bold"> / {result.totalPossibleScore}</span>
              <p className="text-xs text-slate-500">Points Earned</p>
            </div>

            <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-3 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>{Math.round(result.timeSpentSeconds / 60)} min {result.timeSpentSeconds % 60}s elapsed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Section Breakdown if full mock */}
      {result.mockSectionResults && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Mock Assessment Section Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.mockSectionResults.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex justify-between items-center"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                    {s.sectionName}
                  </span>
                  <span className="text-[11px] text-slate-400">Score: {s.score} / {s.maxScore}</span>
                </div>
                <span
                  className={`text-base font-extrabold ${
                    s.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {s.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strengths & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
          <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Demonstrated Strengths</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {result.strengths.length > 0 ? (
              result.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-400">Continue practicing foundational drills.</li>
            )}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
          <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Recommended Next Exercises</span>
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {result.recommendedTopics && result.recommendedTopics.length > 0 ? (
              result.recommendedTopics.map((top, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{top}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-400">Great work! You are ready for live assessment rounds.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Question by Question Review */}
      {result.questionReviews && result.questionReviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Question-by-Question Review ({result.questionReviews.length})
            </h3>
            <span className="text-xs text-slate-400">
              {result.correctCount} correct • {result.incorrectCount} incorrect
            </span>
          </div>

          <div className="space-y-4">
            {result.questionReviews.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        q.isCorrect
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {q.topic}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      q.isCorrect
                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    {q.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                {/* Option listing if present */}
                {q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = q.userAnswer === optIdx;
                      const isCorrectChoice = q.correctAnswer === optIdx;

                      let badgeClass = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400';
                      if (isCorrectChoice) {
                        badgeClass = 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        badgeClass = 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 ${badgeClass}`}
                        >
                          <span className="w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center shrink-0 bg-white dark:bg-slate-700">
                            {letters[optIdx]}
                          </span>
                          <span className="truncate">{opt}</span>
                          {isCorrectChoice && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white font-semibold">Explanation: </strong>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800 print:hidden">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
        >
          <span>← Back to Dashboard</span>
        </Link>
        <Link
          href={`/tests/${result.category}`}
          className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Practice Another Test</span>
        </Link>
      </div>
    </div>
  );
}
