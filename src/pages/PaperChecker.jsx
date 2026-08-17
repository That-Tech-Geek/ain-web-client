import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { checkPaper } from '../api';
import { FileSearch, Loader2, AlertCircle } from 'lucide-react';

export default function PaperChecker() {
  const [text, setText] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setReport(null);
    
    try {
      const data = await checkPaper(text);
      setReport(data.report);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please set your API Key in Settings.');
      } else {
        setError('An error occurred during analysis. Make sure the API is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-col gap-6" style={{ display: 'flex' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Paper Auditor</h1>
        <p>Run a comprehensive plagiarism check and semantic citation audit on your research draft.</p>
      </header>

      <div className="glass-panel" style={{ padding: '1px' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your draft research paper here..."
          style={{
            width: '100%',
            minHeight: '300px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            padding: '1.5rem',
            resize: 'vertical',
            outline: 'none',
            fontSize: '1rem',
            lineHeight: 1.6
          }}
        />
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {text.length} characters
          </span>
          <button 
            className="btn-primary flex items-center gap-2" 
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            style={{ opacity: (loading || !text.trim()) ? 0.6 : 1 }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <FileSearch size={18} />}
            {loading ? 'Analyzing Draft...' : 'Run Audit'}
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel flex items-center gap-3" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--danger)' }}>
          <AlertCircle className="text-danger" size={24} color="var(--danger)" />
          <p style={{ color: 'var(--text-primary)', margin: 0 }}>{error}</p>
        </div>
      )}

      {report && (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Audit Report</h2>
          <div className="markdown-body" style={{ color: 'var(--text-primary)' }}>
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        </div>
      )}
      
      {/* Inline styles for markdown specifically */}
      <style>{`
        .markdown-body h1, .markdown-body h2, .markdown-body h3 { margin-top: 1.5em; margin-bottom: 0.5em; }
        .markdown-body p { margin-bottom: 1em; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.5em; margin-bottom: 1em; }
        .markdown-body li { margin-bottom: 0.25em; color: var(--text-secondary); }
        .markdown-body strong { color: var(--text-primary); }
        .markdown-body blockquote { border-left: 4px solid var(--accent); padding-left: 1em; color: var(--text-muted); }
      `}</style>
    </div>
  );
}
