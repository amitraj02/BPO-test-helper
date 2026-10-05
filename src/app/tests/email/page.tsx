'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EmailScenario } from '@/types/question';
import { EmailEvaluation, TestResult } from '@/types/results';
import { saveTestResult } from '@/lib/storage/local-storage';
import {
  Mail,
  Send,
  Loader2,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  FileCheck,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function EmailTestPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scenario, setScenario] = useState<EmailScenario | null>(null);
  const [candidateEmail, setCandidateEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<EmailEvaluation | null>(null);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(900); // 15 mins
  const [wordCount, setWordCount] = useState<number>(0);

  // Load scenario from API
  useEffect(() => {
    async function loadScenario() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'email' }),
        });
        const data = await res.json();
        if (data.scenario) {
          setScenario(data.scenario);
        }
      } catch (err) {
        console.error('Failed to load email scenario:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadScenario();
  }, []);

  // Timer
  useEffect(() => {
    if (evaluation || timeRemainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [evaluation, timeRemainingSeconds]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCandidateEmail(val);
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
  };

  const handleEvaluateEmail = async () => {
    if (!scenario || candidateEmail.trim().length === 0 || isSubmitting) return;

    if (wordCount < 20) {
      alert('Your email response is too short. Please compose a professional response of at least 30-50 words.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email',
          scenarioTitle: scenario.scenarioTitle,
          customerEmail: scenario.customerEmailBody,
          candidateEmail,
          instructions: scenario.candidateInstructions,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);

        // Save result
        const evalResult = data.evaluation as EmailEvaluation;
        const testResult: TestResult = {
          id: `email_${Date.now()}`,
          category: 'email',
          title: `Email Assessment: ${scenario.issueCategory}`,
          difficulty: 'advanced',
          timestamp: Date.now(),
          timeSpentSeconds: 900 - timeRemainingSeconds,
          score: evalResult.overallScore,
          totalPossibleScore: 100,
          percentage: evalResult.overallScore,
          passed: evalResult.overallScore >= 75,
          emailEvaluation: evalResult,
          generalFeedback: `Evaluation against 100-pt Concentrix rubric resulted in a score of ${evalResult.overallScore}/100.`,
          strengths: evalResult.strengths,
          weaknesses: evalResult.mistakes,
          recommendedTopics: evalResult.suggestedCorrections,
        };

        saveTestResult(testResult);
      }
    } catch (err) {
      console.error('Failed to evaluate email:', err);
      alert('Evaluation failed. Please try submitting again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || !scenario) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <Mail className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Loading Email Ticket Scenario...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Generating realistic customer ticket and evaluation parameters</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              Round 4 Assessment
            </span>
            <span className="text-xs font-semibold text-slate-500">100-Point Official Rubric</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Email Writing Assessment
          </h1>
        </div>

        {!evaluation && (
          <div className="flex items-center space-x-2 font-mono font-bold text-sm px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTimer(timeRemainingSeconds)}</span>
          </div>
        )}
      </div>

      {!evaluation ? (
        /* Test Taking Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer Ticket & Scenario */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-slate-500 uppercase">Incoming Support Ticket</span>
                <span className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                  Urgency: {scenario.urgency}
                </span>
              </div>

              <div className="space-y-1 mb-4 text-xs">
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Customer:</strong>{' '}
                  <span className="text-slate-900 dark:text-white font-semibold">{scenario.customerName}</span>
                </p>
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Order #:</strong>{' '}
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{scenario.orderNumber}</span>
                </p>
                <p>
                  <strong className="text-slate-700 dark:text-slate-300">Category:</strong>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{scenario.issueCategory}</span>
                </p>
              </div>

              {/* Customer Email Body */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed italic">
                {scenario.customerEmailBody}
              </div>
            </div>

            {/* Candidate Instructions */}
            <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-3 flex items-center space-x-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Evaluation Rubric Criteria (100 Pts Total)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Grammar & Spelling (25 pts):</strong> Zero punctuation or tense errors.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Professional Tone (20 pts):</strong> Courteous, respectful, customer-focused.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Clarity & Readability (20 pts):</strong> Clear paragraphs, easy to read.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Completeness (20 pts):</strong> Resolves the customer issue completely.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span><strong>Customer Empathy (15 pts):</strong> Validates customer frustration.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Email Composition Editor */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Your Reply to Customer
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  {wordCount} words
                </span>
              </div>

              <textarea
                value={candidateEmail}
                onChange={handleTextChange}
                disabled={isSubmitting}
                placeholder={`Dear ${scenario.customerName},\n\nThank you for reaching out to us regarding your order #${scenario.orderNumber}...\n\nSincerely,\nCustomer Support Specialist`}
                className="w-full h-80 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                Target: 80 - 180 words with proper salutation and signoff.
              </span>

              <button
                onClick={handleEvaluateEmail}
                disabled={isSubmitting || candidateEmail.trim().length === 0}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Grading with AI Rubric...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit for AI Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Results Card */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in">
          {/* Top Score Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                AI Evaluation Result
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {evaluation.overallScore >= 75 ? 'Passed Concentrix Benchmark' : 'Review Areas for Improvement'}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Your email was audited against the 5-point non-voice criteria. Minimum pass is 75/100.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-4xl font-black ${
                  evaluation.overallScore >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {evaluation.overallScore}
              </span>
              <span className="text-slate-400 text-lg font-bold"> / 100</span>
            </div>
          </div>

          {/* 5-Criteria Rubric Breakdown Cards */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Rubric Category Scores
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(evaluation.breakdown).map(([key, item]: any) => {
                const names: Record<string, string> = {
                  grammarSpelling: 'Grammar & Spelling',
                  professionalTone: 'Professional Tone',
                  clarityReadability: 'Clarity & Readability',
                  completeness: 'Completeness',
                  customerEmpathy: 'Customer Empathy',
                };

                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-slate-500 truncate">
                        {names[key] || key}
                      </span>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {item.score}
                      </span>
                      <span className="text-xs text-slate-400">/{item.max}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {item.feedback}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Areas to Improve</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.mistakes.map((mis, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{mis}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Improved Email Example */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Model 100/100 Benchmark Response</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Compare your answer with this gold-standard response:
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans">
              {evaluation.improvedExample}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                setEvaluation(null);
                setCandidateEmail('');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Try Another Scenario
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
            >
              <span>Back to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
