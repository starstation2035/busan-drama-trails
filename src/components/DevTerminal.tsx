"use client";

import { useState, useEffect } from "react";
import { Terminal, ChevronDown, ChevronUp, GitBranch, TerminalSquare, AlertCircle } from "lucide-react";

export function DevTerminal() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [gitBranch, setGitBranch] = useState("unknown");
  const [gitStatus, setGitStatus] = useState("");
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check if we are running in local development mode
    setIsDev(process.env.NODE_ENV === "development");
    
    // Read Git variables exposed by next.config.mjs
    const branch = process.env.NEXT_PUBLIC_GIT_BRANCH;
    const status = process.env.NEXT_PUBLIC_GIT_STATUS;

    if (branch) setGitBranch(branch);
    if (status) setGitStatus(status);
  }, []);

  // Return nothing if not in development mode
  if (!isDev) return null;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed top-3 right-3 z-[9999] flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/95 px-3 py-1.5 text-[11px] font-bold text-emerald-400 font-mono shadow-lg backdrop-blur-md hover:bg-zinc-900 hover:border-emerald-500/30 transition-all cursor-pointer animate-in fade-in duration-300"
        title="Expand Developer Terminal"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <GitBranch className="size-3" />
        <span>{gitBranch}</span>
      </button>
    );
  }

  return (
    <div className="relative z-[9999] w-full bg-zinc-950 border-b border-zinc-800 text-zinc-300 font-mono text-[12px] shadow-md animate-in slide-in-from-top duration-300">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2 border-b border-zinc-950">
        <div className="flex items-center gap-2">
          {/* macOS Style Window Dots */}
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500 opacity-80" />
            <span className="size-2.5 rounded-full bg-amber-500 opacity-80" />
            <span className="size-2.5 rounded-full bg-emerald-500 opacity-80" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-zinc-400 font-semibold text-[11px]">
            <Terminal className="size-3 text-emerald-400" />
            <span>Developer Status Panel</span>
          </div>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded hover:bg-zinc-800"
          title="Minimize Panel"
        >
          <ChevronUp className="size-3.5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Hide</span>
        </button>
      </div>

      {/* Terminal Content Box */}
      <div className="p-4 space-y-2 max-h-[140px] overflow-y-auto leading-relaxed select-text">
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 font-bold">$</span>
          <div className="flex-1">
            <span className="text-zinc-400">git branch --show-current</span>
            <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <GitBranch className="size-3" />
              <span>{gitBranch}</span>
              <span className="text-zinc-500 text-[10px] font-medium ml-2">(Active Branch)</span>
            </div>
          </div>
        </div>

        {gitStatus ? (
          <div className="flex items-start gap-2 pt-1 border-t border-zinc-900/50">
            <span className="text-emerald-400 font-bold">$</span>
            <div className="flex-1">
              <span className="text-zinc-400">git status --short</span>
              <pre className="text-zinc-300 text-[11px] mt-1 whitespace-pre overflow-x-auto bg-zinc-900/40 p-2 rounded border border-zinc-900">
                {gitStatus}
              </pre>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2 pt-1 border-t border-zinc-900/50">
            <span className="text-emerald-400 font-bold">$</span>
            <div className="flex-1">
              <span className="text-zinc-400">git status</span>
              <div className="text-zinc-500 text-[11px] mt-0.5">Nothing to commit, working tree clean.</div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 pt-1 border-t border-zinc-900/50">
          <span className="text-emerald-400 font-bold">$</span>
          <div className="flex-1">
            <span className="text-zinc-400">npm run dev</span>
            <div className="text-zinc-400 mt-0.5">
              Next.js Dev Server running. Page refreshed at{" "}
              <span className="text-amber-400 font-bold">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
