import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { LiveSimulator } from './components/LiveSimulator';
import { CustomersView } from './components/CustomersView';
import { CampaignsView } from './components/CampaignsView';
import { CallsView } from './components/CallsView';
import { CallbacksView } from './components/CallbacksView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { ProjectInfoView } from './components/ProjectInfoView';
import { Customer, Campaign, CallRecord, CallbackRecord, KnowledgeDocument, AnalyticsData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [callbacks, setCallbacks] = useState<CallbackRecord[]>([]);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mockMode, setMockMode] = useState<boolean>(true);
  const [geminiConnected, setGeminiConnected] = useState<boolean>(true);

  // Fetch all primary datasets
  const fetchData = useCallback(async () => {
    try {
      const [custRes, campRes, callRes, cbRes, kbRes, anaRes] = await Promise.all([
        fetch('/api/customers'),
        fetch('/api/campaigns'),
        fetch('/api/calls'),
        fetch('/api/callbacks'),
        fetch('/api/knowledge'),
        fetch('/api/analytics'),
      ]);

if (custRes.ok) {
  const data = await custRes.json();
  setCustomers(Array.isArray(data) ? data : data.customers ?? []);
}

if (campRes.ok) {
  const data = await campRes.json();
  setCampaigns(Array.isArray(data) ? data : data.campaigns ?? []);
}

if (callRes.ok) {
  const data = await callRes.json();
  setCalls(Array.isArray(data) ? data : data.calls ?? []);
}

if (cbRes.ok) {
  const data = await cbRes.json();
  setCallbacks(Array.isArray(data) ? data : data.callbacks ?? []);
}

if (kbRes.ok) {
  const data = await kbRes.json();
  setKnowledgeDocs(Array.isArray(data) ? data : data.documents ?? []);
}

if (anaRes.ok) {
  const data = await anaRes.json();
  setAnalytics(data);
}
    } catch (err) {
      console.error('Data sync error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset database to seed data
  const handleResetSeed = async () => {
    try {
      setLoading(true);
      await fetch('/api/seed/reset', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Launch simulator with pre-selected customer or call
  const handleStartSimulate = (callId?: string) => {
    setActiveCallId(callId || null);
    setActiveTab('simulator');
  };

  const handleCallCustomer = (customerId: string) => {
    setActiveCallId(null);
    setActiveTab('simulator');
  };

  const handleSelectCampaignForSimulator = (campaignId: string) => {
    setActiveTab('simulator');
  };

  const inCallCount = calls.filter((c) => c.status === 'in_progress' || c.status === 'ringing').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mockMode={mockMode}
        geminiConnected={geminiConnected}
        onResetSeed={handleResetSeed}
        inCallCount={inCallCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-sm font-medium">Initializing Autonomous Voice Calling Engine...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                analytics={analytics}
                calls={calls}
                onStartSimulate={handleStartSimulate}
              />
            )}

            {activeTab === 'simulator' && (
              <LiveSimulator
                customers={customers}
                campaigns={campaigns}
                activeCallId={activeCallId}
                onCallEnded={fetchData}
                onCustomerUpdated={fetchData}
              />
            )}

            {activeTab === 'customers' && (
              <CustomersView
                customers={customers}
                campaigns={campaigns}
                onRefresh={fetchData}
                onCallCustomer={handleCallCustomer}
              />
            )}

            {activeTab === 'campaigns' && (
              <CampaignsView
                campaigns={campaigns}
                onRefresh={fetchData}
                onSelectCampaignForSimulator={handleSelectCampaignForSimulator}
              />
            )}

            {activeTab === 'calls' && (
              <CallsView
                calls={calls}
                onRefresh={fetchData}
                onOpenSimulator={handleStartSimulate}
              />
            )}

            {activeTab === 'callbacks' && (
              <CallbacksView
                callbacks={callbacks}
                onRefresh={fetchData}
                onCallCustomer={handleCallCustomer}
              />
            )}

            {activeTab === 'knowledge' && (
              <KnowledgeBaseView
                documents={knowledgeDocs}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'project-info' && <ProjectInfoView />}
          </>
        )}
      </main>

      {/* Footer Ribbon */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Vishwakarma Institute of Technology, Pune • Dept. of AI & Data Science (TY_E_13)
          </span>
          <span className="text-slate-400">
            Guide: <strong>Dr. Viomesh Kumar Singh</strong> • Academic Year 2025-26
          </span>
        </div>
      </footer>
    </div>
  );
}
