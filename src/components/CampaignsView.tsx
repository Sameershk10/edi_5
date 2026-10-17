import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Play, 
  Pause, 
  Clock, 
  CheckCircle2, 
  Users, 
  Globe, 
  Layers, 
  PhoneOutgoing,
  Settings,
  Sparkles
} from 'lucide-react';
import { Campaign } from '../types';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onRefresh: () => void;
  onSelectCampaignForSimulator: (campaignId: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onRefresh,
  onSelectCampaignForSimulator,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [language, setLanguage] = useState('Multilingual (Hindi/Marathi/English)');
  const [objective, setObjective] = useState('');
  const [scriptTemplate, setScriptTemplate] = useState('');

  const handleStartCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/start`, { method: 'POST' });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error('Failed to start campaign:', err);
    }
  };

  const handlePauseCampaign = async (id: string) => {
    try {
      const res = await fetch(`/api/campaigns/${id}/pause`, { method: 'POST' });
      if (res.ok) onRefresh();
    } catch (err) {
      console.error('Failed to pause campaign:', err);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          start_time: startTime,
          end_time: endTime,
          max_attempts: maxAttempts,
          language,
          objective,
          script_template: scriptTemplate,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setName('');
        setDescription('');
        setObjective('');
        setScriptTemplate('');
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to create campaign:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" />
            Outbound Voice Calling Campaigns
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated outbound scheduling, calling windows, retry policies, and multi-language personas.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => {
          const total = camp.total_customers || 0;
          const completed = camp.completed_calls || 0;
          const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={camp.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      camp.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      camp.status === 'paused' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {camp.status}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{camp.name}</h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {camp.status === 'active' ? (
                      <button
                        onClick={() => handlePauseCampaign(camp.id)}
                        title="Pause Campaign"
                        className="p-1.5 rounded-lg bg-amber-950/40 text-amber-300 hover:bg-amber-900 border border-amber-800/50 text-xs transition"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartCampaign(camp.id)}
                        title="Start Automated Calling"
                        className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/50 text-xs transition flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {camp.description || 'No description provided.'}
                </p>

                {/* Campaign Rules & Specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Calling Hours: <strong>{camp.start_time} - {camp.end_time}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">Lang: <strong>{camp.language}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>Audience: <strong>{total} Customers</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>Max Retries: <strong>{camp.max_attempts}x</strong></span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1 text-slate-400">
                    <span>Call Completion Progress</span>
                    <span>{completed} / {total} ({progressPct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(progressPct, 5)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 italic">
                  Goal: {camp.objective ? camp.objective.substring(0, 40) + '...' : 'Customer Engagement'}
                </span>
                <button
                  onClick={() => onSelectCampaignForSimulator(camp.id)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <PhoneOutgoing className="w-3.5 h-3.5" />
                  Test in Voice Sim
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Campaign Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateCampaign} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-indigo-400" />
                Create New Outbound Campaign
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Campaign Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. OPD Appointment Reminder"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Campaign purpose, intended target cohort..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Start Calling Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">End Calling Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Max Retry Attempts</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(parseInt(e.target.value) || 3)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Primary Languages</label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Conversational Goal / Objective</label>
              <textarea
                rows={2}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Verify patient availability, confirm booking or schedule preferred callback time."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
