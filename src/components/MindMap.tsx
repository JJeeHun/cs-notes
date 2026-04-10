import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { MindMapNode, PositionedNode } from "../types";
import data from "../data.json";

const NODE_RADIUS = 60;
const LEVEL_DISTANCE = 250;

interface MindMapProps {
  focusNodeId?: string;
  onNavigate: (
    view: "home" | "mindmap" | "wiki" | "component",
    nodeId?: string,
    path?: string
  ) => void;
}

export default function MindMap({ focusNodeId, onNavigate }: MindMapProps) {
  const [nodes, setNodes] = useState<PositionedNode[]>([]);

  // High performance motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  // Smooth springs for focus transitions
  const springConfig = { damping: 25, stiffness: 120 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);

  const [isNavigating, setIsNavigating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  // Initialize from session storage
  useEffect(() => {
    const saved = sessionStorage.getItem("mindmap_view_state");
    if (saved) {
      const { x: sx, y: sy, scale: ss } = JSON.parse(saved);
      x.set(sx);
      y.set(sy);
      scale.set(ss);
    }
  }, []);

  // Handle Dragging (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isNavigating) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - x.get(), y: e.clientY - y.get() };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    x.set(e.clientX - dragStart.current.x);
    y.set(e.clientY - dragStart.current.y);
  };

  // Handle Dragging (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isNavigating || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = {
      x: touch.clientX - x.get(),
      y: touch.clientY - y.get(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    x.set(touch.clientX - dragStart.current.x);
    y.set(touch.clientY - dragStart.current.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Save state periodically or on end
    sessionStorage.setItem(
      "mindmap_view_state",
      JSON.stringify({
        x: x.get(),
        y: y.get(),
        scale: scale.get(),
      })
    );
  };

  // Handle Zooming
  const handleWheel = (e: React.WheelEvent) => {
    if (isNavigating) return;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale.get() * delta, 0.2), 5);
    scale.set(newScale);
  };

  // Handle focus from sidebar
  useEffect(() => {
    if (focusNodeId && nodes.length > 0) {
      const target = nodes.find((n) => n.id === focusNodeId);
      if (target) {
        x.set(-target.x);
        y.set(-target.y);
        scale.set(1.5);
      }
    }
  }, [focusNodeId, nodes]);

  // Calculate positions for nodes
  useEffect(() => {
    const positioned: PositionedNode[] = [];

    const calculatePositions = (
      node: MindMapNode,
      nx: number,
      ny: number,
      depth: number,
      angleStart: number,
      angleEnd: number,
      parentId?: string
    ) => {
      const newNode: PositionedNode = {
        ...node,
        x: nx,
        y: ny,
        depth,
        parentId,
      };
      positioned.push(newNode);

      if (node.children && node.children.length > 0) {
        const count = node.children.length;
        const angleStep = (angleEnd - angleStart) / count;

        node.children.forEach((child, i) => {
          const angle = angleStart + angleStep * (i + 0.5);
          const nextX = nx + Math.cos(angle) * LEVEL_DISTANCE;
          const nextY = ny + Math.sin(angle) * LEVEL_DISTANCE;

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

      // Smoothly zoom in
      x.set(-node.x * 3);
      y.set(-node.y * 3);
      scale.set(3);

      setTimeout(() => {
        if (node.link?.endsWith(".md")) {
          onNavigate("wiki", node.id, node.link);
        } else if (node.link?.startsWith("component:")) {
          const compName = node.link.replace("component:", "");
          onNavigate("component", node.id, compName);
        } else {
          window.location.href = node.link!;
        }
        setIsNavigating(false);
      }, 500);
    } else {
      x.set(-node.x);
      y.set(-node.y);
      scale.set(1.2);
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
          color: node.color || "#ffffff",
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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-screen overflow-hidden bg-[#121212] transition-colors touch-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="relative pointer-events-auto will-change-transform"
          style={{
            x: springX,
            y: springY,
            scale: springScale,
          }}
        >
          {/* SVG Connections */}
          <svg className="absolute inset-0 overflow-visible pointer-events-none">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
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
                d={`M ${conn!.x1} ${conn!.y1} C ${(conn!.x1 + conn!.x2) / 2} ${
                  conn!.y1
                }, ${(conn!.x1 + conn!.x2) / 2} ${conn!.y2}, ${conn!.x2} ${
                  conn!.y2
                }`}
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
                initial={{ scale: 0, opacity: 0, x: "-50%", y: "-32px" }}
                animate={{ scale: 1, opacity: 1, x: "-50%", y: "-32px" }}
                transition={{
                  delay: node.depth * 0.1,
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                }}
                style={{
                  position: "absolute",
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
          onClick={() => {
            x.set(0);
            y.set(0);
            scale.set(1);
          }}
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
