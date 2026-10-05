'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  FileText,
  Keyboard,
  Mail,
  MessageSquare,
  BrainCircuit,
  Headphones,
  UserCheck,
  Award,
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { TestResult } from '@/types/results';
import { getSavedTestHistory } from '@/lib/storage/local-storage';
import StatCards from '@/components/dashboard/StatCards';
import AssessmentCard, { AssessmentModuleInfo } from '@/components/dashboard/AssessmentCard';
import RecentHistory from '@/components/dashboard/RecentHistory';
import PerformanceChart from '@/components/dashboard/PerformanceChart';

export default function DashboardPage() {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadHistory = () => {
    const data = getSavedTestHistory();
    setHistory(data);
    setIsLoaded(true);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const assessmentModules: AssessmentModuleInfo[] = [
    {
      id: 'mock',
      roundName: 'Comprehensive Mock',
      title: 'Full Mock Assessment',
      description: 'The complete Concentrix non-voice evaluation battery: English, Reading, Aptitude, Typing, Email, and Scenarios.',
      defaultQuestions: '45 tasks',
      duration: '45-60 min',
      difficulty: 'intermediate',
      iconName: 'Award',
      href: '/tests/mock',
      isAiPowered: true,
      highlight: true,
    },
    {
      id: 'english',
      roundName: 'Round 2',
      title: 'English Grammar & Vocabulary',
      description: 'Master tenses, subject-verb agreement, prepositions, articles, sentence correction, and professional vocabulary.',
      defaultQuestions: '10-30 MCQs',
      duration: '15 min',
      difficulty: 'intermediate',
      iconName: 'BookOpen',
      href: '/tests/english',
      isAiPowered: true,
    },
    {
      id: 'reading',
      roundName: 'Round 2',
      title: 'Reading Comprehension',
      description: 'Original business support passages, e-commerce return policies, SLA guidelines, and inference questions.',
      defaultQuestions: '1 Passage, 5 MCQs',
      duration: '10 min',
      difficulty: 'intermediate',
      iconName: 'FileText',
      href: '/tests/reading',
      isAiPowered: true,
    },
    {
      id: 'typing',
      roundName: 'Round 3',
      title: 'Typing Speed & Accuracy',
      description: 'Live in-browser typing benchmark. Real-time WPM, Net WPM, accuracy %, and customer support macro passages.',
      defaultQuestions: '1 Passage',
      duration: '1-5 min',
      difficulty: 'easy',
      iconName: 'Keyboard',
      href: '/tests/typing',
      isAiPowered: false,
    },
    {
      id: 'email',
      roundName: 'Round 4',
      title: 'Email Writing Assessment',
      description: 'Handle customer complaint tickets evaluated on the 100-pt rubric: Grammar (25), Tone (20), Clarity (20), Completeness (20), Empathy (15).',
      defaultQuestions: '1 Ticket Scenario',
      duration: '15 min',
      difficulty: 'advanced',
      iconName: 'Mail',
      href: '/tests/email',
      isAiPowered: true,
    },
    {
      id: 'chat',
      roundName: 'Round 6',
      title: 'Chat Support Simulation',
      description: 'Live interactive chat simulation. AI plays a realistic US customer with order problems while you provide resolution.',
      defaultQuestions: 'Multi-turn Live Chat',
      duration: '10 min',
      difficulty: 'advanced',
      iconName: 'MessageSquare',
      href: '/tests/chat',
      isAiPowered: true,
    },
    {
      id: 'aptitude',
      roundName: 'Round 5',
      title: 'Aptitude & Logical Reasoning',
      description: 'Percentages, ratios, averages, number series, arithmetic, and basic analytical sequencing for BPO processes.',
      defaultQuestions: '10-20 MCQs',
      duration: '15 min',
      difficulty: 'intermediate',
      iconName: 'BrainCircuit',
      href: '/tests/aptitude',
      isAiPowered: true,
    },
    {
      id: 'customer-service',
      roundName: 'Round 6',
      title: 'Customer Service Scenarios',
      description: 'Realistic situations for non-voice reps: angry refund complaints, missing info, and First Contact Resolution (FCR).',
      defaultQuestions: '5-15 Scenarios',
      duration: '10 min',
      difficulty: 'intermediate',
      iconName: 'Headphones',
      href: '/tests/customer-service',
      isAiPowered: true,
    },
    {
      id: 'hr',
      roundName: 'Round 1',
      title: 'HR & Operations Interview',
      description: 'Practice the top 8 screening questions: Tell me about yourself, 24/7 night shifts, non-voice preference, and de-escalation.',
      defaultQuestions: '8 Questions',
      duration: '15 min',
      difficulty: 'easy',
      iconName: 'UserCheck',
      href: '/tests/hr',
      isAiPowered: true,
    },
  ];

  // Calculate weak areas across all attempts
  const allWeaknesses = history.flatMap((h) => h.weaknesses || []);
  const uniqueWeaknesses = Array.from(new Set(allWeaknesses)).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Candidate Practice Dashboard
            </h1>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Active Session
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Concentrix US BPO Non-Voice (Email & Chat Support) assessment preparation and real-time skill analytics.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Link
            href="/study-plan"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>5-Day Study Plan</span>
          </Link>
          <Link
            href="/tests/mock"
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          >
            <Award className="w-4 h-4" />
            <span>Launch Mock</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <StatCards history={history} />

      {/* Weak Areas Banner if identified */}
      {uniqueWeaknesses.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                Recommended Focus Areas Based on Recent Attempts:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {uniqueWeaknesses.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-amber-200 dark:border-amber-800/60"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/study-plan"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 shrink-0 hover:underline"
          >
            <span>Generate Targeted Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Analytics Chart + Recent History row */}
      {history.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PerformanceChart history={history} />
          </div>
          <div className="lg:col-span-1">
            <div className="h-full p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Concentrix Cutoffs</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Required benchmarks for non-voice qualification</p>
                <div className="space-y-3 mt-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400">English Grammar</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">≥ 80%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Typing Speed</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">≥ 40 WPM, 95% Acc</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Written Email Rubric</span>
                    <span className="font-bold text-violet-600 dark:text-violet-400">≥ 75 / 100</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Operations Interview</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Pass (De-escalation)</span>
                  </div>
                </div>
              </div>
              <Link
                href="/tests/mock"
                className="w-full mt-4 text-center py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
              >
                Benchmark Everything with Mock Test
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Modules Grid (All 9 Modules) */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Assessment Modules & Practice Tests
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any round to launch practice tests. Questions regenerate dynamically per attempt.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            9 Modules Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessmentModules.map((mod) => (
            <AssessmentCard key={mod.id} module={mod} />
          ))}
        </div>
      </div>

      {/* Recent Attempts Log */}
      <RecentHistory history={history} onRefresh={loadHistory} />
    </div>
  );
}
