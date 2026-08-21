'use client';

import React from 'react';
import { DiagnosisResult } from '@/lib/groq';
import { XCircle, CheckCircle2, Scale } from 'lucide-react';

interface ComparisonViewProps {
  diagnosis?: DiagnosisResult | null;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ diagnosis }) => {
  const tradText = diagnosis?.comparativeInsight?.traditionalResponse || 
    'Lowers question difficulty score from 0.75 to 0.50. Gives another question on the same broad topic.';
  const misfireText = diagnosis?.comparativeInsight?.misfireResponse || 
    'Pinpoints exact cognitive flaw, skips broad topic drills, and generates a counter-example scenario forcing cognitive dissonance.';

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="w-5 h-5 text-cyan-400" />
        <h3 className="text-lg font-bold text-slate-100 uppercase tracking-wider">
          Why Misfire Beats Traditional Adaptive Learning
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traditional Adaptive Learning Card */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-rose-950/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-rose-400 bg-rose-950/80 border border-rose-900/60">
                Traditional Adaptive Learning
              </span>
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>
            <h4 className="text-base font-semibold text-slate-200 mb-2">
              Behavioral Difficulty Adjuster
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Treats wrong answers as binary points on a difficulty curve. Doesn&apos;t know WHY the student chose option C over option A.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/40 text-xs text-rose-300">
            <span className="font-semibold block mb-1">Standard System Reaction:</span>
            {tradText}
          </div>
        </div>

        {/* Misfire Diagnostic Engine Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-950 border border-cyan-700/60 flex flex-col justify-between space-y-4 shadow-lg shadow-cyan-950/20">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/50">
                Misfire AI Engine
              </span>
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            </div>
            <h4 className="text-base font-semibold text-slate-100 mb-2">
              Cognitive Misconception Pinpointer
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Analyzes the specific distractor pattern & step reasoning to reconstruct the student&apos;s flawed mental model.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-cyan-900/40 border border-cyan-700/60 text-xs text-cyan-200">
            <span className="font-semibold block mb-1 text-cyan-300">Misfire Targeted Reaction:</span>
            {misfireText}
          </div>
        </div>
      </div>
    </div>
  );
};
