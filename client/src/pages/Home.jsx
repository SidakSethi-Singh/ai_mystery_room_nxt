import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Compass, 
  Award, 
  ChevronRight, 
  FolderLock, 
  FileText,
  Skull
} from 'lucide-react';
import { sound } from '../utils/audio';

const PRESETS = [
  {
    title: "The Stolen Stradivarius",
    premise: "A priceless violin vanishes from a sealed VIP parlor at the Vienna Opera House during a blackout.",
    difficulty: "Easy",
    theme: "Classic Noir",
    badge: "3 Suspects • 5 Clues",
    color: "from-[#2A0A25] to-[#140412]"
  },
  {
    title: "Cyanide in Silicon Valley",
    premise: "A ruthless neuro-tech CEO is fatally poisoned during a private IPO celebratory toast.",
    difficulty: "Medium",
    theme: "Modern Thriller",
    badge: "4 Suspects • 7 Clues",
    color: "from-[#330D2E] to-[#140412]"
  },
  {
    title: "The Orient Express Phantom",
    premise: "A high-ranking diplomat carrying peace treaties is murdered in a snowbound railway car locked from inside.",
    difficulty: "Hard",
    theme: "Agatha Christie Mystery",
    badge: "5 Suspects • 9 Clues",
    color: "from-[#3D0F37] to-[#140412]"
  }
];

