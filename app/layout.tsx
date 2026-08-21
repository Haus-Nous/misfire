import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Target, Zap, PlayCircle, BookOpen, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Misfire - Misconception-Driven Adaptive Learning Engine',
  description: 'AI-powered EdTech tool that diagnoses the SPECIFIC misconception behind student wrong answers and generates targeted follow-up questions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090d16] text-slate-100 antialiased flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#090d16]/80 backdrop-blur-lg border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-blue-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-100 tracking-tight flex items-center gap-1.5">
                  MISFIRE
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                    AI
                  </span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
                  Cognitive Misconception Diagnosis
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Home
              </Link>
              <Link
                href="/quiz"
                className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-teal-400" />
                Diagnostic Quiz
              </Link>
              <Link
                href="/demo"
                className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
              >
                <PlayCircle className="w-4 h-4 text-indigo-400" />
                Live Demo / Sandbox
              </Link>
            </nav>

            {/* Right Action */}
            <div className="hidden md:flex items-center gap-3">
              <span className="px-2.5 py-1 text-[11px] font-mono font-medium text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#060910] py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span>Misfire EdTech Misconception Diagnostic Engine</span>
            </div>
            <p>Targeting the exact cognitive gap, not just the difficulty level.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
