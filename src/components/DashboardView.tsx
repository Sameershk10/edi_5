import React from 'react';
import { 
  Users, 
  Megaphone, 
  PhoneOutgoing, 
  CheckCircle2, 
  CalendarClock, 
  AlertTriangle, 
  Clock, 
  Zap, 
  Percent, 
  Activity,
  Award,
  Sparkles,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { AnalyticsData, CallRecord } from '../types';

interface DashboardViewProps {
  analytics: AnalyticsData | null;
  calls: CallRecord[];
  onStartSimulate: (callId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  analytics,
  calls,
  onStartSimulate,
}) => {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mr-3" />
        Loading analytics engine...
      </div>
    );
  }

  const { kpis, distributions, academic_evaluation_metrics } = analytics;

  const totalCalls = kpis.calls_today || 1;
  const langEntries = Object.entries(distributions.languages || {});
  const totalLang = langEntries.reduce((acc, [, val]) => acc + val, 0) || 1;

  const intentEntries = Object.entries(distributions.intents || {});
  const outcomeEntries = Object.entries(distributions.outcomes || {});

  return (
    <div className="space-y-6">
      {/* Academic Highlights Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950/60 border border-indigo-800/50 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Semester V AI & Data Science Capstone Project
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              AI-Based Autonomous Voice Calling Agent
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mt-1">
              Outbound telephony platform with multilingual dialogue management, Google Gemini 3.8 Flash reasoning, Indic code-switching (English, Hindi, Marathi, Hinglish), and grounded RAG action workflows.
            </p>
          </div>
          <button
            onClick={() => onStartSimulate()}
            className="self-start md:self-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95"
          >
            <PhoneOutgoing className="w-4 h-4" />
            Launch Voice Call Simulator
          </button>
        </div>

        {/* Academic Benchmark Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-900/60 text-xs">
          <div className="bg-slate-900/80 border border-indigo-800/40 rounded-xl p-3">
            <span className="text-slate-400 block mb-0.5">Intent F1 Score</span>
            <span className="text-lg font-bold text-emerald-400">{academic_evaluation_metrics.intent_f1_score}</span>
            <span className="text-[10px] text-slate-500 block">Evaluated across 12 intent classes</span>
          </div>
          <div className="bg-slate-900/80 border border-indigo-800/40 rounded-xl p-3">
            <span className="text-slate-400 block mb-0.5">Word Error Rate (WER)</span>
            <span className="text-lg font-bold text-sky-400">{academic_evaluation_metrics.word_error_rate_wer}</span>
            <span className="text-[10px] text-slate-500 block">Acoustic & Devanagari test sets</span>
          </div>
          <div className="bg-slate-900/80 border border-indigo-800/40 rounded-xl p-3">
            <span className="text-slate-400 block mb-0.5">Multilingual Accuracy</span>
            <span className="text-lg font-bold text-purple-400">{academic_evaluation_metrics.multilingual_accuracy}</span>
            <span className="text-[10px] text-slate-500 block">Hinglish / Marathi code-switch</span>
          </div>
          <div className="bg-slate-900/80 border border-indigo-800/40 rounded-xl p-3">
            <span className="text-slate-400 block mb-0.5">Sub-Second Latency</span>
            <span className="text-lg font-bold text-amber-400">{academic_evaluation_metrics.sub_second_latency_compliance}</span>
            <span className="text-[10px] text-slate-500 block">Streaming STT + Gemini turn</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Customers</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.total_customers}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>PostgreSQL CRM active</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Campaigns</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.active_campaigns}</div>
          <div className="text-xs text-slate-500 mt-1">Calling hours monitored</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Calls Today</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PhoneOutgoing className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.calls_today}</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{kpis.completed_calls} completed ({kpis.completion_rate_percentage}%)</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Scheduled Callbacks</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.callbacks_scheduled}</div>
          <div className="text-xs text-slate-500 mt-1">Automatic retry scheduled</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Human Escalations</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.human_escalations}</div>
          <div className="text-xs text-rose-400/80 mt-1">Supervisor transfer safety</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Call Duration</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.avg_call_duration_seconds}s</div>
          <div className="text-xs text-slate-500 mt-1">Natural conversational pace</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Response Latency</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{kpis.avg_response_latency_ms}ms</div>
          <div className="text-xs text-slate-500 mt-1">Streaming turn turnaround</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Success Rate</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{kpis.completion_rate_percentage}%</div>
          <div className="text-xs text-emerald-400 mt-1">High goal conversion</div>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              Language & Code-Switching Breakdown
            </h3>
            <span className="text-xs text-slate-500">Indic Speech Engine</span>
          </div>

          <div className="space-y-3">
            {langEntries.map(([lang, count]) => {
              const pct = Math.round((count / totalLang) * 100);
              const colorClass = 
                lang === 'Marathi' ? 'bg-amber-500' :
                lang === 'Hindi' ? 'bg-orange-500' :
                lang === 'Hinglish' ? 'bg-sky-500' : 'bg-indigo-500';

              return (
                <div key={lang}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">{lang}</span>
                    <span className="text-slate-400">{count} calls ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${Math.max(pct, 5)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-4">
            Adaptive model preserves Hindi, Marathi, and Hinglish transliteration dynamically without forced machine translation.
          </p>
        </div>

        {/* Intent Distribution */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Customer Intent Distribution
            </h3>
            <span className="text-xs text-slate-500">FSM State Machine</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {intentEntries.length === 0 ? (
              <div className="col-span-3 text-xs text-slate-500 py-6 text-center">No intent data yet. Run calls in simulator!</div>
            ) : (
              intentEntries.map(([intent, count]) => (
                <div key={intent} className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
                  <span className="text-[10px] text-slate-400 block truncate">{intent}</span>
                  <span className="text-base font-bold text-white">{count}</span>
                </div>
              ))
            )}
          </div>

          {/* Sentiment overview */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-300 block mb-2">Customer Sentiment Breakdown</span>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-800">
              <div 
                className="bg-emerald-500" 
                title={`Positive: ${distributions.sentiments.positive || 0}`}
                style={{ width: `${((distributions.sentiments.positive || 1) / (totalCalls || 1)) * 100}%` }}
              />
              <div 
                className="bg-slate-500" 
                title={`Neutral: ${distributions.sentiments.neutral || 0}`}
                style={{ width: `${((distributions.sentiments.neutral || 1) / (totalCalls || 1)) * 100}%` }}
              />
              <div 
                className="bg-rose-500" 
                title={`Negative: ${distributions.sentiments.negative || 0}`}
                style={{ width: `${((distributions.sentiments.negative || 0) / (totalCalls || 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500" /> Neutral</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" /> Negative (Auto-Escalate)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls Feed */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PhoneOutgoing className="w-4 h-4 text-indigo-400" />
            Recent Outbound Voice Calls
          </h3>
          <span className="text-xs text-slate-400">{calls.length} total recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Customer</th>
                <th className="py-2.5 px-3">Campaign</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3">Intent</th>
                <th className="py-2.5 px-3">Outcome</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3 rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {calls.slice(0, 5).map((call) => (
                <tr key={call.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-medium text-white">
                    {call.customer_name}
                    <span className="block text-[10px] text-slate-500">{call.customer_phone}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{call.campaign_name}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700 text-sky-300">
                      {call.detected_language}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-950/70 border border-indigo-800 text-indigo-300">
                      {call.final_intent || 'IN_PROGRESS'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      call.outcome === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      call.outcome === 'callback_requested' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      call.outcome === 'human_escalation' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {call.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">{call.duration}s</td>
                  <td className="py-3 px-3 text-emerald-400 font-mono">{call.latency_ms}ms</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => onStartSimulate(call.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      View Live / Replay
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
