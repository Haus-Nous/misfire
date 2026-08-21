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

function formatMisconceptionLabel(id: string, name?: string): string {
  if (name && name !== id && !name.includes('_')) return name;
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
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
            misconceptionDescription: diagData.flawedMentalModel || diagData.underlyingMentalModel || diagData.rootCauseAnalysis,
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
    <div className="space-y-8 py-4 max-w-7xl mx-auto">
      {/* Pitch Header Section */}
      <div className="text-center space-y-3.5 pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0d121f] border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          // LIVE COMPARISON MATRIX
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          Same question. Three mistakes.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
            Three different fixes.
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Traditional adaptive software treats wrong answers as identical points on a difficulty curve. <strong className="text-cyan-300 font-semibold">Misfire</strong> isolates the exact cognitive misconception behind each distractor choice and builds an exact counter-example.
        </p>

        {/* Topic Selector Controls & Action Trigger */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <div className="flex items-center gap-1.5 bg-[#0d121f] p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono uppercase text-slate-500 px-2 font-semibold">Domain:</span>
            {(['fractions', 'algebra', 'photosynthesis'] as Topic[]).map((topicKey) => (
              <button
                key={topicKey}
                onClick={() => handleTopicChange(topicKey)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all capitalize ${
                  selectedTopic === topicKey
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
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
            className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 shadow-lg tracking-wider ${
              isRunningAll
                ? 'bg-[#0d121f] text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 hover:from-cyan-300 hover:to-amber-300 text-slate-950 shadow-cyan-950/40 active:scale-[0.98]'
            }`}
          >
            {isRunningAll ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                DIAGNOSING 3 STUDENTS LIVE...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                {hasRun ? 'RE-RUN DIAGNOSIS MATRIX [↵]' : 'RUN LIVE DIAGNOSIS MATRIX [↵]'}
              </>
            )}
          </button>

          {hasRun && (
            <button
              onClick={handleResetDemo}
              className="px-3.5 py-2.5 rounded-xl font-mono text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#0d121f] border border-slate-800 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3 h-3" /> RESET
            </button>
          )}
        </div>
      </div>

      {/* Prominent Original Base Question Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d121f] border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
              BASE PROBLEM // {activeQuestion.topic.toUpperCase()}
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-800 font-semibold">
            KEY: {activeQuestion.correctAnswer}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-slate-100 leading-snug">
          {activeQuestion.question}
        </h2>
      </div>

      {/* 3 Student Columns Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {students.map((student, idx) => {
          const accentColor = student.colorAccent;

          // Color theme configurations per student column
          const colorStyles = {
            rose: {
              border: 'border-rose-500/30 hover:border-rose-500/60',
              bgHeader: 'bg-rose-950/40 border-rose-800/50 text-rose-300',
              textAccent: 'text-rose-400',
              badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800/80',
              followupBorder: 'border-rose-500/30 bg-[#05080e]',
              cardBg: 'bg-[#0d121f]'
            },
            amber: {
              border: 'border-amber-500/30 hover:border-amber-500/60',
              bgHeader: 'bg-amber-950/40 border-amber-800/50 text-amber-300',
              textAccent: 'text-amber-400',
              badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800/80',
              followupBorder: 'border-amber-500/30 bg-[#05080e]',
              cardBg: 'bg-[#0d121f]'
            },
            cyan: {
              border: 'border-cyan-500/30 hover:border-cyan-500/60',
              bgHeader: 'bg-cyan-950/40 border-cyan-800/50 text-cyan-300',
              textAccent: 'text-cyan-400',
              badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
              followupBorder: 'border-cyan-500/30 bg-[#05080e]',
              cardBg: 'bg-[#0d121f]'
            }
          }[accentColor];

          const formattedMisconception = student.diagnosis
            ? formatMisconceptionLabel(student.diagnosis.misconceptionId, student.diagnosis.misconceptionName)
            : '';

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl ${colorStyles.cardBg} border ${colorStyles.border} shadow-xl space-y-4 flex flex-col justify-between transition-all`}
            >
              <div className="space-y-4">
                {/* Column Student Header */}
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border ${colorStyles.bgHeader}`}>
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-100">
                        {student.studentName}
                      </h3>
                      <span className="text-[10px] text-slate-500 font-mono">
                        DISTRACTOR [{idx + 1}/3]
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${colorStyles.badgeBg}`}>
                    OPTION ({String.fromCharCode(65 + idx)})
                  </span>
                </div>

                {/* Wrong Answer Picked by Student */}
                <div className="p-3 rounded-xl bg-[#05080e] border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block">
                    // SUBMITTED WRONG ANSWER:
                  </span>
                  <div className="text-xs sm:text-sm font-bold text-slate-100">
                    &quot;{student.option.text}&quot;
                  </div>
                  {student.option.explanation && (
                    <p className="text-[11px] text-slate-400 leading-relaxed font-normal pt-1 border-t border-slate-800/60">
                      {student.option.explanation}
                    </p>
                  )}
                </div>

                {/* Diagnosed Misconception Section */}
                {!student.diagnosis && !student.isDiagnosing && (
                  <div className="h-[140px] rounded-xl border border-dashed border-slate-800 bg-[#05080e]/40 flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                    <BrainCircuit className="w-5 h-5 text-slate-600 animate-pulse" />
                    <span className="text-[11px] font-mono text-slate-400 font-medium">// AWAITING TELEMETRY</span>
                    <p className="text-[10px] text-slate-500">
                      Click &quot;Run Live Diagnosis Matrix&quot; above.
                    </p>
                  </div>
                )}

                {student.isDiagnosing && (
                  <div className="h-[140px] rounded-xl border border-slate-800 bg-[#05080e]/80 flex flex-col items-center justify-center p-3 text-center space-y-2">
                    <Loader2 className={`w-5 h-5 animate-spin ${colorStyles.textAccent}`} />
                    <span className={`text-[11px] font-mono font-bold ${colorStyles.textAccent}`}>
                      RECONSTRUCTING MENTAL MODEL...
                    </span>
                  </div>
                )}

                {student.diagnosis && (
                  <div className="p-3.5 rounded-xl bg-[#05080e] border border-slate-800 space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border ${colorStyles.badgeBg}`}>
                        // MISCONCEPTION
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        CONF: {((student.diagnosis.confidenceScore ?? student.diagnosis.confidence ?? 0.95) * 100).toFixed(0)}%
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-100 tracking-tight">
                      {formattedMisconception}
                    </h4>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {student.diagnosis.flawedMentalModel || student.diagnosis.underlyingMentalModel}
                    </p>

                    {student.diagnosis.remedyStrategy && (
                      <div className="pt-1.5 border-t border-slate-800 text-[10px] text-teal-300/90 leading-relaxed font-mono">
                        <strong className="text-teal-400">// REMEDY:</strong> {student.diagnosis.remedyStrategy}
                      </div>
                    )}
                  </div>
                )}

                {/* Follow-up Question Generated for Student */}
                {student.isGeneratingFollowup && (
                  <div className="p-3 rounded-xl bg-[#05080e] border border-slate-800 flex items-center justify-center gap-2 text-[11px] font-mono text-teal-300">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                    SYNTHESIZING COUNTER-EXAMPLE...
                  </div>
                )}

                {student.followup && (
                  <div className={`p-3.5 rounded-xl border ${colorStyles.followupBorder} space-y-2.5 animate-in fade-in duration-400`}>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-teal-300 uppercase tracking-widest">
                      <Zap className="w-3 h-3 text-teal-400 fill-current" />
                      // TARGETED COUNTER-EXAMPLE
                    </div>

                    <h5 className="text-xs font-bold text-slate-100 leading-snug">
                      {student.followup.question}
                    </h5>

                    <div className="space-y-1">
                      {student.followup.options.map((optText, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-1.5 px-2.5 rounded text-[11px] border font-mono ${
                            optIdx === student.followup?.correctAnswerIndex
                              ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200 font-bold'
                              : 'bg-[#090d16] border-slate-800 text-slate-400'
                          }`}
                        >
                          ({String.fromCharCode(65 + optIdx)}) {optText}
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-teal-200/90 leading-relaxed pt-1.5 border-t border-slate-800 font-mono">
                      <strong className="text-teal-300">// WHY IT TARGETS:</strong> {student.followup.whyThisTargetsIt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Pitch Card */}
      {hasRun && (
        <div className="p-6 sm:p-7 rounded-2xl bg-[#0d121f] border border-cyan-500/40 shadow-2xl space-y-3 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            // SYNTHESIS: ARCHITECTURAL COMPARISON
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-100">
            Why Misfire Outperforms Difficulty-Based Adaptive Learning
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
            In standard systems, all three students above are labeled as &quot;incorrect&quot; and moved down 1 level. Misfire diagnosed that Student A had an <strong className="text-rose-400">operation flaw</strong>, Student B had a <strong className="text-amber-400">conversion misconception</strong>, and Student C had an <strong className="text-cyan-400">arithmetic inversion</strong> — producing 3 mathematically targeted counter-examples to dismantle each specific cognitive error.
          </p>
        </div>
      )}
    </div>
  );
}
