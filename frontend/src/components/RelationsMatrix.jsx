import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  ShieldAlert, 
  Sliders, 
  Search, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function RelationsMatrix({ 
  relations, 
  factsMap, 
  onOpenRelationModal, 
  onInspectPage 
}) {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRelations = relations.filter(r => {
    const matchesFilter = filterType === 'ALL' || r.relation_type === filterType;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRelationBadge = (type) => {
    switch (type) {
      case 'CORROBORATION':
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'Corroboration'
        };
      case 'CONTRADICTION':
        return {
          pill: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'Contradiction'
        };
      case 'CONTEXTUAL_RECONCILIATION':
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <GitMerge className="w-3.5 h-3.5" />,
          label: 'Context Reconciled'
        };
      case 'ANOMALY_FAILURE':
        return {
          pill: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          label: 'Anomaly / Trap'
        };
      default:
        return {
          pill: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: type
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#101624] p-3.5 rounded-xl border border-[#1f293d]">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'All Relations' },
            { id: 'CORROBORATION', label: 'Corroborations' },
            { id: 'CONTRADICTION', label: 'Contradictions' },
            { id: 'CONTEXTUAL_RECONCILIATION', label: 'Reconciled' },
            { id: 'ANOMALY_FAILURE', label: 'Anomalies / Audits' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter relations..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#090d16] border border-[#1f293d] focus:border-cyan-500 focus:outline-none rounded-lg text-xs text-white placeholder-slate-500"
          />
        </div>

      </div>

      {/* Relations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRelations.map((r) => {
          const badge = getRelationBadge(r.relation_type);
          const factA = factsMap[r.fact_a_id];
          const factB = r.fact_b_id ? factsMap[r.fact_b_id] : null;

          return (
            <div
              key={r.id}
              className="bg-[#101726] border border-[#1e2a40] rounded-xl p-5 flex flex-col justify-between hover:border-cyan-500/40 transition-all shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${badge.pill}`}>
                    {badge.icon}
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    Conf: <strong className="text-white">{Math.round(r.confidence * 100)}%</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight mt-2">
                  {r.title}
                </h3>
                <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {r.summary}
                </p>

                {/* Document Tags */}
                <div className="mt-4 pt-3 border-t border-[#1b2538] space-y-1.5 text-xs font-mono">
                  {factA && (
                    <div className="flex items-center justify-between text-slate-400 bg-[#0b101c] px-2.5 py-1 rounded">
                      <span className="truncate max-w-[200px] text-slate-300">[A] {factA.doc_id}</span>
                      <span className="text-cyan-400">p.{factA.citation.page}</span>
                    </div>
                  )}
                  {factB && (
                    <div className="flex items-center justify-between text-slate-400 bg-[#0b101c] px-2.5 py-1 rounded">
                      <span className="truncate max-w-[200px] text-slate-300">[B] {factB.doc_id}</span>
                      <span className="text-cyan-400">p.{factB.citation.page}</span>
                    </div>
                  )}
                  {r.context_delta && (
                    <div className="text-[11px] text-amber-300 font-sans flex items-center gap-1.5 pt-1">
                      <Sliders className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Reconciled by: <strong>{r.context_delta.dimension}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Action Button */}
              <div className="mt-4 pt-3 border-t border-[#1b2538] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-600">{r.id}</span>
                <button
                  onClick={() => onOpenRelationModal(r)}
                  className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>Forensic Audit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
