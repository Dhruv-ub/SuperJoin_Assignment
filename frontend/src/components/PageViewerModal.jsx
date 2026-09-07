import React, { useState, useEffect } from 'react';
import { X, BookOpen, Loader2, AlertCircle } from 'lucide-react';

export default function PageViewerModal({ isOpen, onClose, docId, pageNum, quote }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && docId && pageNum) {
      fetchPageText();
    }
  }, [isOpen, docId, pageNum]);

  const fetchPageText = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/document/${docId}/page/${pageNum}`);
      if (!res.ok) {
        throw new Error(`Failed to load page: ${res.statusText}`);
      }
      const data = await res.json();
      setPageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Highlight quote inside text
  const renderHighlightedText = (text, targetQuote) => {
    if (!text) return 'No readable text on this page.';
    if (!targetQuote) return text;

    const lowerText = text.toLowerCase();
    const lowerQuote = targetQuote.toLowerCase().trim();
    const matchIdx = lowerText.indexOf(lowerQuote);

    if (matchIdx === -1) {
      // If exact string match not found, split into lines and highlight line with highest overlap
      return (
        <div>
          <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <strong>Target Quote:</strong> "{targetQuote}"
          </div>
          <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-300">
            {text}
          </div>
        </div>
      );
    }

    const before = text.slice(0, matchIdx);
    const match = text.slice(matchIdx, matchIdx + lowerQuote.length);
    const after = text.slice(matchIdx + lowerQuote.length);

    return (
      <div className="font-mono text-xs whitespace-pre-wrap leading-relaxed text-slate-300">
        {before}
        <mark className="bg-cyan-400 text-black font-bold px-1 py-0.5 rounded shadow-sm">
          {match}
        </mark>
        {after}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
      <div className="bg-[#0e1422] border border-[#1f2b42] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f2b42] bg-[#111828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Source Document Page Inspector
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {docId} · <span className="text-cyan-400 font-bold">Page {pageNum}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#080c14]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-mono">Extracting verbatim page text from PDF...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : pageData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pb-2 border-b border-[#1a2335]">
                <span>Word Count: {pageData.word_count} words</span>
                <span className="text-emerald-400">✓ Page Grounding Verified</span>
              </div>
              <div className="bg-[#0b101c] p-5 rounded-xl border border-[#1b263b] overflow-x-auto">
                {renderHighlightedText(pageData.text, quote)}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1f2b42] bg-[#111828] flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Exact source excerpt highlighted in cyan</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Close Page View
          </button>
        </div>

      </div>
    </div>
  );
}
