import React, { useState } from 'react';
import { getCitations } from '../api';
import { Search, Loader2, Quote, AlertCircle, Copy, Check } from 'lucide-react';

export default function CitationEngine() {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(5);
  const [citations, setCitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setCitations([]);
    
    try {
      const data = await getCitations(query, limit);
      setCitations(data.citations);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Unauthorized: Please set your API Key in Settings.');
      } else {
        setError('An error occurred. Make sure the AIN Enterprise API is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex-col gap-6" style={{ display: 'flex' }}>
      <header style={{ marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Citation Engine</h1>
        <p>Query the Hybrid Citation Pipeline (Crossref + ArXiv) to find optimal semantic references for your claims.</p>
      </header>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleSearch} className="flex-col gap-4" style={{ display: 'flex' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Semantic Search Query</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Transformers in sequence modeling..."
                style={{ flex: 1 }}
              />
              <button 
                type="submit"
                className="btn-primary flex items-center gap-2" 
                disabled={loading || !query.trim()}
                style={{ opacity: (loading || !query.trim()) ? 0.6 : 1, minWidth: '140px', justifyContent: 'center' }}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                {loading ? 'Searching' : 'Search'}
              </button>
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Max Citations</label>
            <input 
              type="range" 
              min="1" max="15" 
              value={limit} 
              onChange={(e) => setLimit(e.target.value)}
              style={{ width: '200px', accentColor: 'var(--accent)' }}
            />
            <span style={{ marginLeft: '1rem', color: 'var(--text-primary)' }}>{limit} results</span>
          </div>
        </form>
      </div>

      {error && (
        <div className="glass-panel flex items-center gap-3" style={{ padding: '1rem 1.5rem', borderLeft: '4px solid var(--danger)' }}>
          <AlertCircle className="text-danger" size={24} color="var(--danger)" />
          <p style={{ color: 'var(--text-primary)', margin: 0 }}>{error}</p>
        </div>
      )}

      {citations.length > 0 && (
        <div className="flex-col gap-4" style={{ display: 'flex', marginTop: '1rem' }}>
          <h3 style={{ borderBottom: '1px solid var(--surface-border)', paddingBottom: '0.5rem' }}>Results</h3>
          
          {citations.map((cite, index) => (
            <div key={index} className="glass-panel flex gap-4" style={{ padding: '1.5rem', alignItems: 'flex-start' }}>
              <Quote size={24} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.25rem' }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.05rem' }}>{cite}</p>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '0.5rem', borderRadius: '50%' }}
                onClick={() => copyToClipboard(cite, index)}
                title="Copy to clipboard"
              >
                {copiedIndex === index ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
