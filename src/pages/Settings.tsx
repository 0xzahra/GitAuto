import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Github } from 'lucide-react';

export default function Settings() {
  const { state, updateGitbook } = useAppContext();
  const { user, signInWithGoogle, signInWithGithub, signOut } = useAuth();

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Settings</h2>
        <p className="text-[var(--text-secondary)]">Manage your connected accounts and preferences.</p>
      </div>

      <div className="space-y-8">
        <div className="opus-glass p-6 md:p-8">
          <div className="flex items-center space-x-3 mb-4">
            <User className="text-[var(--accent-primary)]" />
            <h3 className="text-xl font-bold tracking-tight">Profile & Accounts</h3>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-6">
            Sign in to sync your preferences and link external platforms like GitHub.
          </p>
          
          {user ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-black/10 dark:bg-white/5 border border-[#ffffff10]">
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-[var(--accent-primary)]" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center text-[var(--accent-primary)] font-bold text-xl">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{user.displayName || 'Connected User'}</div>
                  <div className="text-sm text-[var(--text-secondary)]">{user.email}</div>
                </div>
              </div>
              <button onClick={signOut} className="opus-button bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-2 flex items-center space-x-2 text-sm">
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={signInWithGoogle} className="opus-button bg-white text-black hover:bg-gray-100 flex-1 px-4 py-3 flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-bold">Continue with Google</span>
              </button>
              <button onClick={signInWithGithub} className="opus-button bg-[#24292e] text-white hover:bg-[#2c3137] flex-1 px-4 py-3 flex items-center justify-center space-x-2">
                <Github size={20} />
                <span className="font-bold">Continue with GitHub</span>
              </button>
            </div>
          )}
        </div>

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
