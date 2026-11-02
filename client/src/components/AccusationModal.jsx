import React, { useState } from 'react';
import { AlertTriangle, Lock, ShieldAlert, X } from 'lucide-react';
import { sound } from '../utils/audio';
import SuspectAvatar from './SuspectAvatar';

export default function AccusationModal({ 
  isOpen, 
  onClose, 
  suspects = [], 
  onSubmitAccusation, 
  isSubmitting 
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState('');
  const [reasoning, setReasoning] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedSuspectId) return;
    sound.playStampSound();
    onSubmitAccusation({ suspectId: selectedSuspectId, reasoning });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#1A0517] border-2 border-red-500/60 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Classified Banner */}
        <div className="bg-red-950/90 border-b border-red-900/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-red-200 tracking-wider font-serif">
                CONFRONTATION CHAMBER
              </h3>
              <p className="text-xs text-red-400 font-mono">
                CRIMINAL INDICTMENT & ARREST WARRANT
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTypewriterClick();
              onClose();
            }}
            className="text-[#DDE3E8]/60 hover:text-[#DDE3E8] p-1.5 rounded-lg hover:bg-[#2A0B27] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Warning Banner */}
          <div className="p-3.5 bg-[#EAAA00]/10 border border-[#EAAA00]/30 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#EAAA00] shrink-0 mt-0.5" />
            <div className="text-xs text-[#EAAA00] space-y-1">
              <p className="font-semibold">Irrevocable Action Warning</p>
              <p className="text-[#DDE3E8]/80">
                Submitting your indictment locks the crime scene, finalizes your detective score, and summons the judge. Choose carefully.
              </p>
            </div>
          </div>

          {/* Suspect Selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#DDE3E8] mb-3">
              1. Select the Prime Culprit:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
              {suspects.map((suspect) => {
                const isSelected = selectedSuspectId === suspect.id;
                return (
                  <div
                    key={suspect.id}
                    onClick={() => {
                      sound.playTypewriterClick();
                      setSelectedSuspectId(suspect.id);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                      isSelected 
                        ? 'border-red-500 bg-red-950/40 ring-1 ring-red-500/50' 
                        : 'border-[#3A0F34] bg-[#120310] hover:border-[#EAAA00]/40'
                    }`}
                  >
                    <SuspectAvatar
                      name={suspect.name}
                      avatarUrl={suspect.avatarUrl}
                      size="w-12 h-12"
                      textSize="text-sm"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-semibold text-sm text-[#DDE3E8] truncate">{suspect.name}</h4>
                      <p className="text-xs text-[#EAAA00] truncate font-mono">{suspect.occupation}</p>
                      <span className="text-[10px] text-[#DDE3E8]/60 block truncate mt-0.5">
                        Motive: {suspect.motive}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deduction Statement */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#DDE3E8] mb-2">
              2. Detective's Indictment Statement:
            </label>
            <textarea
              rows={3}
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="State the forensic contradiction or clue that shatters their alibi..."
              className="w-full bg-[#120310] border border-[#3A0F34] focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl p-3 text-sm text-[#DDE3E8] placeholder-[#DDE3E8]/30 focus:outline-none transition resize-none font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#3A0F34]">
            <button
              type="button"
              onClick={() => {
                sound.playTypewriterClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#DDE3E8]/60 hover:text-[#DDE3E8] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSuspectId || isSubmitting}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? "Issuing Warrant..." : "Execute Arrest Warrant"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
