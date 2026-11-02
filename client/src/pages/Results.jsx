import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti';
import { 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Home, 
  FileCheck, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/cases/${id}/result`);
      if (res.data?.success) {
        setCaseData(res.data.case);
        const isCorrect = res.data.case.playerProgress?.accusation?.isCorrect;
        if (isCorrect) {
          triggerConfetti();
        }
      } else {
        setError('Case result not ready or not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load case outcome');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-sm text-amber-400">Summoning magistrate & unsealing verdict...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-2xl bg-red-950/40 border border-red-800 text-center space-y-4">
        <XCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold font-serif text-slate-100">Dossier Sealed</h2>
        <p className="text-sm text-slate-300 font-mono">{error || "Case is still under active investigation."}</p>
        <button
          onClick={() => navigate(`/cases/${id}`)}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase rounded-lg"
        >
          Return to Investigation Room
        </button>
      </div>
    );
  }

  const isSolved = caseData.playerProgress?.status === 'solved';
  const isCorrect = caseData.playerProgress?.accusation?.isCorrect;
  const accusation = caseData.playerProgress?.accusation;
  const culprit = caseData.solution;
  const score = caseData.playerProgress?.currentScore || 0;
  const cluesFound = caseData.playerProgress?.cluesDiscoveredCount || 0;
  const hintsUsed = caseData.playerProgress?.hintsUsedCount || 0;
  const rank = caseData.playerProgress?.detectiveRank || "Detective in Training";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Dramatic Verdict Banner */}
      <div className={`p-8 sm:p-12 rounded-3xl border-2 text-center space-y-6 relative overflow-hidden shadow-2xl ${
        isCorrect 
          ? 'border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 to-slate-950' 
          : 'border-red-500/60 bg-gradient-to-b from-red-950/40 to-slate-950'
      }`}>
        
        {/* Rubber Stamp Badge */}
        <div className="inline-block">
          <div className={`${isCorrect ? 'solved-stamp' : 'confidential-stamp'} text-sm sm:text-lg px-6 py-2 shadow-xl`}>
            {isCorrect ? "CASE SOLVED: CULPRIT APPREHENDED" : "WRONGFUL ACCUSATION: CASE UNSOLVED"}
          </div>
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-slate-100">
            {caseData.title}
          </h1>
          <p className="text-sm text-slate-300 font-sans">
            {isCorrect 
              ? "Your inductive reasoning was impeccable. The suspect confessed under the weight of forensic evidence." 
              : "The accused suspect possessed an ironclad defense. The true culprit slipped through the dragnet."}
          </p>
        </div>

        {/* Detective Rank Certificate Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900/90 border border-amber-500/30">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="text-left font-mono">
            <span className="text-[10px] text-slate-400 block uppercase">COMMISSIONED RANK</span>
            <span className="text-sm font-bold text-amber-300">{rank}</span>
          </div>
        </div>
      </div>

      {/* Score Ledger & Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base font-serif text-slate-100">Forensic Performance Ledger</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">CASE ID: {id}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">ACCUSATION VERDICT</span>
            <span className={`text-base font-bold font-mono ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? "+100% BASE" : "0 BASE"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">CLUES UNCOVERED</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              +{cluesFound * 5} <span className="text-xs text-slate-500">({cluesFound}x5)</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">HINT PENALTIES</span>
            <span className="text-base font-bold font-mono text-amber-400">
              -{hintsUsed * 10} <span className="text-xs text-slate-500">({hintsUsed}x10)</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40">
            <span className="text-[10px] text-slate-400 font-mono block">FINAL SCORE</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">
              {score} <span className="text-xs text-slate-400">pts</span>
            </span>
          </div>
        </div>
      </div>

      {/* The Full Truth & Solution Unveiled */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-slate-900/60 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-lg font-serif text-slate-100">The Unvarnished Truth</h3>
        </div>

        {culprit && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">TRUE CULPRIT</span>
                <h4 className="text-xl font-bold font-serif text-amber-200">{culprit.culpritName}</h4>
              </div>
              <span className="text-xs font-mono text-amber-400 px-3 py-1 bg-amber-950/80 border border-amber-500/40 rounded-full">
                ID: {culprit.culpritId}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Full Execution & Explanation:
              </span>
              <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                {culprit.explanation}
              </p>
            </div>
          </div>
        )}

        {/* Player's Accusation Memo */}
        {accusation && (
          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs font-mono">
            <span className="text-slate-400 uppercase block">Your Submitted Indictment:</span>
            <p className="text-slate-300 italic bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              Accused: <strong>{accusation.suspectName}</strong> ({accusation.suspectId})
              {accusation.reasoning && (
                <span className="block mt-1 text-slate-400">Reasoning: "{accusation.reasoning}"</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Action Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link
          to="/"
          onClick={() => sound.playTypewriterClick()}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 border border-slate-800"
        >
          <Home className="w-4 h-4" />
          <span>Bureau Headquarters</span>
        </Link>

        <Link
          to="/create"
          onClick={() => sound.playTypewriterClick()}
          className="px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs uppercase tracking-widest rounded-xl transition shadow-xl shadow-amber-500/20 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Investigate Another Mystery</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
