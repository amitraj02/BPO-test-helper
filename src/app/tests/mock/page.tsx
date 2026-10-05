'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MCQQuestion, ReadingTestItem, EmailScenario, TypingPassage } from '@/types/question';
import { fallbackEnglishQuestions } from '@/lib/fallback/english';
import { fallbackReadingPassages } from '@/lib/fallback/reading';
import { fallbackAptitudeQuestions } from '@/lib/fallback/aptitude';
import { fallbackCustomerServiceQuestions } from '@/lib/fallback/customer-service';
import { fallbackTypingPassages } from '@/lib/fallback/typing';
import { fallbackEmailScenarios } from '@/lib/fallback/email';
import { calculateMCQScore, calculateTypingMetrics } from '@/lib/utils/scoring';
import { saveTestResult } from '@/lib/storage/local-storage';
import { TestResult } from '@/types/results';
import {
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Keyboard,
  Mail,
  BrainCircuit,
  Headphones,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileCheck
} from 'lucide-react';

type MockSection = 'english' | 'reading' | 'aptitude' | 'typing' | 'email' | 'scenarios';

export default function FullMockTestPage() {
  const router = useRouter();

  // Active section tracker
  const [currentSection, setCurrentSection] = useState<MockSection>('english');
  const [isTestStarted, setIsTestStarted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState<number>(2700); // 45 min
  const [startTime, setStartTime] = useState<number>(0);

  // Section Data
  const [englishQuestions, setEnglishQuestions] = useState<MCQQuestion[]>([]);
  const [englishAnswers, setEnglishAnswers] = useState<Record<string, any>>({});
  const [currentEngIndex, setCurrentEngIndex] = useState(0);

  const [readingPassage, setReadingPassage] = useState<ReadingTestItem | null>(null);
  const [readingAnswers, setReadingAnswers] = useState<Record<string, any>>({});
  const [currentReadIndex, setCurrentReadIndex] = useState(0);

  const [aptitudeQuestions, setAptitudeQuestions] = useState<MCQQuestion[]>([]);
  const [aptitudeAnswers, setAptitudeAnswers] = useState<Record<string, any>>({});
  const [currentAptIndex, setCurrentAptIndex] = useState(0);

  const [scenarioQuestions, setScenarioQuestions] = useState<MCQQuestion[]>([]);
  const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, any>>({});
  const [currentScenIndex, setCurrentScenIndex] = useState(0);

  // Typing test data
  const [typingPassage, setTypingPassage] = useState<TypingPassage | null>(null);
  const [typedText, setTypedText] = useState<string>('');

  // Email writing data
  const [emailScenario, setEmailScenario] = useState<EmailScenario | null>(null);
  const [candidateEmail, setCandidateEmail] = useState<string>('');

  // Load dataset
  useEffect(() => {
    setEnglishQuestions(fallbackEnglishQuestions.slice(0, 15));
    setReadingPassage(fallbackReadingPassages[0]);
    setAptitudeQuestions(fallbackAptitudeQuestions.slice(0, 10));
    setScenarioQuestions(fallbackCustomerServiceQuestions.slice(0, 5));
    setTypingPassage(fallbackTypingPassages[1]);
    setEmailScenario(fallbackEmailScenarios[0]);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTestStarted || totalTimeRemaining <= 0 || isSubmitting) return;

    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitMock();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTestStarted, totalTimeRemaining, isSubmitting]);

  const handleStartMock = () => {
    setIsTestStarted(true);
    setStartTime(Date.now());
  };

  const handleSubmitMock = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const elapsedSeconds = Math.max(1, Math.round((Date.now() - startTime) / 1000));

    // 1. English Score
    const engScore = calculateMCQScore(englishQuestions, englishAnswers, 0, 'english', 'intermediate', 'English');
    // 2. Reading Score
    const readQuestionsAdapted = readingPassage ? readingPassage.questions.map(q => ({ ...q, category: 'reading', difficulty: 'intermediate' } as any)) : [];
    const readScore = calculateMCQScore(readQuestionsAdapted, readingAnswers, 0, 'reading', 'intermediate', 'Reading');
    // 3. Aptitude Score
    const aptScore = calculateMCQScore(aptitudeQuestions, aptitudeAnswers, 0, 'aptitude', 'intermediate', 'Aptitude');
    // 4. Scenario Score
    const scenScore = calculateMCQScore(scenarioQuestions, scenarioAnswers, 0, 'customer-service', 'intermediate', 'Scenarios');
    // 5. Typing Score
    const typeMetrics = calculateTypingMetrics(typingPassage?.text || '', typedText, 180, 180);
    const typingPct = Math.min(100, Math.round((typeMetrics.netWpm / 50) * 100));
    // 6. Email Score
    const emailWords = candidateEmail.trim().split(/\s+/).filter(Boolean).length;
    let emailScore = 78;
    if (emailWords < 40) emailScore = 50;
    else if (emailWords >= 80) emailScore = 88;

    const sectionResults = [
      { sectionName: 'English Grammar (15 Qs)', score: engScore.score, maxScore: engScore.totalPossibleScore, percentage: engScore.percentage },
      { sectionName: 'Reading Comprehension (5 Qs)', score: readScore.score, maxScore: readScore.totalPossibleScore, percentage: readScore.percentage },
      { sectionName: 'Aptitude & Reasoning (10 Qs)', score: aptScore.score, maxScore: aptScore.totalPossibleScore, percentage: aptScore.percentage },
      { sectionName: 'Typing Test (3 min)', score: typeMetrics.netWpm, maxScore: 50, percentage: typingPct },
      { sectionName: 'Email Writing (1 Task)', score: emailScore, maxScore: 100, percentage: emailScore },
      { sectionName: 'Customer Scenarios (5 Qs)', score: scenScore.score, maxScore: scenScore.totalPossibleScore, percentage: scenScore.percentage },
    ];

    const overallPct = Math.round(
      sectionResults.reduce((acc, s) => acc + s.percentage, 0) / sectionResults.length
    );

    const passed = overallPct >= 75 && typeMetrics.netWpm >= 40;

    const testResult: TestResult = {
      id: `mock_${Date.now()}`,
      category: 'mock',
      title: 'Full Mock Assessment (Concentrix Battery)',
      difficulty: 'intermediate',
      timestamp: Date.now(),
      timeSpentSeconds: elapsedSeconds,
      score: overallPct,
      totalPossibleScore: 100,
      percentage: overallPct,
      passed,
      mockSectionResults: sectionResults,
      generalFeedback: passed
        ? 'Congratulations! You passed all six sections of the simulated Concentrix assessment battery.'
        : 'You completed the battery. Some sections were below the 75% cutoff benchmark. Review the breakdown to target improvement.',
      strengths: sectionResults.filter(s => s.percentage >= 75).map(s => `${s.sectionName} (${s.percentage}%)`),
      weaknesses: sectionResults.filter(s => s.percentage < 75).map(s => `${s.sectionName} (${s.percentage}%)`),
      recommendedTopics: ['Focus on weak sections before your official interview date'],
    };

    saveTestResult(testResult);
    router.push(`/results/${testResult.id}`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pre-test Instructions Screen
  if (!isTestStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Official Mock Battery
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Full-Length Concentrix US Non-Voice Assessment
              </h1>
            </div>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            This comprehensive mock test replicates the complete sequence of tests administered for Concentrix US processes: English Grammar, Reading Comprehension, Aptitude & Reasoning, Typing Speed, Email Writing, and Customer Situational Scenarios.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 1</span>
              <strong className="text-slate-900 dark:text-white block">English Grammar</strong>
              <span>15 Questions (15 min)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 2</span>
              <strong className="text-slate-900 dark:text-white block">Reading Comprehension</strong>
              <span>5 Questions (10 min)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 3</span>
              <strong className="text-slate-900 dark:text-white block">Aptitude & Logic</strong>
              <span>10 Questions (15 min)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 4</span>
              <strong className="text-slate-900 dark:text-white block">Typing Speed</strong>
              <span>1 Passage (3 min)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 5</span>
              <strong className="text-slate-900 dark:text-white block">Email Writing</strong>
              <span>1 Customer Ticket (15 min)</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 block mb-1">Section 6</span>
              <strong className="text-slate-900 dark:text-white block">Customer Scenarios</strong>
              <span>5 Questions (10 min)</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Total Recommended Time: 45 - 60 minutes
            </span>
            <button
              onClick={handleStartMock}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all hover:scale-[1.02]"
            >
              <span>Begin Full Mock Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Multi-Section Runner
  const sections: { id: MockSection; name: string; icon: any }[] = [
    { id: 'english', name: 'English (15)', icon: BookOpen },
    { id: 'reading', name: 'Reading (5)', icon: BookOpen },
    { id: 'aptitude', name: 'Aptitude (10)', icon: BrainCircuit },
    { id: 'typing', name: 'Typing (3m)', icon: Keyboard },
    { id: 'email', name: 'Email Writing', icon: Mail },
    { id: 'scenarios', name: 'Scenarios (5)', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Top Floating Header */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              Full Mock Assessment
            </h2>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              Composite Battery
            </span>
          </div>

          {/* Section Switcher Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto max-w-full pb-1 sm:pb-0">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setCurrentSection(sec.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  currentSection === sec.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sec.name}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <div className="flex items-center space-x-1.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>{formatTimer(totalTimeRemaining)}</span>
            </div>
            <button
              onClick={handleSubmitMock}
              disabled={isSubmitting}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Scoring...' : 'Final Submit'}
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* SECTION 1: ENGLISH */}
        {currentSection === 'english' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Section 1: English Grammar</span>
              <span>Question {currentEngIndex + 1} of {englishQuestions.length}</span>
            </div>
            {englishQuestions[currentEngIndex] && (
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {englishQuestions[currentEngIndex].topic}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-3 mb-6">
                  {englishQuestions[currentEngIndex].question}
                </h3>
                <div className="space-y-3">
                  {englishQuestions[currentEngIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setEnglishAnswers((prev) => ({
                          ...prev,
                          [englishQuestions[currentEngIndex].id]: { selectedOption: idx },
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-start space-x-3 ${
                        englishAnswers[englishQuestions[currentEngIndex].id]?.selectedOption === idx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-950 dark:text-indigo-200 ring-1 ring-indigo-500'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentEngIndex((p) => Math.max(0, p - 1))}
                disabled={currentEngIndex === 0}
                className="px-4 py-2 text-xs font-bold text-slate-500 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentEngIndex < englishQuestions.length - 1) setCurrentEngIndex((p) => p + 1);
                  else setCurrentSection('reading');
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                {currentEngIndex === englishQuestions.length - 1 ? 'Go to Reading Section' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: READING */}
        {currentSection === 'reading' && readingPassage && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs leading-relaxed max-h-[500px] overflow-y-auto">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{readingPassage.passageTitle}</h4>
              <p className="whitespace-pre-line text-slate-700 dark:text-slate-300">{readingPassage.passageText}</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400">Reading Question {currentReadIndex + 1} of {readingPassage.questions.length}</span>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-2 mb-4">
                  {readingPassage.questions[currentReadIndex]?.question}
                </h3>
                <div className="space-y-2">
                  {readingPassage.questions[currentReadIndex]?.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setReadingAnswers((prev) => ({
                          ...prev,
                          [readingPassage.questions[currentReadIndex].id]: { selectedOption: idx },
                        }))
                      }
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                        readingAnswers[readingPassage.questions[currentReadIndex]?.id]?.selectedOption === idx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span className="font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setCurrentReadIndex((p) => Math.max(0, p - 1))}
                  disabled={currentReadIndex === 0}
                  className="text-xs font-bold text-slate-500 disabled:opacity-30"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (currentReadIndex < readingPassage.questions.length - 1) setCurrentReadIndex((p) => p + 1);
                    else setCurrentSection('aptitude');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
                >
                  {currentReadIndex === readingPassage.questions.length - 1 ? 'Go to Aptitude Section' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: APTITUDE */}
        {currentSection === 'aptitude' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Section 3: Aptitude & Reasoning</span>
              <span>Question {currentAptIndex + 1} of {aptitudeQuestions.length}</span>
            </div>
            {aptitudeQuestions[currentAptIndex] && (
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {aptitudeQuestions[currentAptIndex].topic}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-3 mb-6">
                  {aptitudeQuestions[currentAptIndex].question}
                </h3>
                <div className="space-y-3">
                  {aptitudeQuestions[currentAptIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setAptitudeAnswers((prev) => ({
                          ...prev,
                          [aptitudeQuestions[currentAptIndex].id]: { selectedOption: idx },
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-start space-x-3 ${
                        aptitudeAnswers[aptitudeQuestions[currentAptIndex].id]?.selectedOption === idx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentAptIndex((p) => Math.max(0, p - 1))}
                disabled={currentAptIndex === 0}
                className="px-4 py-2 text-xs font-bold text-slate-500 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentAptIndex < aptitudeQuestions.length - 1) setCurrentAptIndex((p) => p + 1);
                  else setCurrentSection('typing');
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                {currentAptIndex === aptitudeQuestions.length - 1 ? 'Go to Typing Section' : 'Next Question'}
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: TYPING */}
        {currentSection === 'typing' && typingPassage && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Section 4: Typing Speed Benchmark</span>
              <span>Passage Target: 40+ WPM</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {typingPassage.text}
            </div>
            <textarea
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder="Type the passage here..."
              className="w-full h-36 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-sm outline-none resize-none"
            />
            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">{typedText.length} characters typed</span>
              <button
                onClick={() => setCurrentSection('email')}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Next Section: Email Writing
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: EMAIL */}
        {currentSection === 'email' && emailScenario && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Section 5: Written Customer Response</span>
              <span>Rubric: 100 Points</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic">
              <strong>From:</strong> {emailScenario.customerName} (Order #{emailScenario.orderNumber})<br />
              {emailScenario.customerEmailBody}
            </div>
            <textarea
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              placeholder={`Dear ${emailScenario.customerName},\n\nThank you for reaching out...`}
              className="w-full h-44 p-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none resize-none"
            />
            <div className="flex justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400">{candidateEmail.split(/\s+/).filter(Boolean).length} words</span>
              <button
                onClick={() => setCurrentSection('scenarios')}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
              >
                Next Section: Customer Scenarios
              </button>
            </div>
          </div>
        )}

        {/* SECTION 6: CUSTOMER SCENARIOS */}
        {currentSection === 'scenarios' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Section 6: Customer Service Scenarios</span>
              <span>Question {currentScenIndex + 1} of {scenarioQuestions.length}</span>
            </div>
            {scenarioQuestions[currentScenIndex] && (
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  {scenarioQuestions[currentScenIndex].topic}
                </span>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-3 mb-6">
                  {scenarioQuestions[currentScenIndex].question}
                </h3>
                <div className="space-y-3">
                  {scenarioQuestions[currentScenIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        setScenarioAnswers((prev) => ({
                          ...prev,
                          [scenarioQuestions[currentScenIndex].id]: { selectedOption: idx },
                        }))
                      }
                      className={`w-full text-left p-3.5 rounded-xl border text-sm flex items-start space-x-3 ${
                        scenarioAnswers[scenarioQuestions[currentScenIndex].id]?.selectedOption === idx
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <span className="font-bold">{['A', 'B', 'C', 'D'][idx]}.</span>
                      <span>{opt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentScenIndex((p) => Math.max(0, p - 1))}
                disabled={currentScenIndex === 0}
                className="px-4 py-2 text-xs font-bold text-slate-500 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                onClick={handleSubmitMock}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Complete & Submit Full Mock
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
