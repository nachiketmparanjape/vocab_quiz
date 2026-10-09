import { useLists } from '../hooks/useLists.js';
import { getMasteryLevel } from '../utils/srs.js';

export default function Home({ onNavigate }) {
  const { lists, loading } = useLists();

  if (loading) return <div className="loading">Loading...</div>;

  const totalWords = lists.reduce((sum, l) => sum + l.words.length, 0);
  const now = Date.now();
  const dueWords = lists.reduce(
    (sum, l) =>
      sum +
      l.words.filter(w => w.nextReviewAt <= now || w.attemptCount === 0).length,
    0
  );
  const masteredWords = lists.reduce(
    (sum, l) =>
      sum + l.words.filter(w => getMasteryLevel(w) === 'mastered').length,
    0
  );

  return (
    <div className="home">
      <h1>Vocab Quiz</h1>
      <p className="subtitle">Learn vocabulary with spaced repetition</p>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">{totalWords}</span>
          <span className="stat-label">Total Words</span>
        </div>
        <div className="stat">
          <span className="stat-number">{dueWords}</span>
          <span className="stat-label">Due for Review</span>
        </div>
        <div className="stat">
          <span className="stat-number">{masteredWords}</span>
          <span className="stat-label">Mastered</span>
        </div>
      </div>

      <div className="home-actions">
        <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
          Add Words
        </button>
        <button
          className="btn btn-success"
          onClick={() => onNavigate('quiz-setup')}
          disabled={totalWords < 4}
          title={totalWords < 4 ? 'Add at least 4 words to start a quiz' : ''}
        >
          Start Quiz
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('wordlist')}>
          My Words
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
          Dashboard
        </button>
      </div>

      {totalWords < 4 && (
        <p className="hint">Add at least 4 words to start quizzing.</p>
      )}
    </div>
  );
}
