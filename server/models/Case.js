import mongoose from 'mongoose';

const SuspectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  alibi: { type: String, required: true },
  motive: { type: String, required: true },
  demeanor: { type: String, required: true },
  avatarUrl: { type: String, default: '' }
}, { _id: false });

const ClueSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  discovered: { type: Boolean, default: false },
  discoveredAt: { type: Date, default: null }
}, { _id: false });

const HintSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  order: { type: Number, required: true }
}, { _id: false });

const SolutionSchema = new mongoose.Schema({
  culpritId: { type: String, required: true, select: false },
  culpritName: { type: String, required: true, select: false },
  explanation: { type: String, required: true, select: false },
  criticalClueId: { type: String, select: false }
}, { _id: false });

const AccusationSchema = new mongoose.Schema({
  suspectId: { type: String },
  suspectName: { type: String },
  isCorrect: { type: Boolean },
  reasoning: { type: String },
  accusedAt: { type: Date }
}, { _id: false });

const PlayerProgressSchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['in-progress', 'solved', 'failed'], 
    default: 'in-progress' 
  },
  currentScore: { type: Number, default: 0 },
  cluesDiscoveredCount: { type: Number, default: 0 },
  hintsUsedCount: { type: Number, default: 0 },
  accusation: { type: AccusationSchema, default: null },
  detectiveRank: { type: String, default: 'Detective in Training' }
}, { _id: false });

const CaseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  premise: { type: String, required: true },
  theme: { type: String, default: 'Classic Noir' },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    required: true 
  },
  storyBriefing: { type: String, required: true },
  victim: {
    name: { type: String, required: true },
    details: { type: String, required: true }
  },
  crimeScene: {
    location: { type: String, required: true },
    time: { type: String, required: true }
  },
  suspects: { type: [SuspectSchema], required: true },
  clues: { type: [ClueSchema], required: true },
  hints: { type: [HintSchema], required: true },
  solution: { type: SolutionSchema, required: true },
  playerProgress: { type: PlayerProgressSchema, default: () => ({}) }
}, { 
  timestamps: true 
});

export const Case = mongoose.model('Case', CaseSchema);

