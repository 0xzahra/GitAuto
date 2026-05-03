import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../contexts/AppContext';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

export default function Generator() {
  const { state, updateIdentity, updateTechnical, updateBrand, updateGitbook } = useAppContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      // Navigate to workspace to start generation/review
      navigate('/workspace');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBrand({ logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaKitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBrand({ mediaKit: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-6">New Document</h2>
        
        {/* Progress Indicator */}
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-black/10 dark:bg-white/10 rounded-full -z-10" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--accent-primary)] rounded-full -z-10 transition-all duration-500 ease-out" 
            style={{ width: `${((step - 1) / 3) * 100}%` }} 
          />
          {[1, 2, 3, 4].map(num => (
            <div 
              key={num} 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
                ${step >= num ? 'bg-[var(--accent-primary)] text-white shadow-[0_0_15px_var(--accent-primary)]' : 'opus-glass text-[var(--text-secondary)]'}
              `}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-bold text-[var(--text-secondary)] px-2">
          <span>Identity</span>
          <span>Technical</span>
          <span>Brand</span>
          <span>Setup</span>
        </div>
      </div>

      <div className="opus-card p-8 min-h-[400px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 form-step"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Project Identity</h3>
                <button type="button" onClick={() => useAppContext().eraseIdentity()} className="text-xs text-[var(--text-secondary)] hover:text-red-500 uppercase tracking-widest font-bold flex items-center gap-1"><X size={12} /> Erase</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Project Name</label>
                  <input 
                    type="text" 
                    className="opus-input" 
                    value={state.identity.name}
                    onChange={e => updateIdentity({ name: e.target.value })}
                    placeholder="e.g. GitAuto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Tagline</label>
                  <input 
                    type="text" 
                    className="opus-input" 
                    value={state.identity.tagline}
                    onChange={e => updateIdentity({ tagline: e.target.value })}
                    placeholder="e.g. Intelligent Documentation Generator"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Website URL</label>
                  <input 
                    type="url" 
                    className="opus-input" 
                    value={state.identity.website}
                    onChange={e => updateIdentity({ website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Primary Description</label>
                  <textarea 
                    className="opus-input min-h-[120px] resize-y" 
                    value={state.identity.description}
                    onChange={e => updateIdentity({ description: e.target.value })}
                    placeholder="What does your project do? Who is it for?"
                    maxLength={2000}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
             <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Technical Inputs</h3>
                <button type="button" onClick={() => useAppContext().eraseTechnical()} className="text-xs text-[var(--text-secondary)] hover:text-red-500 uppercase tracking-widest font-bold flex items-center gap-1"><X size={12} /> Erase</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Code Project URL(s)</label>
                   <input 
                    type="text" 
                    className="opus-input" 
                    value={state.technical.repos}
                    onChange={e => updateTechnical({ repos: e.target.value })}
                    placeholder="https://github.com/org/repo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">OpenAPI Spec URL or Details</label>
                  <textarea 
                    className="opus-input min-h-[80px]" 
                    value={state.technical.openapi}
                    onChange={e => updateTechnical({ openapi: e.target.value })}
                    placeholder="Paste URL or key API paths..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Programming Language / Tech Stack</label>
                  <input 
                    type="text" 
                    className="opus-input" 
                    value={state.technical.stack}
                    onChange={e => updateTechnical({ stack: e.target.value })}
                    placeholder="e.g. React, Node.js, TypeScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Key Dependencies / Requirements</label>
                  <input 
                    type="text" 
                    className="opus-input" 
                    value={state.technical.dependencies}
                    onChange={e => updateTechnical({ dependencies: e.target.value })}
                    placeholder="e.g. Node 18+"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Brand & Media</h3>
                <button type="button" onClick={() => useAppContext().eraseBrand()} className="text-xs text-[var(--text-secondary)] hover:text-red-500 uppercase tracking-widest font-bold flex items-center gap-1"><X size={12} /> Erase</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Media Kit (URL or Upload)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                       {state.brand.mediaKit?.startsWith('data:') ? (
                         <div className="opus-input flex items-center justify-between">
                           <span className="truncate text-[var(--accent-primary)] font-medium text-sm">Media File Attached</span>
                           <button type="button" onClick={() => updateBrand({ mediaKit: '' })} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                             <X size={16} />
                           </button>
                         </div>
                       ) : (
                         <input 
                          type="url" 
                          className="opus-input" 
                          value={state.brand.mediaKit}
                          onChange={e => updateBrand({ mediaKit: e.target.value })}
                          placeholder="Link to assets..."
                        />
                       )}
                    </div>
                    {!state.brand.mediaKit?.startsWith('data:') && (
                      <label className="opus-button opus-button-secondary flex items-center justify-center px-4 cursor-pointer flex-shrink-0">
                        <UploadCloud size={18} className="mr-2" />
                        <span className="text-sm font-bold hidden sm:inline">Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={handleMediaKitUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Primary Color Hex</label>
                    <div className="flex space-x-2">
                       <input 
                        type="color" 
                        value={state.brand.colorHex || '#000000'}
                        onChange={e => updateBrand({ colorHex: e.target.value })}
                        className="w-12 h-12 rounded-xl opus-glass p-1 cursor-pointer"
                      />
                       <input 
                        type="text" 
                        className="opus-input flex-1" 
                        value={state.brand.colorHex}
                        onChange={e => updateBrand({ colorHex: e.target.value })}
                        placeholder="#hexcode"
                      />
                    </div>
                  </div>
                   <div className="flex flex-col">
                    <label className="block text-sm font-bold mb-2">Project Logo</label>
                    <div className="flex items-center space-x-4">
                      {state.brand.logoUrl ? (
                        <div className="relative w-16 h-16 rounded-xl border border-[var(--border-color)] overflow-hidden bg-black/10 dark:bg-white/10 flex items-center justify-center">
                          <img src={state.brand.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain p-1" />
                          <button 
                            type="button"
                            onClick={() => updateBrand({ logoUrl: '' })}
                            className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200 uppercase text-[10px] font-bold"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl border border-dashed border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)]">
                          <ImageIcon size={24} />
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <label className="opus-button opus-button-secondary text-sm inline-flex items-center justify-center px-4 py-2 cursor-pointer w-full text-center">
                          <UploadCloud size={16} className="mr-2" />
                          <span>Upload Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleLogoUpload}
                          />
                        </label>
                        <p className="text-[10px] text-[var(--text-secondary)] mt-2 ml-1 text-center">
                          PNG, JPG, or SVG up to 2MB.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Preferred Tone</label>
                  <select 
                    className="opus-input appearance-none"
                    value={state.brand.tone}
                    onChange={e => updateBrand({ tone: e.target.value as any })}
                  >
                    <option value="formal">Formal & Corporate</option>
                    <option value="conversational">Conversational & Friendly</option>
                    <option value="developer-focused">Developer-Focused</option>
                    <option value="neutral">Neutral & Direct</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div 
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">GitBook Connection</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Provide your access tokens to enable one-click publishing. These are stored securely in your browser and sent only securely to the APIs.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-2">GitBook Personal Access Token</label>
                  <input 
                    type="password" 
                    className="opus-input" 
                    value={state.gitbook.token}
                    onChange={e => updateGitbook({ token: e.target.value })}
                    placeholder="gb_pat_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">GitBook Organization ID (Optional)</label>
                  <input 
                    type="text" 
                    className="opus-input" 
                    value={state.gitbook.orgId}
                    onChange={e => updateGitbook({ orgId: e.target.value })}
                    placeholder="org_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">GitHub Project URL for Git Sync (Optional)</label>
                  <input 
                    type="url" 
                    className="opus-input" 
                    value={state.gitbook.githubRepo}
                    onChange={e => updateGitbook({ githubRepo: e.target.value })}
                    placeholder="https://github.com/org/repo"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-[var(--border-color)]">
          <button 
            onClick={handleBack}
            disabled={step === 1}
            className={`opus-button opus-button-secondary px-6 py-2.5 ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Back
          </button>
          
          <button 
            onClick={handleNext}
            className="opus-button opus-button-primary px-8 py-2.5 flex items-center space-x-2"
          >
            <span>{step === 4 ? 'Review & Generate' : 'Continue'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
