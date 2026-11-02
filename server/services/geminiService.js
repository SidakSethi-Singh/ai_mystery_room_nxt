import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { fallbackCases } from '../data/fallbackCases.js';

// Zod Schema to strictly validate Gemini's JSON output
export const MysteryCaseSchema = z.object({
  title: z.string().min(3),
  storyBriefing: z.string().min(20),
  victim: z.object({
    name: z.string().min(2),
    details: z.string().min(10)
  }),
  crimeScene: z.object({
    location: z.string().min(3),
    time: z.string().min(3)
  }),
  suspects: z.array(z.object({
    id: z.string(),
    name: z.string(),
    occupation: z.string(),
    alibi: z.string(),
    motive: z.string(),
    demeanor: z.string(),
    avatarUrl: z.string().optional()
  })),
  clues: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string()
  })),
  hints: z.array(z.object({
    id: z.string(),
    text: z.string(),
    order: z.number()
  })),
  solution: z.object({
    culpritId: z.string(),
    culpritName: z.string(),
    explanation: z.string(),
    criticalClueId: z.string()
  })
});

const DIFFICULTY_CONFIG = {
  Easy: { suspects: 3, clues: 5, hints: 2 },
  Medium: { suspects: 4, clues: 7, hints: 3 },
  Hard: { suspects: 5, clues: 9, hints: 3 }
};

// Fast and resilient model priority list using current Gemini API models
const CANDIDATE_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-2.5-flash'];

/**
 * Generates an AI-powered murder mystery using Google Gemini.
 * Uses model cascading + zero-failure fallback if API limits occur.
 */
export async function generateMysteryFromAI({ premise, difficulty = 'Medium', theme = 'Classic Noir' }) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.Medium;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key') {
    console.warn(`[GeminiService] No GEMINI_API_KEY configured. Utilizing curated benchmark case for '${difficulty}'.`);
    return getFallbackMystery(premise, difficulty, theme);
  }

  const systemInstruction = `You are an elite detective novelist and puzzle designer.
Create a solvable, logically consistent whodunit mystery based on the user's premise.
Rules:
1. Difficulty: "${difficulty}".
   - Exactly ${config.suspects} suspects (with IDs: "suspect-1", "suspect-2", etc.).
   - Exactly ${config.clues} clues (with IDs: "clue-1", "clue-2", etc.).
   - Exactly ${config.hints} hints (with IDs: "hint-1", "hint-2", etc. and sequential order 1, 2, ...).
2. The mystery MUST have an airtight, logically sound solution supported by the clues.
3. Every suspect must have an alibi and a plausible motive. Exactly ONE suspect is the true culprit.
4. The clues must contain enough forensic/testimonial evidence that a sharp sleuth can identify the culprit with zero ambiguity.
5. Return ONLY a single valid JSON object strictly matching this format without markdown code blocks:
{
  "title": "String",
  "storyBriefing": "String",
  "victim": { "name": "String", "details": "String" },
  "crimeScene": { "location": "String", "time": "String" },
  "suspects": [
    { "id": "suspect-1", "name": "Name", "occupation": "Job", "alibi": "Alibi", "motive": "Motive", "demeanor": "Demeanor" }
  ],
  "clues": [
    { "id": "clue-1", "title": "Title", "description": "Description" }
  ],
  "hints": [
    { "id": "hint-1", "text": "Hint text", "order": 1 }
  ],
  "solution": {
    "culpritId": "suspect-X",
    "culpritName": "Name matching culpritId",
    "explanation": "Detailed explanation showing how clues prove their guilt",
    "criticalClueId": "clue-Y"
  }
}`;

  const prompt = `Premise: "${premise || 'A high-profile theft during a storm'}"
Theme/Setting: "${theme}"
Difficulty: "${difficulty}"`;

  const ai = new GoogleGenAI({ apiKey });

  // Try candidate models in cascade with timeout
  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`[GeminiService] Requesting generation via ${modelName}...`);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout after 12s on ${modelName}`)), 12000)
      );

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const responseText = response.text?.trim() || '';
      if (!responseText) continue;

      let parsedJson;
      try {
        parsedJson = JSON.parse(responseText);
      } catch {
        const cleaned = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
        parsedJson = JSON.parse(cleaned);
      }

      const validatedData = MysteryCaseSchema.parse(parsedJson);

      const processedCase = {
        title: validatedData.title,
        premise: premise || validatedData.title,
        theme,
        difficulty,
        storyBriefing: validatedData.storyBriefing,
        victim: validatedData.victim,
        crimeScene: validatedData.crimeScene,
        suspects: validatedData.suspects.map((s, idx) => ({
          ...s,
          avatarUrl: s.avatarUrl || `https://images.unsplash.com/photo-${1500000000000 + (idx * 1234567)}?w=150`
        })),
        clues: validatedData.clues.map(c => ({
          ...c,
          discovered: false,
          discoveredAt: null
        })),
        hints: validatedData.hints.map((h, idx) => ({
          ...h,
          unlocked: false,
          order: h.order || (idx + 1)
        })),
        solution: validatedData.solution,
        playerProgress: {
          status: 'in-progress',
          currentScore: 0,
          cluesDiscoveredCount: 0,
          hintsUsedCount: 0,
          accusation: null,
          detectiveRank: 'Detective in Training'
        }
      };

      console.log(`✅ [GeminiService] Successfully generated fresh mystery using ${modelName}: "${processedCase.title}"`);
      return processedCase;
    } catch (err) {
      console.warn(`[GeminiService] ${modelName} failed (${err.message}). Trying next candidate...`);
    }
  }

  console.warn('[GeminiService] All Gemini models currently experiencing high traffic/errors. Engaging fallback engine.');
  return getFallbackMystery(premise, difficulty, theme);
}

function getFallbackMystery(premise, difficulty, theme) {
  const base = fallbackCases[difficulty] || fallbackCases.Medium;
  const clone = JSON.parse(JSON.stringify(base));
  
  if (premise && premise.trim().length > 5) {
    clone.premise = premise.trim();
  }
  if (theme) {
    clone.theme = theme;
  }
  return clone;
}
