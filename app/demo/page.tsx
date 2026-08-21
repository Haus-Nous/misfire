'use client';

import React, { useState } from 'react';
import { SEED_QUESTIONS, Question, Option, Topic, TAXONOMY } from '@/lib/questions';
import { DiagnosisResult } from '@/lib/groq';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  Target, 
  User, 
  Zap, 
  BrainCircuit, 
  Loader2,
  Layers
} from 'lucide-react';

interface FollowupAPIResult {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  whyThisTargetsIt: string;
}

interface StudentState {
  studentName: string;
  option: Option;
  colorAccent: 'rose' | 'amber' | 'cyan';
  isDiagnosing: boolean;
  diagnosis: DiagnosisResult | null;
  isGeneratingFollowup: boolean;
  followup: FollowupAPIResult | null;
}

export default function DemoPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('fractions');

  // Active question based on selected topic
  const activeQuestion: Question = 
    SEED_QUESTIONS.find((q) => q.topic === selectedTopic) || SEED_QUESTIONS[0];

  // Get the 3 wrong distractor options for this question
  const wrongOptions: Option[] = activeQuestion.options.filter((opt) => !opt.isCorrect).slice(0, 3);

  // Diagnosis & Follow-up State per Student Column
  const [students, setStudents] = useState<StudentState[]>([
    { studentName: 'Student A', option: wrongOptions[0], colorAccent: 'rose', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null },
    { studentName: 'Student B', option: wrongOptions[1], colorAccent: 'amber', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null },
    { studentName: 'Student C', option: wrongOptions[2], colorAccent: 'cyan', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null }
  ]);

  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);

  // Reset state when topic changes
  const handleTopicChange = (newTopic: Topic) => {
    setSelectedTopic(newTopic);
    const newQuestion = SEED_QUESTIONS.find((q) => q.topic === newTopic) || SEED_QUESTIONS[0];
    const newWrongs = newQuestion.options.filter((opt) => !opt.isCorrect).slice(0, 3);

    setStudents([
      { studentName: 'Student A', option: newWrongs[0], colorAccent: 'rose', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null },
      { studentName: 'Student B', option: newWrongs[1], colorAccent: 'amber', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null },
      { studentName: 'Student C', option: newWrongs[2], colorAccent: 'cyan', isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null }
    ]);
    setHasRun(false);
    setIsRunningAll(false);
  };

  // Controlled Pacing: Run Diagnosis across all 3 student columns
  const handleRunDiagnosis = async () => {
    setIsRunningAll(true);
    setHasRun(true);

    // Staggered execution for presenter narration pacing
    for (let i = 0; i < 3; i++) {
      const studentOpt = wrongOptions[i];
      if (!studentOpt) continue;

      // Set diagnosing state for column i
      setStudents((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, isDiagnosing: true, diagnosis: null, followup: null } : s))
      );

      try {
        // 1. Call /api/diagnose
        const diagRes = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: activeQuestion.topic,
            question: activeQuestion.question,
            correctAnswer: activeQuestion.correctAnswer,
            wrongAnswer: studentOpt.text,
            taxonomy: TAXONOMY[activeQuestion.topic],
            knownMisconceptionId: studentOpt.misconceptionId,
          }),
        });

        const diagData: DiagnosisResult = await diagRes.json();

        // Update diagnosis state
        setStudents((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, isDiagnosing: false, diagnosis: diagData, isGeneratingFollowup: true } : s
          )
        );

        // 2. Call /api/followup
        const followupRes = await fetch('/api/followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: activeQuestion.topic,
            misconceptionId: diagData.misconceptionId,
            misconceptionDescription: diagData.underlyingMentalModel || diagData.rootCauseAnalysis,
          }),
        });

        const followupData: FollowupAPIResult = await followupRes.json();

        setStudents((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, isGeneratingFollowup: false, followup: followupData } : s
          )
        );
      } catch (err) {
        console.error(`Error diagnosing student ${i}:`, err);
        setStudents((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, isDiagnosing: false, isGeneratingFollowup: false } : s
          )
        );
      }
    }

    setIsRunningAll(false);
  };

  const handleResetDemo = () => {
    setStudents((prev) =>
      prev.map((s) => ({ ...s, isDiagnosing: false, diagnosis: null, isGeneratingFollowup: false, followup: null }))
    );
    setHasRun(false);
    setIsRunningAll(false);
  };

  return (
    <div className="space-y-10 py-6 max-w-7xl mx-auto">
      {/* Pitch Header Banner */}
      <div className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-950 via-teal-950 to-indigo-950 border border-cyan-700/60 text-cyan-300 text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-cyan-950/40">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Misfire Hackathon Flagship Demo
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          Same question. Three mistakes.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
            Three different fixes.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Traditional adaptive software treats wrong answers as identical points on a difficulty curve. <strong className="text-cyan-300">Misfire</strong> isolates the exact cognitive misconception behind each distractor choice and builds a personalized remediation path.
        </p>

        {/* Topic Selector Controls & Action Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 px-2">Topic:</span>
            {(['fractions', 'algebra', 'photosynthesis'] as Topic[]).map((topicKey) => (
              <button
                key={topicKey}
                onClick={() => handleTopicChange(topicKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  selectedTopic === topicKey
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {topicKey}
              </button>
            ))}
          </div>

          {/* Controlled Pacing "Run Diagnosis" Button */}
          <button
            onClick={handleRunDiagnosis}
            disabled={isRunningAll}
            className={`px-7 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2.5 shadow-xl ${
              isRunningAll
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 via-teal-400 to-amber-400 hover:from-cyan-400 hover:to-amber-300 text-slate-950 shadow-cyan-500/20 active:scale-[0.98]'
            }`}
          >
            {isRunningAll ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                Diagnosing All 3 Students Live...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                {hasRun ? 'Re-Run Live Diagnosis' : 'Run Diagnosis (Live Pitch)'}
              </>
            )}
          </button>

          {hasRun && (
            <button
              onClick={handleResetDemo}
              className="px-4 py-3 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Prominent Original Base Question Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Original Base Question Prompt ({activeQuestion.topic})
            </span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800/80 font-semibold">
            Correct Answer: {activeQuestion.correctAnswer}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 leading-snug">
          {activeQuestion.question}
        </h2>
      </div>

      {/* 3 Student Columns Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {students.map((student, idx) => {
          const accentColor = student.colorAccent;

          // Color theme configurations per student column
          const colorStyles = {
            rose: {
              border: 'border-rose-900/60 hover:border-rose-500/80',
              bgHeader: 'bg-rose-950/60 border-rose-800/60 text-rose-300',
              textAccent: 'text-rose-400',
              badgeBg: 'bg-rose-950 text-rose-300 border-rose-800',
              followupBorder: 'border-rose-500/50 bg-rose-950/20'
            },
            amber: {
              border: 'border-amber-900/60 hover:border-amber-500/80',
              bgHeader: 'bg-amber-950/60 border-amber-800/60 text-amber-300',
              textAccent: 'text-amber-400',
              badgeBg: 'bg-amber-950 text-amber-300 border-amber-800',
              followupBorder: 'border-amber-500/50 bg-amber-950/20'
            },
            cyan: {
              border: 'border-cyan-900/60 hover:border-cyan-500/80',
              bgHeader: 'bg-cyan-950/60 border-cyan-800/60 text-cyan-300',
              textAccent: 'text-cyan-400',
              badgeBg: 'bg-cyan-950 text-cyan-300 border-cyan-800',
              followupBorder: 'border-cyan-500/50 bg-cyan-950/20'
            }
          }[accentColor];

          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl bg-slate-900/90 border ${colorStyles.border} shadow-2xl backdrop-blur-md space-y-6 flex flex-col justify-between transition-all duration-300`}
            >
              <div className="space-y-6">
                {/* Column Student Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${colorStyles.bgHeader}`}>
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-100">
                        {student.studentName}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Distractor #{idx + 1}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md border font-mono ${colorStyles.badgeBg}`}>
                    Option ({String.fromCharCode(65 + idx)})
                  </span>
                </div>

                {/* Wrong Answer Picked by Student */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block">
                    Student Answer Choice:
                  </span>
                  <div className="text-sm font-bold text-slate-100">
                    &quot;{student.option.text}&quot;
                  </div>
                  {student.option.explanation && (
                    <p className="text-xs text-slate-400 leading-relaxed font-normal pt-1 border-t border-slate-850">
                      {student.option.explanation}
                    </p>
                  )}
                </div>

                {/* Diagnosed Misconception Section */}
                {!student.diagnosis && !student.isDiagnosing && (
                  <div className="h-[180px] rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex flex-col items-center justify-center p-4 text-center space-y-2">
                    <BrainCircuit className="w-7 h-7 text-slate-600 animate-pulse" />
                    <span className="text-xs text-slate-400 font-medium">Awaiting Diagnosis</span>
                    <p className="text-[11px] text-slate-500">
                      Click &quot;Run Diagnosis&quot; to classify this student&apos;s mental model.
                    </p>
                  </div>
                )}

                {student.isDiagnosing && (
                  <div className="h-[180px] rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <Loader2 className={`w-7 h-7 animate-spin ${colorStyles.textAccent}`} />
                    <span className={`text-xs font-bold ${colorStyles.textAccent}`}>
                      Diagnosing Misconception...
                    </span>
                  </div>
                )}

                {student.diagnosis && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${colorStyles.badgeBg}`}>
                        Misconception Detected
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        Score: {(student.diagnosis.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-100">
                      {student.diagnosis.misconceptionName}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {student.diagnosis.underlyingMentalModel}
                    </p>
                  </div>
                )}

                {/* Follow-up Question Generated for Student */}
                {student.isGeneratingFollowup && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center gap-2 text-xs text-teal-300">
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
                    Generating Personalized Follow-up Question...
                  </div>
                )}

                {student.followup && (
                  <div className={`p-4 rounded-xl border ${colorStyles.followupBorder} space-y-3 animate-in fade-in duration-400`}>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-300 uppercase tracking-wider">
                      <Zap className="w-3.5 h-3.5 text-teal-400 fill-current" />
                      Targeted Follow-Up Fix
                    </div>

                    <h5 className="text-xs font-bold text-slate-100 leading-snug">
                      {student.followup.question}
                    </h5>

                    <div className="space-y-1.5">
                      {student.followup.options.map((optText, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-lg text-[11px] border font-medium ${
                            optIdx === student.followup?.correctAnswerIndex
                              ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-semibold'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          ({String.fromCharCode(65 + optIdx)}) {optText}
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-teal-200/90 leading-relaxed pt-1 border-t border-slate-800">
                      <strong className="text-teal-300">Why it targets it:</strong> {student.followup.whyThisTargetsIt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Pitch Cards */}
      {hasRun && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-800/60 shadow-2xl space-y-4 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-400" />
            Hackathon Pitch Synthesis
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100">
            Why Misfire Changes Adaptive Learning
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            In traditional systems, all three students above would simply be marked &quot;incorrect&quot; and moved down to level 0.5. Misfire proved that Student A has a <strong className="text-rose-300">procedural error</strong>, Student B has a <strong className="text-amber-300">concept confusion</strong>, and Student C has a <strong className="text-cyan-300">mental model inversion</strong> — generating 3 completely different targeted counter-examples to fix the exact root cause.
          </p>
        </div>
      )}
    </div>
  );
}
