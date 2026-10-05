'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fallbackTypingPassages } from '@/lib/fallback/typing';
import { calculateTypingMetrics } from '@/lib/utils/scoring';
import { saveTestResult } from '@/lib/storage/local-storage';
import { TestResult } from '@/types/results';
import {
  Keyboard,
  Clock,
  RotateCcw,
  CheckCircle,
  Zap,
  Target,
  Sparkles,
  ArrowRight,
  Award
} from 'lucide-react';

export default function TypingTestPage() {
  const router = useRouter();

  // Test setup
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(3);
  const [passageIndex, setPassageIndex] = useState<number>(0);
  const [passageText, setPassageText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');

  // Status
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestCompleted, setIsTestCompleted] = useState<boolean>(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(180);
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Live Metrics
  const [liveWpm, setLiveWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const passageContainerRef = useRef<HTMLDivElement>(null);

  // Pick passage based on selected duration
  useEffect(() => {
    const matching = fallbackTypingPassages.find(
      (p) => p.durationMinutes === selectedDurationMinutes
    );
    const selected = matching || fallbackTypingPassages[0];
    setPassageText(selected.text);
    setTimeRemainingSeconds(selectedDurationMinutes * 60);
    resetTest();
  }, [selectedDurationMinutes]);

  const resetTest = () => {
    setTypedText('');
    setIsTestActive(false);
    setIsTestCompleted(false);
    setHasStartedTyping(false);
    setTimeRemainingSeconds(selectedDurationMinutes * 60);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setCorrectCount(0);
    setIncorrectCount(0);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Timer interval
  useEffect(() => {
    if (!isTestActive || isTestCompleted || timeRemainingSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestActive, isTestCompleted, timeRemainingSeconds]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isTestCompleted) return;

    const val = e.target.value;

    // Start timer on first keystroke
    if (!hasStartedTyping && val.length > 0) {
      setHasStartedTyping(true);
      setIsTestActive(true);
      setStartTime(Date.now());
    }

    setTypedText(val);

    // Compute live metrics
    let correct = 0;
    let incorrect = 0;
    const minLen = Math.min(val.length, passageText.length);

    for (let i = 0; i < minLen; i++) {
      if (val[i] === passageText[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    if (val.length > passageText.length) {
      incorrect += val.length - passageText.length;
    }

    setCorrectCount(correct);
    setIncorrectCount(incorrect);

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - (startTime || Date.now())) / 1000));
    const elapsedMinutes = elapsedSeconds / 60;

    // Standard formula: WPM = (Correct characters / 5) / Elapsed time in minutes
    const wpm = Math.round((correct / 5) / elapsedMinutes);
    const acc = val.length > 0 ? Math.round((correct / val.length) * 100) : 100;

    setLiveWpm(wpm);
    setLiveAccuracy(acc);

    // Completed full passage?
    if (val.length >= passageText.length) {
      finishTest();
    }
  };

  const finishTest = () => {
    if (isTestCompleted) return;
    setIsTestCompleted(true);
    setIsTestActive(false);

    const totalSeconds = selectedDurationMinutes * 60;
    const elapsed = Math.max(1, totalSeconds - timeRemainingSeconds);
    const metrics = calculateTypingMetrics(passageText, typedText, elapsed, totalSeconds);

    const passed = metrics.netWpm >= 40 && metrics.accuracy >= 95;

    const result: TestResult = {
      id: `type_${Date.now()}`,
      category: 'typing',
      title: `Typing Test (${selectedDurationMinutes} min)`,
      difficulty: selectedDurationMinutes >= 3 ? 'intermediate' : 'easy',
      timestamp: Date.now(),
      timeSpentSeconds: elapsed,
      totalTimeAllocatedSeconds: totalSeconds,
      score: metrics.netWpm,
      totalPossibleScore: 60, // benchmark 60 WPM
      percentage: Math.min(100, Math.round((metrics.netWpm / 60) * 100)),
      passed,
      typingMetrics: {
        grossWpm: metrics.grossWpm,
        netWpm: metrics.netWpm,
        accuracy: metrics.accuracy,
        correctCharacters: metrics.correctCharacters,
        incorrectCharacters: metrics.incorrectCharacters,
      },
      generalFeedback: passed
        ? `Exceptional typing performance! Your Net WPM of ${metrics.netWpm} with ${metrics.accuracy}% accuracy exceeds the Concentrix Round 3 minimum requirement (40+ WPM with 95%+ accuracy).`
        : `Your speed was ${metrics.netWpm} Net WPM with ${metrics.accuracy}% accuracy. Concentrix requires at least 40 Net WPM with 95%+ accuracy for non-voice operations. Focus on reducing backspacing and rhythm.`,
      strengths: [
        `Net WPM: ${metrics.netWpm} words/min`,
        `Accuracy: ${metrics.accuracy}%`,
        `Correct characters: ${metrics.correctCharacters}`,
      ],
      weaknesses: metrics.accuracy < 95 ? ['Character accuracy below 95% target'] : metrics.netWpm < 40 ? ['Typing speed below 40 WPM benchmark'] : [],
      recommendedTopics: ['Support macro typing drills', 'Touch typing accuracy'],
    };

    saveTestResult(result);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Round 3 Assessment
            </span>
            <span className="text-xs font-semibold text-slate-500">Benchmark: 40+ WPM, 95% Acc</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Typing Speed & Accuracy Test
          </h1>
        </div>

        {/* Duration selector */}
        {!isTestActive && !isTestCompleted && (
          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {[1, 2, 3, 5].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDurationMinutes(mins)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedDurationMinutes === mins
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {mins} Min
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Live Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Time Remaining</span>
            <p className="text-xl font-mono font-extrabold text-slate-900 dark:text-white">
              {formatTimer(timeRemainingSeconds)}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Net Speed</span>
            <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {liveWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Live Accuracy</span>
            <p className="text-xl font-extrabold text-violet-600 dark:text-violet-400">
              {liveAccuracy}%
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Characters</span>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              <span className="text-emerald-600 dark:text-emerald-400">{correctCount}</span> /{' '}
              <span className="text-rose-600 dark:text-rose-400">{incorrectCount}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Interactive Typing Area */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative">
        {/* Text Display with Dynamic Colored Character Highlighting */}
        <div
          ref={passageContainerRef}
          className="text-lg sm:text-xl font-mono leading-relaxed select-none tracking-wide p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 mb-6 max-h-64 overflow-y-auto whitespace-pre-wrap break-words"
          onClick={() => inputRef.current?.focus()}
        >
          {passageText.split('').map((char, index) => {
            let colorClass = 'text-slate-400 dark:text-slate-600';
            const isTyped = index < typedText.length;
            const isCurrent = index === typedText.length;

            if (isTyped) {
              if (typedText[index] === char) {
                colorClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30';
              } else {
                colorClass = 'text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/60 underline decoration-rose-500 font-bold';
              }
            }

            return (
              <span key={index} className={`transition-colors ${colorClass}`}>
                {isCurrent && <span className="typing-cursor mr-[1px]" />}
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden or active typing input */}
        {!isTestCompleted ? (
          <div>
            <textarea
              ref={inputRef}
              value={typedText}
              onChange={handleInputChange}
              disabled={isTestCompleted}
              placeholder="Click here and start typing to begin the countdown timer..."
              className="w-full h-32 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              autoFocus
            />
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3">
              <span>{hasStartedTyping ? 'Typing active...' : 'Timer starts on first keypress.'}</span>
              <button
                onClick={resetTest}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart Passage</span>
              </button>
            </div>
          </div>
        ) : (
          /* Completion Summary Card */
          <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Typing Test Completed!
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                  Final Net Speed:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400 text-base font-bold">
                    {liveWpm} WPM
                  </strong>{' '}
                  • Accuracy:{' '}
                  <strong className="text-indigo-600 dark:text-indigo-400 text-base font-bold">
                    {liveAccuracy}%
                  </strong>{' '}
                  • Status:{' '}
                  <span
                    className={`font-bold ${
                      liveWpm >= 40 && liveAccuracy >= 95 ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {liveWpm >= 40 && liveAccuracy >= 95 ? 'Passed Concentrix Benchmark' : 'Below 40 WPM / 95% Cutoff'}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={resetTest}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  <span>Return to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
