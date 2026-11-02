import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Volume2, VolumeX, FolderSearch, PlusCircle } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar() {
  const location = useLocation();
  const [muted, setMuted] = useState(sound.muted);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setMuted(isMuted);
    if (!isMuted) {
      sound.playTypewriterClick();
    }
  };

  return (
    <header className="border-b border-amber-900/30 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link 
          to="/" 
          onClick={() => sound.playTypewriterClick()}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg group-hover:border-amber-500/60 transition">
            <ShieldAlert className="w-6 h-6 text-amber-400 group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-slate-100 font-serif text-lg">AI MYSTERY ROOM</span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-red-950/80 text-red-400 border border-red-800/40 rounded font-mono">
                TOP SECRET
              </span>
            </div>
            <p className="text-xs text-amber-500/70 font-mono tracking-wide">BUREAU OF INVESTIGATIVE PUZZLES</p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={muted ? "Unmute Audio Effects" : "Mute Audio Effects"}
            className="p-2 text-slate-400 hover:text-amber-400 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-lg transition flex items-center gap-1.5 text-xs font-mono"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span className="hidden sm:inline">{muted ? "MUTED" : "SFX ON"}</span>
          </button>

          {/* New Case Button */}
          {location.pathname !== '/create' && (
            <Link
              to="/create"
              onClick={() => sound.playTypewriterClick()}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wider uppercase rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/10"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Launch Case</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
