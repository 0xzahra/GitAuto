import React, { useEffect, useState } from 'react';
import { getActiveProjects, getActivityLogs, ActivityLog as ActivityLogType, ProjectData } from '../lib/db';
import { auth } from '../lib/firebase';
import { Activity, Clock, FileText, ChevronRight } from 'lucide-react';

export default function ActivityLog() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [logs, setLogs] = useState<ActivityLogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await getActiveProjects();
    setProjects(data || []);
    if (data && data.length > 0) {
      handleSelectProject(data[0].id);
    }
    setLoading(false);
  };

  const handleSelectProject = async (id: string) => {
    setSelectedProjectId(id);
    setLogsLoading(true);
    const data = await getActivityLogs(id);
    setLogs(data || []);
    setLogsLoading(false);
  };

  if (!auth.currentUser) {
    return <div className="p-8 text-center text-[var(--text-secondary)]">Please sign in to view activity logs.</div>;
  }

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 rounded-full border-t-2 border-[var(--accent-primary)]"></div></div>;

  return (
    <div className="w-full">
      <div className="flex items-center space-x-3 mb-8">
        <Activity className="text-[var(--accent-primary)]" size={32} />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity & Version History</h2>
          <p className="text-[var(--text-secondary)] mt-1">Track changes and document generation updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Selector Sidebar */}
        <div className="col-span-1 border-r border-[#ffffff10] pr-4 space-y-2 max-h-[70vh] overflow-y-auto">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4 ml-2">Your Projects</h3>
          {projects.length === 0 ? (
             <div className="text-sm text-[var(--text-secondary)] p-4 italic">No projects found.</div>
          ) : (
            projects.map(project => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                  selectedProjectId === project.id 
                    ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20' 
                    : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <FileText size={16} className={`flex-shrink-0 ${selectedProjectId === project.id ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} />
                  <span className="truncate text-sm font-medium">{project.name || 'Untitled Project'}</span>
                </div>
                <ChevronRight size={14} className={`flex-shrink-0 opacity-0 group-hover:opacity-50 transition-opacity ${selectedProjectId === project.id ? 'opacity-100' : ''}`} />
              </button>
            ))
          )}
        </div>

        {/* Timeline View */}
        <div className="col-span-1 md:col-span-2 pl-2 md:pl-4">
          <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-6">Timeline</h3>
          
          {logsLoading ? (
            <div className="flex justify-center p-8"><div className="animate-spin w-6 h-6 rounded-full border-t-2 border-[var(--accent-primary)]"></div></div>
          ) : (
            <div className="relative border-l-2 border-[#ffffff10] ml-3 pb-8">
              {logs.length === 0 ? (
                <div className="pl-6 text-sm text-[var(--text-secondary)] italic">No activity recorded for this project yet.</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={log.id} className="relative pl-8 pb-8 transform transition-all duration-300 hover:translate-x-1 hover:-translate-y-1">
                    {/* Timeline Dot */}
                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--bg-base)] border-2 border-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
                    
                    <div className="opus-glass p-5 flex flex-col rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[var(--text-primary)] text-sm">{log.action}</span>
                        <div className="flex items-center text-xs text-[var(--text-secondary)] bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
                          <Clock size={12} className="mr-1" />
                          {log.timestamp.toDate().toLocaleString()}
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{log.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
