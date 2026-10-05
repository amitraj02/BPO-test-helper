'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HRQuestion } from '@/types/question';
import {
  UserCheck,
  Send,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function HRInterviewPracticePage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<HRQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [candidateAnswer, setCandidateAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [showSample, setShowSample] = useState<boolean>(false);

  useEffect(() => {
    async function loadHRQuestions() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'hr' }),
        });
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error('Failed to load HR questions:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHRQuestions();
  }, []);

  const handleEvaluate = async () => {
    if (candidateAnswer.trim().length === 0 || isEvaluating) return;
    const currentQ = questions[currentIndex];
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'hr',
          question: currentQ.question,
          candidateAnswer,
          keyPoints: currentQ.keyPointsExpected,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setCandidateAnswer('');
      setEvaluation(null);
      setShowSample(false);
    } else {
      router.push('/dashboard');
    }
  };

  if (isLoading || questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Loading HR Practice Questions...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Curating Round 1 & Round 6 operations screening prompts</span>
        </p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Round 1 & 6 Prep
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            HR Screening & Operations Interview Practice
          </h1>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            {currentQ.topic}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-3">
            {currentQ.question}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            {currentQ.context}
          </p>
        </div>

        {/* Tips banner */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3 text-xs text-amber-900 dark:text-amber-300">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>Interviewer Tip: </strong>
            <span>{currentQ.tipsForCandidate}</span>
          </div>
        </div>

        {/* Answer input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Your Response
          </label>
          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            disabled={isEvaluating}
            placeholder="Type your spoken answer here as if speaking to the HR manager..."
            className="w-full h-44 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-sans"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setShowSample(!showSample)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <span>{showSample ? 'Hide Strong Sample Answer' : 'Show Strong Sample Answer'}</span>
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showSample ? 'rotate-90' : ''}`} />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleEvaluate}
              disabled={isEvaluating || candidateAnswer.trim().length === 0}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Answer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Get AI Feedback</span>
                </>
              )}
            </button>

            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold"
            >
              <span>{currentIndex === questions.length - 1 ? 'Finish Practice' : 'Next Question'}</span>
            </button>
          </div>
        </div>

        {/* Sample Answer Box */}
        {showSample && (
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300 mb-2">
              Model High-Scoring Response:
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed italic">
              "{currentQ.sampleStrongAnswer}"
            </p>
          </div>
        )}

        {/* AI Feedback Box */}
        {evaluation && (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                AI Evaluation Feedback
              </span>
              <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                Score: {evaluation.score} / 100
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {evaluation.feedback}
            </p>

            {evaluation.suggestedImprovement && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <strong>Recommended Improvement:</strong> {evaluation.suggestedImprovement}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
