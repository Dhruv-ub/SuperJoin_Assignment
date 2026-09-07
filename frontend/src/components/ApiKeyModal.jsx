import React, { useState } from 'react';
import { Key, ExternalLink, Sparkles, X, CheckCircle2 } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, currentKey, onSaveKey, model, onSaveModel }) {
  const [apiKey, setApiKey] = useState(currentKey || '');
  const [selectedModel, setSelectedModel] = useState(model || 'gemini-3.6-flash');
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      setStatusMsg('Please enter a valid API key or use pre-loaded offline demo.');
      return;
    }
    onSaveKey(apiKey.trim(), selectedModel);
    setStatusMsg('Saved! Active for live document extraction.');
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#101624] border border-[#1f293d] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1f293d]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">Gemini API Setup</h2>
              <p className="text-xs text-slate-400">Connect your free API key to analyze PDFs live</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="mt-5 space-y-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Steps to get your free API key:
          </h3>
          <ol className="space-y-2.5 text-xs sm:text-sm text-slate-300 list-decimal list-inside pl-1 leading-relaxed">
            <li>
              Open{' '}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer" 
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-mono"
              >
                aistudio.google.com/app/apikey <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>{' '}
              and sign in with your Google account.
            </li>
            <li>
              Click <span className="font-medium text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Create API key</span> &rarr; <span className="font-medium text-white bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Create API key in new project</span>.
            </li>
            <li>
              Copy the key (starts with <code className="text-cyan-300 font-mono">AIzaSy...</code>) and paste it below.
            </li>
          </ol>
        </div>

        {/* Input Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
              Gemini API Key
            </label>
            <input 
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Paste your AIzaSy... key here"
              className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1f293d] focus:border-cyan-500 focus:outline-none rounded-xl text-white font-mono text-sm placeholder-slate-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
              Model Selection (Free Tier Eligible)
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090d16] border border-[#1f293d] focus:border-cyan-500 focus:outline-none rounded-xl text-white text-sm"
            >
              <option value="gemini-3.6-flash">gemini-3.6-flash (Recommended by Google AI Studio)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option value="gemini-1.5-flash">gemini-1.5-flash</option>
            </select>
          </div>

          {statusMsg && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{statusMsg}</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-[#1f293d] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel / Use Offline Benchmark
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Apply Key</span>
          </button>
        </div>

      </div>
    </div>
  );
}
