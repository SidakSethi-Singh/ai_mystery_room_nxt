import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Sparkles, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  Flame, 
  Terminal, 
  Loader2,
  Compass
} from 'lucide-react';
import { sound } from '../utils/audio';

const QUICK_INSPIRATIONS = [
  "A billionaire's vault is looted during a total solar eclipse at his private island.",
  "The lead dancer is poisoned on stage during the opening night of Swan Lake.",
  "A quantum encryption key is stolen from a locked server room with no external access.",
  "An ancient cursed Egyptian amulet vanishes from an antique collector's safe."
];

const THEMES = [
  { id: "Classic Noir", name: "1940s Classic Noir", icon: "🕵️", desc: "Rain-slicked streets, fedoras, and smoky jazz lounges" },
  { id: "Victorian Gothic", name: "Victorian London (1890s)", icon: "🕯️", desc: "Cobblestone alleys, gas lamps, and locked manor houses" },
  { id: "Modern Thriller", name: "Silicon Valley Tech Thriller", icon: "💻", desc: "Corporate espionage, cleanrooms, and bio-pharma heists" },
  { id: "Cyberpunk 2099", name: "Neo-Tokyo Cyberpunk", icon: "⚡", desc: "Neon towers, neural implants, and rogue synthetics" }
];

const DIFFICULTIES = [
  {
    level: "Easy",
    suspects: 3,
    clues: 5,
    hints: 2,
    basePoints: 100,
    color: "border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 text-emerald-300",
    desc: "Straightforward alibis with direct forensic evidence. Ideal for rookie gumshoes."
  },
  {
    level: "Medium",
    suspects: 4,
    clues: 7,
    hints: 3,
    basePoints: 150,
    color: "border-amber-500/40 hover:border-amber-400 bg-amber-950/20 text-amber-300",
    desc: "Intricate red herrings and conflicting testimonies. Requires methodical deduction."
  },
  {
    level: "Hard",
    suspects: 5,
    clues: 9,
    hints: 3,
    basePoints: 200,
    color: "border-purple-500/40 hover:border-purple-400 bg-purple-950/20 text-purple-300",
    desc: "Complex webs of deceit, tight timelines, and subtle physical traces. For master sleuths only."
  }
];

const LOADING_STEPS = [
  "Interrogating initial informants...",
  "Synthesizing forensic timeline via Gemini AI...",
  "Formulating suspect alibis and hidden motives...",
  "Planting physical evidence across the crime scene...",
  "Quarantining the confidential culprit in server vault...",
  "Stamping official case dossier..."
];

export default function CreateMystery() {
  const navigate = useNavigate();
  const [premise, setPremise] = useState('');
  const [theme, setTheme] = useState('Classic Noir');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
        sound.playTypewriterClick();
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playTypewriterClick();
    setIsGenerating(true);

    try {
      const response = await axios.post('/api/cases', {
        premise: premise.trim() || 'A high-profile jewel theft during an evening gala',
        theme,
        difficulty
      });

      if (response.data?.success) {
        sound.playClueChime();
        navigate(`/cases/${response.data.case._id || response.data.case.id}`);
      } else {
        alert(response.data?.message || 'Failed to generate mystery');
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('Case generation failed:', err);
      alert('Case generation error: ' + (err.response?.data?.message || err.message));
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-mono">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CASE COMMISSION DESK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-100">
          Commission a New Crime File
        </h1>
        <p className="text-sm text-slate-400">
          Configure the premise, period aesthetic, and deduction difficulty. Gemini will construct a fully cohesive, solvable whodunit.
        </p>
      </div>

      {isGenerating ? (
        /* Dramatic Loading State */
        <div className="p-12 rounded-3xl border border-amber-500/40 bg-slate-900/90 text-center space-y-6 shadow-2xl animate-pulse">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-serif text-slate-100">
              Generating Case Dossier...
            </h3>
            <p className="text-amber-400 font-mono text-sm tracking-wide">
              {LOADING_STEPS[loadingStepIdx]}
            </p>
          </div>

          <div className="max-w-md mx-auto text-xs text-slate-500 font-mono border-t border-slate-800 pt-4">
            Security Quarantine: Solution and culprit identity will remain encrypted on the backend until final verdict.
          </div>
        </div>
      ) : (
        /* Setup Form */
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Premise Input */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold font-serif text-slate-200">
              1. Case Premise & Inciting Incident
            </label>
            <textarea
              rows={3}
              value={premise}
              onChange={(e) => setPremise(e.target.value)}
              placeholder="e.g. During a lightning storm at Lord Blackwood's country estate, a priceless renaissance painting is slashed and the head curator disappears..."
              className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition resize-none font-mono"
            />

            {/* Quick Inspiration Chips */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Need inspiration? Click a prompt:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {QUICK_INSPIRATIONS.map((insp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      sound.playTypewriterClick();
                      setPremise(insp);
                    }}
                    className="text-left text-xs bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-300 px-3 py-1.5 rounded-lg transition"
                  >
                    "{insp}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold font-serif text-slate-200">
              2. Atmospheric Theme & Period Setting
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      sound.playTypewriterClick();
                      setTheme(t.id);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl">{t.icon}</span>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-100">{t.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold font-serif text-slate-200">
              3. Investigation Challenge Tier
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DIFFICULTIES.map((diff) => {
                const isSelected = difficulty === diff.level;
                return (
                  <div
                    key={diff.level}
                    onClick={() => {
                      sound.playTypewriterClick();
                      setDifficulty(diff.level);
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 ${
                      isSelected
                        ? 'border-amber-500 bg-slate-900/90 ring-2 ring-amber-500/40'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${diff.color}`}>
                        {diff.level}
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold">
                        +{diff.basePoints} pts
                      </span>
                    </div>

                    <div className="space-y-1 text-xs text-slate-300 font-mono">
                      <div>• <strong>{diff.suspects}</strong> Suspects to interrogate</div>
                      <div>• <strong>{diff.clues}</strong> Clues to uncover (+5 ea)</div>
                      <div>• <strong>{diff.hints}</strong> Classified hints (-10 ea)</div>
                    </div>

                    <p className="text-xs text-slate-400 border-t border-slate-800 pt-2">
                      {diff.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 flex items-center justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm uppercase tracking-widest rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Case Dossier</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
