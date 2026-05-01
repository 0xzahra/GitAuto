import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, FileText, Settings, BarChart2, Sun, Moon, PlusCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import OnboardingTour from './OnboardingTour';

export default function Layout() {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'New Document', icon: PlusCircle, path: '/generator' },
    { name: 'Workspace', icon: FileText, path: '/workspace' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row transition-colors duration-400">
      <OnboardingTour />

      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col items-center w-16 py-8 opus-glass m-4 mr-0 z-50 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/20 mb-12 flex items-center justify-center flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center text-[var(--accent-primary)] font-bold text-lg">
            G
          </div>
        </div>
        
        <nav className="flex-1 flex flex-col space-y-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={item.name}
                className={() => `sidebar-icon relative flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all duration-300
                  ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-50 hover:bg-[var(--accent-primary)]/10 hover:opacity-100 hover:-translate-y-0.5'}
                `}
              >
                <Icon size={20} className={isActive ? "text-[var(--accent-primary)]" : ""} />
                <span className="sr-only">{item.name}</span>
                {isActive && (
                  <div className="nav-dot absolute -right-1 top-0 w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" />
                )}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-4">
          <button onClick={toggleTheme} className="sidebar-icon opacity-50 hover:bg-[var(--accent-primary)]/10 hover:opacity-100 hover:-translate-y-0.5 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden relative pb-24 md:pb-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-40 opus-glass border-b border-[#ffffff10] px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-white font-bold shadow-[0_0_15px_var(--accent-primary)]">
              G
            </div>
            <h1 className="text-lg font-bold">GitAuto</h1>
          </div>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 opus-glass border-t border-[#ffffff10] flex justify-around items-center p-2 pb-safe z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={() => `flex flex-col items-center p-2 rounded-lg 
                ${isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}
              `}
            >
              <div className="relative">
                <Icon size={22} className={isActive ? "text-[var(--accent-primary)]" : ""} />
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-primary)] shadow-[0_0_8px_var(--accent-primary)]" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
