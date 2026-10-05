'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSavedTestHistory } from '@/lib/storage/local-storage';
import { TestResult } from '@/types/results';
import {
  CalendarCheck,
  Sparkles,
  Loader2,
  Clock,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

export default function StudyPlanPage() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studyPlan, setStudyPlan] = useState<any>(null);

  useEffect(() => {
    async function fetchPlan() {
      const data = getSavedTestHistory();
      setHistory(data);

      const totalTests = data.length;
      const averageScore = totalTests > 0 ? Math.round(data.reduce((acc, h) => acc + h.percentage, 0) / totalTests) : 70;
      const weakTopics = Array.from(new Set(data.flatMap((h) => h.weaknesses || []))).slice(0, 5);

      try {
        const res = await fetch('/api/study-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            totalTests,
            averageScore,
            weakTopics,
          }),
        });

        const resData = await res.json();
        if (resData.plan) {
          setStudyPlan(resData.plan);
        }
      } catch (err) {
        console.error('Failed to generate study plan:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlan();
  }, []);

  if (isLoading || !studyPlan) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <CalendarCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Synthesizing Personalized Study Plan...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Analyzing your test attempts, question error patterns, and weak topics</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              AI Study Architect
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Readiness: {studyPlan.readinessLevel}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Personalized 5-Day Concentrix Prep Roadmap
          </h1>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center space-x-1"
        >
          <span>← Dashboard</span>
        </Link>
      </div>

      {/* Focus Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/60 dark:border-indigo-900/60 space-y-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Current Calibration & Strategic Focus
          </h3>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
          {studyPlan.focusSummary}
        </p>
      </div>

      {/* 5-Day Schedule Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          5-Day Action Plan
        </h3>

        <div className="space-y-4">
          {studyPlan.dailySchedule.map((day: any) => (
            <div
              key={day.day}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold text-base flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Day</span>
                  <span>{day.day}</span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {day.focus}
                    </h4>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {day.targetMinutes} min
                    </span>
                  </div>

                  <ul className="space-y-1.5 mt-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {day.actionItems.map((act: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                href={`/tests/${day.recommendedModule}`}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 hover:text-white dark:text-slate-200 text-xs font-bold transition-all text-center shrink-0 flex items-center justify-center space-x-1"
              >
                <span>Launch Day {day.day} Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tips Box */}
      {studyPlan.topProTips && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Concentrix Recruiter Best Practices
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {studyPlan.topProTips.map((tip: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
