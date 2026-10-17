import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Clock, 
  Cpu, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Languages, 
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { Customer, Campaign, CallRecord, TranscriptTurn } from '../types';

interface LiveSimulatorProps {
  customers: Customer[];
  campaigns: Campaign[];
  activeCallId?: string | null;
  onCallEnded: () => void;
  onCustomerUpdated: () => void;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  customers,
  campaigns,
  activeCallId,
  onCallEnded,
  onCustomerUpdated,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [currentCall, setCurrentCall] = useState<CallRecord | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');
  const [duration, setDuration] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [voiceMuted, setVoiceMuted] = useState<boolean>(false);
  const [isListeningMic, setIsListeningMic] = useState<boolean>(false);
  const [lastAnalysis, setLastAnalysis] = useState<any>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Selected customer object
  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentCampaign = campaigns.find((camp) => camp.id === currentCustomer?.campaign_id) || campaigns[0];

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentCall?.transcript]);

  // Duration timer during connected call
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (callStatus === 'idle') setDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Web Speech API Voice synthesis helper
  const speakText = (text: string, lang: string) => {
    if (voiceMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (lang === 'Marathi') {
        utterance.lang = 'mr-IN';
      } else if (lang === 'Hindi') {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis playback error:', e);
    }
  };

  // Start Outbound Call
  const handleInitiateCall = async () => {
    if (!currentCustomer) return;

    setCallStatus('ringing');
    setDuration(0);
    setLastAnalysis(null);

    try {
      const res = await fetch('/api/calls/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: currentCustomer.id,
          campaign_id: currentCampaign?.id,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setCurrentCall(data.call);
        setCallStatus('connected');
        speakText(data.greeting, data.call.detected_language);
      }, 1500); // 1.5s simulated ring delay
    } catch (err) {
      console.error('Call initiation failed:', err);
      setCallStatus('idle');
    }
  };

  // Send Customer Speech Turn
  const handleSendUtterance = async (utteranceToSend?: string) => {
    const text = (utteranceToSend || inputText).trim();
    if (!text || !currentCall || isProcessing) return;

    setInputText('');
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/calls/${currentCall.id}/interact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setCurrentCall(data.call);
      setLastAnalysis({
        intent: data.intent,
        confidence: data.confidence,
        detected_language: data.detected_language,
        sentiment: data.sentiment,
        next_state: data.next_state,
        action_executed: data.action_executed,
        latency_ms: data.latency_ms,
      });

      speakText(data.agent_response, data.detected_language);
      onCustomerUpdated();

      if (data.call.status === 'completed' || data.next_state === 'COMPLETED') {
        setTimeout(() => {
          setCallStatus('ended');
          onCallEnded();
        }, 3000);
      }
    } catch (err) {
      console.error('Turn processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Speech Recognition (Microphone)
  const toggleMicListening = () => {
    if (isListeningMic) {
      setIsListeningMic(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use the quick preset phrases or text input.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = currentCustomer?.preferred_language === 'Marathi' ? 'mr-IN' : currentCustomer?.preferred_language === 'Hindi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListeningMic(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListeningMic(false);
        if (transcript) {
          setInputText(transcript);
          handleSendUtterance(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListeningMic(false);
      };

      recognition.onend = () => {
        setIsListeningMic(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('Microphone start error:', err);
      setIsListeningMic(false);
    }
  };

  // Hang Up Call
  const handleEndCall = async () => {
    if (!currentCall) return;
    try {
      await fetch(`/api/calls/${currentCall.id}/end`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome: 'completed' }),
      });
      setCallStatus('ended');
      onCallEnded();
      onCustomerUpdated();
    } catch (err) {
      console.error('End call error:', err);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Telephony Dialer & Control Deck */}
      <div className="lg:col-span-4 space-y-4">
        {/* Customer & Preset Selector */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Target Customer</span>
            <span className="text-indigo-400 text-[10px] lowercase">csv / db records</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Customer Record</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                disabled={callStatus === 'ringing' || callStatus === 'connected'}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.preferred_language}) - {c.phone_number}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Demo Evaluation Presets */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                Quick Academic Demo Scenarios
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const found = customers.find((c) => c.name.includes('Rahul'));
                    if (found) setSelectedCustomerId(found.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-orange-950/40 border border-orange-800/40 text-orange-200 hover:bg-orange-900/50 text-[11px] font-medium text-left truncate transition"
                >
                  🇮🇳 Rahul (Hindi Remind)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const found = customers.find((c) => c.name.includes('Sneha'));
                    if (found) setSelectedCustomerId(found.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-200 hover:bg-amber-900/50 text-[11px] font-medium text-left truncate transition"
                >
                  🚩 Sneha (Marathi Busy)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const found = customers.find((c) => c.name.includes('Amit'));
                    if (found) setSelectedCustomerId(found.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-200 hover:bg-sky-900/50 text-[11px] font-medium text-left truncate transition"
                >
                  💬 Amit (Hinglish Lead)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const found = customers.find((c) => c.name.includes('John'));
                    if (found) setSelectedCustomerId(found.id);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-indigo-200 hover:bg-indigo-900/50 text-[11px] font-medium text-left truncate transition"
                >
                  🌐 John (English Survey)
                </button>
              </div>
            </div>

            {/* Customer Details Snapshot */}
            {currentCustomer && (
              <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-700/60">
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Campaign:</span>
                  <span className="text-indigo-300 font-semibold">{currentCampaign?.name || 'General'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Preferred Language:</span>
                  <span className="text-amber-300 font-bold">{currentCustomer.preferred_language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Call Attempts:</span>
                  <span className="text-slate-200">{currentCustomer.call_attempts}</span>
                </div>
                <div className="pt-1 border-t border-slate-700/60 text-[11px] text-slate-400 italic">
                  &ldquo;{currentCustomer.notes || 'No custom notes'}&rdquo;
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Telephony Dialing Console */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="text-center py-4">
            {/* Visual Phone Ringing Avatar */}
            <div className="relative inline-flex items-center justify-center mb-3">
              {callStatus === 'ringing' && (
                <span className="absolute w-24 h-24 rounded-full bg-indigo-500/20 animate-ping" />
              )}
              {callStatus === 'connected' && (
                <span className="absolute w-20 h-20 rounded-full bg-emerald-500/20 animate-pulse" />
              )}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-xl ${
                callStatus === 'connected' ? 'bg-emerald-600' :
                callStatus === 'ringing' ? 'bg-amber-600 animate-bounce' :
                callStatus === 'ended' ? 'bg-slate-700' : 'bg-indigo-600'
              }`}>
                {callStatus === 'connected' ? <Volume2 className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
              </div>
            </div>

            <h4 className="text-base font-bold text-white">
              {currentCustomer?.name || 'No customer'}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {currentCustomer?.phone_number || ''}
            </p>

            <div className="mt-3 flex items-center justify-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                callStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                callStatus === 'ringing' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' :
                callStatus === 'ended' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {callStatus === 'connected' ? `Live Connected (${formatSeconds(duration)})` :
                 callStatus === 'ringing' ? 'Ringing Outbound...' :
                 callStatus === 'ended' ? 'Call Completed' : 'Ready to Call'}
              </span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
            {callStatus === 'idle' || callStatus === 'ended' ? (
              <button
                onClick={handleInitiateCall}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <Phone className="w-4 h-4" />
                Initiate Outbound Call
              </button>
            ) : (
              <button
                onClick={handleEndCall}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                Hang Up Call
              </button>
            )}

            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              title={voiceMuted ? 'Unmute Agent Synthetic Voice' : 'Mute Agent Synthetic Voice'}
              className={`p-3 rounded-xl border transition ${
                voiceMuted 
                  ? 'bg-slate-800 border-slate-700 text-slate-500' 
                  : 'bg-indigo-950/80 border-indigo-700 text-indigo-300 hover:bg-indigo-900'
              }`}
            >
              {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Live Conversation Transcript & Intelligence Panel */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Real-time State & Intent HUD Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">Dialogue State</span>
            <span className="font-mono font-bold text-indigo-300">
              {currentCall?.dialogue_state || 'IDLE'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Detected Intent</span>
            <span className="font-mono font-bold text-amber-300">
              {lastAnalysis?.intent || currentCall?.final_intent || 'PENDING'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Language / Code-Switch</span>
            <span className="font-bold text-sky-400">
              {lastAnalysis?.detected_language || currentCall?.detected_language || currentCustomer?.preferred_language}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Turn Turnaround</span>
            <span className="font-mono font-bold text-emerald-400">
              {lastAnalysis?.latency_ms ? `${lastAnalysis.latency_ms}ms` : '< 300ms'}
            </span>
          </div>
        </div>

        {/* Live Transcript Log Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex-1 min-h-[380px] max-h-[480px] flex flex-col justify-between overflow-hidden">
          <div className="overflow-y-auto space-y-3.5 pr-2 flex-1">
            {!currentCall || currentCall.transcript.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Phone className="w-10 h-10 mb-2 text-slate-600 opacity-60" />
                <p className="text-sm font-medium">Outbound voice call not started.</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Select a customer on the left and click &ldquo;Initiate Outbound Call&rdquo; to simulate live multilingual dialogue.
                </p>
              </div>
            ) : (
              currentCall.transcript.map((turn, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${turn.speaker === 'customer' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mb-1 px-1">
                    <span className="font-semibold uppercase tracking-wider text-slate-400">
                      {turn.speaker === 'customer' ? `Customer (${turn.language || 'User'})` : 'AI Voice Agent'}
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
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                      turn.speaker === 'customer'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {turn.text}
                  </div>
                </div>
              ))
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Action Trigger Alert Box (if tool was executed) */}
          {lastAnalysis?.action_executed && (
            <div className="mt-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-2.5 text-xs text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Tool Fired:</strong> {lastAnalysis.action_executed.action} (
                  {JSON.stringify(lastAnalysis.action_executed.arguments || {})})
                </span>
              </div>
              <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded font-mono text-emerald-200">
                DB Updated
              </span>
            </div>
          )}

          {/* Customer Utterance Input Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            {/* Quick Demo Utterance Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
              <span className="text-slate-500 text-[10px] font-semibold shrink-0">Click to reply:</span>
              <button
                type="button"
                onClick={() => handleSendUtterance('Haan, confirm kar do.')}
                disabled={callStatus !== 'connected' || isProcessing}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition disabled:opacity-50"
              >
                &ldquo;Haan, confirm kar do.&rdquo; (Confirm)
              </button>
              <button
                type="button"
                onClick={() => handleSendUtterance('Mala udya sakali call kara, busy ahe.')}
                disabled={callStatus !== 'connected' || isProcessing}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-900/60 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition disabled:opacity-50"
              >
                &ldquo;Mala udya sakali call kara&rdquo; (Marathi Callback)
              </button>
              <button
                type="button"
                onClick={() => handleSendUtterance('Doctor ke available timings kya hain?')}
                disabled={callStatus !== 'connected' || isProcessing}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-900/60 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition disabled:opacity-50"
              >
                &ldquo;Doctor ke timings kya hain?&rdquo; (RAG Query)
              </button>
              <button
                type="button"
                onClick={() => handleSendUtterance('Mujhe kisi human manager se baat karni hai!')}
                disabled={callStatus !== 'connected' || isProcessing}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition disabled:opacity-50"
              >
                &ldquo;Human representative se baat karni hai&rdquo; (Escalate)
              </button>
              <button
                type="button"
                onClick={() => handleSendUtterance('Nahi, mujhe koi interest nahi hai.')}
                disabled={callStatus !== 'connected' || isProcessing}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition disabled:opacity-50"
              >
                &ldquo;Nahi, interest nahi hai.&rdquo; (Decline)
              </button>
            </div>

            {/* Input & Mic row */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMicListening}
                disabled={callStatus !== 'connected' || isProcessing}
                title="Speak using live Microphone (Web Speech Recognition)"
                className={`p-2.5 rounded-xl border transition ${
                  isListeningMic
                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                } disabled:opacity-50`}
              >
                {isListeningMic ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendUtterance()}
                disabled={callStatus !== 'connected' || isProcessing}
                placeholder={
                  callStatus === 'connected'
                    ? isListeningMic
                      ? 'Listening to microphone...'
                      : 'Type customer response in English, Hindi, Marathi, or Hinglish...'
                    : 'Start the call first to speak...'
                }
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />

              <button
                onClick={() => handleSendUtterance()}
                disabled={callStatus !== 'connected' || !inputText.trim() || isProcessing}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md disabled:opacity-50 transition"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
