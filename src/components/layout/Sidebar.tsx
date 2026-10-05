'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  LayoutDashboard,
  Award,
  CalendarCheck,
  BookOpen,
  FileText,
  Keyboard,
  Mail,
  MessageSquare,
  BrainCircuit,
  Headphones,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  Flame,
  CheckCircle2,
  X
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getSavedTestHistory } from '@/lib/storage/local-storage';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [testCount, setTestCount] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number>(0);

  useEffect(() => {
    const history = getSavedTestHistory();
    setTestCount(history.length);
    if (history.length > 0) {
      const avg = Math.round(history.reduce((a, b) => a + b.percentage, 0) / history.length);
      setAvgScore(avg);
    }
  }, [pathname]);

  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Full Mock Test', href: '/tests/mock', icon: Award, badge: 'HOT', badgeColor: 'bg-rose-500 text-white' },
    { name: '5-Day Study Plan', href: '/study-plan', icon: CalendarCheck },
  ];

  const roundModules = [
    { name: 'English Grammar', round: 'R2', href: '/tests/english', icon: BookOpen },
    { name: 'Reading Comprehension', round: 'R2', href: '/tests/reading', icon: FileText },
    { name: 'Typing Speed (40+ WPM)', round: 'R3', href: '/tests/typing', icon: Keyboard },
    { name: 'Email Writing (100 Pts)', round: 'R4', href: '/tests/email', icon: Mail },
    { name: 'Chat Simulation', round: 'R6', href: '/tests/chat', icon: MessageSquare },
    { name: 'Aptitude & Logic', round: 'R5', href: '/tests/aptitude', icon: BrainCircuit },
    { name: 'Customer Scenarios', round: 'R6', href: '/tests/customer-service', icon: Headphones },
    { name: 'HR Screening & Ops', round: 'R1', href: '/tests/hr', icon: UserCheck },
  ];

  const systemNav = [
    { name: 'Settings & Storage', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header / Brand */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            href="/"
            onClick={onCloseMobile}
            className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25 shrink-0 hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                    BPO Prep AI
                  </span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    US
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate font-medium">
                  Concentrix Prep Suite
                </p>
              </div>
            )}
          </Link>

          {/* Close mobile button */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Hub */}
          <div>
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Main Hub
              </span>
            )}
            <div className="mt-2 space-y-1">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                    {!isCollapsed && item.badge && (
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Assessment Modules by Concentrix Round */}
          <div>
            {!isCollapsed && (
              <div className="px-3 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Assessment Modules
                </span>
                <span className="text-[9px] font-semibold text-indigo-500">6 Rounds</span>
              </div>
            )}
            <div className="mt-2 space-y-1">
              {roundModules.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? `${item.name} (${item.round})` : undefined}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800/80 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.name}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {item.round}
                        </span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Settings */}
          <div>
            {!isCollapsed && (
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Preferences
              </span>
            )}
            <div className="mt-2 space-y-1">
              {systemNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    title={isCollapsed ? item.name : undefined}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                    {!isCollapsed && <span className="flex-1 truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Profile / Quick Stats Card */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {!isCollapsed && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 dark:from-slate-800/80 dark:via-slate-800 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-700/80 shadow-sm text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Local Readiness</span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-900 dark:text-white">
                  {testCount} Tests
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Avg Score: <strong className="text-slate-900 dark:text-white">{avgScore}%</strong> • Cutoff: <span className="font-semibold text-emerald-600">75%</span>
              </p>
            </div>
          )}

          {/* Quick controls bar */}
          <div className={`flex items-center gap-1.5 ${isCollapsed ? 'flex-col' : 'justify-between'}`}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
