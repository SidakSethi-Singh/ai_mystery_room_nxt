/**
 * Sanitizes a Case document to prevent any spoiler leaks before an accusation is submitted.
 * Guarantees zero-leak backend security.
 *
 * @param {Object} caseDoc - The raw Mongoose document or plain JS object
 * @param {Boolean} includeSolution - Whether the case is resolved and solution can be shown
 * @returns {Object} Sanitized case payload safe for client consumption
 */
export function sanitizeCase(caseDoc, includeSolution = false) {
  const caseObj = caseDoc.toObject ? caseDoc.toObject() : JSON.parse(JSON.stringify(caseDoc));

  // Determine if case is already solved or failed
  const isCaseCompleted = caseObj.playerProgress?.status === 'solved' || 
                          caseObj.playerProgress?.status === 'failed';

  const shouldRevealSolution = includeSolution || isCaseCompleted;

  if (!shouldRevealSolution) {
    // Quarantine solution
    delete caseObj.solution;

    // Redact text of locked hints
    if (Array.isArray(caseObj.hints)) {
      caseObj.hints = caseObj.hints.map(hint => {
        if (!hint.unlocked) {
          return {
            id: hint.id,
            unlocked: false,
            order: hint.order,
            text: '🔒 [Classified Hint - Request hint to reveal details]'
          };
        }
        return hint;
      });
    }
  }

  return caseObj;
}

