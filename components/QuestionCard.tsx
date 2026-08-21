'use client';

import React, { useState } from 'react';
import { DiagnosticQuestion, Option } from '@/lib/questions';
import { HelpCircle, ArrowRight, Loader2, Sparkles, BrainCircuit } from 'lucide-react';

interface QuestionCardProps {
  question: DiagnosticQuestion;
  onSubmit: (selectedOption: Option, reasoning: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmit,
  isLoading = false,
  disabled = false,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string>('');
  const [showReasoningField, setShowReasoningField] = useState<boolean>(false);

  const selectedOption = question.options.find((opt) => opt.id === selectedOptionId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || isLoading || disabled) return;
    onSubmit(selectedOption, reasoning);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-cyan-950/20 backdrop-blur-md transition-all">
      {/* Subject & Topic Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 rounded-full">
            {question.topic}
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
          <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
          Target: {question.targetConcept}
        </span>
      </div>

      {/* Question Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4 leading-snug">
        {question.question}
      </h2>

      {/* Code Snippet / Context if present */}
      {question.contextSnippet && (
        <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 overflow-x-auto">
          <pre className="whitespace-pre-wrap">{question.contextSnippet}</pre>
        </div>
      )}

      {/* Options List */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Select your answer:
        </div>
        {question.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          return (
            <div
              key={opt.id}
              onClick={() => !disabled && !isLoading && setSelectedOptionId(opt.id)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/50 border-cyan-500 text-cyan-100 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                  : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
              } ${disabled || isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded-full border transition-all ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold'
                      : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950" />}
                </div>
                <span className="text-base leading-relaxed flex-1">{opt.text}</span>
              </div>
            </div>
          );
        })}

        {/* Optional Student Reasoning Input */}
        <div className="pt-3">
          {!showReasoningField ? (
            <button
              type="button"
              onClick={() => setShowReasoningField(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              + Add step-by-step thinking for deeper LLM misconception diagnosis (Optional)
            </button>
          ) : (
            <div className="space-y-2 mt-2">
              <label className="block text-xs font-semibold text-slate-400">
                Explain your thought process or working steps:
              </label>
              <textarea
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="e.g. I assumed constant velocity requires continuous force because..."
                rows={3}
                disabled={disabled || isLoading}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
              />
            </div>
          )}
        </div>

        {/* Submit Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={!selectedOptionId || isLoading || disabled}
            className={`px-6 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2.5 transition-all shadow-lg ${
              !selectedOptionId || isLoading || disabled
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Diagnosing Misconception...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Submit & Diagnose Gap
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
