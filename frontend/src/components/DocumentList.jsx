import React, { useState } from 'react';
import { FileText, Play, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';

export default function DocumentList({ documents, onLiveExtract, apiKeyConfigured, onOpenApiKeyModal }) {
  const [selectedDoc, setSelectedDoc] = useState(documents[0]?.id || '');
  const [startPage, setStartPage] = useState(1);
  const [maxPages, setMaxPages] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState(null);

  const handleExtract = async () => {
    if (!apiKeyConfigured) {
      onOpenApiKeyModal();
      return;
    }

    setIsLoading(true);
    setResultMsg(null);
    try {
      const res = await onLiveExtract({
        doc_id: selectedDoc,
        start_page: Number(startPage),
        max_pages: Number(maxPages)
      });
      setResultMsg({
        success: true,
        text: `Extracted ${res.facts_extracted} new grounded facts and formed ${res.new_relations} cross-document links!`
      });
    } catch (err) {
      setResultMsg({
        success: false,
        text: err.message || 'Extraction failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Live Gemini Extraction Bar */}
      <div className="bg-gradient-to-r from-[#111728] via-[#162138] to-[#111728] p-6 rounded-2xl border border-[#202e47] shadow-xl">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Live Gemini Flash Ingestion Console</span>
        </div>
        <h3 className="text-lg font-bold text-white tracking-tight">
          Extract Grounded Facts Directly with Google Gemini 1.5/2.0 Flash
        </h3>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Select any indexed PDF and page range. Gemini will extract facts with exact verbatim quotes and grounding verification.
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Target PDF Document</label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2b42] rounded-lg text-xs text-white"
            >
              {documents.map(d => (
                <option key={d.id} value={d.id}>{d.title} ({d.page_count} pages)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Start Page</label>
            <input
              type="number"
              min="1"
              max="100"
              value={startPage}
              onChange={(e) => setStartPage(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2b42] rounded-lg text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Max Pages (Free Tier Batch)</label>
            <input
              type="number"
              min="1"
              max="15"
              value={maxPages}
              onChange={(e) => setMaxPages(e.target.value)}
              className="w-full px-3 py-2 bg-[#0a0e1a] border border-[#1f2b42] rounded-lg text-xs text-white font-mono"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1a253a]">
          <div className="text-[11px] text-slate-400">
            {apiKeyConfigured ? (
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> Gemini Flash Free Tier Ready
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" /> Gemini API key needed for live runs
              </span>
            )}
          </div>

          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Grounded Claims...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Live Extraction</span>
              </>
            )}
          </button>
        </div>

        {resultMsg && (
          <div className={`mt-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
            resultMsg.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {resultMsg.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{resultMsg.text}</span>
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div>
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-4">
          Active Knowledge Base Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-[#101626] border border-[#1e2a40] rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">
                  {doc.title}
                </h4>
                <div className="text-xs font-mono text-slate-500 mt-0.5 truncate">
                  {doc.filename}
                </div>
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1a2538] flex items-center justify-between text-xs font-mono text-slate-400">
                <span>{doc.page_count} Pages</span>
                <span>{doc.size_mb} MB</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
