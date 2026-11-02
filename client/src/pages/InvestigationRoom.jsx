import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  User, 
  Eye, 
  Lock, 
  Unlock, 
  FileEdit, 
  CheckCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { sound } from '../utils/audio';
import AccusationModal from '../components/AccusationModal';
import SuspectAvatar from '../components/SuspectAvatar';

export default function InvestigationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Detective field notes (persisted to localStorage)
  const [notes, setNotes] = useState('');
  
  // Accusation modal state
  const [isAccuseOpen, setIsAccuseOpen] = useState(false);
  const [isSubmittingAccusation, setIsSubmittingAccusation] = useState(false);

  // Hint unlocking state
  const [isUnlockingHint, setIsUnlockingHint] = useState(false);

  useEffect(() => {
    fetchCaseDetails();
    const savedNotes = localStorage.getItem(`notes_${id}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [id]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
    localStorage.setItem(`notes_${id}`, e.target.value);
  };

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/cases/${id}`);
      if (res.data?.success) {
        setCaseData(res.data.case);
        if (res.data.case.playerProgress?.status !== 'in-progress') {
          navigate(`/cases/${id}/result`);
        }
      } else {
        setError('Case not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  // Discover Clue Action (+5 pts)
  const handleDiscoverClue = async (clueId) => {
    try {
      sound.playClueChime();
      const res = await axios.post(`/api/cases/${id}/clues/${clueId}/discover`);
      if (res.data?.success) {
        setCaseData(prev => ({
          ...prev,
          playerProgress: {
            ...prev.playerProgress,
            currentScore: res.data.currentScore,
            cluesDiscoveredCount: res.data.cluesDiscoveredCount
          },
          clues: prev.clues.map(c => c.id === clueId ? res.data.clue : c)
        }));
      }
    } catch (err) {
      console.error('Failed to discover clue:', err);
    }
  };

  // Request Hint Action (-10 pts)
  const handleRequestHint = async () => {
    if (isUnlockingHint) return;
    try {
      setIsUnlockingHint(true);
      sound.playTypewriterClick();
      const res = await axios.post(`/api/cases/${id}/hints`);
      if (res.data?.success) {
        setCaseData(prev => ({
          ...prev,
          playerProgress: {
            ...prev.playerProgress,
            currentScore: res.data.currentScore,
            hintsUsedCount: res.data.hintsUsedCount
          },
          hints: prev.hints.map(h => h.id === res.data.hint.id ? res.data.hint : h)
        }));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'No further hints available');
    } finally {
      setIsUnlockingHint(false);
    }
  };

  // Submit Accusation
  const handleSubmitAccusation = async ({ suspectId, reasoning }) => {
    try {
      setIsSubmittingAccusation(true);
      const res = await axios.post(`/api/cases/${id}/accuse`, { suspectId, reasoning });
      if (res.data?.success) {
        if (res.data.verdict?.isCorrect) {
          sound.playVictoryFanfare();
        } else {
          sound.playDefeatSound();
        }
        navigate(`/cases/${id}/result`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Accusation submission error');
    } finally {
      setIsSubmittingAccusation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#EAAA00] border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-sm text-[#EAAA00]">Opening classified crime docket...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-2xl bg-red-950/40 border border-red-800 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold font-serif text-[#DDE3E8]">Case Inaccessible</h2>
        <p className="text-sm text-[#DDE3E8]/80 font-mono">{error || "Record missing or archived."}</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-[#2D0B28] hover:bg-[#3D1037] text-xs font-mono uppercase rounded-lg text-[#EAAA00] border border-[#EAAA00]/30"
        >
          Return to Headquarters
        </button>
      </div>
    );
  }

  const discoveredCluesCount = caseData.clues?.filter(c => c.discovered).length || 0;
  const totalClues = caseData.clues?.length || 0;
  const unlockedHintsCount = caseData.hints?.filter(h => h.unlocked).length || 0;
  const totalHints = caseData.hints?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top HUD Bar */}
      <div className="sticky top-16 z-30 bg-[#160414]/95 backdrop-blur-md border border-[#3A0F34] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        
        {/* Case Title & Badges */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#EAAA00]/10 text-[#EAAA00] border border-[#EAAA00]/30">
              {caseData.difficulty} TIER
            </span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#3A0F34]/80 text-[#DDE3E8]">
              {caseData.theme}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold font-serif text-[#DDE3E8] truncate max-w-lg">
            {caseData.title}
          </h1>
        </div>

        {/* Live Metrics & Accuse CTA */}
        <div className="flex items-center gap-4 sm:gap-6">
          
          {/* Clues Discovered */}
          <div className="text-center">
            <span className="text-[10px] text-[#DDE3E8]/60 font-mono block">CLUES FOUND</span>
            <span className="text-base sm:text-lg font-bold font-mono text-[#EAAA00]">
              {discoveredCluesCount} / {totalClues}
            </span>
          </div>

          {/* Current Score */}
          <div className="text-center px-4 py-1.5 bg-[#0F020E] rounded-xl border border-[#EAAA00]/40 shadow-inner">
            <span className="text-[10px] text-[#DDE3E8]/60 font-mono block">CURRENT SCORE</span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#EAAA00]">
              {caseData.playerProgress?.currentScore || 0} <span className="text-xs text-[#DDE3E8]/60 font-normal">pts</span>
            </span>
          </div>

          {/* Accuse CTA */}
          <button
            onClick={() => {
              sound.playStampSound();
              setIsAccuseOpen(true);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-600/30 flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Accuse Suspect</span>
          </button>
        </div>
      </div>

      {/* Crime Scene Dossier Memo */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-[#1D061A]/80 border border-[#3A0F34] shadow-xl overflow-hidden">
        <div className="absolute top-4 right-6 pointer-events-none opacity-20 sm:opacity-30">
          <div className="confidential-stamp text-xs sm:text-sm px-3 py-1">
            CONFIDENTIAL FILE
          </div>
        </div>

        <div className="space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#EAAA00]">
            <div className="flex items-center gap-1.5 bg-[#120310] px-3 py-1.5 rounded-lg border border-[#3A0F34]">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>Location: {caseData.crimeScene?.location}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#120310] px-3 py-1.5 rounded-lg border border-[#3A0F34]">
              <Clock className="w-4 h-4 text-[#EAAA00]" />
              <span>Time: {caseData.crimeScene?.time}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#120310] px-3 py-1.5 rounded-lg border border-[#3A0F34]">
              <User className="w-4 h-4 text-[#DDE3E8]" />
              <span>Victim: {caseData.victim?.name}</span>
            </div>
          </div>

          <h2 className="text-xl font-bold font-serif text-[#DDE3E8]">
            Official Crime Scene Briefing
          </h2>

          <p className="text-sm text-[#DDE3E8]/85 leading-relaxed font-sans">
            {caseData.storyBriefing}
          </p>

          <p className="text-xs text-[#DDE3E8]/60 font-mono italic">
            Victim Profile: {caseData.victim?.details}
          </p>
        </div>
      </div>

      {/* Main Investigation Split: Suspects & Clues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Suspects Lineup & Clue Board */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Suspect Lineup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-[#DDE3E8] flex items-center gap-2">
                <span>Suspect Lineup & Interrogations</span>
                <span className="text-xs font-mono text-[#EAAA00] font-normal">
                  ({caseData.suspects?.length} Persons of Interest)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.suspects?.map((suspect) => (
                <div
                  key={suspect.id}
                  className="rounded-2xl border border-[#3A0F34] bg-[#1A0517]/70 p-5 space-y-4 hover:border-[#EAAA00]/40 transition shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <SuspectAvatar
                      name={suspect.name}
                      avatarUrl={suspect.avatarUrl}
                      size="w-16 h-16"
                    />
                    <div className="space-y-1 overflow-hidden flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A0B27] text-[#DDE3E8]/80">
                          {suspect.id}
                        </span>
                        <span className="text-[10px] font-mono text-[#EAAA00] truncate max-w-[180px]">
                          {suspect.demeanor}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-[#DDE3E8] truncate">{suspect.name}</h4>
                      <p className="text-xs text-[#EAAA00]/90 font-mono truncate">{suspect.occupation}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-sans border-t border-[#3A0F34] pt-3">
                    <div>
                      <span className="font-mono text-[#DDE3E8]/60 block text-[10px] uppercase">Stated Alibi:</span>
                      <p className="text-[#DDE3E8]/90 italic bg-[#120310] p-2 rounded-lg mt-0.5 border border-[#3A0F34]/50">
                        "{suspect.alibi}"
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[#DDE3E8]/60 block text-[10px] uppercase">Suspected Motive:</span>
                      <p className="text-[#DDE3E8]/90 bg-[#120310] p-2 rounded-lg mt-0.5 border border-[#3A0F34]/50">
                        {suspect.motive}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Clue Board */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-[#DDE3E8] flex items-center gap-2">
                <span>Interactive Forensic Evidence Pinboard</span>
                <span className="text-xs font-mono text-[#EAAA00]">
                  (+5 pts per discovery)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.clues?.map((clue, idx) => {
                if (clue.discovered) {
                  return (
                    /* Discovered Clue Card */
                    <div
                      key={clue.id}
                      className="p-5 rounded-2xl border border-[#EAAA00]/50 bg-[#250921]/70 space-y-2 shadow-lg transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3A0F34] text-[#EAAA00] border border-[#EAAA00]/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#EAAA00]" />
                          <span>EXAMINED</span>
                        </span>
                        <span className="text-xs font-mono text-[#EAAA00] font-bold">+5 PTS</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#DDE3E8] font-serif">{clue.title}</h4>
                      <p className="text-xs text-[#DDE3E8]/80 leading-relaxed font-sans">{clue.description}</p>
                    </div>
                  );
                }

                /* Sealed / Undiscovered Clue Card */
                return (
                  <div
                    key={clue.id}
                    onClick={() => handleDiscoverClue(clue.id)}
                    className="group cursor-pointer p-5 rounded-2xl border-2 border-dashed border-[#3A0F34] hover:border-[#EAAA00]/70 bg-[#160414]/60 hover:bg-[#20071C] transition space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2D0B28] text-[#DDE3E8]/70 group-hover:text-[#EAAA00] transition">
                          EVIDENCE PACKET #{idx + 1}
                        </span>
                        <span className="text-xs font-mono text-[#DDE3E8]/50 group-hover:text-[#EAAA00] transition flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5" />
                          <span>SEALED</span>
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-[#DDE3E8]/70 group-hover:text-[#DDE3E8] font-serif transition">
                        Classified Forensic Envelope
                      </h4>
                      <p className="text-xs text-[#DDE3E8]/50 font-mono">
                        Contains physical traces, forensic pathology, or physical logs collected at the scene.
                      </p>
                    </div>

                    <div className="pt-2">
                      <span className="w-full py-2 bg-[#120310] group-hover:bg-[#EAAA00] group-hover:text-[#120310] text-[#DDE3E8] border border-[#3A0F34] group-hover:border-[#EAAA00] font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Break Seal (+5 pts)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Hints & Detective Journal */}
        <div className="space-y-8">
          
          {/* Classified Hint Terminal */}
          <div className="p-6 rounded-3xl border border-[#3A0F34] bg-[#1A0517]/80 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#EAAA00]" />
                <h3 className="font-bold text-base font-serif text-[#DDE3E8]">Hint Safe</h3>
              </div>
              <span className="text-xs font-mono text-[#DDE3E8]/60">
                {unlockedHintsCount} / {totalHints} Unlocked
              </span>
            </div>

            <p className="text-xs text-[#DDE3E8]/70 font-mono">
              Requesting assistance incurs a <strong>-10 point</strong> penalty per hint.
            </p>

            <div className="space-y-3">
              {caseData.hints?.map((hint) => (
                <div
                  key={hint.id}
                  className={`p-3.5 rounded-xl border text-xs font-mono transition ${
                    hint.unlocked 
                      ? 'border-[#EAAA00]/40 bg-[#2D0B28]/60 text-[#EAAA00]' 
                      : 'border-[#3A0F34] bg-[#120310] text-[#DDE3E8]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold uppercase tracking-wider text-[10px]">
                      Hint #{hint.order}
                    </span>
                    {hint.unlocked ? (
                      <span className="text-[10px] text-[#EAAA00] font-bold flex items-center gap-1">
                        <Unlock className="w-3 h-3" />
                        UNLOCKED
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#DDE3E8]/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        LOCKED
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {hint.text}
                  </p>
                </div>
              ))}
            </div>

            {unlockedHintsCount < totalHints && (
              <button
                disabled={isUnlockingHint}
                onClick={handleRequestHint}
                className="w-full py-2.5 bg-[#EAAA00]/10 hover:bg-[#EAAA00]/20 border border-[#EAAA00]/30 hover:border-[#EAAA00]/50 text-[#EAAA00] font-mono text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>{isUnlockingHint ? "Decrypting..." : "Request Next Hint (-10 pts)"}</span>
              </button>
            )}
          </div>

          {/* Detective Field Notebook */}
          <div className="p-6 rounded-3xl border border-[#3A0F34] bg-[#1A0517]/80 space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-[#EAAA00]" />
              <h3 className="font-bold text-base font-serif text-[#DDE3E8]">Detective Field Journal</h3>
            </div>
            
            <p className="text-xs text-[#DDE3E8]/60 font-mono">
              Your confidential scratchpad. Automatically auto-saves hypotheses locally in your browser.
            </p>

            <textarea
              rows={6}
              value={notes}
              onChange={handleNotesChange}
              placeholder="Record contradictions, verify alibi timestamps, or note suspicious behavior..."
              className="w-full bg-[#120310] border border-[#3A0F34] focus:border-[#EAAA00] rounded-xl p-3 text-xs text-[#DDE3E8] placeholder-[#DDE3E8]/30 focus:outline-none transition resize-none font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Confrontation Accusation Modal */}
      <AccusationModal
        isOpen={isAccuseOpen}
        onClose={() => setIsAccuseOpen(false)}
        suspects={caseData.suspects}
        onSubmitAccusation={handleSubmitAccusation}
        isSubmitting={isSubmittingAccusation}
      />
    </div>
  );
}
