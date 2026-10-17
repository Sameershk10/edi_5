import React, { useState } from 'react';
import { 
  PhoneOutgoing, 
  Search, 
  Filter, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Zap, 
  ShieldAlert, 
  Languages, 
  Volume2,
  FileText
} from 'lucide-react';
import { CallRecord } from '../types';

interface CallsViewProps {
  calls: CallRecord[];
  onRefresh: () => void;
  onOpenSimulator: (callId: string) => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  calls,
  onRefresh,
  onOpenSimulator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedOutcome, setSelectedOutcome] = useState('all');
  const [selectedCallForModal, setSelectedCallForModal] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.customer_phone.includes(searchTerm) ||
      call.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = selectedLanguage === 'all' || call.detected_language === selectedLanguage;
    const matchesOutcome = selectedOutcome === 'all' || call.outcome === selectedOutcome;
    return matchesSearch && matchesLang && matchesOutcome;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <PhoneOutgoing className="w-5 h-5 text-indigo-400" />
            Outbound Call History & Transcripts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full audit log of customer voice calls, conversational turns, intent classifications, and action outcomes.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold self-start sm:self-auto"
        >
          Refresh Log
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer, phone, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Languages className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Languages</option>
            <option value="Hindi">Hindi</option>
            <option value="Marathi">Marathi</option>
            <option value="Hinglish">Hinglish</option>
            <option value="English">English</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Outcomes</option>
            <option value="completed">Completed</option>
            <option value="callback_requested">Callback Requested</option>
            <option value="human_escalation">Human Escalation</option>
            <option value="not_interested">Not Interested</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Final Intent</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Started At</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No calls recorded yet. Try starting a call in the Live Voice Simulator!
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr key={call.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{call.customer_name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{call.customer_phone}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-medium">
                      {call.campaign_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700 text-sky-300">
                        {call.detected_language}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        call.outcome === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        call.outcome === 'callback_requested' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        call.outcome === 'human_escalation' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {call.outcome}
                      </span>
                      {call.escalated && (
                        <span className="ml-1 text-[9px] bg-rose-950 text-rose-300 border border-rose-800 px-1 py-0.2 rounded font-bold">
                          ESCALATED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-indigo-300">
                      {call.final_intent || 'IN_PROGRESS'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {call.duration}s
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {call.latency_ms}ms
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {new Date(call.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCallForModal(call)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 text-xs font-medium flex items-center gap-1 ml-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Transcript ({call.transcript.length})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Inspection Modal */}
      {selectedCallForModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Call Transcript: {selectedCallForModal.customer_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedCallForModal.customer_phone} • {selectedCallForModal.detected_language} • Outcome: {selectedCallForModal.outcome}
                </p>
              </div>
              <button
                onClick={() => setSelectedCallForModal(null)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            {/* Transcript scrollable content */}
            <div className="overflow-y-auto space-y-3 pr-2 flex-1">
              {selectedCallForModal.transcript.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No turns recorded for this call.
                </div>
              ) : (
                selectedCallForModal.transcript.map((turn, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${turn.speaker === 'customer' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                      <span className="font-semibold uppercase tracking-wider text-slate-400">
                        {turn.speaker === 'customer' ? 'Customer' : 'AI Autonomous Agent'}
                      </span>
                      <span>•</span>
                      <span>{turn.timestamp}</span>
                      {turn.intent && (
                        <span className="ml-1 bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-1.5 py-0.2 rounded font-mono">
                          {turn.intent}
                        </span>
                      )}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        turn.speaker === 'customer'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      {turn.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Avg Latency: <strong className="text-emerald-400 font-mono">{selectedCallForModal.latency_ms}ms</strong>
              </span>
              <button
                onClick={() => setSelectedCallForModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
