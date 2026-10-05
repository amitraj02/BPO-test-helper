'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatScenario } from '@/types/question';
import { ChatMessage } from '@/types/test';
import { ChatEvaluation, TestResult } from '@/types/results';
import { saveTestResult } from '@/lib/storage/local-storage';
import {
  MessageSquare,
  Send,
  Loader2,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  User,
  Bot,
  HelpCircle,
  FileCheck,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function ChatSupportTestPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [scenario, setScenario] = useState<ChatScenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<ChatEvaluation | null>(null);
  const [startTime, setStartTime] = useState<number>(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Load chat scenario
  useEffect(() => {
    async function loadChatScenario() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'chat' }),
        });
        const data = await res.json();
        if (data.scenario) {
          setScenario(data.scenario);
          setMessages([
            {
              id: 'init',
              sender: 'customer',
              content: data.scenario.initialMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setStartTime(Date.now());
        }
      } catch (err) {
        console.error('Failed to load chat scenario:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadChatScenario();
  }, []);

  // Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!scenario || inputMessage.trim().length === 0 || isAiTyping || isEvaluating) return;

    const agentText = inputMessage.trim();
    setInputMessage('');

    const newAgentMsg: ChatMessage = {
      id: `agent_${Date.now()}`,
      sender: 'agent',
      content: agentText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, newAgentMsg];
    setMessages(updatedHistory);
    setIsAiTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario,
          history: updatedHistory.map((m) => ({ sender: m.sender, content: m.content })),
          latestAgentMessage: agentText,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `cust_${Date.now()}`,
            sender: 'customer',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsAiTyping(false);
    }
  };

  // Quick Macro Insert
  const handleInsertMacro = (phrase: string) => {
    setInputMessage((prev) => (prev ? `${prev} ${phrase}` : phrase));
  };

  // Finish and evaluate simulation
  const handleFinishChat = async () => {
    if (!scenario || messages.length < 2 || isEvaluating) return;

    const agentTurns = messages.filter((m) => m.sender === 'agent').length;
    if (agentTurns === 0) {
      alert('Please send at least one response to the customer before ending the chat.');
      return;
    }

    setIsEvaluating(true);

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chat',
          scenarioContext: scenario.scenarioContext,
          conversationTranscript: messages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setEvaluation(data.evaluation);

        // Save result
        const evalData = data.evaluation as ChatEvaluation;
        const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));

        const testResult: TestResult = {
          id: `chat_${Date.now()}`,
          category: 'chat',
          title: `Chat Support Simulation: ${scenario.customerSentiment}`,
          difficulty: 'advanced',
          timestamp: Date.now(),
          timeSpentSeconds: elapsed,
          score: evalData.overallScore,
          totalPossibleScore: 100,
          percentage: evalData.overallScore,
          passed: evalData.overallScore >= 75,
          chatEvaluation: evalData,
          generalFeedback: evalData.summary,
          strengths: evalData.strengths,
          weaknesses: evalData.areasToImprove,
          recommendedTopics: ['Customer De-escalation', 'First Contact Resolution'],
        };

        saveTestResult(testResult);
      }
    } catch (err) {
      console.error('Evaluation failed:', err);
      alert('Evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  if (isLoading || !scenario) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 mb-4 animate-pulse">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Initializing Simulated Customer Chat...
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Setting up persona, order details, and customer mood</span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
              Round 6 Simulation
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Customer: {scenario.customerName} ({scenario.customerSentiment})
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Customer Support Chat Simulation
          </h1>
        </div>

        {!evaluation && (
          <button
            onClick={handleFinishChat}
            disabled={isEvaluating || messages.filter((m) => m.sender === 'agent').length === 0}
            className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing Transcript...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Resolve & Audit Chat</span>
              </>
            )}
          </button>
        )}
      </div>

      {!evaluation ? (
        /* Chatroom Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Customer & Account Details Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs space-y-3">
              <h4 className="font-bold uppercase tracking-wider text-slate-500 mb-2">
                Live CRM Account Data
              </h4>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{scenario.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{scenario.accountDetails.accountEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {scenario.accountDetails.orderId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Product:</span>
                  <span className="text-slate-800 dark:text-slate-200 text-right">{scenario.accountDetails.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purchased:</span>
                  <span className="text-slate-800 dark:text-slate-200">{scenario.accountDetails.purchaseDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Scenario Background:</span>
                <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  {scenario.scenarioContext}
                </p>
              </div>
            </div>

            {/* Quick Macro Suggestions */}
            <div className="p-5 rounded-3xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-2">
                Quick Phrases (Click to insert):
              </span>
              <div className="space-y-1.5">
                {[
                  'I completely understand how frustrating this is.',
                  'May I please verify your delivery zip code?',
                  'Let me check the tracking logs with our carrier right now.',
                  'I can immediately arrange a priority replacement for you.',
                ].map((macro, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertMacro(macro)}
                    className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    "{macro}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Chat Box */}
          <div className="lg:col-span-8 flex flex-col h-[580px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {scenario.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {scenario.customerName}
                  </h4>
                  <span className="text-[10px] text-emerald-500 font-semibold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Online • Active Chat</span>
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-mono">
                {messages.length} messages
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isAgent = m.sender === 'agent';

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                        isAgent
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {isAgent ? 'You (Support)' : scenario.customerName} • {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {isAiTyping && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 italic">
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></div>
                  <span>{scenario.customerName} is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center space-x-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your response to the customer..."
                disabled={isAiTyping || isEvaluating}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAiTyping || inputMessage.trim().length === 0}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Evaluation Report */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                QA Audit Report
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Chat Resolution Score: {evaluation.overallScore}/100
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                {evaluation.summary}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span
                className={`text-4xl font-black ${
                  evaluation.overallScore >= 75 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {evaluation.overallScore}%
              </span>
              <p className="text-[10px] text-slate-400">
                {evaluation.overallScore >= 75 ? 'Passed Concentrix Audit' : 'Below Target Benchmark'}
              </p>
            </div>
          </div>

          {/* 6 Criteria Breakdown */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              6-Core Competency Breakdown
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(evaluation.criteria).map(([key, item]: any) => (
                <div
                  key={key}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700"
                >
                  <span className="text-[11px] font-semibold text-slate-500 capitalize block mb-1">
                    {key}
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {item.score}
                    </span>
                    <span className="text-xs text-slate-400">/{item.max}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
              <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-300 mb-3 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Observed Strengths</span>
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
                <span>Areas to Polish</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {evaluation.areasToImprove.map((area, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
