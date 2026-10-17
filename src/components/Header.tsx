import React from 'react';
import { 
  PhoneCall, 
  Cpu, 
  Sparkles, 
  RotateCcw, 
  GraduationCap, 
  Radio, 
  Languages,
  ShieldCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mockMode: boolean;
  geminiConnected: boolean;
  onResetSeed: () => void;
  inCallCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  mockMode,
  geminiConnected,
  onResetSeed,
  inCallCount,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
      {/* College & Department Top Ribbon */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border-b border-indigo-900/50 px-4 py-1.5 text-xs text-slate-300 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white tracking-wide">
            Vishwakarma Institute of Technology, Pune
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-indigo-300">
            Dept. of Artificial Intelligence & Data Science (AY 2025-26)
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="bg-indigo-900/60 text-indigo-200 border border-indigo-700/50 px-2 py-0.5 rounded text-[11px] font-mono">
            Group TY_E_13
          </span>
          <span className="hidden md:inline text-slate-400">
            Guide: <strong className="text-slate-200">Dr. Viomesh Kumar Singh</strong>
          </span>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <PhoneCall className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                AI Voice Calling Agent
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded">
                Autonomous
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Customer Interaction • English • Hindi • Marathi • Hinglish
            </p>
          </div>
        </div>

        {/* Live Engine Badges */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Languages className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300">Indic Code-Switch</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-200 font-medium">Gemini 3.8 Flash</span>
            <span className={`w-2 h-2 rounded-full ${geminiConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300">{mockMode ? 'Mock Telephony' : 'Twilio Live'}</span>
          </div>

          {inCallCount > 0 && (
            <div className="flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg px-2.5 py-1 text-xs animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{inCallCount} Active Call</span>
            </div>
          )}

          <button
            onClick={onResetSeed}
            title="Reset database to sample demo data"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-1 border-t border-slate-800/80 scrollbar-none py-1">
        {[
          { id: 'dashboard', label: 'Dashboard & Metrics' },
          { id: 'simulator', label: '🎙️ Live Voice Simulator', highlight: true },
          { id: 'customers', label: 'Customers & CSV' },
          { id: 'campaigns', label: 'Campaigns' },
          { id: 'calls', label: 'Calls & Transcripts' },
          { id: 'callbacks', label: 'Callbacks' },
          { id: 'knowledge', label: 'RAG Knowledge Base' },
          { id: 'project-info', label: 'Academic & Architecture' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? tab.highlight 
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                : tab.highlight
                ? 'text-indigo-400 hover:bg-indigo-950/40 border border-indigo-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
