// SM-2 spaced repetition algorithm (simplified)

export function processAnswer(word, isCorrect, quality = null) {
  // If quality is 'again', treat as incorrect regardless of isCorrect
  if (quality === 'again') {
    isCorrect = false;
  }

  const now = Date.now();
  const updated = { ...word };
  updated.attemptCount += 1;

  if (isCorrect) {
    updated.correctCount += 1;
    updated.repetitions += 1;

    if (updated.repetitions === 1) {
      updated.interval = 1;
    } else if (updated.repetitions === 2) {
      updated.interval = 3;
    } else {
      updated.interval = Math.round(updated.interval * updated.easeFactor);
    }

    // Adjust ease factor based on quality
    const easeBonus = quality === 'easy' ? 0.15 : quality === 'hard' ? 0 : 0.05;
    updated.easeFactor = Math.min(3.0, updated.easeFactor + easeBonus);
    updated.nextReviewAt = now + updated.interval * 24 * 60 * 60 * 1000;
  } else {
    updated.repetitions = 0;
    updated.interval = 0;
    // Decrease ease factor (min 1.3)
    updated.easeFactor = Math.max(1.3, updated.easeFactor - 0.2);
    updated.nextReviewAt = now; // Review again immediately
  }

  return updated;
}

export function getMasteryLevel(word) {
  if (word.attemptCount === 0) return 'new';
  if (word.repetitions >= 5) return 'mastered';
  if (word.repetitions >= 3) return 'familiar';
  return 'learning';
}

export function getMasteryColor(level) {
  switch (level) {
    case 'new': return '#ef4444';
    case 'learning': return '#f97316';
    case 'familiar': return '#eab308';
    case 'mastered': return '#22c55e';
    default: return '#9ca3af';
  }
}
