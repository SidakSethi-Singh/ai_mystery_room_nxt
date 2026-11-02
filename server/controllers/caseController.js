import { Case } from '../models/Case.js';
import { generateMysteryFromAI } from '../services/geminiService.js';
import { sanitizeCase } from '../utils/sanitizeCase.js';
import mongoose from 'mongoose';

// In-memory store fallback if MongoDB is offline during initial preview/testing
const memoryCases = new Map();

const DIFFICULTY_BASE_SCORES = {
  Easy: 100,
  Medium: 150,
  Hard: 200
};

/**
 * Helper to determine detective rank based on accuracy and score
 */
function calculateDetectiveRank(isCorrect, finalScore, difficulty) {
  if (!isCorrect) {
    return 'Gumshoe on Probation (Wrong Accusation)';
  }
  const base = DIFFICULTY_BASE_SCORES[difficulty] || 150;
  if (finalScore >= base + 20) {
    return 'Master Sleuth (Sherlock Tier)';
  } else if (finalScore >= base) {
    return 'Senior Inspector';
  } else {
    return 'Junior Detective';
  }
}

/**
 * Check if MongoDB connection is ready
 */
function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * POST /api/cases
 * Generate a new mystery case
 */
export async function createCase(req, res) {
  try {
    const { premise, difficulty = 'Medium', theme = 'Classic Noir' } = req.body;

    console.log(`[CaseController] Creating mystery: "${premise || 'Default'}" | Diff: ${difficulty}`);
    const generatedData = await generateMysteryFromAI({ premise, difficulty, theme });

    let savedCase;
    if (isDbConnected()) {
      savedCase = await Case.create(generatedData);
    } else {
      // In-memory persistence
      const fakeId = 'mem_' + Date.now();
      savedCase = { ...generatedData, _id: fakeId, id: fakeId, createdAt: new Date() };
      memoryCases.set(fakeId, savedCase);
    }

    // Return sanitized case (Zero-leak: NO culprit, NO solution)
    const sanitized = sanitizeCase(savedCase, false);
    return res.status(201).json({
      success: true,
      case: sanitized
    });
  } catch (error) {
    console.error('[CaseController] createCase Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate mystery case',
      error: error.message
    });
  }
}

/**
 * GET /api/cases
 * Retrieve list of cases (Archive/Recent Cases)
 */
export async function getCases(req, res) {
  try {
    let cases = [];
    if (isDbConnected()) {
      cases = await Case.find()
        .select('title premise theme difficulty playerProgress createdAt')
        .sort({ createdAt: -1 })
        .limit(20);
    } else {
      cases = Array.from(memoryCases.values()).map(c => ({
        _id: c._id || c.id,
        title: c.title,
        premise: c.premise,
        theme: c.theme,
        difficulty: c.difficulty,
        playerProgress: c.playerProgress,
        createdAt: c.createdAt
      }));
    }

    return res.json({ success: true, cases });
  } catch (error) {
    console.error('[CaseController] getCases Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve cases' });
  }
}

/**
 * GET /api/cases/:id
 * Retrieve an active mystery case for investigation (Zero-leak)
 */
export async function getCaseById(req, res) {
  try {
    const { id } = req.params;
    let foundCase = null;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      foundCase = await Case.findById(id).select('-solution');
    } else if (memoryCases.has(id)) {
      foundCase = memoryCases.get(id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case file not found' });
    }

    const sanitized = sanitizeCase(foundCase, false);
    return res.json({ success: true, case: sanitized });
  } catch (error) {
    console.error('[CaseController] getCaseById Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve case file' });
  }
}

/**
 * POST /api/cases/:id/clues/:clueId/discover
 * Discover a clue and award +5 points
 */
export async function discoverClue(req, res) {
  try {
    const { id, clueId } = req.params;
    let foundCase = null;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      foundCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      foundCase = memoryCases.get(id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case file not found' });
    }

    if (foundCase.playerProgress.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Investigation is already closed for this case'
      });
    }

    // Locate clue
    const clue = foundCase.clues.find(c => c.id === clueId);
    if (!clue) {
      return res.status(404).json({ success: false, message: 'Clue not found' });
    }

    let pointsAwarded = 0;
    if (!clue.discovered) {
      clue.discovered = true;
      clue.discoveredAt = new Date();
      pointsAwarded = 5;

      foundCase.playerProgress.currentScore = Math.max(0, (foundCase.playerProgress.currentScore || 0) + pointsAwarded);
      foundCase.playerProgress.cluesDiscoveredCount = (foundCase.playerProgress.cluesDiscoveredCount || 0) + 1;

      if (isDbConnected()) {
        await foundCase.save();
      } else {
        memoryCases.set(id, foundCase);
      }
    }

    return res.json({
      success: true,
      clue,
      currentScore: foundCase.playerProgress.currentScore,
      cluesDiscoveredCount: foundCase.playerProgress.cluesDiscoveredCount,
      pointsAwarded
    });
  } catch (error) {
    console.error('[CaseController] discoverClue Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to discover clue' });
  }
}

/**
 * POST /api/cases/:id/hints
 * Request the next hint and apply -10 points penalty
 */
