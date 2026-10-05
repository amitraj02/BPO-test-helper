'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/layout/ThemeContext';
import {
  clearAllTestHistory,
  getSavedTestHistory,
  getUserSettings,
  saveUserSettings,
} from '@/lib/storage/local-storage';
import {
  Settings,
  Sun,
  Moon,
  Trash2,
  Download,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [historyCount, setHistoryCount] = useState<number>(0);
  const [isCleared, setIsCleared] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    const history = getSavedTestHistory();
    setHistoryCount(history.length);
  }, [isCleared]);

  const handleClearData = () => {
    clearAllTestHistory();
    setIsCleared(!isCleared);
    setShowClearConfirm(false);
  };

  const handleExportData = () => {
    const data = getSavedTestHistory();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bpo-prep-ai-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Settings & Local Storage
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage application appearance, zero-database client storage, and API settings.
        </p>
      </div>

      {/* Theme Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Appearance & Theme
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Dark / Light Mode</h4>
            <p className="text-xs text-slate-500">Toggle high-contrast dark theme for night shift practice</p>
          </div>
          <div className="flex items-center space-x-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                theme === 'light'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                theme === 'dark'
                  ? 'bg-slate-900 text-indigo-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </button>
          </div>
        </div>
      </div>

      {/* OpenAI Integration Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Key className="w-4 h-4" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            AI Engine Configuration
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          OpenAI API keys are read server-side through <code className="font-mono text-indigo-600 dark:text-indigo-400">process.env.OPENAI_API_KEY</code>.
          Keys are never exposed to the client browser.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Built-in Fallback Question Engine Active</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            If no API key is specified in <code className="font-mono">.env.local</code>, the application automatically serves verified offline question banks and simulated rubric evaluation so you can test all features seamlessly.
          </p>
        </div>
      </div>

      {/* Local Storage Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Browser Local Storage
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          No external database is used. You currently have{' '}
          <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{historyCount}</strong> saved assessment attempts in this browser.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            disabled={historyCount === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export History as JSON</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={historyCount === 0}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-xs font-semibold text-rose-600 dark:text-rose-400 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Local Test Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Clear All Practice History?</h3>
            <p className="text-xs text-slate-500 mt-2">
              This will permanently delete all {historyCount} stored assessment logs from your browser.
            </p>
            <div className="flex items-center space-x-2 mt-5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold border rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleClearData}
                className="flex-1 py-2 text-xs font-bold bg-rose-600 text-white rounded-xl"
              >
                Yes, Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
