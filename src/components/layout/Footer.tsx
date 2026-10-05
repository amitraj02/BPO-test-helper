import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ExternalLink, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compliance & Disclaimer Banner */}
        <div className="mb-10 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                Independent Assessment Preparation Notice
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                This platform is an independent educational training aid powered by AI models. It is{' '}
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">not affiliated with, endorsed, or operated by Concentrix</strong>{' '}
                or any other corporate entity. Practice tests simulate realistic non-voice evaluation patterns but do not present actual confidential recruitment exam items.
              </p>
            </div>
          </div>
          <a
            href="https://jobs.concentrix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors shrink-0"
          >
            <span>Official Concentrix Careers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-white">BPO Prep AI</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              AI-powered practice platform tailored for Concentrix US Non-Voice (Email & Chat Support) recruitment assessments in Bengaluru and global hubs.
            </p>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Offline Fallback Ready • Zero Database Required</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Assessment Modules
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/tests/english" className="hover:text-indigo-600 dark:hover:text-indigo-400">English Grammar & Vocab</Link></li>
              <li><Link href="/tests/reading" className="hover:text-indigo-600 dark:hover:text-indigo-400">Reading Comprehension</Link></li>
              <li><Link href="/tests/typing" className="hover:text-indigo-600 dark:hover:text-indigo-400">Speed & Accuracy Typing</Link></li>
              <li><Link href="/tests/email" className="hover:text-indigo-600 dark:hover:text-indigo-400">100-pt Email Writing</Link></li>
              <li><Link href="/tests/chat" className="hover:text-indigo-600 dark:hover:text-indigo-400">Live Customer Chat Simulation</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Interview Rounds
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/tests/aptitude" className="hover:text-indigo-600 dark:hover:text-indigo-400">Round 5: Aptitude & Reasoning</Link></li>
              <li><Link href="/tests/customer-service" className="hover:text-indigo-600 dark:hover:text-indigo-400">Round 6: Customer Scenarios</Link></li>
              <li><Link href="/tests/hr" className="hover:text-indigo-600 dark:hover:text-indigo-400">Round 1: HR Screening Practice</Link></li>
              <li><Link href="/tests/mock" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-indigo-600 dark:text-indigo-400">Full 6-Section Mock Assessment</Link></li>
              <li><Link href="/study-plan" className="hover:text-indigo-600 dark:hover:text-indigo-400">Adaptive 5-Day Study Plan</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Recruitment Process (6 Rounds)
            </h5>
            <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex justify-between"><span>R1: HR Screening</span><span className="text-slate-700 dark:text-slate-300 font-medium">Shifts & Bio</span></div>
              <div className="flex justify-between"><span>R2: English Test</span><span className="text-slate-700 dark:text-slate-300 font-medium">Grammar & Vocab</span></div>
              <div className="flex justify-between"><span>R3: Typing Test</span><span className="text-slate-700 dark:text-slate-300 font-medium">40+ WPM, 95% Acc</span></div>
              <div className="flex justify-between"><span>R4: Written Email</span><span className="text-slate-700 dark:text-slate-300 font-medium">Ticket Handling</span></div>
              <div className="flex justify-between"><span>R5: Aptitude</span><span className="text-slate-700 dark:text-slate-300 font-medium">Logic & Series</span></div>
              <div className="flex justify-between"><span>R6: Operations</span><span className="text-slate-700 dark:text-slate-300 font-medium">Customer Scenarios</span></div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} BPO Prep AI. Built with Next.js, React, Tailwind CSS, & OpenAI API.</p>
          <div className="flex items-center space-x-4">
            <Link href="/settings" className="hover:text-slate-600 dark:hover:text-slate-300">Settings & Privacy</Link>
            <span>•</span>
            <Link href="/dashboard" className="hover:text-slate-600 dark:hover:text-slate-300">Candidate Dashboard</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
