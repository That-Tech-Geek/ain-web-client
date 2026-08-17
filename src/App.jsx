import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SettingsModal from './components/SettingsModal';
import PaperChecker from './pages/PaperChecker';
import CitationEngine from './pages/CitationEngine';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="container">
          <Routes>
            <Route path="/" element={<PaperChecker />} />
            <Route path="/citations" element={<CitationEngine />} />
          </Routes>
        </main>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
