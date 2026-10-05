'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { TestResult } from '@/types/results';
import { BarChart3, TrendingUp } from 'lucide-react';

interface PerformanceChartProps {
  history: TestResult[];
}

export default function PerformanceChart({ history }: PerformanceChartProps) {
  if (history.length < 2) {
    return (
      <div className="h-full min-h-[260px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
        <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-sm text-slate-900 dark:text-white">Performance Analytics</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
          Complete at least 2 assessments to generate your historical score progression curve and module mastery metrics.
        </p>
      </div>
    );
  }

  // Format data for chart (oldest to newest)
  const chartData = [...history]
    .reverse()
    .slice(-10)
    .map((item, idx) => ({
      index: idx + 1,
      name: item.title.split(' ')[0],
      score: item.percentage,
      date: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
    }));

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>Score Progression (Recent Attempts)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Target benchmark: 75% for non-voice qualification</p>
        </div>
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Min Pass: 75%
        </span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '0.75rem',
                color: '#fff',
                fontSize: '12px',
              }}
              formatter={(value: any) => [`${value}%`, 'Score']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
