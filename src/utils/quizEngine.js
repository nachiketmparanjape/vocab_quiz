import { getMasteryLevel } from './srs.js';

export function selectQuizWords(words, count = 20) {
  const now = Date.now();

  const overdue = [];
  const weak = [];
  const newWords = [];
  const strong = [];

  for (const word of words) {
    const mastery = getMasteryLevel(word);
    if (mastery === 'new') {
      newWords.push(word);
    } else if (word.nextReviewAt <= now) {
      overdue.push(word);
    } else if (mastery === 'learning') {
      weak.push(word);
    } else {
      strong.push(word);
    }
  }

  // Sort overdue by how overdue they are (most overdue first)
  overdue.sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  // Sort weak by ease factor (hardest first)
  weak.sort((a, b) => a.easeFactor - b.easeFactor);
  // Shuffle new and strong words
  shuffle(newWords);
  shuffle(strong);

  const selected = [];
  // Priority: overdue → weak → new → strong
  for (const word of overdue) {
    if (selected.length >= count) break;
    selected.push(word);
  }
  for (const word of weak) {
    if (selected.length >= count) break;
    selected.push(word);
  }
  // Limit new words per session
  const maxNew = Math.min(5, Math.max(1, count - selected.length));
  for (let i = 0; i < Math.min(maxNew, newWords.length); i++) {
    if (selected.length >= count) break;
    selected.push(newWords[i]);
  }
  for (const word of strong) {
    if (selected.length >= count) break;
    selected.push(word);
  }

  shuffle(selected);
  return selected;
}

export function generateQuestion(word, allWords, showFields, answerField) {
  const mastery = getMasteryLevel(word);
  const isTyping = mastery === 'familiar' || mastery === 'mastered';

  const correctAnswer = word.fields[answerField];
  const prompt = showFields.map(f => word.fields[f]).join(' — ');

  if (isTyping) {
    return {
      type: 'typing',
      wordId: word.id,
      prompt,
      showFields,
      answerField,
      correctAnswer,
      word,
    };
  }

  // Multiple choice: pick 3 wrong options
  const otherWords = allWords.filter(
    w => w.id !== word.id && w.fields[answerField]
  );
  shuffle(otherWords);

  const wrongOptions = otherWords
    .slice(0, 3)
    .map(w => w.fields[answerField]);

  // If we don't have enough distractors, pad with what we have
  while (wrongOptions.length < 3 && otherWords.length > 0) {
    wrongOptions.push(otherWords[wrongOptions.length % otherWords.length].fields[answerField]);
  }

  const options = shuffle([correctAnswer, ...wrongOptions]);

  return {
    type: 'multiple-choice',
    wordId: word.id,
    prompt,
    showFields,
    answerField,
    correctAnswer,
    options,
    word,
  };
}

export function getQuizModes(fields) {
  if (fields.length < 2) return [];

  const modes = [];
  for (let answerIdx = 0; answerIdx < fields.length; answerIdx++) {
    const showFields = fields.filter((_, i) => i !== answerIdx);
    modes.push({
      label: `${showFields.join(' + ')} → ${fields[answerIdx]}`,
      showFields,
      answerField: fields[answerIdx],
    });
  }
  return modes;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
