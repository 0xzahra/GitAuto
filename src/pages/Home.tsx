import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen, Layers, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-3xl space-y-6"
      >
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full opus-glass border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-medium text-sm mb-4 tracking-wide relative">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
          <span>Intelligent Documentation Generator</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
          Write once. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]">Publish everywhere.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          GitAuto takes your project details and automatically writes complete, publication-ready technical documentation perfectly structured for GitBook and GitHub.
        </p>

        <div className="pt-8">
          <button 
            onClick={() => navigate('/generator')}
            className="opus-button opus-button-primary text-lg px-8 py-4 inline-flex items-center space-x-3 group"
          >
            <span>Start New Document</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
        <style>{`@keyframes fade-in { to { opacity: 1; } }`}</style>
        
        <div className="opus-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] mb-4">
             <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Automated Writing</h3>
          <p className="text-[var(--text-secondary)]">Generate getting started guides, API references, and troubleshooting from basic inputs.</p>
        </div>

        <div className="opus-card p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--accent-secondary)]/20 flex items-center justify-center text-[var(--accent-secondary)] mb-4">
             <Layers size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Review & Polish</h3>
          <p className="text-[var(--text-secondary)]">A side-by-side workspace allows you to tweak the Markdown and preview exactly how it will look.</p>
        </div>

        <div className="opus-card p-6 flex flex-col items-center text-center">
           <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
             <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">One-Click Push</h3>
          <p className="text-[var(--text-secondary)]">Instantly publish your generated docs to GitBook or sync them to your GitHub code storage.</p>
        </div>
      </div>
    </div>
  );
}
