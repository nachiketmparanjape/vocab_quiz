import { generateId } from './storage.js';

export function parseCSV(text) {
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length < 2) {
    throw new Error('CSV must have a header row and at least one data row');
  }

  const fields = parseLine(lines[0]).map(f => f.trim().toLowerCase());

  if (fields.length < 2) {
    throw new Error('CSV must have at least 2 columns');
  }

  const words = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    if (values.length !== fields.length) continue;

    const fieldMap = {};
    fields.forEach((field, idx) => {
      fieldMap[field] = values[idx].trim();
    });

    // Skip rows where all values are empty
    if (Object.values(fieldMap).every(v => v === '')) continue;

    words.push(createWord(fieldMap));
  }

  if (words.length === 0) {
    throw new Error('No valid word rows found in CSV');
  }

  return { fields, words };
}

function parseLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function createWord(fields, listId = null) {
  return {
    id: generateId(),
    listId,
    fields,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReviewAt: 0,
    correctCount: 0,
    attemptCount: 0,
  };
}
