import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import PaperChecker from './pages/PaperChecker';
import CitationEngine from './pages/CitationEngine';
import ResearchInquire from './pages/ResearchInquire';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('ain_api_key'));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Re-check api key occasionally or on mount
  React.useEffect(() => {
    const handleStorage = () => setApiKey(localStorage.getItem('ain_api_key'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!apiKey) {
    return (
      <SettingsModal 
        isOpen={true} 
        onClose={() => setApiKey(localStorage.getItem('ain_api_key'))} 
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<ResearchInquire />} />
            <Route path="/audit" element={<PaperChecker />} />
            <Route path="/citations" element={<CitationEngine />} />
          </Routes>
        </main>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => {
            setIsSettingsOpen(false);
            setApiKey(localStorage.getItem('ain_api_key'));
          }} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
