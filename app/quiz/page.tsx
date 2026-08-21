'use client';

import React, { useState } from 'react';
import { SEED_QUESTIONS, Question, Option, Topic, TAXONOMY } from '@/lib/questions';
import { QuestionCard } from '@/components/QuestionCard';
import { MisconceptionCard } from '@/components/MisconceptionCard';
import { ComparisonView } from '@/components/ComparisonView';
import { DiagnosisResult } from '@/lib/groq';
import { 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Lightbulb, 
  Sparkles, 
  Loader2, 
  Target, 
  AlertCircle,
  BrainCircuit,
  Wand2
} from 'lucide-react';

interface FollowupAPIResult {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  whyThisTargetsIt: string;
}

export default function QuizPage() {
  const [activeTabMode, setActiveTabMode] = useState<'seed' | 'custom'>('seed');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('fractions');
  const [topicQuestionIndex, setTopicQuestionIndex] = useState<number>(0);

  // Filter seed questions by selected topic
  const topicQuestions = SEED_QUESTIONS.filter((q) => q.topic === selectedTopic);
  const activeQuestion: Question = topicQuestions[topicQuestionIndex] || topicQuestions[0];

  // Submission & Diagnostic State
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);

  // Staged Reveal States
  const [showDiagnosisCard, setShowDiagnosisCard] = useState<boolean>(false);
  const [isGeneratingFollowup, setIsGeneratingFollowup] = useState<boolean>(false);
  const [followupData, setFollowupData] = useState<FollowupAPIResult | null>(null);
  const [showFollowupCard, setShowFollowupCard] = useState<boolean>(false);

  // Follow-up interaction
  const [followupSelectedIdx, setFollowupSelectedIdx] = useState<number | null>(null);
  const [followupSubmitted, setFollowupSubmitted] = useState<boolean>(false);

  // --- CUSTOM TOPIC MODE STATES ---
  const [customTopic, setCustomTopic] = useState<string>('Thermodynamics');
  const [customQuestion, setCustomQuestion] = useState<string>(
    'When heat is added to a gas at constant volume, what happens to the internal energy and temperature?'
  );
  const [customCorrectAnswer, setCustomCorrectAnswer] = useState<string>(
    'Internal energy increases and temperature increases.'
  );
  const [customWrongAnswer, setCustomWrongAnswer] = useState<string>(
    'Temperature remains constant because heat does zero work at constant volume.'
  );
  const [customReasoning, setCustomReasoning] = useState<string>(
    'I assumed that since W = 0 at constant volume, heat addition cannot change temperature.'
  );
  const [isInferringTaxonomy, setIsInferringTaxonomy] = useState<boolean>(false);
  const [inferredTaxonomy, setInferredTaxonomy] = useState<Record<string, string> | null>(null);

  // Reset state for new question or topic switch
  const handleResetState = () => {
    setSelectedOption(null);
    setIsDiagnosing(false);
    setDiagnosisError(null);
    setDiagnosis(null);
    setShowDiagnosisCard(false);
    setIsGeneratingFollowup(false);
    setFollowupData(null);
    setShowFollowupCard(false);
    setFollowupSelectedIdx(null);
    setFollowupSubmitted(false);
    setInferredTaxonomy(null);
  };

  const handleTopicChange = (newTopic: Topic) => {
    setActiveTabMode('seed');
    setSelectedTopic(newTopic);
    setTopicQuestionIndex(0);
    handleResetState();
  };

  const handleNextQuestion = () => {
    setTopicQuestionIndex((prev) => (prev + 1) % topicQuestions.length);
    handleResetState();
  };

  // Submit main seed question
  const handleSubmitAnswer = async (option: Option, reasoning: string) => {
    setSelectedOption(option);

    // If answer is correct, no need for misconception diagnosis
    if (option.isCorrect) {
      return;
    }

    // Wrong answer flow: trigger diagnosis & targeted follow-up
    setIsDiagnosing(true);
    setDiagnosisError(null);
    setShowDiagnosisCard(false);
    setShowFollowupCard(false);

    try {
      // 1. Call /api/diagnose
      const diagnoseRes = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeQuestion.topic,
          question: activeQuestion.question,
          correctAnswer: activeQuestion.correctAnswer,
          wrongAnswer: option.text,
          taxonomy: TAXONOMY[activeQuestion.topic],
          knownMisconceptionId: option.misconceptionId,
          studentReasoning: reasoning,
        }),
      });

      if (!diagnoseRes.ok) {
        throw new Error('Server returned an error while diagnosing misconception.');
      }

      const diagData: DiagnosisResult = await diagnoseRes.json();
      setDiagnosis(diagData);
      setIsDiagnosing(false);
      setShowDiagnosisCard(true);

      // 2. Automatically call /api/followup
      setIsGeneratingFollowup(true);
      const followupRes = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeQuestion.topic,
          misconceptionId: diagData.misconceptionId,
          misconceptionDescription: diagData.underlyingMentalModel || diagData.rootCauseAnalysis,
        }),
      });

      if (!followupRes.ok) {
        throw new Error('Failed to generate targeted follow-up question.');
      }

      const fData: FollowupAPIResult = await followupRes.json();
      setFollowupData(fData);
      setIsGeneratingFollowup(false);

      // Staged reveal
      setTimeout(() => {
        setShowFollowupCard(true);
      }, 400);

    } catch (err: unknown) {
      console.error('Quiz diagnosis error:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to diagnose misconception. Please try again.';
      setDiagnosisError(errMsg);
      setIsDiagnosing(false);
      setIsGeneratingFollowup(false);
    }
  };

  // Submit Custom Topic Form (Infer taxonomy on the fly -> Diagnose -> Followup)
  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleResetState();

    setIsInferringTaxonomy(true);
    setIsDiagnosing(true);
    setDiagnosisError(null);

    try {
      // Step 1: Infer taxonomy on the fly
      const inferRes = await fetch('/api/infer-taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          question: customQuestion,
          correctAnswer: customCorrectAnswer,
        }),
      });

      if (!inferRes.ok) {
        throw new Error('Failed to infer misconception taxonomy.');
      }

      const inferData = await inferRes.json();
      const taxonomyObj = inferData.taxonomy || {};
      setInferredTaxonomy(taxonomyObj);
      setIsInferringTaxonomy(false);

      // Step 2: Diagnose against inferred taxonomy
      const diagnoseRes = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          question: customQuestion,
          correctAnswer: customCorrectAnswer,
          wrongAnswer: customWrongAnswer,
          taxonomy: taxonomyObj,
          studentReasoning: customReasoning,
        }),
      });

      if (!diagnoseRes.ok) {
        throw new Error('Failed to diagnose custom misconception.');
      }

      const diagData: DiagnosisResult = await diagnoseRes.json();
      setDiagnosis(diagData);
      setIsDiagnosing(false);
      setShowDiagnosisCard(true);

      // Step 3: Generate targeted follow-up
      setIsGeneratingFollowup(true);
      const followupRes = await fetch('/api/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customTopic,
          misconceptionId: diagData.misconceptionId,
          misconceptionDescription: diagData.underlyingMentalModel || diagData.rootCauseAnalysis,
        }),
      });

      if (!followupRes.ok) {
        throw new Error('Failed to generate targeted follow-up for custom topic.');
      }

      const fData: FollowupAPIResult = await followupRes.json();
      setFollowupData(fData);
      setIsGeneratingFollowup(false);

      setTimeout(() => {
        setShowFollowupCard(true);
      }, 400);

    } catch (err: unknown) {
      console.error('Custom topic diagnosis error:', err);
      const errMsg = err instanceof Error ? err.message : 'Failed to infer taxonomy or diagnose custom topic.';
      setDiagnosisError(errMsg);
      setIsInferringTaxonomy(false);
      setIsDiagnosing(false);
      setIsGeneratingFollowup(false);
    }
  };

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Header Navigation & Mode Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 rounded-full flex items-center gap-1">
              <Target className="w-3.5 h-3.5" />
              Cognitive Diagnostic Room
            </span>
            {activeTabMode === 'seed' && (
              <span className="text-xs text-slate-400 font-mono">
                Question {topicQuestionIndex + 1} of {topicQuestions.length}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Diagnostic Quiz Room
          </h1>
        </div>

        {/* Topic & Custom Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          {(['fractions', 'algebra', 'photosynthesis'] as Topic[]).map((topicKey) => (
            <button
              key={topicKey}
              onClick={() => handleTopicChange(topicKey)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                activeTabMode === 'seed' && selectedTopic === topicKey
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {topicKey}
            </button>
          ))}

          {/* Separate Experimental Entry Point for Custom Topic */}
          <button
            onClick={() => {
              setActiveTabMode('custom');
              handleResetState();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              activeTabMode === 'custom'
                ? 'bg-gradient-to-r from-amber-500 to-indigo-500 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Try your own topic (experimental)
          </button>
        </div>
      </div>

      {/* --- SEED QUESTION MODE --- */}
      {activeTabMode === 'seed' && (
        <div className="space-y-6">
          <QuestionCard
            question={activeQuestion}
            onSubmit={handleSubmitAnswer}
            isLoading={isDiagnosing}
            disabled={Boolean(selectedOption)}
          />
        </div>
      )}

      {/* --- EXPERIMENTAL CUSTOM TOPIC MODE --- */}
      {activeTabMode === 'custom' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border-2 border-amber-500/50 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
                <Wand2 className="w-5 h-5" />
              </span>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Experimental Secondary Proof-Point Mode
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  On-the-Fly Misconception Taxonomy Inferencing
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-300 bg-amber-950 px-3 py-1 rounded-full border border-amber-800">
              Q&A Sandbox
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Enter any custom subject question below. Groq will first <strong className="text-amber-300 font-semibold">infer a plausible misconception taxonomy on the fly</strong>, then classify your wrong answer and generate a targeted follow-up question.
          </p>

          <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">Custom Topic:</label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Organic Chemistry, Quantum Physics, Economics"
                  required
                  disabled={isDiagnosing}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-400 mb-1">Correct Answer:</label>
                <input
                  type="text"
                  value={customCorrectAnswer}
                  onChange={(e) => setCustomCorrectAnswer(e.target.value)}
                  required
                  disabled={isDiagnosing}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-400 mb-1">Question Prompt:</label>
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                rows={2}
                required
                disabled={isDiagnosing}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 transition-all text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-rose-400 mb-1">Student Wrong Answer:</label>
                <input
                  type="text"
                  value={customWrongAnswer}
                  onChange={(e) => setCustomWrongAnswer(e.target.value)}
                  required
                  disabled={isDiagnosing}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-rose-500 transition-all text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-amber-400 mb-1">Student Work / Reasoning (Optional):</label>
                <input
                  type="text"
                  value={customReasoning}
                  onChange={(e) => setCustomReasoning(e.target.value)}
                  disabled={isDiagnosing}
                  placeholder="e.g. I assumed constant volume means temperature can't change"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-500 transition-all text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isDiagnosing}
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-orange-500 to-indigo-500 hover:from-amber-300 hover:to-indigo-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isDiagnosing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Inferring Taxonomy & Diagnosing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Infer Taxonomy & Run Diagnostic Chain
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Inferred Taxonomy Preview Pill */}
          {inferredTaxonomy && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <BrainCircuit className="w-4 h-4 text-amber-300" />
                Inferred On-the-Fly Misconception Taxonomy ({customTopic})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(inferredTaxonomy).map(([key, desc]) => (
                  <div key={key} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                    <span className="font-mono text-amber-300 font-bold block mb-0.5">{key}</span>
                    <span className="text-slate-300">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Correct Answer Celebration State (Seed Mode) */}
      {activeTabMode === 'seed' && selectedOption && selectedOption.isCorrect && (
        <div className="p-6 sm:p-8 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/30 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-200">Spot On! Correct Answer</h3>
              <p className="text-xs text-emerald-400 font-medium">You correctly mastered this concept: {activeQuestion.targetConcept}</p>
            </div>
          </div>
          <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
            {activeQuestion.explanation}
          </p>

          <div className="pt-3 flex items-center justify-between border-t border-emerald-900/60">
            <span className="text-xs text-emerald-300">No misconceptions detected. Ready for the next challenge!</span>
            <button
              onClick={handleNextQuestion}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center gap-2"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Diagnosis Error & Retry Banner */}
      {diagnosisError && (
        <div className="p-6 rounded-2xl bg-rose-950/50 border border-rose-800 text-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            Diagnosis Request Error
          </div>
          <p className="text-xs text-rose-300">{diagnosisError}</p>
        </div>
      )}

      {/* Staged Loading State during Diagnosis */}
      {isDiagnosing && (
        <div className="p-8 rounded-2xl bg-slate-900/80 border border-cyan-900/60 flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
            <Sparkles className="w-5 h-5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-cyan-300">
              {isInferringTaxonomy ? 'Inferring On-the-Fly Misconception Taxonomy...' : 'Diagnosing Cognitive Mental Model...'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Misfire engine is running Groq LLM inference to identify the exact cognitive gap and flawed mental model.
            </p>
          </div>
        </div>
      )}

      {/* Step 1 Reveal: Diagnosed Misconception Card */}
      {showDiagnosisCard && diagnosis && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
          <MisconceptionCard
            diagnosis={diagnosis}
            showFollowupButton={false}
          />
        </div>
      )}

      {/* Loading state between Diagnosis & Follow-up Generation */}
      {isGeneratingFollowup && !showFollowupCard && (
        <div className="p-6 rounded-2xl bg-teal-950/30 border border-teal-800/60 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-teal-400 animate-spin" />
            <div>
              <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">Generating Targeted Follow-up</h4>
              <p className="text-xs text-teal-200/80">Crafting a counter-example question specifically designed to isolate this gap...</p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 Reveal: Targeted Follow-Up Transition & Question Card */}
      {showFollowupCard && followupData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Targeted Remediation Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-teal-950 via-cyan-950 to-slate-900 border border-teal-500/50 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-teal-400 fill-current animate-bounce" />
              Here is a question that targets exactly that gap
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-800">
              Remediation Bridge
            </span>
          </div>

          {/* Follow-up Question Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border-2 border-teal-500/60 shadow-2xl shadow-teal-950/20 space-y-6">
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200">
                <strong className="font-semibold text-teal-300 block mb-1">Targeting Rationale:</strong>
                {followupData.whyThisTargetsIt}
              </div>

              <h3 className="text-xl font-bold text-slate-100 leading-snug pt-2">
                {followupData.question}
              </h3>
            </div>

            {/* Follow-up Options List */}
            <div className="space-y-3">
              {followupData.options.map((optionText, idx) => {
                const isSelected = followupSelectedIdx === idx;
                const isCorrectOpt = idx === followupData.correctAnswerIndex;

                let style = 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/50';

                if (followupSubmitted) {
                  if (isCorrectOpt) {
                    style = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-semibold shadow-md shadow-emerald-950/40';
                  } else if (isSelected) {
                    style = 'bg-rose-950/80 border-rose-500 text-rose-100';
                  }
                } else if (isSelected) {
                  style = 'bg-teal-950/70 border-teal-500 text-teal-100 ring-1 ring-teal-500/50';
                }

                return (
                  <div
                    key={idx}
                    onClick={() => !followupSubmitted && setFollowupSelectedIdx(idx)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${style}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs font-bold text-slate-400 mt-0.5">
                        ({String.fromCharCode(65 + idx)})
                      </span>
                      <span className="text-sm flex-1">{optionText}</span>
                      {followupSubmitted && isCorrectOpt && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {followupSubmitted && isSelected && !isCorrectOpt && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons for Follow-up */}
            {!followupSubmitted ? (
              <div className="flex justify-end pt-2">
                <button
                  disabled={followupSelectedIdx === null}
                  onClick={() => setFollowupSubmitted(true)}
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Follow-up Answer
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  {followupSelectedIdx === followupData.correctAnswerIndex
                    ? 'Misconception Repaired!'
                    : 'Remediation Step Complete'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {followupData.whyThisTargetsIt}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comparison View Footer */}
      {(diagnosis || (selectedOption && selectedOption.isCorrect)) && (
        <ComparisonView diagnosis={diagnosis} />
      )}
    </div>
  );
}
