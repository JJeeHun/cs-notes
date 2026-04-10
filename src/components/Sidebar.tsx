import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Github, Linkedin, Mail, ChevronRight, BookOpen, Home as HomeIcon } from 'lucide-react';
import data from '../data.json';

interface SidebarProps {
  onNavigate: (view: 'home' | 'mindmap' | 'wiki' | 'component', nodeId?: string, path?: string) => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<string[]>([]);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => 
      prev.includes(id) ? prev.filter(n => n !== id) : [...prev, id]
    );
  };

  const renderMenuItems = (items: any[], depth = 0) => {
    return items.map((item) => {
      const isExpanded = expandedNodes.includes(item.id);
      const hasChildren = item.children && item.children.length > 0;

      return (
        <div key={item.id} className="flex flex-col">
          <button
            onClick={() => {
              if (hasChildren) {
                toggleNode(item.id);
              }
              if (item.link) {
                if (item.link.endsWith('.md')) {
                  onNavigate('wiki', item.id, item.link);
                  setIsOpen(false);
                } else if (item.link.startsWith('component:')) {
                  const compName = item.link.replace('component:', '');
                  onNavigate('component', item.id, compName);
                  setIsOpen(false);
                } else {
                  window.location.href = item.link;
                }
              } else {
                onNavigate('mindmap', item.id);
              }
            }}
            className={`flex items-center py-3 px-4 rounded-xl transition-all group hover:bg-white/5 text-left ${
              depth === 0 ? 'text-lg font-bold' : 'text-base font-medium text-white/60'
            }`}
            style={{ paddingLeft: `${(depth + 1) * 1}rem` }}
          >
            {hasChildren && (
              <ChevronRight 
                className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''} text-white/20 group-hover:text-white/40`} 
              />
            )}
            <span className="group-hover:text-white transition-colors">{item.label}</span>
            {item.link && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500/40" />}
          </button>
          
          <AnimatePresence>
            {isExpanded && hasChildren && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {renderMenuItems(item.children, depth + 1)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-50 p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors cursor-pointer group"
        aria-label="Open Menu"
      >
        <Menu className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#1a1a1a] border-l border-white/5 z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <button
                  onClick={() => {
                    onNavigate('home');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
                >
                  <HomeIcon className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                  <h2 className="text-2xl font-bold tracking-tight text-white">Home</h2>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
                <div className="space-y-2">
                  {/* Blog Link (Placeholder) */}
                  <button
                    onClick={() => {
                      // Placeholder for blog navigation
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center py-4 px-4 rounded-xl transition-all hover:bg-white/5 text-lg font-bold text-left group"
                  >
                    <BookOpen className="w-5 h-5 mr-3 text-purple-400 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-white">Blog</span>
                  </button>

                  <div className="h-px bg-white/5 my-4 mx-4" />

                  {/* Tech Wiki Hierarchy */}
                  <div className="px-4 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-bold">Tech Wiki</span>
                  </div>
                  {renderMenuItems(data.children)}
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-[#1a1a1a]">
                <div className="flex space-x-4">
                  {[Github, Linkedin, Mail].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
                <p className="mt-6 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  Knowledge Graph Portfolio
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
