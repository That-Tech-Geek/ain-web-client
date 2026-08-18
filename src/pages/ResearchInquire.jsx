import React, { useState, useRef } from 'react';
import { inquireResearch } from '../api';
import { Search, Loader, CheckCircle, AlertCircle, Database, FlaskConical, GitBranch, Cpu } from 'lucide-react';

// ─── Sub-components ───────────────────────────────────────────────────────────

function PipelineStage({ icon: Icon, label, status }) {
  const colors = {
    idle:    { color: 'var(--text-muted)',    bg: 'rgba(100,116,139,0.1)' },
    running: { color: 'var(--accent)',        bg: 'rgba(59,130,246,0.15)' },
    done:    { color: 'var(--success)',       bg: 'rgba(16,185,129,0.15)' },
    error:   { color: 'var(--danger)',        bg: 'rgba(239,68,68,0.15)' },
  };
  const c = colors[status] || colors.idle;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
      padding: '1rem 1.25rem',
      background: c.bg,
      border: `1px solid ${c.color}44`,
      borderRadius: 'var(--radius-md)',
      transition: 'all 0.4s ease',
      minWidth: '110px',
    }}>
      <Icon size={22} style={{ color: c.color, transition: 'color 0.4s' }} />
      <span style={{ fontSize: '0.72rem', color: c.color, fontWeight: 600, letterSpacing: '0.04em', textAlign: 'center' }}>
        {label}
      </span>
    </div>
  );
}

function ResultCard({ result }) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle size={18} style={{ color: 'var(--success)' }} />
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>Pipeline Complete</span>
        </div>
        <span style={{
          background: 'rgba(16,185,129,0.15)', color: 'var(--success)',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: '999px', padding: '0.25rem 0.85rem', fontSize: '0.78rem', fontWeight: 600,
        }}>
          {result.status}
        </span>
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{result.message}</p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <MetricBadge label="Items Processed" value={result.results?.processed ?? 0} color="var(--accent)" />
        <MetricBadge label="Inquiry ID" value={result.inquiry_id?.slice(0, 8) + '…'} color="var(--text-muted)" />
      </div>
    </div>
  );
}

function MetricBadge({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--surface-border)',
      borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem',
    }}>
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const STAGES = [
  { id: 'scraper',    icon: Database,    label: 'Scraper' },
  { id: 'reviewer',  icon: FlaskConical, label: 'Reviewer' },
  { id: 'arbitrate', icon: GitBranch,    label: 'Arbitrator' },
  { id: 'belief',    icon: Cpu,          label: 'Belief Engine' },
];

// Stage timing simulation for visual feedback (ms delay before each stage lights up)
const STAGE_DELAYS = [200, 1800, 3500, 5200];

export default function ResearchInquire() {
  const [query, setQuery]       = useState('');
  const [maxResults, setMax]    = useState(5);
  const [loading, setLoading]   = useState(false);
  const [stages, setStages]     = useState({ scraper: 'idle', reviewer: 'idle', arbitrate: 'idle', belief: 'idle' });
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const timers                  = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const animateStages = (finalStatus = 'done') => {
    clearTimers();
    const stageIds = STAGES.map(s => s.id);
    stageIds.forEach((id, i) => {
      timers.current.push(setTimeout(() => {
        setStages(prev => ({ ...prev, [id]: i < stageIds.length - 1 ? 'running' : 'running' }));
      }, STAGE_DELAYS[i]));
    });
    // Complete them sequentially
    stageIds.forEach((id, i) => {
      timers.current.push(setTimeout(() => {
        setStages(prev => ({ ...prev, [id]: finalStatus }));
      }, STAGE_DELAYS[i] + 1200));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setError(null);
    setStages({ scraper: 'idle', reviewer: 'idle', arbitrate: 'idle', belief: 'idle' });

    animateStages('done');

    try {
      const data = await inquireResearch(query.trim(), maxResults);
      clearTimers();
      // Force all stages done on success
      setStages({ scraper: 'done', reviewer: 'done', arbitrate: 'done', belief: 'done' });
      setResult(data);
    } catch (err) {
      clearTimers();
      setStages({ scraper: 'error', reviewer: 'error', arbitrate: 'error', belief: 'error' });
      setError(err?.response?.data?.detail || err.message || 'Pipeline failed. Check API logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '860px', margin: '0 auto' }}>

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>
          Research Inquire
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '560px', lineHeight: 1.6 }}>
          Ask AIN a research question. The Evidence Intelligence Engine will scrape, review, arbitrate conflicts,
          and update its belief graph — giving you a traceable, epistemic answer.
        </p>
      </div>

      {/* ── Query Form ── */}
      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <label style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Research Question
        </label>
        <textarea
          className="input-field"
          rows={3}
          placeholder="e.g. What are the latest breakthroughs in transformer efficiency for long-context reasoning?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={loading}
          style={{ resize: 'vertical', minHeight: '80px', fontFamily: 'var(--font-sans)' }}
          id="research-query-input"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Max sources
            </label>
            <select
              value={maxResults}
              onChange={e => setMax(Number(e.target.value))}
              disabled={loading}
              className="input-field"
              style={{ width: '80px', padding: '0.5rem 0.75rem' }}
              id="research-max-results"
            >
              {[3, 5, 10, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <button
            type="submit"
            id="research-submit-btn"
            className="btn-primary"
            disabled={loading || !query.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
          >
            {loading ? <Loader size={16} className="spin" /> : <Search size={16} />}
            {loading ? 'Running Pipeline…' : 'Run Inquiry'}
          </button>
        </div>
      </form>

      {/* ── Pipeline Visualiser ── */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Evidence Pipeline
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <PipelineStage icon={s.icon} label={s.label} status={stages[s.id]} />
              {i < STAGES.length - 1 && (
                <div style={{ flex: 1, height: '2px', minWidth: '24px', background: 'var(--surface-border)', borderRadius: '1px' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Result ── */}
      {result && <ResultCard result={result} />}

      {/* ── Error ── */}
      {error && (
        <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', borderColor: 'rgba(239,68,68,0.3)' }}>
          <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '0.25rem' }}>Pipeline Error</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{error}</p>
          </div>
        </div>
      )}

    </div>
  );
}
