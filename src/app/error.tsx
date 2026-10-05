'use client';

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Something Went Wrong</h2>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        An unexpected error occurred during assessment rendering. You can retry safely.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
