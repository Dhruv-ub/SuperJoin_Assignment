import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

export default function ShowcaseView({ cases, onInspectPage, onOpenRelationModal, relations }) {
  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Info className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p>No showcase cases loaded.</p>
      </div>
    );
  }

  const getCaseBadge = (type) => {
    switch (type) {
      case 'CORROBORATION':
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        };
      case 'CONTRADICTION':
        return {
          pill: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
        };
      case 'CONTEXTUAL_RECONCILIATION':
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <GitMerge className="w-4 h-4 text-amber-400" />
        };
      case 'ANOMALY_FAILURE':
        return {
          pill: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
          icon: <ShieldAlert className="w-4 h-4 text-violet-400" />
        };
      default:
        return {
          pill: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: <BookOpen className="w-4 h-4" />
        };
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-[#111726] via-[#162035] to-[#111726] p-6 sm:p-8 rounded-2xl border border-[#1f2d47]">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Superjoin Core Requirement Specification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          The Four Required Verification Cases
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          As mandated by <code className="text-cyan-300 font-mono">agent.md</code>, this section demonstrates 
          verifiable fact discovery, pinpoint page-level provenance, semantic & quantitative cross-referencing, 
          and concrete failure mitigation across real multi-page filings.
        </p>
      </div>

      {/* Grid of 4 Cases */}
      <div className="grid grid-cols-1 gap-6">
        {cases.map((c) => {
          const badge = getCaseBadge(c.case_type);
          return (
            <div 
              key={c.case_number}
              className="bg-[#101626] border border-[#1e2b42] rounded-2xl p-6 shadow-xl hover:border-cyan-500/40 transition-all"
            >
              {/* Card Top */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1b263b]">
                <div className="flex items-center gap-2.5">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badge.pill}`}>
                    {badge.icon}
                    <span>{c.badge_label}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-500">Case 0{c.case_number}</span>
                </div>
                <div className="text-xs font-mono text-cyan-400 font-medium">
                  {c.case_title}
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-lg sm:text-xl font-bold text-white mt-4 tracking-tight">
                {c.headline}
              </h3>

              {/* Evidence Pair */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                
                {/* Doc A Evidence */}
                <div className="bg-[#0b101c] p-4 rounded-xl border border-[#1a253a]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                      Source Document [A]
                    </span>
                    <button
                      onClick={() => onInspectPage(c.doc_a_name, c.doc_a_page, c.doc_a_quote)}
                      className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Page {c.doc_a_page}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="font-semibold text-white text-xs mb-2">
                    {c.doc_a_name}
                  </div>
                  <blockquote className="text-xs text-emerald-300/90 font-mono bg-[#070b13] p-3 rounded-lg border border-emerald-500/20 italic leading-relaxed">
                    "{c.doc_a_quote}"
                  </blockquote>
                  <p className="text-xs text-slate-400 mt-2">
                    <strong>Extracted Interpretation:</strong> {c.doc_a_interpretation}
                  </p>
                </div>

                {/* Doc B Evidence or Failure State */}
                {c.doc_b_name ? (
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-[#1a253a]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-mono text-cyan-400 font-bold uppercase tracking-wider text-[10px]">
                        Source Document [B]
                      </span>
                      <button
                        onClick={() => onInspectPage(c.doc_b_name, c.doc_b_page, c.doc_b_quote)}
                        className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[11px] transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Page {c.doc_b_page}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="font-semibold text-white text-xs mb-2">
                      {c.doc_b_name}
                    </div>
                    <blockquote className="text-xs text-emerald-300/90 font-mono bg-[#070b13] p-3 rounded-lg border border-emerald-500/20 italic leading-relaxed">
                      "{c.doc_b_quote}"
                    </blockquote>
                    <p className="text-xs text-slate-400 mt-2">
                      <strong>Extracted Interpretation:</strong> {c.doc_b_interpretation}
                    </p>
                  </div>
                ) : c.failure_analysis ? (
                  <div className="bg-[#0b101c] p-4 rounded-xl border border-violet-500/30">
                    <div className="flex items-center gap-1.5 text-violet-400 text-[10px] font-mono font-bold uppercase mb-2">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Failure Post-Mortem & Guardrail</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        <span className="text-[10px] block font-bold uppercase text-rose-400">Naive LLM Error:</span>
                        {c.failure_analysis.naive_result}
                      </div>
                      <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        <span className="text-[10px] block font-bold uppercase text-emerald-400">Our Guardrail Fix:</span>
                        {c.failure_analysis.guardrail_applied}
                      </div>
                    </div>
                  </div>
                ) : null}

              </div>

              {/* Context Delta (Case 3) */}
              {c.context_delta && (
                <div className="mt-4 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-2 font-mono font-bold uppercase text-amber-400 text-[11px] mb-2">
                    <GitMerge className="w-3.5 h-3.5" />
                    <span>Contextual Reconciling Factor: {c.context_delta.dimension}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 mb-2">
                    <div className="bg-[#090e18] p-2.5 rounded border border-[#1a253a]">
                      <span className="text-[10px] text-slate-500 block">Doc [A] Setting:</span>
                      <span className="text-cyan-300 font-mono">{c.context_delta.doc_a_spec}</span>
                    </div>
                    <div className="bg-[#090e18] p-2.5 rounded border border-[#1a253a]">
                      <span className="text-[10px] text-slate-500 block">Doc [B] Setting:</span>
                      <span className="text-cyan-300 font-mono">{c.context_delta.doc_b_spec}</span>
                    </div>
                  </div>
                  <p className="text-amber-200/90 leading-relaxed">
                    <strong>Reconciliation Mechanics:</strong> {c.context_delta.explanation}
                  </p>
                </div>
              )}

              {/* Forensic Reasoning & Verdict */}
              <div className="mt-4 pt-4 border-t border-[#1b263b] space-y-3">
                <div className="text-xs text-slate-300 leading-relaxed bg-[#0b101c] p-3.5 rounded-xl border border-[#1a253a]">
                  <span className="font-mono text-cyan-400 font-bold uppercase block text-[10px] mb-1">
                    System Reasoning Trail:
                  </span>
                  {c.system_reasoning}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131b2d] p-3.5 rounded-xl border border-[#202c46]">
                  <div className="text-xs font-medium text-white flex items-center gap-2">
                    <span className="text-cyan-400 font-mono font-bold">VERDICT:</span>
                    <span>{c.verdict}</span>
                  </div>
                  <button
                    onClick={() => {
                      // Find relation and open studio
                      if (relations && relations.length > 0) {
                        const target = relations.find(r => r.relation_type === c.case_type) || relations[0];
                        onOpenRelationModal(target);
                      }
                    }}
                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Inspect in Provenance Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