export default function Home() {
  const navigate = useNavigate();
  const [recentCases, setRecentCases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRecentCases();
  }, []);

  const fetchRecentCases = async () => {
    try {
      const res = await axios.get('/api/cases');
      if (res.data?.success) {
        setRecentCases(res.data.cases || []);
      }
    } catch {
      // Graceful fallback
    }
  };

  const launchPreset = async (preset) => {
    sound.playTypewriterClick();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/cases', {
        premise: preset.premise,
        difficulty: preset.difficulty,
        theme: preset.theme
      });
      if (res.data?.success) {
        navigate(`/cases/${res.data.case._id || res.data.case.id}`);
      }
    } catch (err) {
      console.error('Failed to launch preset:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Section */}
      <div className="relative rounded-3xl border border-[#3A0F34] bg-gradient-to-b from-[#250821]/90 to-[#120310] p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Atmospheric Aubergine & Marigold background blooms */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[450px] h-[450px] bg-[#EAAA00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-[450px] h-[450px] bg-[#3A0F34]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EAAA00]/10 border border-[#EAAA00]/30 rounded-full text-[#EAAA00] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Murder Mystery Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-[#DDE3E8] leading-tight">
            Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EAAA00] via-[#FFD050] to-[#EAAA00]">Crime Scene</span>. Solve the Unsolved.
          </h1>

          <p className="text-base sm:text-lg text-[#DDE3E8]/80 leading-relaxed font-sans">
            Every case is generated dynamically on demand by Google Gemini. Investigate suspect alibis, break forensic seals on the evidence board, request classified hints, and unmask the culprit before they escape.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/create"
              onClick={() => sound.playTypewriterClick()}
              className="px-7 py-3.5 bg-gradient-to-r from-[#EAAA00] to-[#D49800] hover:from-[#F5B81C] hover:to-[#EAAA00] text-[#120310] font-bold text-sm tracking-wider uppercase rounded-xl transition shadow-xl shadow-[#EAAA00]/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Commission New Case</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href="#case-presets"
              className="px-6 py-3.5 bg-[#20071C] hover:bg-[#2C0B27] border border-[#3A0F34] hover:border-[#EAAA00]/40 text-[#DDE3E8] font-semibold text-sm tracking-wide rounded-xl transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Classified Presets</span>
            </a>
          </div>
        </div>
      </div>

      {/* Feature Pillar Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#1B0517]/80 border border-[#3A0F34] hover:border-[#EAAA00]/40 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAAA00]/10 border border-[#EAAA00]/30 flex items-center justify-center text-[#EAAA00]">
            <FolderLock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-[#DDE3E8] font-serif text-base">Zero-Leak Backend Security</h3>
          <p className="text-xs text-[#DDE3E8]/70 leading-relaxed font-mono">
            The culprit, motive, and critical clue remain strictly quarantined on the server. Inspecting browser networks will never leak the answer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1B0517]/80 border border-[#3A0F34] hover:border-[#EAAA00]/40 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#3A0F34] border border-[#EAAA00]/30 flex items-center justify-center text-[#EAAA00]">
            <Skull className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-[#DDE3E8] font-serif text-base">Airtight Gemini Reasoning</h3>
          <p className="text-xs text-[#DDE3E8]/70 leading-relaxed font-mono">
            Powered by Gemini with Zod validation. Each case delivers realistic alibis, consistent timelines, and forensic evidence pointing only to the true killer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#1B0517]/80 border border-[#3A0F34] hover:border-[#EAAA00]/40 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EAAA00]/10 border border-[#EAAA00]/30 flex items-center justify-center text-[#EAAA00]">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-[#DDE3E8] font-serif text-base">Authoritative Scoring</h3>
          <p className="text-xs text-[#DDE3E8]/70 leading-relaxed font-mono">
            Clue discoveries award +5 points, hints cost -10 points, and a correct accusation secures up to +200 points. Climb from Gumshoe to Master Sleuth.
          </p>
        </div>
      </div>

      {/* Case Presets Section */}
      <div id="case-presets" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#DDE3E8]">Classified Dossier Presets</h2>
            <p className="text-xs text-[#DDE3E8]/60 font-mono mt-1">Select an active dossier to initiate investigation immediately.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRESETS.map((preset, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border border-[#3A0F34] bg-gradient-to-b ${preset.color} flex flex-col justify-between hover:border-[#EAAA00]/60 transition group shadow-lg`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                    preset.difficulty === 'Easy' ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40' :
                    preset.difficulty === 'Medium' ? 'border-[#EAAA00]/40 text-[#EAAA00] bg-[#3A0F34]/40' :
                    'border-purple-500/40 text-purple-300 bg-purple-950/40'
                  }`}>
                    {preset.difficulty} TIER
                  </span>
                  <span className="text-xs font-mono text-[#DDE3E8]/60">{preset.badge}</span>
                </div>

                <h3 className="text-xl font-bold font-serif text-[#DDE3E8] group-hover:text-[#EAAA00] transition">
                  {preset.title}
                </h3>

                <p className="text-xs text-[#DDE3E8]/80 leading-relaxed">
                  {preset.premise}
                </p>
              </div>

              <div className="pt-6">
                <button
                  disabled={isLoading}
                  onClick={() => launchPreset(preset)}
                  className="w-full py-2.5 px-4 bg-[#140412]/90 hover:bg-[#EAAA00] hover:text-[#120310] text-[#DDE3E8] border border-[#3A0F34] hover:border-[#EAAA00] font-semibold text-xs tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-[#EAAA00]/20"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{isLoading ? "Generating Case..." : "Take This Case"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Archive / History */}
      {recentCases.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-[#3A0F34]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#EAAA00]" />
            <h3 className="text-lg font-serif font-bold text-[#DDE3E8]">Recent Bureau Records</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentCases.map((c) => {
              const caseId = c._id || c.id;
              const isResolved = c.playerProgress?.status !== 'in-progress';
              const isSolved = c.playerProgress?.status === 'solved';

              return (
                <Link
                  key={caseId}
                  to={isResolved ? `/cases/${caseId}/result` : `/cases/${caseId}`}
                  onClick={() => sound.playTypewriterClick()}
                  className="p-4 rounded-xl border border-[#3A0F34] bg-[#1A0517]/60 hover:border-[#EAAA00]/40 transition block space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#EAAA00]">{c.difficulty}</span>
                    <span className={`px-1.5 py-0.5 rounded border ${
                      isSolved 
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' 
                        : isResolved 
                        ? 'border-red-500/40 text-red-400 bg-red-950/40' 
                        : 'border-[#EAAA00]/40 text-[#EAAA00] bg-[#3A0F34]/40'
                    }`}>
                      {c.playerProgress?.status?.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-[#DDE3E8] group-hover:text-[#EAAA00] transition truncate">
                    {c.title}
                  </h4>

                  <p className="text-xs text-[#DDE3E8]/60 truncate font-mono">
                    Score: {c.playerProgress?.currentScore || 0} pts
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
