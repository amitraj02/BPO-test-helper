'use client';

import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Keyboard,
  Mail,
  MessageSquare,
  BrainCircuit,
  Headphones,
  UserCheck,
  Award,
  Clock,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { QuestionCategory, Difficulty } from '@/types/question';

export interface AssessmentModuleInfo {
  id: QuestionCategory;
  roundName: string;
  title: string;
  description: string;
  defaultQuestions: string;
  duration: string;
  difficulty: Difficulty;
  iconName: string;
  href: string;
  isAiPowered: boolean;
  highlight?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Keyboard,
  Mail,
  MessageSquare,
  BrainCircuit,
  Headphones,
  UserCheck,
  Award,
};

export default function AssessmentCard({ module }: { module: AssessmentModuleInfo }) {
  const Icon = iconMap[module.iconName] || BookOpen;

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60';
      case 'intermediate':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60';
      case 'advanced':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60';
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-6 rounded-2xl transition-all duration-200 ${
        module.highlight
          ? 'bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/40 border-2 border-indigo-500/50 shadow-md hover:shadow-xl hover:border-indigo-500'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700/60 shadow-sm hover:shadow-lg'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {module.roundName}
          </span>
          <div className="flex items-center space-x-1.5">
            {module.isAiPowered && (
              <span className="inline-flex items-center space-x-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60">
                <Sparkles className="w-2.5 h-2.5" />
                <span>AI Powered</span>
              </span>
            )}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border capitalize ${getDifficultyBadge(
                module.difficulty
              )}`}
            >
              {module.difficulty}
            </span>
          </div>
        </div>

        {/* Icon & Title */}
        <div className="flex items-start space-x-3.5 mb-2.5">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {module.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {module.description}
            </p>
          </div>
        </div>

        {/* Quick Meta */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{module.defaultQuestions}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{module.duration}</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-5 pt-3">
        <Link
          href={module.href}
          className={`w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm ${
            module.highlight
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              : 'bg-slate-100 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-slate-800 hover:text-white dark:text-slate-200'
          }`}
        >
          <span>Start Assessment</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
