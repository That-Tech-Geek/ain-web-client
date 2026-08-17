import React, { useState, useEffect } from 'react';
import { Key, X, Loader2, LogOut, Mail } from 'lucide-react';
import { signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { login } from '../api';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('ain_api_key');
    if (saved) setApiKey(saved);
  }, []);

  if (!isOpen) return null;

  const handleAuthResult = async (result) => {
    const idToken = await result.user.getIdToken();
    const data = await login(idToken);
    const newApiKey = data.api_key;
    localStorage.setItem('ain_api_key', newApiKey);
    setApiKey(newApiKey);
    onClose();
  };

  const handleEmailSignIn = async (isRegister) => {
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let result;
      if (isRegister) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      await handleAuthResult(result);
    } catch (err) {
      console.error(err);
      setError('Auth failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('ain_api_key');
    setApiKey('');
  };

  return (
    <div style={overlayStyle}>
      <div className="glass-panel" style={modalStyle}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h2 className="flex items-center gap-2">
            <Key size={20} className="text-accent" /> API Authentication
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        
        <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
          Securely authenticate to provision your dynamic AIN Enterprise API key.
        </p>

        {error && (
          <div style={{ marginBottom: '1rem', color: 'var(--danger)', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '4px' }}>
            {error}
          </div>
        )}
        
        {apiKey ? (
          <div className="flex-col gap-4" style={{ display: 'flex' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: 'var(--success)', fontWeight: 500 }}>Authenticated Successfully</p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>
                Active Key: {apiKey.substring(0, 15)}...
              </p>
            </div>
            
            <button className="btn-secondary flex items-center justify-center gap-2" onClick={handleLogout}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        ) : (
          <div className="flex-col gap-4" style={{ display: 'flex' }}>
            <div className="flex-col gap-3" style={{ display: 'flex', marginBottom: '0.5rem' }}>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                className="input-field" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex gap-2">
                <button 
                  className="btn-primary flex-1 flex items-center justify-center gap-2" 
                  onClick={() => handleEmailSignIn(false)}
                  disabled={loading}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />} Login
                </button>
                <button 
                  className="btn-secondary flex-1" 
                  onClick={() => handleEmailSignIn(true)}
                  disabled={loading}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle = {
  padding: '2rem',
  width: '100%',
  maxWidth: '450px',
};
