import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateMystery from './pages/CreateMystery';
import InvestigationRoom from './pages/InvestigationRoom';
import Results from './pages/Results';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMystery />} />
            <Route path="/cases/:id" element={<InvestigationRoom />} />
            <Route path="/cases/:id/result" element={<Results />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500 font-mono space-y-1">
          <p>© 2026 AI MYSTERY ROOM — Autonomous Detective Protocol</p>
          <p className="text-slate-600">Engineered with React 19, Tailwind CSS, Express, MongoDB, & Google Gemini</p>
        </footer>
      </div>
    </Router>
  );
}
