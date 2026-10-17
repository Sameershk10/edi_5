import React from 'react';
import { 
  CalendarClock, 
  Phone, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar, 
  AlertCircle 
} from 'lucide-react';
import { CallbackRecord } from '../types';

interface CallbacksViewProps {
  callbacks: CallbackRecord[];
  onRefresh: () => void;
  onCallCustomer: (customerId: string) => void;
}

export const CallbacksView: React.FC<CallbacksViewProps> = ({
  callbacks,
  onRefresh,
  onCallCustomer,
}) => {
  const handleMarkComplete = async (id: string) => {
    try {
      await fetch(`/api/callbacks/${id}/complete`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error('Failed to complete callback:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-amber-400" />
            Scheduled Customer Callbacks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated retry and rescheduled appointments captured directly from multi-turn voice conversations.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold self-start sm:self-auto"
        >
          Refresh Queue
        </button>
      </div>

      {/* Callbacks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {callbacks.length === 0 ? (
          <div className="col-span-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
            <CalendarClock className="w-10 h-10 mx-auto mb-2 text-slate-600" />
            <p className="text-sm font-semibold text-slate-400">No callbacks scheduled yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When a customer requests a callback during an outbound call (e.g. &ldquo;Mala udya sakali call kara&rdquo;), the AI agent automatically registers the scheduled slot here.
            </p>
          </div>
        ) : (
          callbacks.map((cb) => (
            <div
              key={cb.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{cb.customer_name}</h4>
                      <span className="text-[11px] text-slate-400 font-mono">{cb.customer_phone}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    cb.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {cb.status}
                  </span>
                </div>

                <div className="mt-4 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Scheduled: {new Date(cb.scheduled_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] italic">
                    Reason: &ldquo;{cb.reason || 'Customer requested callback'}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onCallCustomer(cb.customer_id)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Now (Sim)
                </button>

                {cb.status !== 'completed' && (
                  <button
                    onClick={() => handleMarkComplete(cb.id)}
                    title="Mark callback as completed"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
