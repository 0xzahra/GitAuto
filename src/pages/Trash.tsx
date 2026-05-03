import React, { useEffect, useState } from 'react';
import { getTrashProjects, restoreProject, hardDeleteProject, ProjectData } from '../lib/db';
import { auth } from '../lib/firebase';
import { FileText, RefreshCcw, Trash2, Clock, AlertTriangle } from 'lucide-react';

export default function Trash() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getTrashProjects();
    setProjects(data || []);
    setLoading(false);
  };

  const handleRestore = async (id: string) => {
    await restoreProject(id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleHardDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to permanently delete this project? This cannot be undone.")) {
      await hardDeleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (!auth.currentUser) {
    return <div className="p-8 text-center text-[var(--text-secondary)]">Please sign in to view trash.</div>;
  }
  
  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 rounded-full border-t-2 border-[var(--accent-primary)]"></div></div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-500">Trash</h2>
          <p className="text-[var(--text-secondary)] mt-2">Projects in trash will be permanently deleted after 30 days.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full opus-glass p-12 text-center flex flex-col items-center">
            <Trash2 size={48} className="text-[var(--text-secondary)] opacity-30 mb-4" />
            <h3 className="text-xl font-bold mb-2 text-[var(--text-secondary)]">Trash is empty</h3>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="opus-glass p-0 overflow-hidden flex flex-col opacity-80 hover:opacity-100 transition-opacity duration-300 border-red-500/20">
              <div className="p-6 border-b border-[#ffffff10] flex-1">
                <h3 className="text-xl font-bold truncate mb-1 text-[var(--text-primary)]">{project.name || 'Untitled Project'}</h3>
                
                <div className="flex items-center text-xs text-red-400 mt-4 space-x-1 font-medium">
                  <AlertTriangle size={12} />
                  <span>Deleted</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5">
                <button 
                  onClick={() => handleRestore(project.id)}
                  className="opus-button bg-[var(--text-secondary)]/10 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/20 hover:text-[var(--text-primary)] px-3 py-1.5 flex items-center space-x-2 text-xs"
                >
                  <RefreshCcw size={14} />
                  <span>Restore</span>
                </button>
                <button 
                  onClick={() => handleHardDelete(project.id)}
                  className="opus-button bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-1.5 flex items-center space-x-2 text-xs"
                >
                  <Trash2 size={14} />
                  <span>Delete Forever</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
