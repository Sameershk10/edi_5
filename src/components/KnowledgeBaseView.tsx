import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  FileText, 
  Tag, 
  Sparkles, 
  CheckCircle,
  Layers,
  ArrowRight
} from 'lucide-react';
import { KnowledgeDocument } from '../types';

interface KnowledgeBaseViewProps {
  documents: KnowledgeDocument[];
  onRefresh: () => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  documents,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Doc state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('General');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('policy, clinic');

  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch('/api/knowledge/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('RAG search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          content: newContent,
          tags: newTags.split(',').map((t) => t.trim()),
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewContent('');
        onRefresh();
      }
    } catch (err) {
      console.error('Add document failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-5 h-5 text-sky-400" />
            RAG Knowledge Base & Semantic Vector Index
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Grounded factual repository queried during live speech turns to answer customer questions accurately.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Knowledge Doc
        </button>
      </div>

      {/* Live Semantic Search Query Tester */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/40 rounded-2xl p-5 shadow-lg">
        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Live Vector RAG Retrieval Query Simulator
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Test how customer inquiries (in English, Hindi, or Hinglish) retrieve vector chunks for the LLM prompt.
        </p>

        <form onSubmit={handleTestSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. 'What are the clinic timings?' or 'Doctor ke timings kya hain?'"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold disabled:opacity-50 transition flex items-center gap-1.5"
          >
            {searching ? 'Querying...' : 'Retrieve Chunks'}
          </button>
        </form>

        {/* Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 pt-4 border-t border-indigo-900/60 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Retrieved Grounding Context ({searchResults.length} chunks):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {searchResults.map((res, i) => (
                <div key={i} className="bg-slate-900/90 border border-indigo-800/50 rounded-xl p-3 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-300">{res.title}</span>
                    <span className="bg-indigo-950 border border-indigo-800 px-1.5 py-0.5 rounded font-mono text-emerald-400">
                      Score: {res.score.toFixed(3)}
                    </span>
                  </div>
                  <p className="text-slate-200 text-xs italic">&ldquo;{res.chunk}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 border border-slate-700 text-indigo-300">
                  {doc.category}
                </span>
                <h4 className="text-base font-bold text-white mt-1.5">{doc.title}</h4>
              </div>
              <FileText className="w-5 h-5 text-slate-500" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
              {doc.content}
            </p>

            {/* Chunks */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Indexed Embedding Chunks ({doc.chunks?.length || 0}):
              </span>
              <div className="space-y-1">
                {doc.chunks?.map((chunk, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 truncate"
                    title={chunk}
                  >
                    • {chunk}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {doc.tags?.map((tag, idx) => (
                <span key={idx} className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-slate-500" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Document Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddDocument} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                Add Grounding Knowledge Document
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
              <label className="text-xs text-slate-400 block mb-1">Document Title *</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Cancellation and Reschedule Policy"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Healthcare, Services"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="pricing, timings, doctor"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Content / Policy Rules *</label>
              <textarea
                rows={5}
                required
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Enter complete factual guidelines that the agent must cite..."
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
                Save & Index
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
