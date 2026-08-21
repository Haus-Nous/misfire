'use client';

import React from 'react';
import { DiagnosisResult } from '@/lib/groq';
import { AlertTriangle, CheckCircle2, ShieldAlert, Zap, Compass, Lightbulb, Activity } from 'lucide-react';

interface MisconceptionCardProps {
  diagnosis: DiagnosisResult;
  onGenerateFollowup?: () => void;
  isGeneratingFollowup?: boolean;
  showFollowupButton?: boolean;
}

export const MisconceptionCard: React.FC<MisconceptionCardProps> = ({
  diagnosis,
  onGenerateFollowup,
  isGeneratingFollowup = false,
  showFollowupButton = true,
}) => {
  const isCorrect = diagnosis.misconceptionId === 'NONE';

  if (isCorrect) {
    return (
      <div className="w-full bg-[#0d121f] border border-emerald-500/40 rounded-2xl p-6 sm:p-7 shadow-xl shadow-emerald-950/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  // TELEMETRY: ALIGNED
                </span>
                <span className="font-mono text-[10px] text-slate-500">ID // MASTERY_CONFIRMED</span>
              </div>
              <h3 className="text-lg font-extrabold text-emerald-100 tracking-tight mt-0.5">
                Flawless Mental Model Verified
              </h3>
            </div>
          </div>
          <div className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-md border border-emerald-800/80">
            CONF: {(diagnosis.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
          {diagnosis.flawedMentalModel || diagnosis.underlyingMentalModel}
        </p>

        <div className="p-3.5 rounded-xl bg-[#05080e] border border-emerald-900/40 text-xs text-emerald-300/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono">
          <span className="text-slate-400">TRADITIONAL: +1 Difficulty Index</span>
          <span className="text-emerald-400 font-bold">MISFIRE: Conceptual Mastery Authenticated</span>
        </div>
      </div>
    );
  }

  const flawedModelText = diagnosis.flawedMentalModel || diagnosis.underlyingMentalModel;
  const distractorText = diagnosis.distractorAnalysis || diagnosis.whyChosenDistractorPicked;
  const rootCauseText = diagnosis.rootCause || diagnosis.rootCauseAnalysis;
  const remedyText = diagnosis.remedyStrategy;
  const confidenceVal = (diagnosis.confidenceScore ?? diagnosis.confidence ?? 0.95);
  const confidencePercent = (confidenceVal <= 1 ? confidenceVal * 100 : confidenceVal).toFixed(0);

  return (
    <div className="w-full bg-[#0d121f] border border-rose-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-rose-950/20 space-y-6">
      {/* Header Telemetry Bar (Precision Instrument Layout) */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-800/80 rounded">
                // MISCONCEPTION DETECTED
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono font-medium bg-slate-900 text-slate-400 rounded border border-slate-800">
                {diagnosis.category || 'Cognitive Misconception'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
              {diagnosis.misconceptionName || diagnosis.misconceptionId}
            </h3>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              TAXONOMY_KEY // <span className="text-rose-300 font-bold">{diagnosis.misconceptionId}</span>
            </p>
          </div>
        </div>

        {/* Precision Diagnostic Confidence Telemetry */}
        <div className="flex flex-col items-end shrink-0 bg-[#05080e] p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-rose-400" />
            Confidence Index
          </span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-400 rounded-full"
                style={{ width: `${Math.min(100, Number(confidencePercent))}%` }}
              />
            </div>
            <span className="text-xs font-mono font-black text-rose-300">
              {confidencePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* 2x2 Telemetry Matrix of 4 Distinct Cognitive Reasoning Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Cell 01: Flawed Mental Model */}
        <div className="p-4 rounded-xl bg-[#05080e] border border-amber-900/30 border-l-2 border-l-amber-500 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-amber-400 uppercase flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              01 // FLAWED MENTAL MODEL
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
            {flawedModelText}
          </p>
        </div>

        {/* Cell 02: Distractor Attractor Analysis */}
        <div className="p-4 rounded-xl bg-[#05080e] border border-rose-900/30 border-l-2 border-l-rose-500 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-rose-400 uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-rose-400" />
              02 // DISTRACTOR ATTRACTOR
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
            {distractorText}
          </p>
        </div>

        {/* Cell 03: Root Cause Cognitive Gap */}
        <div className="p-4 rounded-xl bg-[#05080e] border border-violet-900/30 border-l-2 border-l-violet-500 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-violet-400 uppercase flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-violet-400" />
              03 // ROOT CAUSE COGNITIVE GAP
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-normal">
            {rootCauseText}
          </p>
        </div>

        {/* Cell 04: Concrete Remedy Strategy */}
        <div className="p-4 rounded-xl bg-[#05080e] border border-teal-900/30 border-l-2 border-l-teal-400 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-teal-300 uppercase flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-teal-400" />
              04 // TARGETED REMEDY STRATEGY
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-teal-100 font-medium leading-relaxed">
            {remedyText}
          </p>
        </div>
      </div>

      {/* Action Rail: Follow-up Generation Trigger */}
      {showFollowupButton && onGenerateFollowup && (
        <div className="pt-1 flex justify-end">
          <button
            onClick={onGenerateFollowup}
            disabled={isGeneratingFollowup}
            className="px-5 py-3 rounded-xl font-mono text-xs font-bold bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/40 transition-all flex items-center gap-2 active:scale-[0.98] uppercase tracking-wider"
          >
            {isGeneratingFollowup ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                SYNTHESIZING COUNTER-EXAMPLE...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 fill-current" />
                EXECUTE COUNTER-EXAMPLE REMEDIATION [↵]
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
