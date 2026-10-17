export interface Customer {
  id: string;
  name: string;
  phone_number: string;
  email: string;
  preferred_language: 'English' | 'Hindi' | 'Marathi' | 'Hinglish';
  preferred_call_time: string;
  status: 'pending' | 'calling' | 'completed' | 'callback_scheduled' | 'escalated' | 'failed' | 'not_interested';
  campaign_id: string;
  last_call_at?: string;
  next_callback_at?: string;
  call_attempts: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  start_time: string;
  end_time: string;
  max_attempts: number;
  language: string;
  objective: string;
  script_template: string;
  total_customers?: number;
  pending_calls?: number;
  completed_calls?: number;
  created_at: string;
}

export interface TranscriptTurn {
  speaker: 'agent' | 'customer' | 'system';
  text: string;
  timestamp: string;
  intent?: string;
  confidence?: number;
  language?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  audio_url?: string;
}

export interface CallRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  campaign_id: string;
  campaign_name: string;
  twilio_call_sid: string;
  status: 'queued' | 'ringing' | 'in_progress' | 'completed' | 'failed' | 'busy' | 'no_answer';
  started_at: string;
  ended_at?: string;
  duration: number;
  detected_language: string;
  final_intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  outcome: 'interested' | 'not_interested' | 'callback_requested' | 'information_requested' | 'completed' | 'wrong_number' | 'human_escalation' | 'in_progress';
  escalated: boolean;
  transcript: TranscriptTurn[];
  recording_url?: string;
  dialogue_state: string;
  latency_ms: number;
  created_at: string;
}

export interface CallbackRecord {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  call_id: string;
  scheduled_at: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  chunks: string[];
  tags: string[];
  updated_at: string;
}

export interface AnalyticsData {
  kpis: {
    total_customers: number;
    active_campaigns: number;
    calls_today: number;
    completed_calls: number;
    failed_calls: number;
    callbacks_scheduled: number;
    human_escalations: number;
    avg_call_duration_seconds: number;
    avg_response_latency_ms: number;
    completion_rate_percentage: number;
  };
  distributions: {
    intents: Record<string, number>;
    languages: Record<string, number>;
    outcomes: Record<string, number>;
    sentiments: Record<string, number>;
  };
  academic_evaluation_metrics: {
    word_error_rate_wer: string;
    intent_f1_score: string;
    multilingual_accuracy: string;
    sub_second_latency_compliance: string;
  };
}
