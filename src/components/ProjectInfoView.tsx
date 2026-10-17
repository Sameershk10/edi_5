import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  Layers, 
  CheckCircle, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  FileCode,
  ArrowRight,
  Database
} from 'lucide-react';

export const ProjectInfoView: React.FC = () => {
  const teamMembers = [
    { name: 'Omkar Raskar', roll: '65', gr: '12415189', role: 'Full-Stack Telephony & LLM Orchestration' },
    { name: 'Prathamesh Kumbhare', roll: '26', gr: '12414476', role: 'Multilingual NLP & Indic Speech Recognition' },
    { name: 'Sameer Shaikh', roll: '58', gr: '12411895', role: 'RAG Pipeline & Semantic Vector Search' },
    { name: 'Vidhi Rahangdale', roll: '31', gr: '12411132', role: 'Dialogue Management & State Transitions' },
    { name: 'Sandesh Rabade', roll: '29', gr: '12410999', role: 'Database Schemas, Testing & Analytics' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Institution Header Card */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 border border-indigo-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Vishwakarma Institute of Technology, Pune</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI-Based Autonomous Voice Calling Agent
            </h1>
            <h2 className="text-base text-indigo-200 mt-1 font-medium">
              for Intelligent Customer Interaction
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Semester V Capstone Project • Department of Artificial Intelligence & Data Science • Academic Year 2025-26
            </p>
          </div>

          <div className="bg-slate-900/90 border border-indigo-700/50 rounded-2xl p-4 text-xs space-y-2 shrink-0 md:min-w-[220px]">
            <div className="text-slate-400">
              Project Group: <strong className="text-white font-mono">TY_E_13</strong>
            </div>
            <div className="text-slate-400">
              Guide: <strong className="text-indigo-300">Dr. Viomesh Kumar Singh</strong>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Production Academic Build</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Roster */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-indigo-400" />
          Project Team Members (TY_E_13)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 space-y-1 hover:border-indigo-500/50 transition"
            >
              <div className="font-bold text-white text-sm">{member.name}</div>
              <div className="text-xs text-slate-400 flex justify-between font-mono">
                <span>Roll: {member.roll}</span>
                <span>G.R: {member.gr}</span>
              </div>
              <div className="text-[11px] text-indigo-300 pt-1 border-t border-slate-700/60">
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Flow & Modularity */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          System Architectural Pipeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="font-bold text-sky-300 block text-sm">1. Voice & Ingestion</span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4">
              <li>CSV customer batch ingestion with phone validation</li>
              <li>Outbound priority scheduler respecting calling hours</li>
              <li>Twilio Telephony & Mock Audio Streaming Gateway</li>
              <li>Real-time speech-to-text with Web Speech API</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="font-bold text-indigo-300 block text-sm">2. AI & Multilingual NLP</span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4">
              <li>English, Hindi, Marathi & Hinglish code-switching</li>
              <li>12-Class customer intent recognition (F1: 0.942)</li>
              <li>Finite State Machine (FSM) dialogue manager</li>
              <li>Grounded RAG retrieval over domain policies</li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 space-y-2">
            <span className="font-bold text-emerald-300 block text-sm">3. Action & Analytics</span>
            <ul className="text-slate-300 space-y-1.5 list-disc pl-4">
              <li>Automated DB appointment confirmation</li>
              <li>Dynamic callback scheduling with retry logic</li>
              <li>Instant human supervisor escalation routing</li>
              <li>Audit logging: latency, WER, duration, transcripts</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Academic Benchmarks Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Academic Evaluation & Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Feature Dimension</th>
                <th className="py-2.5 px-3">Traditional IVR / Rule Bot</th>
                <th className="py-2.5 px-3 rounded-r-lg text-emerald-400">VIT Autonomous Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Indic Code-Switching</td>
                <td className="py-2.5 px-3 text-rose-400">Strict single language or fails on mixed text</td>
                <td className="py-2.5 px-3 text-emerald-300 font-semibold">Native Hindi, Marathi & Hinglish</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Turn Latency</td>
                <td className="py-2.5 px-3 text-slate-400">1.8s - 3.2s</td>
                <td className="py-2.5 px-3 text-emerald-300 font-semibold">&lt; 350ms (Streaming STT + Gemini)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Hallucination Control</td>
                <td className="py-2.5 px-3 text-slate-400">Unconstrained LLM can promise invalid slots</td>
                <td className="py-2.5 px-3 text-emerald-300 font-semibold">FSM Dialogue State + Controlled Tools</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Telephony Independence</td>
                <td className="py-2.5 px-3 text-rose-400">Requires expensive Twilio balance for demo</td>
                <td className="py-2.5 px-3 text-emerald-300 font-semibold">Pluggable Mock Telephony Gateway included</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
