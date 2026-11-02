import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, Volume2, VolumeX, PlusCircle } from 'lucide-react';
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
    <header className="border-b border-[#3A0F34]/60 bg-[#140412]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link 
          to="/" 
          onClick={() => sound.playTypewriterClick()}
          className="flex items-center gap-3 group"
        >
          <div className="p-2 bg-[#EAAA00]/10 border border-[#EAAA00]/30 rounded-xl group-hover:border-[#EAAA00]/60 transition shadow-sm group-hover:shadow-[#EAAA00]/20">
            <ShieldAlert className="w-6 h-6 text-[#EAAA00] group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-[#DDE3E8] font-serif text-lg">AI MYSTERY ROOM</span>
              <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/30 rounded-full font-mono">
                CLASSIFIED
              </span>
            </div>
            <p className="text-[11px] text-[#DDE3E8]/60 font-mono tracking-wide">BUREAU OF FORENSIC DEDUCTION</p>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={muted ? "Unmute Audio Effects" : "Mute Audio Effects"}
            className="p-2 text-[#DDE3E8]/70 hover:text-[#EAAA00] bg-[#22071F]/80 border border-[#3A0F34] hover:border-[#EAAA00]/40 rounded-xl transition flex items-center gap-1.5 text-xs font-mono"
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-[#EAAA00]" />}
            <span className="hidden sm:inline">{muted ? "MUTED" : "SFX ON"}</span>
          </button>

          {/* New Case Button */}
          {location.pathname !== '/create' && (
            <Link
              to="/create"
              onClick={() => sound.playTypewriterClick()}
              className="px-4 py-2 bg-[#EAAA00] hover:bg-[#F5B81C] text-[#120310] font-bold text-xs tracking-wider uppercase rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-[#EAAA00]/15"
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
