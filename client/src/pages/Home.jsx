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
  Clock, 
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
    color: "from-blue-900/40 to-slate-900"
  },
  {
    title: "Cyanide in Silicon Valley",
    premise: "A ruthless neuro-tech CEO is fatally poisoned during a private IPO celebratory toast.",
    difficulty: "Medium",
    theme: "Modern Thriller",
    badge: "4 Suspects • 7 Clues",
    color: "from-amber-900/40 to-slate-900"
  },
  {
    title: "The Orient Express Phantom",
    premise: "A high-ranking diplomat carrying peace treaties is murdered in a snowbound railway car locked from inside.",
    difficulty: "Hard",
    theme: "Agatha Christie Mystery",
    badge: "5 Suspects • 9 Clues",
    color: "from-purple-900/40 to-slate-900"
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
      <div className="relative rounded-3xl border border-amber-900/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-14 overflow-hidden shadow-2xl">
        {/* Atmospheric background accents */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Case Generator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-slate-100 leading-tight">
            Step into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Crime Scene</span>. Solve the Unsolved.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Every case is dynamically generated on-demand by Google Gemini. Investigate suspect alibis, uncover hidden forensic evidence on the interactive board, request tactical hints, and unmask the culprit before they slip away.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/create"
              onClick={() => sound.playTypewriterClick()}
              className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm tracking-wider uppercase rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Launch Custom Case</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href="#case-presets"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-sm tracking-wide rounded-xl transition flex items-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Classified Presets</span>
            </a>
          </div>
        </div>
      </div>

      {/* Feature Pillar Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FolderLock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 font-serif">Zero-Leak Backend Security</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            The culprit, motive, and critical clue remain strictly quarantined on the server. Inspecting browser networks will never leak the answer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Skull className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 font-serif">Airtight Gemini Reasoning</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Powered by Gemini with Zod validation. Each case delivers realistic alibis, consistent timelines, and forensic evidence pointing only to the true killer.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 font-serif">Authoritative Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Clue discoveries award +5 points, hints cost -10 points, and a correct accusation secures up to +200 points. Climb from Gumshoe to Master Sleuth.
          </p>
        </div>
      </div>

      {/* Case Presets Section */}
      <div id="case-presets" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-serif text-slate-100">Classified Dossier Presets</h2>
            <p className="text-xs text-slate-400 font-mono mt-1">Select an active dossier to initiate investigation immediately.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRESETS.map((preset, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border border-slate-800 bg-gradient-to-b ${preset.color} flex flex-col justify-between hover:border-amber-500/50 transition group shadow-lg`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border ${
                    preset.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40' :
                    preset.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-950/40' :
                    'border-purple-500/30 text-purple-400 bg-purple-950/40'
                  }`}>
                    {preset.difficulty} TIER
                  </span>
                  <span className="text-xs font-mono text-slate-400">{preset.badge}</span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-100 group-hover:text-amber-300 transition">
                  {preset.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {preset.premise}
                </p>
              </div>

              <div className="pt-6">
                <button
                  disabled={isLoading}
                  onClick={() => launchPreset(preset)}
                  className="w-full py-2.5 px-4 bg-slate-900/90 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/80 hover:border-amber-400 font-semibold text-xs tracking-wider uppercase rounded-xl transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-amber-500/10"
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
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-serif font-bold text-slate-200">Recent Bureau Records</h3>
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
                  className="p-4 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:border-amber-500/40 transition block space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-amber-400/80">{c.difficulty}</span>
                    <span className={`px-1.5 py-0.5 rounded border ${
                      isSolved 
                        ? 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40' 
                        : isResolved 
                        ? 'border-red-500/40 text-red-400 bg-red-950/40' 
                        : 'border-blue-500/40 text-blue-400 bg-blue-950/40'
                    }`}>
                      {c.playerProgress?.status?.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-semibold text-sm text-slate-200 group-hover:text-amber-300 transition truncate">
                    {c.title}
                  </h4>

                  <p className="text-xs text-slate-400 truncate">
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
