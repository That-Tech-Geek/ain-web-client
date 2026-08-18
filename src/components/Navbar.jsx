import React from 'react';
import { NavLink } from 'react-router-dom';
import { Settings, BrainCircuit } from 'lucide-react';

export default function Navbar({ onOpenSettings }) {
  return (
    <nav className="glass-panel" style={navStyle}>
      <div className="container flex justify-between items-center" style={{ padding: '1rem 2rem' }}>
        <div className="flex items-center gap-2">
          <BrainCircuit size={28} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '1px' }}>AIN Client</span>
        </div>
        
        <div className="flex items-center gap-8">
          <NavLink to="/" style={({isActive}) => isActive ? activeLink : linkStyle}>Research Inquire</NavLink>
          <NavLink to="/audit" style={({isActive}) => isActive ? activeLink : linkStyle}>Paper Auditor</NavLink>
          <NavLink to="/citations" style={({isActive}) => isActive ? activeLink : linkStyle}>Citations</NavLink>
          
          <button className="btn-secondary flex items-center gap-2" onClick={onOpenSettings} style={{ padding: '0.5rem 1rem' }}>
            <Settings size={16} /> API Key
          </button>
        </div>
      </div>
    </nav>
  );
}

const navStyle = {
  borderRadius: 0,
  borderTop: 'none',
  borderLeft: 'none',
  borderRight: 'none',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const linkStyle = {
  color: 'var(--text-secondary)',
  fontWeight: 500,
  padding: '0.5rem 0',
  borderBottom: '2px solid transparent',
};

const activeLink = {
  ...linkStyle,
  color: 'var(--text-primary)',
  borderBottom: '2px solid var(--accent)',
};
