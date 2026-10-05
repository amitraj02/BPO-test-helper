'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useTheme } from './ThemeContext';
import {
  Menu,
  Sun,
  Moon,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('bpo_prep_sidebar_collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('bpo_prep_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Generate readable title from current route
  const getPageTitle = (path: string) => {
    if (path === '/') return 'Overview';
    if (path === '/dashboard') return 'Candidate Dashboard';
    if (path === '/study-plan') return '5-Day Study Plan';
    if (path === '/settings') return 'Settings & Storage';
    if (path.startsWith('/tests/english')) return 'Round 2: English Assessment';
    if (path.startsWith('/tests/reading')) return 'Round 2: Reading Comprehension';
    if (path.startsWith('/tests/typing')) return 'Round 3: Typing Benchmark';
    if (path.startsWith('/tests/email')) return 'Round 4: Email Writing Rubric';
    if (path.startsWith('/tests/chat')) return 'Round 6: Chat Simulation';
    if (path.startsWith('/tests/aptitude')) return 'Round 5: Aptitude & Reasoning';
    if (path.startsWith('/tests/customer-service')) return 'Round 6: Customer Scenarios';
    if (path.startsWith('/tests/hr')) return 'Round 1: HR & Ops Practice';
    if (path.startsWith('/tests/mock')) return 'Full Mock Assessment';
    if (path.startsWith('/results')) return 'Assessment Results Report';
    return 'Preparation Suite';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Left Sidebar Menu Tab */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Layout Area to the right of the sidebar */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 w-full border-b border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left Controls: Mobile hamburger & breadcrumb */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs">
                <Link
                  href="/dashboard"
                  className="hidden sm:inline font-medium text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  BPO Prep
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:inline" />
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {getPageTitle(pathname)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                <span>Concentrix Non-Voice Prep</span>
              </div>

              {/* Theme Switcher */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Quick Start Action */}
              <Link
                href="/tests/mock"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Assessment</span>
                <span className="sm:hidden">Mock</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content Page Outlet */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
