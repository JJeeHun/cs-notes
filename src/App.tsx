/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Home from './components/Home';
import MindMap from './components/MindMap';
import Sidebar from './components/Sidebar';
import Wiki from './components/Wiki';
import SecurityWiki from './components/custom/SecurityWiki';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'mindmap' | 'wiki' | 'component'>('home');
  const [focusNodeId, setFocusNodeId] = useState<string | undefined>();
  const [wikiPath, setWikiPath] = useState<string | undefined>();
  const [componentName, setComponentName] = useState<string | undefined>();

  const handleNavigate = (view: 'home' | 'mindmap' | 'wiki' | 'component', nodeId?: string, path?: string) => {
    setCurrentView(view);
    setFocusNodeId(nodeId);
    if (view === 'wiki' && path) setWikiPath(path);
    if (view === 'component' && path) setComponentName(path);
  };

  return (
    <main className="relative w-full h-screen bg-[#121212] overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Home />
          </motion.div>
        )}
        {currentView === 'mindmap' && (
          <motion.div
            key="mindmap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <MindMap focusNodeId={focusNodeId} onNavigate={handleNavigate} />
          </motion.div>
        )}
        {currentView === 'wiki' && wikiPath && (
          <motion.div
            key="wiki"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <Wiki filePath={wikiPath} onBack={() => setCurrentView('mindmap')} />
          </motion.div>
        )}
        {currentView === 'component' && (
          <motion.div
            key="component"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            {componentName === 'SecurityWiki' && (
              <SecurityWiki onBack={() => setCurrentView('mindmap')} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar onNavigate={handleNavigate} />
      
      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-40" />
    </main>
  );
}
