import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveProjects, softDeleteProject, ProjectData } from '../lib/db';
import { auth } from '../lib/firebase';
import { useAppContext } from '../contexts/AppContext';
import { FileText, Plus, Trash2, Edit2, Share2, Clock, Check } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setAllState, getStats } = useAppContext();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getActiveProjects();
    setProjects(data || []);
    setLoading(false);
  };

  const handleEdit = (project: ProjectData) => {
    setAllState({
      projectId: project.id,
      identity: project.identity,
      technical: project.technical,
      brand: project.brand,
      sections: project.sections,
      // For real app we might fetch or use gitbook
    });
    navigate('/workspace');
  };

  const handleDelete = async (id: string) => {
    await softDeleteProject(id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleShare = (id: string) => {
    // In a real app, this would share a unique public link
    const url = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!auth.currentUser) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <div className="opus-glass p-12 text-center flex flex-col items-center">
          <h3 className="text-xl font-bold mb-2">Please sign in</h3>
          <p className="text-[var(--text-secondary)] mb-6">You need to be signed in to view your projects.</p>
          <button onClick={() => navigate('/settings')} className="opus-button opus-button-primary px-6 py-2">Go to Settings</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 rounded-full border-t-2 border-[var(--accent-primary)]"></div></div>;

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-[var(--text-secondary)] mt-2">Manage and view your generated documentation</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/trash')}
            className="opus-button opus-button-secondary text-[var(--text-secondary)] px-4 py-2 flex items-center space-x-2"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Trash</span>
          </button>
          <button 
            onClick={() => navigate('/generator')}
            className="opus-button opus-button-primary px-4 py-2 flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <div className="col-span-full opus-glass p-12 text-center flex flex-col items-center">
            <FileText size={48} className="text-[var(--text-secondary)] opacity-50 mb-4" />
            <h3 className="text-xl font-bold mb-2">No projects yet</h3>
            <p className="text-[var(--text-secondary)] mb-6">Create your first documentation project to see it here.</p>
            <button 
              onClick={() => navigate('/generator')}
              className="opus-button opus-button-primary px-6 py-2"
            >
              Start Generating
            </button>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="opus-glass p-0 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="p-6 border-b border-[#ffffff10] flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-lg">
                    {project.name ? project.name[0].toUpperCase() : 'U'}
                  </div>
                </div>
                <h3 className="text-xl font-bold truncate mb-1 text-[var(--text-primary)]">{project.name || 'Untitled Project'}</h3>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 min-h-[40px]">{project.identity.description || 'No description provided.'}</p>
                
                <div className="flex items-center text-xs text-[var(--text-secondary)] mt-4 space-x-1">
                  <Clock size={12} />
                  <span>Updated: {project.updatedAt.toDate().toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-black/5 dark:bg-white/5">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit/View Workspace"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleShare(project.id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-green-500 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                    title="Share Link"
                  >
                    {copiedId === project.id ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                  </button>
                </div>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
                  title="Move to Trash"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
