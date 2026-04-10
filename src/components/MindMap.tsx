import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MindMapNode, PositionedNode } from '../types';
import data from '../data.json';

const NODE_RADIUS = 60;
const LEVEL_DISTANCE = 250;

interface MindMapProps {
  focusNodeId?: string;
  onNavigate: (view: 'home' | 'mindmap' | 'wiki' | 'component', nodeId?: string, path?: string) => void;
}

export default function MindMap({ focusNodeId, onNavigate }: MindMapProps) {
  const [nodes, setNodes] = useState<PositionedNode[]>([]);
  const [viewState, setViewState] = useState(() => {
    const saved = sessionStorage.getItem('mindmap_view_state');
    return saved ? JSON.parse(saved) : { x: 0, y: 0, scale: 1 };
  });
  const [isNavigating, setIsNavigating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isNavigating) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - viewState.x, y: e.clientY - viewState.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setViewState(prev => ({
      ...prev,
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle Zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (isNavigating) return;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      scale: Math.min(Math.max(prev.scale * delta, 0.2), 5),
    }));
  };

  // Handle focus from sidebar
  useEffect(() => {
    if (focusNodeId && nodes.length > 0) {
      const target = nodes.find(n => n.id === focusNodeId);
      if (target) {
        setViewState({
          x: -target.x,
          y: -target.y,
          scale: 1.5,
        });
      }
    }
  }, [focusNodeId, nodes]);

  // Save view state when it changes
  useEffect(() => {
    sessionStorage.setItem('mindmap_view_state', JSON.stringify(viewState));
  }, [viewState]);

  // Calculate positions for nodes
  useEffect(() => {
    const positioned: PositionedNode[] = [];
    
    const calculatePositions = (
      node: MindMapNode,
      x: number,
      y: number,
      depth: number,
      angleStart: number,
      angleEnd: number,
      parentId?: string
    ) => {
      const newNode: PositionedNode = { ...node, x, y, depth, parentId };
      positioned.push(newNode);

      if (node.children && node.children.length > 0) {
        const count = node.children.length;
        const angleStep = (angleEnd - angleStart) / count;
        
        node.children.forEach((child, i) => {
          const angle = angleStart + angleStep * (i + 0.5);
          const nextX = x + Math.cos(angle) * LEVEL_DISTANCE;
          const nextY = y + Math.sin(angle) * LEVEL_DISTANCE;
          
          // Narrow the angle range for children to keep it organic
          const childAngleRange = angleStep * 0.8;
          calculatePositions(
            child,
            nextX,
            nextY,
            depth + 1,
            angle - childAngleRange / 2,
            angle + childAngleRange / 2,
            node.id
          );
        });
      }
    };

    calculatePositions(data as MindMapNode, 0, 0, 0, 0, Math.PI * 2);
    setNodes(positioned);
  }, []);

  const handleNodeClick = (node: PositionedNode) => {
    if (isNavigating) return;

    if (node.link) {
      setIsNavigating(true);
      // Zoom into the node
      setViewState({
        x: -node.x * 3, // Multiplied by scale
        y: -node.y * 3,
        scale: 3,
      });

      // Redirect after animation
      setTimeout(() => {
        if (node.link?.endsWith('.md')) {
          onNavigate('wiki', node.id, node.link);
        } else if (node.link?.startsWith('component:')) {
          const compName = node.link.replace('component:', '');
          onNavigate('component', node.id, compName);
        } else {
          window.location.href = node.link!;
        }
        setIsNavigating(false);
      }, 500);
    } else {
      // Just center on the node if it's not a leaf
      setViewState({
        x: -node.x,
        y: -node.y,
        scale: 1.2,
      });
    }
  };

  const connections = useMemo(() => {
    return nodes
      .filter((n) => n.parentId)
      .map((node) => {
        const parent = nodes.find((p) => p.id === node.parentId);
        if (!parent) return null;
        return {
          id: `${parent.id}-${node.id}`,
          x1: parent.x,
          y1: parent.y,
          x2: node.x,
          y2: node.y,
          color: node.color || '#ffffff',
        };
      })
      .filter(Boolean);
  }, [nodes]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-screen overflow-hidden bg-[#121212] transition-colors ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative pointer-events-auto"
          animate={{
            x: viewState.x,
            y: viewState.y,
            scale: viewState.scale,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 overflow-visible pointer-events-none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {connections.map((conn) => (
              <motion.path
                key={conn!.id}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={`M ${conn!.x1} ${conn!.y1} C ${(conn!.x1 + conn!.x2) / 2} ${conn!.y1}, ${(conn!.x1 + conn!.x2) / 2} ${conn!.y2}, ${conn!.x2} ${conn!.y2}`}
                stroke={conn!.color}
                strokeWidth="2"
                fill="none"
                filter="url(#glow)"
              />
            ))}
          </svg>

          {/* Nodes */}
          <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0, x: '-50%', y: '-32px' }}
                animate={{ scale: 1, opacity: 1, x: '-50%', y: '-32px' }}
                transition={{ 
                  delay: node.depth * 0.1,
                  type: 'spring',
                  damping: 12,
                  stiffness: 100 
                }}
                style={{
                  position: 'absolute',
                  left: node.x,
                  top: node.y,
                }}
                className="group"
              >
                <button
                  onClick={() => handleNodeClick(node)}
                  className="relative flex flex-col items-center justify-center cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: node.color }}
                  />
                  
                  {/* Node Circle */}
                  <div 
                    className="w-16 h-16 rounded-full border-2 flex items-center justify-center bg-[#1a1a1a] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    style={{ borderColor: node.color }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>

                  {/* Label */}
                  <span className="mt-4 text-sm font-medium tracking-wide text-white/80 group-hover:text-white transition-colors whitespace-nowrap">
                    {node.label}
                  </span>

                  {/* Link Indicator */}
                  {node.link && (
                    <div className="mt-1 w-1 h-1 rounded-full bg-white/20 group-hover:bg-white/60 transition-colors" />
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Instructions Overlay */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none">
        <button 
          onClick={() => setViewState({ x: 0, y: 0, scale: 1 })}
          className="pointer-events-auto px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-[10px] text-white/40 hover:text-white hover:bg-white/10 transition-all tracking-[0.2em] uppercase"
        >
          Reset View
        </button>
        <div className="text-white/20 text-[10px] font-medium tracking-[0.3em] uppercase">
          Click nodes to explore
        </div>
      </div>
    </div>
  );
}
