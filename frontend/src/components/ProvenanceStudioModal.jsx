import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  ShieldAlert, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  Sliders
} from 'lucide-react';

export default function ProvenanceStudioModal({ 
  isOpen, 
  onClose, 
  relation, 
  factsMap, 
  onInspectPage 
}) {
  const [copiedId, setCopiedId] = useState(null);

  if (!isOpen || !relation) return null;

  const factA = factsMap[relation.fact_a_id];
  const factB = relation.fact_b_id ? factsMap[relation.fact_b_id] : null;

  const handleCopyQuote = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getRelationBadge = (type) => {
    switch (type) {
      case 'CORROBORATION':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
          label: 'Corroboration Across Documents'
        };
      case 'CONTRADICTION':
        return {
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
          label: 'Genuine Factual Contradiction'
        };
      case 'CONTEXTUAL_RECONCILIATION':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <GitMerge className="w-4 h-4 text-amber-400" />,
          label: 'Reconciled by Context (Scope/Time/Units)'
        };
      case 'ANOMALY_FAILURE':
        return {
          bg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-violet-400" />,
          label: 'Extraction Failure & Mitigation Audit'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: <BookOpen className="w-4 h-4" />,
          label: type
        };
    }
  };

  const badge = getRelationBadge(relation.relation_type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
      <div className="bg-[#0e1422] border border-[#1f2b42] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Studio Header */}
        <div className="px-6 py-4 border-b border-[#1f2b42] bg-[#111828] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.bg}`}>
              {badge.icon}
              <span>{badge.label}</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              Confidence: <strong className="text-white">{Math.round(relation.confidence * 100)}%</strong>
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Main Title & Summary */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {relation.title}
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed bg-[#151e30] p-3.5 rounded-xl border border-[#212d45]">
              {relation.summary}
            </p>
          </div>

          {/* Side-by-Side Evidence Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Fact A Source Card */}
            {factA && (
              <div className="bg-[#121929] border border-[#202d45] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      Document Evidence [A]
                    </span>
                    <button
                      onClick={() => onInspectPage(factA.doc_id, factA.citation.page, factA.citation.quote)}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Page {factA.citation.page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-white text-sm">
                    {factA.doc_title}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    {factA.doc_id}
                  </div>

                  {/* Fact Claims */}
                  <div className="mt-3 p-3 rounded-lg bg-[#0a0e18] border border-[#1a2438] space-y-1.5">
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Entity:</span> <strong className="text-white">{factA.entity}</strong>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Stated Value:</span> <strong className="text-cyan-300 font-mono text-sm">{factA.value}</strong>
                    </div>
                    {factA.temporal_anchor && (
                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500">Time Anchor:</span> {factA.temporal_anchor}
                      </div>
                    )}
                    {factA.scope_qualifier && (
                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500">Scope:</span> {factA.scope_qualifier}
                      </div>
                    )}
                  </div>

                  {/* Verbatim Quote */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-slate-400">Verbatim Citation Quote:</span>
                      <button
                        onClick={() => handleCopyQuote(factA.citation.quote, 'quote-a')}
                        className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === 'quote-a' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === 'quote-a' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <blockquote className="text-xs text-emerald-300/90 font-mono bg-[#09121a] p-3 rounded-lg border border-emerald-500/20 italic leading-relaxed">
                      "{factA.citation.quote}"
                    </blockquote>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a2438] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Grounding Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(factA.confidence * 100)}% Verified</span>
                </div>
              </div>
            )}

            {/* Fact B Source Card */}
            {factB ? (
              <div className="bg-[#121929] border border-[#202d45] rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      Document Evidence [B]
                    </span>
                    <button
                      onClick={() => onInspectPage(factB.doc_id, factB.citation.page, factB.citation.quote)}
                      className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Page {factB.citation.page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <h3 className="font-semibold text-white text-sm">
                    {factB.doc_title}
                  </h3>
                  <div className="text-xs font-mono text-slate-500 mt-0.5">
                    {factB.doc_id}
                  </div>

                  {/* Fact Claims */}
                  <div className="mt-3 p-3 rounded-lg bg-[#0a0e18] border border-[#1a2438] space-y-1.5">
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Entity:</span> <strong className="text-white">{factB.entity}</strong>
                    </div>
                    <div className="text-xs text-slate-300">
                      <span className="text-slate-500">Stated Value:</span> <strong className="text-cyan-300 font-mono text-sm">{factB.value}</strong>
                    </div>
                    {factB.temporal_anchor && (
                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500">Time Anchor:</span> {factB.temporal_anchor}
                      </div>
                    )}
                    {factB.scope_qualifier && (
                      <div className="text-xs text-slate-400">
                        <span className="text-slate-500">Scope:</span> {factB.scope_qualifier}
                      </div>
                    )}
                  </div>

                  {/* Verbatim Quote */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-slate-400">Verbatim Citation Quote:</span>
                      <button
                        onClick={() => handleCopyQuote(factB.citation.quote, 'quote-b')}
                        className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                      >
                        {copiedId === 'quote-b' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === 'quote-b' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <blockquote className="text-xs text-emerald-300/90 font-mono bg-[#09121a] p-3 rounded-lg border border-emerald-500/20 italic leading-relaxed">
                      "{factB.citation.quote}"
                    </blockquote>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a2438] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Grounding Confidence:</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(factB.confidence * 100)}% Verified</span>
                </div>
              </div>
            ) : relation.failure_analysis ? (
              /* Case 4 Anomaly Card */
              <div className="bg-[#121929] border border-violet-500/30 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-violet-400 text-[11px] font-mono font-bold uppercase">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Extraction Failure Post-Mortem</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm">
                    {relation.failure_analysis.failure_type}
                  </h3>
                  
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                      <span className="text-[10px] uppercase tracking-wider font-bold block text-rose-400">Naive LLM Trap:</span>
                      {relation.failure_analysis.naive_result}
                    </div>

                    <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/30 text-slate-300">
                      <span className="text-[10px] uppercase tracking-wider font-bold block text-violet-400">Root Cause:</span>
                      {relation.failure_analysis.root_cause}
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                      <span className="text-[10px] uppercase tracking-wider font-bold block text-emerald-400">Mitigation Guardrail Applied:</span>
                      {relation.failure_analysis.guardrail_applied}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#1a2438] text-[11px] font-mono text-emerald-400 font-bold">
                  ✓ Successfully Mitigated & Corrected
                </div>
              </div>
            ) : null}

          </div>

          {/* Signature Element: The Contextual Delta Spectrum */}
          {relation.context_delta && (
            <div className="bg-[#10192e] border border-amber-500/30 rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
                <Sliders className="w-4 h-4" />
                <span>The Contextual Delta Spectrum</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-[#0b101f] p-3 rounded-lg border border-[#1f2b45]">
                  <span className="text-[11px] text-slate-400 block font-medium">Reconciling Dimension</span>
                  <span className="text-white font-semibold text-sm mt-0.5 block">{relation.context_delta.dimension}</span>
                </div>
                <div className="bg-[#0b101f] p-3 rounded-lg border border-[#1f2b45]">
                  <span className="text-[11px] text-slate-400 block font-medium">Specification in Doc [A]</span>
                  <span className="text-cyan-300 font-mono text-xs mt-0.5 block">{relation.context_delta.doc_a_spec}</span>
                </div>
                <div className="bg-[#0b101f] p-3 rounded-lg border border-[#1f2b45]">
                  <span className="text-[11px] text-slate-400 block font-medium">Specification in Doc [B]</span>
                  <span className="text-cyan-300 font-mono text-xs mt-0.5 block">{relation.context_delta.doc_b_spec}</span>
                </div>
              </div>

              <div className="mt-3 text-xs text-amber-200/90 bg-amber-500/5 border border-amber-500/20 p-3 rounded-lg leading-relaxed">
                <strong>Reconciliation Logic:</strong> {relation.context_delta.explanation}
              </div>
            </div>
          )}

          {/* Deep-Dive System Reasoning Chain */}
          <div className="bg-[#101624] border border-[#1f293d] rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-cyan-400" />
              <span>Veritas Forensic Reasoning Chain</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {relation.detailed_reasoning}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1f2b42] bg-[#111828] flex items-center justify-between text-xs text-slate-400">
          <span>Relational ID: <code className="text-slate-300 font-mono">{relation.id}</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
