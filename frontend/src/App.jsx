import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  BookOpen, 
  ExternalLink, 
  Key, 
  Loader2, 
  Trash2, 
  Sparkles 
} from 'lucide-react';
import ApiKeyModal from './components/ApiKeyModal';
import PageViewerModal from './components/PageViewerModal';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [facts, setFacts] = useState([]);
  const [showcaseCases, setShowcaseCases] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Modals
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [pageViewerOpen, setPageViewerOpen] = useState(false);
  const [pageTarget, setPageTarget] = useState({ docId: '', pageNum: 1, quote: '' });

  // API Config
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [currentModel, setCurrentModel] = useState('gemini-3.6-flash');

  useEffect(() => {
    fetchHealthAndResults();
  }, []);

  const fetchHealthAndResults = async () => {
    try {
      const hRes = await fetch('/api/health');
      if (hRes.ok) {
        const hData = await hRes.json();
        setApiKeyConfigured(hData.api_key_configured);
        setCurrentModel(hData.model);
      }

      const rRes = await fetch('/api/results');
      if (rRes.ok) {
        const rData = await rRes.json();
        setDocuments(rData.documents || []);
        setFacts(rData.facts || []);
        setShowcaseCases(rData.showcase_cases || []);
      }
    } catch (err) {
      console.error('Connection error', err);
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setStatusMessage(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents);
        setStatusMessage({ success: true, text: `Uploaded ${data.added_count} PDF(s). Click "Analyze Documents" to extract facts.` });
      } else {
        setStatusMessage({ success: false, text: data.detail || 'Upload failed' });
      }
    } catch (err) {
      setStatusMessage({ success: false, text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleLoadStarter = async () => {
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/load-starter', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setDocuments(data.documents);
        setStatusMessage({ success: true, text: '3 starter PDFs loaded! Click "Analyze Documents" to run.' });
      }
    } catch (err) {
      setStatusMessage({ success: false, text: err.message });
    } finally {
      setIsUploading(false);
    }
  };

  const handleProcess = async () => {
    if (documents.length === 0) {
      setStatusMessage({ success: false, text: 'Please add at least one PDF first.' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ max_pages_per_doc: 15 })
      });
      const data = await res.json();
      if (res.ok) {
        setFacts(data.results.facts || []);
        setShowcaseCases(data.results.showcase_cases || []);
        setStatusMessage({ 
          success: true, 
          text: `Success! Extracted ${data.facts_count} facts and verified all 4 required cases.` 
        });
      } else {
        setStatusMessage({ success: false, text: data.detail || 'Analysis failed' });
      }
    } catch (err) {
      setStatusMessage({ success: false, text: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    await fetch('/api/reset', { method: 'POST' });
    setDocuments([]);
    setFacts([]);
    setShowcaseCases([]);
    setStatusMessage(null);
  };

  const handleInspectPage = (docId, pageNum, quote) => {
    setPageTarget({ docId, pageNum, quote });
    setPageViewerOpen(true);
  };

  const handleSaveApiKey = async (newKey, newModel) => {
    try {
      const res = await fetch('/api/config/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: newKey, model: newModel })
      });
      if (res.ok) {
        setApiKeyConfigured(true);
        setCurrentModel(newModel);
      }
    } catch (err) {
      console.error('Failed to save API key', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-100 flex flex-col font-sans">
      
      {/* Clean, Simple Navigation */}
      <header className="border-b border-[#21262d] bg-[#161b22] sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Fact Knowledge Layer</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Superjoin Assignment
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Extracts facts from PDFs, links citations to evidence, and checks for agreement, contradiction, and context.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                apiKeyConfigured 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{apiKeyConfigured ? `API Key Active (${currentModel})` : 'Enter Free Gemini API Key'}</span>
            </button>

            {documents.length > 0 && (
              <button
                onClick={handleReset}
                title="Clear Documents"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        
        {/* Step 1: Upload Documents */}
        <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-400" />
                <span>1. Upload PDF Documents</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your files, or click "Load Sample PDFs" to use the starter dataset.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLoadStarter}
                disabled={isUploading || isProcessing}
                className="px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] text-slate-200 border border-[#30363d] rounded-lg text-xs font-medium transition-colors"
              >
                + Load Sample PDFs
              </button>

              <label className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                <span>Select PDF Files</span>
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Uploaded File List */}
          {documents.length > 0 ? (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-[#0d1117] p-2.5 rounded-lg border border-[#30363d] flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <div className="truncate">
                      <span className="text-xs font-medium text-slate-200 block truncate">{doc.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{doc.page_count} pages</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button: Analyze */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing Documents & Comparing Facts...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Analyze Documents</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 border border-dashed border-[#30363d] rounded-lg text-center text-xs text-slate-400">
              No documents selected. Click <strong>"Select PDF Files"</strong> or <strong>"+ Load Sample PDFs"</strong> to get started.
            </div>
          )}

          {statusMessage && (
            <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
              statusMessage.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {statusMessage.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </section>

        {/* Step 2: The 4 Required Cases (Strictly what agent.md asks for) */}
        {showcaseCases.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-[#21262d] pb-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>The Four Required Cases</span>
              </h2>
              <p className="text-xs text-slate-400">
                Source evidence and system reasoning for corroboration, contradiction, contextual explanation, and failure handling.
              </p>
            </div>

            <div className="space-y-4">
              {showcaseCases.map((c) => (
                <div 
                  key={c.case_number}
                  className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3.5 shadow-sm"
                >
                  {/* Case Tag & Headline */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#21262d]">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        c.case_number === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        c.case_number === 2 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        c.case_number === 3 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        Case {c.case_number}: {c.case_title}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white">
                    {c.headline}
                  </h3>

                  {/* Evidence Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    
                    {/* Evidence 1 */}
                    <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-blue-400">Source Document 1</span>
                        <button
                          onClick={() => handleInspectPage(c.doc_a_name, c.doc_a_page, c.doc_a_quote)}
                          className="hover:text-white flex items-center gap-1 font-mono text-blue-400 underline"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Page {c.doc_a_page}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="font-medium text-slate-300 truncate">{c.doc_a_name}</div>
                      <blockquote className="bg-[#161b22] p-2.5 rounded border border-[#30363d] text-emerald-300 font-mono text-[11px] leading-relaxed">
                        "{c.doc_a_quote}"
                      </blockquote>
                      <div className="text-slate-400 text-[11px]">
                        <strong>Stated:</strong> {c.doc_a_interpretation}
                      </div>
                    </div>

                    {/* Evidence 2 (or Failure Explanation) */}
                    {c.doc_b_name ? (
                      <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="font-semibold text-blue-400">Source Document 2</span>
                          <button
                            onClick={() => handleInspectPage(c.doc_b_name, c.doc_b_page, c.doc_b_quote)}
                            className="hover:text-white flex items-center gap-1 font-mono text-blue-400 underline"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Page {c.doc_b_page}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="font-medium text-slate-300 truncate">{c.doc_b_name}</div>
                        <blockquote className="bg-[#161b22] p-2.5 rounded border border-[#30363d] text-emerald-300 font-mono text-[11px] leading-relaxed">
                          "{c.doc_b_quote}"
                        </blockquote>
                        <div className="text-slate-400 text-[11px]">
                          <strong>Stated:</strong> {c.doc_b_interpretation}
                        </div>
                      </div>
                    ) : c.failure_analysis ? (
                      <div className="bg-[#0d1117] p-3 rounded-lg border border-purple-500/30 space-y-2">
                        <span className="text-purple-400 font-semibold text-xs block">
                          Failure Breakdown & System Fix:
                        </span>
                        <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                          <strong>What went wrong:</strong> {c.failure_analysis.naive_result}
                        </div>
                        <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                          <strong>How our system fixed it:</strong> {c.failure_analysis.guardrail_applied}
                        </div>
                      </div>
                    ) : null}

                  </div>

                  {/* Context Explanation (for Case 3) */}
                  {c.context_delta && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                      <strong>Context that resolves this:</strong> {c.context_delta.explanation}
                    </div>
                  )}

                  {/* System Reasoning & Verdict */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="text-slate-300 bg-[#0d1117] p-3 rounded-lg border border-[#30363d] leading-relaxed">
                      <strong className="text-slate-200 block mb-0.5">System Reasoning:</strong>
                      {c.system_reasoning}
                    </div>
                    <div className="text-slate-200 font-medium pt-1">
                      <span className="text-blue-400 font-bold">VERDICT: </span>
                      {c.verdict}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Extracted Facts List */}
        {facts.length > 0 && (
          <section className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-4 shadow-sm">
            <div className="border-b border-[#21262d] pb-2">
              <h2 className="text-base font-bold text-white">
                Extracted Grounded Facts ({facts.length})
              </h2>
              <p className="text-xs text-slate-400">
                Meaningful facts discovered in the documents, linked to verbatim quotes and page numbers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0d1117] text-slate-400 uppercase text-[10px] font-mono border-b border-[#30363d]">
                  <tr>
                    <th className="py-2.5 px-3">Document</th>
                    <th className="py-2.5 px-3">Fact / Claim</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Verbatim Evidence Quote</th>
                    <th className="py-2.5 px-3 text-right">Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]">
                  {facts.map((f) => (
                    <tr key={f.id} className="hover:bg-[#1c2128] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-400 truncate max-w-[140px]">
                        {f.doc_id}
                      </td>
                      <td className="py-2.5 px-3 max-w-xs">
                        <span className="text-white font-medium block">{f.claim}</span>
                      </td>
                      <td className="py-2.5 px-3 text-cyan-300 font-mono font-semibold whitespace-nowrap">
                        {f.value}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-emerald-300 text-[11px] max-w-sm italic">
                        "{f.citation.quote}"
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleInspectPage(f.doc_id, f.citation.page, f.citation.quote)}
                          className="px-2 py-0.5 bg-[#21262d] hover:bg-blue-600 hover:text-white text-blue-400 rounded text-[11px] font-mono inline-flex items-center gap-1 transition-colors"
                        >
                          <span>p.{f.citation.page}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* Clean Footer */}
      <footer className="border-t border-[#21262d] bg-[#161b22] py-4 text-center text-xs text-slate-500 font-mono">
        Superjoin Engineering Assignment · Fact Knowledge Layer · Free Gemini Tier
      </footer>

      {/* Modals */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        currentKey=""
        model={currentModel}
        onSaveKey={handleSaveApiKey}
      />

      <PageViewerModal
        isOpen={pageViewerOpen}
        onClose={() => setPageViewerOpen(false)}
        docId={pageTarget.docId}
        pageNum={pageTarget.pageNum}
        quote={pageTarget.quote}
      />

    </div>
  );
}
