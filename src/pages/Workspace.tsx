import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Download, RefreshCw, UploadCloud, Github, Check, AlertCircle, Save, Folder } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { createProject, updateProject } from '../lib/db';
import { DocumentSection } from '../types';

export default function Workspace() {
  const navigate = useNavigate();
  const { state, updateSection, updateProjectId, addGeneratedDocToStats } = useAppContext();
  const { user } = useAuth();
  const [activeSectionId, setActiveSectionId] = useState(state.sections[0].id);
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<any>(null);

  const activeSection = state.sections.find(s => s.id === activeSectionId) || state.sections[0];

  const handleSave = async () => {
    if (!user) {
      setPublishStatus({ type: 'error', message: 'You must be logged in to save.' });
      return;
    }
    setPublishStatus({ type: 'info', message: 'Saving project...' });
    try {
      if (state.projectId) {
        await updateProject(state.projectId, state.identity.name, state.identity, state.technical, state.brand, state.sections);
      } else {
        const newId = await createProject(state.identity.name, state.identity, state.technical, state.brand, state.sections);
        if (newId) updateProjectId(newId);
      }
      setPublishStatus({ type: 'success', message: 'Project saved to cloud!' });
      setTimeout(() => setPublishStatus(null), 3000);
    } catch (err: any) {
      setPublishStatus({ type: 'error', message: err.message });
    }
  };

  const generateSection = async (section: DocumentSection) => {
    updateSection(section.id, { status: 'generating' });
    
    try {
      const res = await fetch('/api/generate-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: section.title,
          identity: state.identity,
          technical: state.technical,
          brand: state.brand
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      updateSection(section.id, { 
        content: data.content.replace(/^```markdown\\n|```$/g, ''), // Strip markdown block wrapper if present
        status: 'done' 
      });
      addGeneratedDocToStats();
      
    } catch (err) {
      updateSection(section.id, { status: 'error' });
      console.error(err);
    }
  };

  const handleRegenerateAll = () => {
    const confirm = window.confirm("Are you sure you want to regenerate all sections? Current edits will be lost.");
    if (confirm) {
      state.sections.forEach(s => generateSection(s));
    }
  };

  const pushToGitbook = async () => {
    setPublishing(true);
    setPublishStatus({ type: 'info', message: 'Publishing to GitBook...' });
    try {
      const res = await fetch('/api/publish/gitbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: state.gitbook.token,
          orgId: state.gitbook.orgId,
          title: state.identity.name,
          sections: state.sections
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPublishStatus({ type: 'success', message: `Published to GitBook!`, url: data.url });
    } catch (err: any) {
      setPublishStatus({ type: 'error', message: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const syncToGithub = async () => {
    setPublishing(true);
    setPublishStatus({ type: 'info', message: 'Starting GitHub sync...' });
    try {
      const res = await fetch('/api/publish/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: state.gitbook.token, // assume sharing token or prompt for GH token
          repoUrl: state.gitbook.githubRepo,
          sections: state.sections
        })
      });
      
      const reader = res.body?.getReader();
      if (!reader) throw new Error('Response body is unavailable');

      const decoder = new TextDecoder('utf-8');
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            setPublishStatus(data);
          } catch (err) {
            console.error('Error parsing JSON chunk:', err);
          }
        }
      }
    } catch (err: any) {
      setPublishStatus({ type: 'error', message: err.message });
    } finally {
      setPublishing(false);
    }
  };

  const exportToZip = async () => {
    const zip = new JSZip();
    
    // Add all generated sections as markdown files
    state.sections.forEach((section, idx) => {
      if (section.content) {
        // Create an index prefix for sorting (e.g. 01-overview.md)
        const prefix = String(idx + 1).padStart(2, '0');
        zip.file(`${prefix}-${section.id}.md`, section.content);
      }
    });

    try {
      const blob = await zip.generateAsync({ type: 'blob' });
      saveAs(blob, 'gitauto-docs.zip');
    } catch (err) {
      console.error('Failed to create ZIP', err);
      // Fallback
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">GitAuto Workspace</h1>
          <p className="text-xs text-[var(--text-secondary)] uppercase tracking-widest mt-1">Review & Edit Hub • Project: {state.identity.name || 'Untitled'}</p>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="hidden lg:flex items-center gap-2">
            <button 
              onClick={() => navigate('/projects')}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 uppercase font-bold tracking-wider mr-2"
            >
              <Folder size={14} /> Projects
            </button>
            <button 
              onClick={handleSave}
              className="text-xs text-[var(--accent-primary)] hover:opacity-80 flex items-center gap-1 uppercase font-bold tracking-wider mr-2"
            >
              <Save size={14} /> Save
            </button>
            <button 
              onClick={handleRegenerateAll}
              className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 uppercase font-bold tracking-wider mr-2"
            >
              <RefreshCw size={14} /> Regenerate
            </button>
            <button 
               onClick={syncToGithub}
               disabled={publishing}
               className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 uppercase font-bold tracking-wider mr-2"
            >
               <Github size={14} /> Sync Git
            </button>
            <button 
               onClick={exportToZip}
               className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 uppercase font-bold tracking-wider mr-4"
            >
               <Download size={14} /> ZIP
            </button>
          </div>
          {activeSection.status === 'generating' && (
            <div className="flex items-center opus-glass px-4 py-2 text-xs font-semibold mr-2 rounded-lg whitespace-nowrap">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)] mr-2 animate-pulse"></div> Generating...
            </div>
          )}
          <button 
            onClick={pushToGitbook}
            disabled={publishing}
            className="opus-button opus-button-primary px-4 py-2 text-sm flex items-center space-x-2 whitespace-nowrap"
          >
            <UploadCloud size={16} />
            <span>GitBook</span>
          </button>
        </div>
      </header>

      {publishStatus && (
        <div className={`p-3 rounded-lg mb-4 text-sm font-medium flex items-center space-x-2 
          ${publishStatus.type === 'error' ? 'bg-red-500/10 text-red-500' : 
            publishStatus.type === 'success' ? 'bg-green-500/10 text-green-500' : 
            'bg-blue-500/10 text-blue-500'}
        `}>
          {publishStatus.type === 'error' ? <AlertCircle size={16} /> : 
           publishStatus.type === 'success' ? <Check size={16} /> : 
           <RefreshCw size={16} className="animate-spin" />}
          <span>{publishStatus.message}</span>
          {publishStatus.url && (
            <a href={publishStatus.url} target="_blank" rel="noreferrer" className="underline ml-2">View</a>
          )}
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Sections Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto pb-2 lg:pb-0 scrollbar-hide">
          {state.sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSectionId(section.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all flex-shrink-0 lg:flex-shrink
                ${activeSectionId === section.id 
                  ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] font-bold' 
                  : 'opus-glass hover:bg-black/5 dark:hover:bg-white/5'
                }
              `}
            >
              <span className="truncate mr-3">{section.title}</span>
              {section.status === 'generating' && <RefreshCw size={14} className="animate-spin text-[var(--accent-primary)]" />}
              {section.status === 'done' && <Check size={14} className="text-green-500" />}
              {section.status === 'idle' && <div className="w-2 h-2 rounded-full bg-gray-400 opacity-50" />}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          
          {/* Markdown Editor */}
          <div className="opus-glass p-0 flex flex-col relative overflow-hidden rounded-2xl">
            <div className="p-4 border-b border-[#ffffff0a] flex justify-between items-center bg-transparent">
              <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">EDITOR • Markdown</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => generateSection(activeSection)}
                  className="text-xs font-bold text-[var(--accent-primary)] hover:underline flex items-center space-x-1"
                  disabled={activeSection.status === 'generating'}
                >
                  <RefreshCw size={12} className={activeSection.status === 'generating' ? 'animate-spin' : ''} />
                  <span>{activeSection.status === 'idle' ? 'Generate' : 'Regenerate'}</span>
                </button>
                <div className="flex gap-1.5 opacity-60 mr-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
              </div>
            </div>
            {activeSection.status === 'generating' ? (
              <div className="flex-1 p-6 shimmer relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                     <div className="w-16 h-16 mx-auto relative">
                       <div className="absolute inset-0 border-4 border-t-[var(--accent-primary)] border-r-[var(--accent-secondary)] border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                     </div>
                     <p className="font-bold text-[var(--accent-primary)] animate-pulse">Writing content...</p>
                  </div>
                </div>
              </div>
            ) : (
               <textarea 
                className="flex-1 p-6 bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed text-[var(--text-primary)] opacity-90"
                value={activeSection.content}
                onChange={e => updateSection(activeSection.id, { content: e.target.value })}
                placeholder="Content goes here. Click Generate to let AI write it..."
              />
            )}
          </div>

          {/* GitBook Rendered Preview */}
          <div className="opus-glass p-6 overflow-y-auto rounded-2xl flex flex-col bg-[var(--bg-surface)] dark:bg-[#0e0e12] transition-colors duration-400 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
             <div className="mb-6 flex justify-between items-start flex-shrink-0">
               <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">LIVE PREVIEW • GitBook Style</span>
               <span className="text-[10px] uppercase font-bold bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] px-2 py-1 rounded">Sync Active</span>
             </div>
            <div className="gitbook-preview flex-1">
               {activeSection.content ? (
                 <ReactMarkdown>{activeSection.content}</ReactMarkdown>
               ) : (
                 <div className="h-full flex items-center justify-center text-[var(--text-secondary)] italic pt-10">
                   Preview will appear here
                 </div>
               )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