export async function requestHint(req, res) {
  try {
    const { id } = req.params;
    let foundCase = null;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      foundCase = await Case.findById(id);
    } else if (memoryCases.has(id)) {
      foundCase = memoryCases.get(id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case file not found' });
    }

    if (foundCase.playerProgress.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Investigation is already closed for this case'
      });
    }

    // Find next locked hint by order
    const nextHint = foundCase.hints
      .filter(h => !h.unlocked)
      .sort((a, b) => a.order - b.order)[0];

    if (!nextHint) {
      return res.status(400).json({
        success: false,
        message: 'No further hints available for this case'
      });
    }

    nextHint.unlocked = true;
    const penalty = 10;
    // Score floor is 0 per spec
    foundCase.playerProgress.currentScore = Math.max(0, (foundCase.playerProgress.currentScore || 0) - penalty);
    foundCase.playerProgress.hintsUsedCount = (foundCase.playerProgress.hintsUsedCount || 0) + 1;

    if (isDbConnected()) {
      await foundCase.save();
    } else {
      memoryCases.set(id, foundCase);
    }

    return res.json({
      success: true,
      hint: nextHint,
      currentScore: foundCase.playerProgress.currentScore,
      hintsUsedCount: foundCase.playerProgress.hintsUsedCount,
      penalty
    });
  } catch (error) {
    console.error('[CaseController] requestHint Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to request hint' });
  }
}

/**
 * POST /api/cases/:id/accuse
 * Submit an accusation against a suspect
 */
export async function accuseSuspect(req, res) {
  try {
    const { id } = req.params;
    const { suspectId, reasoning = '' } = req.body;

    if (!suspectId) {
      return res.status(400).json({ success: false, message: 'Please select a suspect to accuse' });
    }

    let foundCase = null;
    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      // Must explicitly select solution for verification
      foundCase = await Case.findById(id).select('+solution.culpritId +solution.culpritName +solution.explanation +solution.criticalClueId');
    } else if (memoryCases.has(id)) {
      foundCase = memoryCases.get(id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case file not found' });
    }

    if (foundCase.playerProgress.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'An accusation has already been resolved for this case',
        case: sanitizeCase(foundCase, true)
      });
    }

    const accusedSuspect = foundCase.suspects.find(s => s.id === suspectId);
    if (!accusedSuspect) {
      return res.status(400).json({ success: false, message: 'Invalid suspect selected' });
    }

    // Verify accusation
    const isCorrect = String(foundCase.solution.culpritId).trim().toLowerCase() === String(suspectId).trim().toLowerCase();

    // Calculate score
    const baseScore = isCorrect ? (DIFFICULTY_BASE_SCORES[foundCase.difficulty] || 100) : 0;
    const clueBonus = (foundCase.playerProgress.cluesDiscoveredCount || 0) * 5;
    const hintPenalty = (foundCase.playerProgress.hintsUsedCount || 0) * 10;
    const finalScore = Math.max(0, baseScore + clueBonus - hintPenalty);

    const rank = calculateDetectiveRank(isCorrect, finalScore, foundCase.difficulty);

    // Update case record
    foundCase.playerProgress.status = isCorrect ? 'solved' : 'failed';
    foundCase.playerProgress.currentScore = finalScore;
    foundCase.playerProgress.detectiveRank = rank;
    foundCase.playerProgress.accusation = {
      suspectId: accusedSuspect.id,
      suspectName: accusedSuspect.name,
      isCorrect,
      reasoning,
      accusedAt: new Date()
    };

    if (isDbConnected()) {
      await foundCase.save();
    } else {
      memoryCases.set(id, foundCase);
    }

    // Return full result including solution
    return res.json({
      success: true,
      verdict: {
        isCorrect,
        accusedSuspect,
        trueCulprit: {
          id: foundCase.solution.culpritId,
          name: foundCase.solution.culpritName,
          explanation: foundCase.solution.explanation,
          criticalClueId: foundCase.solution.criticalClueId
        },
        scoreBreakdown: {
          baseScore,
          clueBonus,
          hintPenalty,
          finalScore
        },
        detectiveRank: rank
      },
      case: sanitizeCase(foundCase, true)
    });
  } catch (error) {
    console.error('[CaseController] accuseSuspect Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process accusation' });
  }
}

/**
 * GET /api/cases/:id/result
 * Retrieve completed case details and full solution
 */
export async function getCaseResult(req, res) {
  try {
    const { id } = req.params;
    let foundCase = null;

    if (isDbConnected() && mongoose.Types.ObjectId.isValid(id)) {
      foundCase = await Case.findById(id).select('+solution.culpritId +solution.culpritName +solution.explanation +solution.criticalClueId');
    } else if (memoryCases.has(id)) {
      foundCase = memoryCases.get(id);
    }

    if (!foundCase) {
      return res.status(404).json({ success: false, message: 'Case file not found' });
    }

    if (foundCase.playerProgress.status === 'in-progress') {
      return res.status(403).json({
        success: false,
        message: 'Case is still active. Accusation required before retrieving solution.'
      });
    }

    return res.json({
      success: true,
      case: sanitizeCase(foundCase, true)
    });
  } catch (error) {
    console.error('[CaseController] getCaseResult Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve result' });
  }
}

