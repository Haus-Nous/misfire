import Link from 'next/link';
import { Zap, ArrowRight, Sparkles, Cpu } from 'lucide-react';
import { ComparisonView } from '@/components/ComparisonView';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="relative text-center space-y-6 pt-8 pb-12 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          The Next Generation of AI-Powered EdTech
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Diagnose the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">EXACT Misconception</span> Behind Wrong Answers
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Standard adaptive learning tools just adjust difficulty or serve the next item in a sequence. <strong className="text-cyan-300 font-semibold">Misfire</strong> reconstructs the student&apos;s flawed mental model and generates a targeted counter-example question aimed at that exact cognitive gap.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/quiz"
            className="px-7 py-4 rounded-xl font-bold text-base bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2.5 active:scale-[0.98]"
          >
            <Zap className="w-5 h-5 fill-current" />
            Try Diagnostic Quiz
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/demo"
            className="px-7 py-4 rounded-xl font-bold text-base bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 transition-all flex items-center gap-2"
          >
            <Cpu className="w-5 h-5 text-indigo-400" />
            Explore Live Sandbox / API Demo
          </Link>
        </div>
      </section>

      {/* Comparison View Section */}
      <section className="space-y-6">
        <ComparisonView />
      </section>

      {/* How Misfire Works (3-Step Pipeline) */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            How Misfire Resolves Cognitive Gaps
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            From distractor analysis to cognitive dissonance and targeted mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold font-mono">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-100">Distractor Pattern Matching</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When a student picks a wrong answer, Misfire doesn&apos;t just mark it incorrect. It checks the distractor against an expert taxonomy of cognitive misconceptions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-800 flex items-center justify-center font-bold font-mono">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-100">Mental Model Diagnosis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Powered by Groq LLM reasoning, Misfire analyzes optional step-by-step student work to identify the precise flawed rule (e.g. Aristotelian impulse force vs Newton&apos;s 1st Law).
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold font-mono">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-100">Targeted Remediation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates a tailored counter-example question designed to produce cognitive dissonance, forcing the student to abandon the flawed model and master the true concept.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Subject Taxonomies */}
      <section className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-100">Supported Misconception Taxonomies</h3>
            <p className="text-xs text-slate-400 mt-1">Pre-indexed cognitive gap domains ready for real-time diagnosis.</p>
          </div>
          <Link
            href="/quiz"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            Test in Quiz Mode <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold text-cyan-400">Physics</span>
            <h4 className="text-sm font-semibold text-slate-200 mt-1">Newtonian Dynamics</h4>
            <p className="text-[11px] text-slate-400 mt-1">Impulse-Motion Equivalence & Gravitational Fall misconceptions.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold text-teal-400">Algebra</span>
            <h4 className="text-sm font-semibold text-slate-200 mt-1">Freshman&apos;s Dream Fallacy</h4>
            <p className="text-[11px] text-slate-400 mt-1">Distributing exponents over binomial sums like (a+b)².</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold text-indigo-400">Computer Science</span>
            <h4 className="text-sm font-semibold text-slate-200 mt-1">Memory & Variable Swap</h4>
            <p className="text-[11px] text-slate-400 mt-1">Sequential value overwrites vs reciprocal variable balance.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-xs font-bold text-amber-400">Fractions</span>
            <h4 className="text-sm font-semibold text-slate-200 mt-1">Whole Number Add</h4>
            <p className="text-[11px] text-slate-400 mt-1">Adding numerators and denominators independently.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
