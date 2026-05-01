import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export default function Settings() {
  const { state, updateGitbook } = useAppContext();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
        <p className="text-[var(--text-secondary)]">Manage your connected accounts and preferences.</p>
      </div>

      <div className="space-y-8">
        <div className="opus-card p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4">GitBook API Credentials</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            These credentials are required to publish generated documentation directly to a GitBook space.
            They are stored locally in your browser.
          </p>

          <div className="space-y-4">
             <div>
              <label className="block text-sm font-bold mb-2">Personal Access Token</label>
              <input 
                type="password" 
                className="opus-input" 
                value={state.gitbook.token}
                onChange={e => updateGitbook({ token: e.target.value })}
                placeholder="gb_pat_..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Default Organization ID</label>
              <input 
                type="text" 
                className="opus-input" 
                value={state.gitbook.orgId}
                onChange={e => updateGitbook({ orgId: e.target.value })}
                placeholder="org_..."
              />
            </div>
          </div>
        </div>

        <div className="opus-card p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4">GitHub Integration</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            For pushing to GitHub. GitBook spaces can be synced with these repositories.
          </p>

          <div className="space-y-4">
             <div>
              <label className="block text-sm font-bold mb-2">Default Base Code Storage</label>
              <input 
                type="url" 
                className="opus-input" 
                value={state.gitbook.githubRepo}
                onChange={e => updateGitbook({ githubRepo: e.target.value })}
                placeholder="https://github.com/org/repo"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
