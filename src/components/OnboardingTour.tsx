import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, X } from 'lucide-react';

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const hasSeen = localStorage.getItem('gitauto_tour_seen');
    if (!hasSeen) {
      // Small delay to let the app load
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeTour = () => {
    setIsOpen(false);
    localStorage.setItem('gitauto_tour_seen', 'true');
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else closeTour();
  };

  const steps = [
    {
      title: "Start Here",
      desc: "Click 'New Document' to begin. You'll answer a few simple questions about your project.",
      image: <div className="w-full h-32 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-xl opacity-20 flex items-center justify-center p-4 text-center text-sm font-bold">New Document Button</div>
    },
    {
      title: "Fill in the Details",
      desc: "Provide your project links, OpenAPI specs, and brand colors. GitAuto handles the rest.",
      image: <div className="w-full h-32 bg-[var(--text-secondary)]/10 rounded-xl flex items-center justify-center p-4 text-center text-sm">Multi-Step Form Input</div>
    },
    {
      title: "Review & Polish",
      desc: "Use the side-by-side workspace to tweak the Markdown and preview exactly how it will look on GitBook.",
      image: <div className="w-full h-32 bg-[var(--text-secondary)]/10 rounded-xl flex flex-row space-x-2 p-4">
        <div className="flex-1 bg-black/20 rounded-lg"></div>
        <div className="flex-1 bg-white/20 rounded-lg"></div>
      </div>
    },
    {
      title: "Publish Instantly",
      desc: "Hit 'Push to GitBook' or sync to GitHub to put your docs live instantly.",
      image: <div className="w-full h-32 bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold rounded-xl flex items-center justify-center">Push to GitBook</div>
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeTour} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="opus-card w-full max-w-md p-6 bg-[var(--bg-surface)] relative"
      >
        <button onClick={closeTour} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
           <X size={20} />
        </button>

        <div className="mb-6">
          {steps[step].image}
        </div>

        <h3 className="text-2xl font-bold mb-2">{steps[step].title}</h3>
        <p className="text-[var(--text-secondary)] mb-8 min-h-[48px]">
          {steps[step].desc}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[var(--accent-primary)] w-4' : 'bg-[var(--text-secondary)]/30'}`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={closeTour} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold">
              Skip Tour
            </button>
            <button onClick={nextStep} className="opus-button opus-button-primary px-4 py-2 flex items-center space-x-2">
              <span>{step === 3 ? 'Get Started' : 'Next'}</span>
              {step < 3 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
