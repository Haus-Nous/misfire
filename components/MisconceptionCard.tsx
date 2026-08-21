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
      <div className="w-full bg-emerald-950/40 border border-emerald-800/80 rounded-2xl p-6 sm:p-8 shadow-lg shadow-emerald-950/30 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-200">Flawless Reasoning Detected!</h3>
            <p className="text-xs text-emerald-400 font-medium">Confidence: {(diagnosis.confidenceScore * 100).toFixed(0)}%</p>
          </div>
        </div>
        <p className="text-sm text-emerald-100/90 leading-relaxed mb-4">
          {diagnosis.flawedMentalModel || diagnosis.underlyingMentalModel}
        </p>
        <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-800/50 text-xs text-emerald-300 flex items-center justify-between">
          <span>Traditional System: Advance difficulty +1 level</span>
          <span className="font-semibold text-emerald-200">Misfire: Verified Conceptual Mastery</span>
        </div>
      </div>
    );
  }

  const flawedModelText = diagnosis.flawedMentalModel || diagnosis.underlyingMentalModel;
  const distractorText = diagnosis.distractorAnalysis || diagnosis.whyChosenDistractorPicked;
  const rootCauseText = diagnosis.rootCause || diagnosis.rootCauseAnalysis;
  const remedyText = diagnosis.remedyStrategy;

  return (
    <div className="w-full bg-slate-900/95 border border-rose-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/20 backdrop-blur-md space-y-6">
      {/* Header Badge & Title */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-start gap-3.5">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/30 shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800/80 rounded-md">
                Misconception Diagnosed
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-medium bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                {diagnosis.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 tracking-tight">
              {diagnosis.misconceptionName}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Code: {diagnosis.misconceptionId}
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs text-slate-400 font-medium mb-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            Diagnostic Confidence
          </span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                style={{ width: `${Math.min(100, diagnosis.confidenceScore * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-rose-400 font-mono">
              {(diagnosis.confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 4 Distinct Diagnostic Breakdown Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Field 1: Flawed Mental Model */}
        <div className="p-4.5 rounded-xl bg-slate-950/80 border border-amber-900/40 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            1. Flawed Mental Model
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {flawedModelText}
          </p>
        </div>

        {/* Field 2: Distractor Attractor Analysis */}
        <div className="p-4.5 rounded-xl bg-slate-950/80 border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-4 h-4 text-rose-400" />
            2. Distractor Attractor Rationale
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {distractorText}
          </p>
        </div>

        {/* Field 3: Root Cause Cognitive Gap */}
        <div className="p-4.5 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-cyan-400" />
            3. Root Cause Cognitive Gap
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
            {rootCauseText}
          </p>
        </div>

        {/* Field 4: Targeted Remedy Strategy */}
        <div className="p-4.5 rounded-xl bg-gradient-to-br from-teal-950/50 to-slate-950 border border-teal-800/60 space-y-2">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-teal-400" />
            4. Concrete Remedy Strategy
          </div>
          <p className="text-xs sm:text-sm text-teal-100 font-medium leading-relaxed">
            {remedyText}
          </p>
        </div>
      </div>

      {/* Action to Generate Targeted Follow-up */}
      {showFollowupButton && onGenerateFollowup && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onGenerateFollowup}
            disabled={isGeneratingFollowup}
            className="px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            {isGeneratingFollowup ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Crafting Targeted Follow-up...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                Generate Targeted Follow-up Question
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
