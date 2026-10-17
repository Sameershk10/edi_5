import React, { useState } from 'react';
import { 
  Users, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  Trash2, 
  Edit, 
  FileText, 
  Download, 
  CheckCircle, 
  Clock,
  Languages
} from 'lucide-react';
import { Customer, Campaign } from '../types';

interface CustomersViewProps {
  customers: Customer[];
  campaigns: Campaign[];
  onRefresh: () => void;
  onCallCustomer: (customerId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  campaigns,
  onRefresh,
  onCallCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  // New Customer Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLanguage, setNewLanguage] = useState<'English' | 'Hindi' | 'Marathi' | 'Hinglish'>('Hindi');
  const [newTime, setNewTime] = useState('14:00');
  const [newCampaignId, setNewCampaignId] = useState(campaigns[0]?.id || 'camp-1');
  const [newNotes, setNewNotes] = useState('');

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone_number.includes(searchTerm) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLang = selectedLanguage === 'all' || c.preferred_language === selectedLanguage;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesLang && matchesStatus;
  });

  const handleDownloadSampleCsv = () => {
    const csvData = `name,phone,email,preferred_language,preferred_call_time,campaign,status,notes
Rahul Sharma,+919876543210,rahul.sharma@example.com,Hindi,17:00,Appointment Reminder,pending,Dentist consultation review
Sneha Kulkarni,+919822334455,sneha.kulkarni@example.com,Marathi,10:30,Follow-up Campaign,pending,Requested Marathi follow-up
Amit Patel,+919988776655,amit.patel@example.com,Hinglish,15:00,Lead Qualification,pending,Enterprise cloud telephony tier
David Wilson,+919855667788,david.w@example.com,English,19:00,Customer Survey,pending,Post delivery service survey`;

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample_customers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCsv = async () => {
    if (!csvContent.trim()) return;
    setImporting(true);
    setImportResult(null);

    try {
      const res = await fetch('/api/customers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setImportResult(`Successfully imported ${data.count} customers!`);
        setTimeout(() => {
          setIsImportModalOpen(false);
          setCsvContent('');
          setImportResult(null);
          onRefresh();
        }, 1200);
      } else {
        setImportResult(`Error: ${data.error || 'Failed to parse CSV'}`);
      }
    } catch (err: any) {
      setImportResult(`Import failed: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          phone_number: newPhone,
          email: newEmail,
          preferred_language: newLanguage,
          preferred_call_time: newTime,
          campaign_id: newCampaignId,
          notes: newNotes,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewName('');
        setNewPhone('');
        setNewEmail('');
        setNewNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add customer:', err);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer record?')) return;
    try {
      await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Customer Directory (PostgreSQL CRM)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage calling candidates, phone records, preferred languages, and CSV datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Upload className="w-3.5 h-3.5 text-sky-400" />
            Import CSV
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer by name, phone, or email..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="calling">Calling Now</option>
            <option value="completed">Completed</option>
            <option value="callback_scheduled">Callback Scheduled</option>
            <option value="escalated">Escalated</option>
            <option value="not_interested">Not Interested</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 ml-auto">
          Showing {filteredCustomers.length} of {customers.length}
        </span>
      </div>

      {/* Customer Records Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700/60">
              <tr>
                <th className="py-3 px-4">Name & Contact</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Preferred Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Attempts</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No customers match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const camp = campaigns.find((c) => c.id === cust.campaign_id);
                  return (
                    <tr key={cust.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{cust.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{cust.phone_number}</span>
                        {cust.email && <span className="block text-[10px] text-slate-500">{cust.email}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                          cust.preferred_language === 'Marathi' ? 'bg-amber-950/40 text-amber-300 border-amber-800/50' :
                          cust.preferred_language === 'Hindi' ? 'bg-orange-950/40 text-orange-300 border-orange-800/50' :
                          cust.preferred_language === 'Hinglish' ? 'bg-sky-950/40 text-sky-300 border-sky-800/50' :
                          'bg-indigo-950/40 text-indigo-300 border-indigo-800/50'
                        }`}>
                          {cust.preferred_language}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">
                        {camp?.name || 'General Campaign'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 font-mono">
                        {cust.preferred_call_time || '12:00'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          cust.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          cust.status === 'callback_scheduled' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          cust.status === 'escalated' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          cust.status === 'calling' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse' :
                          cust.status === 'not_interested' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                          'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {cust.call_attempts}
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate" title={cust.notes}>
                        {cust.notes || '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onCallCustomer(cust.id)}
                            title="Call customer via Voice Simulator"
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 transition"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(cust.id)}
                            title="Delete customer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                Import Customer CSV Dataset
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Upload or paste customer CSV records with fields: <code>name, phone, email, preferred_language, preferred_call_time, notes</code>.
            </p>

            <div className="flex justify-between items-center bg-slate-800/60 border border-slate-700/60 rounded-xl p-3">
              <span className="text-xs text-slate-300">Need sample CSV template?</span>
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 hover:bg-indigo-900 text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Sample CSV
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Upload File (.csv)</label>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Or Paste CSV Content</label>
              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="name,phone,email,preferred_language,preferred_call_time,campaign,status,notes&#10;Rahul Sharma,+919876543210,rahul@example.com,Hindi,17:00,Appointment Reminder,pending,OPD checkup"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {importResult && (
              <div className="text-xs p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-200">
                {importResult}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportCsv}
                disabled={importing || !csvContent.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {importing ? 'Processing...' : 'Import Customers'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomer} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add New Customer
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
              <label className="text-xs text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Omkar Raskar"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98223 34455"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Preferred Language</label>
                <select
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@vit.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Preferred Time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Assign Campaign</label>
              <select
                value={newCampaignId}
                onChange={(e) => setNewCampaignId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                {campaigns.map((camp) => (
                  <option key={camp.id} value={camp.id}>
                    {camp.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Context Notes</label>
              <textarea
                rows={2}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Appointment or lead details..."
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
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
