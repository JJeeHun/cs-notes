import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";
import "github-markdown-css/github-markdown-dark.css";
import { getNormalizedPath } from "../util/path.util";

interface WikiProps {
  filePath: string;
  onBack: () => void;
}

export default function Wiki({ filePath, onBack }: WikiProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkdown = async () => {
      try {
        setLoading(true);
        const normalizedPath = getNormalizedPath(filePath);
        const response = await fetch(normalizedPath);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to fetch markdown:", error);
        setContent("# Error\nFailed to load the document.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarkdown();
  }, [filePath]);

  return (
    <div className="h-full w-full bg-[#121212] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-purple-400 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Wiki</span>
          </button>
          <div className="flex items-center gap-4 text-white/20 text-xs font-mono uppercase tracking-widest">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Updated: 2026.04.10</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              <span>Tech Note</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1a1a1a] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-white/20 font-mono text-xs uppercase tracking-widest">
                Loading Document...
              </span>
            </div>
          ) : (
            <div className="markdown-body !bg-transparent !text-white/80">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
