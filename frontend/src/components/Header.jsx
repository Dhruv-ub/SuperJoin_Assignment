import React from 'react';
import { 
  FileText, 
  Layers, 
  Key, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  GitMerge, 
  ShieldAlert,
  Database,
  RefreshCw
} from 'lucide-react';

export default function Header({ 
  activeDataset, 
  onSelectDataset, 
  apiKeyConfigured, 
  onOpenApiKeyModal, 
  onOpenUploadModal,
  statistics,
  activeTab,
  onSelectTab,
  onRefresh
}) {
  return (
    <header className="border-b border-[#1f293d] bg-[#0b0f19]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-black font-black text-lg">
            V
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">VERITAS</h1>
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
                Fact Knowledge Layer
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Cross-Document Grounding, Provenance & Reconciliation Engine
            </p>
          </div>
        </div>

        {/* Dataset Switcher & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Dataset Selector */}
          <div className="flex items-center bg-[#101624] p-1 rounded-xl border border-[#1f293d]">
            <button
              onClick={() => onSelectDataset('delhivery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeDataset === 'delhivery'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Delhivery Filings</span>
            </button>
            <button
              onClick={() => onSelectDataset('india-macroeconomy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeDataset === 'india-macroeconomy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>India Macroeconomy</span>
            </button>
          </div>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              apiKeyConfigured 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{apiKeyConfigured ? 'Gemini Key Active' : 'Gemini Free API Key'}</span>
          </button>

          {/* Upload PDF Button */}
          <button
            onClick={onOpenUploadModal}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#151d2f] hover:bg-[#1a243a] text-slate-200 border border-[#1f293d] transition-all flex items-center gap-1.5"
          >
            <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload PDF</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            title="Reload Knowledge Layer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-[#1f293d] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#1a233a] flex items-center justify-between overflow-x-auto">
        <nav className="flex space-x-1 py-1">
          <button
            onClick={() => onSelectTab('showcase')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'showcase'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>The 4 Required Cases</span>
          </button>
          
          <button
            onClick={() => onSelectTab('relations')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'relations'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Cross-Document Reconciler</span>
          </button>

          <button
            onClick={() => onSelectTab('matrix')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'matrix'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Fact Knowledge Matrix</span>
          </button>

          <button
            onClick={() => onSelectTab('documents')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'text-cyan-400 bg-cyan-500/10 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Indexed Documents</span>
          </button>
        </nav>

        {/* Live Metrics Ticker */}
        {statistics && (
          <div className="hidden lg:flex items-center gap-3 text-[11px] text-slate-400 py-1 font-mono">
            <span className="flex items-center gap-1">
              <span className="text-white font-bold">{statistics.total_documents}</span> docs
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1">
              <span className="text-white font-bold">{statistics.total_pages_indexed}</span> pages
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              <span>{statistics.corroborated_relations} Corrob</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-rose-400">
              <AlertTriangle className="w-3 h-3" />
              <span>{statistics.contradiction_relations} Contradict</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-amber-400">
              <GitMerge className="w-3 h-3" />
              <span>{statistics.contextual_reconciliations} Reconciled</span>
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-violet-400">
              <ShieldAlert className="w-3 h-3" />
              <span>{statistics.failure_audits} Anomaly/Trap</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
