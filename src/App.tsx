/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Workspace from './pages/Workspace';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Projects from './pages/Projects';
import Trash from './pages/Trash';
import ActivityLog from './pages/ActivityLog';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="generator" element={<Generator />} />
                <Route path="workspace" element={<Workspace />} />
                <Route path="activity" element={<ActivityLog />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="trash" element={<Trash />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

