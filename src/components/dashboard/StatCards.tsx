'use client';

import React from 'react';
import { TestResult } from '@/types/results';
import { Award, Target, Zap, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface StatCardsProps {
  history: TestResult[];
}

export default function StatCards({ history }: StatCardsProps) {
  if (history.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 dark:border-indigo-900/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <span>👋 Welcome to BPO Prep AI!</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              You haven’t completed any assessments yet. Select an assessment card below or start with the{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">English Grammar & Vocabulary</strong> test to calibrate your initial readiness score.
            </p>
          </div>
          <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>All 9 Modules Ready</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalCompleted = history.length;
  const avgScore = Math.round(history.reduce((acc, h) => acc + h.percentage, 0) / totalCompleted);
  const passedTests = history.filter(h => h.passed).length;
  const passRate = Math.round((passedTests / totalCompleted) * 100);
  const latestTest = history[0];

  const totalTimeMinutes = Math.round(history.reduce((acc, h) => acc + (h.timeSpentSeconds || 0), 0) / 60);

  const stats = [
    {
      label: 'Tests Completed',
      value: totalCompleted,
      subtext: `${passedTests} passed (≥75%)`,
      icon: Award,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      label: 'Average Score',
      value: `${avgScore}%`,
      subtext: passRate >= 75 ? 'Qualified for Concentrix R2+' : 'Target 75%+ for selection',
      icon: Target,
      color: avgScore >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400',
      bg: avgScore >= 75 ? 'bg-emerald-50 dark:bg-emerald-950/60' : 'bg-amber-50 dark:bg-amber-950/60',
    },
    {
      label: 'Latest Attempt',
      value: `${latestTest.percentage}%`,
      subtext: `${latestTest.title.substring(0, 20)}...`,
      icon: TrendingUp,
      color: latestTest.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
      bg: latestTest.passed ? 'bg-emerald-50 dark:bg-emerald-950/60' : 'bg-rose-50 dark:bg-rose-950/60',
    },
    {
      label: 'Practice Time',
      value: `${totalTimeMinutes}m`,
      subtext: `${history.length} active sessions`,
      icon: Clock,
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {s.label}
              </span>
              <div className={`p-2 rounded-xl ${s.bg} ${s.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {s.value}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                {s.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
