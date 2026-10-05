'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Keyboard,
  Mail,
  MessageSquare,
  BrainCircuit,
  Award,
  Clock,
  Layers,
  FileCheck,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { getSavedTestHistory } from '@/lib/storage/local-storage';

export default function LandingPage() {
  const [testCount, setTestCount] = useState<number>(0);

  useEffect(() => {
    const history = getSavedTestHistory();
    setTestCount(history.length);
  }, []);

  const rounds = [
    { round: 'Round 1', name: 'HR Screening', focus: 'Education, shifts (24/7 rotational), background & salary expectations' },
    { round: 'Round 2', name: 'English Assessment', focus: 'Tenses, prepositions, subject-verb agreement & business vocabulary' },
    { round: 'Round 3', name: 'Typing Test', focus: 'Typing speed benchmark (40+ WPM with 95%+ accuracy)' },
    { round: 'Round 4', name: 'Written Communication', focus: 'Professional customer support email writing evaluated on a 100-pt rubric' },
    { round: 'Round 5', name: 'Aptitude & Reasoning', focus: 'Percentages, ratios, number series & basic analytical reasoning' },
    { round: 'Round 6', name: 'Operations Interview', focus: 'Customer de-escalation, live chat scenarios & process readiness' },
  ];

  const features = [
    {
      title: 'Dynamic AI Generation',
      desc: 'Never practice the same test twice. Fresh questions, customer complaints, and chat scenarios generated on demand.',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60',
    },
    {
      title: 'Transparent 100-Pt Rubrics',
      desc: 'Email and chat responses scored across grammar (25), tone (20), clarity (20), completeness (20), and empathy (15).',
      icon: FileCheck,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60',
    },
    {
      title: 'Live Chat Simulation',
      desc: 'Engage with an AI playing realistic US customers (frustrated, urgent, confused) in real time with quality audits.',
      icon: MessageSquare,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60',
    },
    {
      title: 'Instant Browser Speed',
      desc: 'No database required. Typing tests run purely in-browser, and progress persists securely in your local storage.',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60',
    },
  ];

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-slate-200/80 dark:border-slate-800">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI-Powered Concentrix US BPO Non-Voice Assessment Prep</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Master Your Non-Voice Interview with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Realistic AI Simulations
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Prepare for Concentrix US non-voice (email & chat support) assessments with dynamic grammar tests,
            precision typing benchmarks, 100-point rubric email evaluations, and live simulated customer conversations.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <span>Go to Candidate Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tests/mock"
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-200 font-bold text-sm shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Award className="w-4 h-4 text-indigo-500" />
              <span>Full Mock Assessment (45 min)</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Covers all 6 Concentrix Assessment Rounds</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verified 100-Point Email Rubric</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Offline Fallback Ready</span>
            </div>
            {testCount > 0 && (
              <div className="flex items-center space-x-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>{testCount} Completed in Browser</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Concentrix 6-Round Assessment Table */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Official Assessment Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            The Concentrix US BPO Recruitment Process
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Candidates for non-voice campaigns undergo a multi-tier screening process before operational deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rounds.map((r, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {r.round}
                </span>
                <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {r.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {r.focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="w-full bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Platform Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Engineered for High First-Attempt Pass Rates
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Every practice module is built to simulate exact test timing, keyboard mechanics, and scoring criteria.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to verify your score before the actual test?
            </h2>
            <p className="text-sm text-indigo-200 mt-3 leading-relaxed">
              Launch the assessment engine right now. No signups or credit card required. Works completely in your browser.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-900 font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                Open Practice Dashboard
              </Link>
              <Link
                href="/tests/typing"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-800/80 hover:bg-indigo-800 text-white font-bold text-sm border border-indigo-700/60 transition-all"
              >
                Test Typing Speed (3 Min)
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
