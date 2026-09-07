import React, { useState } from 'react';
import { Search, BookOpen, ExternalLink, Filter, CheckCircle2 } from 'lucide-react';

export default function KnowledgeMatrix({ facts, onInspectPage }) {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('ALL');

  const topics = ['ALL', ...new Set(facts.map(f => f.topic))];

  const filteredFacts = facts.filter(f => {
    const matchesTopic = selectedTopic === 'ALL' || f.topic === selectedTopic;
    const matchesSearch = 
      f.claim.toLowerCase().includes(search.toLowerCase()) ||
      f.entity.toLowerCase().includes(search.toLowerCase()) ||
      f.value.toLowerCase().includes(search.toLowerCase()) ||
      f.doc_id.toLowerCase().includes(search.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#101624] p-3.5 rounded-xl border border-[#1f293d]">
        
        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTopic === t
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search extracted facts..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#090d16] border border-[#1f293d] focus:border-cyan-500 focus:outline-none rounded-lg text-xs text-white placeholder-slate-500"
          />
        </div>

      </div>

      {/* Facts Table */}
      <div className="bg-[#101626] border border-[#1e2a40] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b101c] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1e2a40]">
              <tr>
                <th className="py-3 px-4">Entity & Topic</th>
                <th className="py-3 px-4">Factual Claim</th>
                <th className="py-3 px-4">Extracted Value</th>
                <th className="py-3 px-4">Context & Time</th>
                <th className="py-3 px-4">Citation Provenance</th>
                <th className="py-3 px-4 text-right">Grounding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#172235]">
              {filteredFacts.map((fact) => (
                <tr key={fact.id} className="hover:bg-[#131b2d] transition-colors">
                  
                  {/* Entity & Topic */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-white">{fact.entity}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                      {fact.topic}
                    </span>
                  </td>

                  {/* Claim */}
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-slate-200 line-clamp-2 leading-relaxed">
                      {fact.claim}
                    </p>
                  </td>

                  {/* Stated Value */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 text-xs">
                      {fact.value}
                    </span>
                  </td>

                  {/* Context & Time */}
                  <td className="py-3 px-4 text-slate-400">
                    {fact.temporal_anchor && (
                      <div className="text-[11px] text-slate-300 font-mono">
                        {fact.temporal_anchor}
                      </div>
                    )}
                    {fact.scope_qualifier && (
                      <div className="text-[10px] text-slate-500">
                        {fact.scope_qualifier}
                      </div>
                    )}
                  </td>

                  {/* Citation */}
                  <td className="py-3 px-4">
                    <div className="text-[11px] font-mono text-slate-400 truncate max-w-[160px]">
                      {fact.doc_id}
                    </div>
                    <button
                      onClick={() => onInspectPage(fact.doc_id, fact.citation.page, fact.citation.quote)}
                      className="mt-1 text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Page {fact.citation.page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>

                  {/* Grounding Status */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{Math.round(fact.confidence * 100)}%</span>
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
