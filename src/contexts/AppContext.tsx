import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, DocumentSection } from '../types';

interface AppContextType {
  state: AppState;
  updateIdentity: (data: Partial<AppState['identity']>) => void;
  updateTechnical: (data: Partial<AppState['technical']>) => void;
  updateBrand: (data: Partial<AppState['brand']>) => void;
  updateGitbook: (data: Partial<AppState['gitbook']>) => void;
  updateSection: (id: string, data: Partial<DocumentSection>) => void;
  eraseIdentity: () => void;
  eraseTechnical: () => void;
  eraseBrand: () => void;
  eraseSections: () => void;
  eraseAll: () => void;
  setAllState: (state: Partial<AppState>) => void;
  updateProjectId: (projectId: string) => void;
  addGeneratedDocToStats: () => void;
  getStats: () => any;
}

const defaultState: AppState = {
  identity: { name: '', tagline: '', website: '', description: '' },
  technical: { repos: '', openapi: '', stack: '', dependencies: '' },
  brand: { mediaKit: '', colorHex: '', logoUrl: '', tone: 'developer-focused' },
  gitbook: { token: '', orgId: '', githubRepo: '' },
  sections: [
    { id: 'overview', title: 'Project Overview', content: '', status: 'idle' },
    { id: 'getting-started', title: 'Getting Started', content: '', status: 'idle' },
    { id: 'api-reference', title: 'API Reference', content: '', status: 'idle' },
    { id: 'settings', title: 'Settings Guide', content: '', status: 'idle' },
    { id: 'troubleshooting', title: 'Troubleshooting', content: '', status: 'idle' },
    { id: 'changelog', title: 'Changelog & Contributing', content: '', status: 'idle' },
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gitauto_state');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('gitauto_state', JSON.stringify(state));
  }, [state]);

  const updateIdentity = (data: Partial<AppState['identity']>) => 
    setState(s => ({ ...s, identity: { ...s.identity, ...data } }));
  
  const updateTechnical = (data: Partial<AppState['technical']>) => 
    setState(s => ({ ...s, technical: { ...s.technical, ...data } }));
    
  const updateBrand = (data: Partial<AppState['brand']>) => 
    setState(s => ({ ...s, brand: { ...s.brand, ...data } }));
    
  const updateGitbook = (data: Partial<AppState['gitbook']>) => 
    setState(s => ({ ...s, gitbook: { ...s.gitbook, ...data } }));
    
  const updateSection = (id: string, data: Partial<DocumentSection>) => {
    setState(s => ({
      ...s,
      sections: s.sections.map(section => 
        section.id === id ? { ...section, ...data } : section
      )
    }));
  };

  const eraseIdentity = () => setState(s => ({ ...s, identity: defaultState.identity }));
  const eraseTechnical = () => setState(s => ({ ...s, technical: defaultState.technical }));
  const eraseBrand = () => setState(s => ({ ...s, brand: defaultState.brand }));
  const eraseSections = () => setState(s => ({ ...s, sections: defaultState.sections }));
  const eraseAll = () => setState(s => ({ ...s, projectId: undefined, identity: defaultState.identity, technical: defaultState.technical, brand: defaultState.brand, sections: defaultState.sections }));
  const setAllState = (newState: Partial<AppState>) => setState(s => ({ ...s, ...newState }));
  const updateProjectId = (projectId: string) => setState(s => ({ ...s, projectId }));

  const addGeneratedDocToStats = () => {
    const statsStr = localStorage.getItem('gitauto_stats') || '{"history":[]}';
    const stats = JSON.parse(statsStr);
    stats.history.push({ date: new Date().toISOString() });
    localStorage.setItem('gitauto_stats', JSON.stringify(stats));
  };

  const getStats = () => {
    const statsStr = localStorage.getItem('gitauto_stats') || '{"history":[]}';
    return JSON.parse(statsStr).history;
  };

  return (
    <AppContext.Provider value={{
      state, updateIdentity, updateTechnical, updateBrand, updateGitbook, updateSection, 
      eraseIdentity, eraseTechnical, eraseBrand, eraseSections, eraseAll, setAllState,
      updateProjectId,
      addGeneratedDocToStats, getStats
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
