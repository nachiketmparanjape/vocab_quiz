import { useState } from 'react';
import { getMasteryLevel } from '../utils/srs.js';
import { useLists } from '../hooks/useLists.js';

export default function Dashboard({ onNavigate }) {
  const { lists, loading } = useLists();
  const [selectedListId, setSelectedListId] = useState('all');

  if (loading) return <div className="loading">Loading...</div>;

  const filteredLists = selectedListId === 'all'
    ? lists
    : lists.filter(l => l.id === selectedListId);
  const allWords = filteredLists.flatMap(l => l.words);
  const now = Date.now();

  const stats = {
    total: allWords.length,
    new: 0,
    learning: 0,
    familiar: 0,
    mastered: 0,
    dueToday: 0,
    totalAttempts: 0,
    totalCorrect: 0,
  };

  for (const word of allWords) {
    const mastery = getMasteryLevel(word);
    stats[mastery]++;
    if (word.nextReviewAt <= now || word.attemptCount === 0) {
      stats.dueToday++;
    }
    stats.totalAttempts += word.attemptCount;
    stats.totalCorrect += word.correctCount;
  }

  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.totalCorrect / stats.totalAttempts) * 100)
      : 0;

  const masteryData = [
    { label: 'New', count: stats.new, color: '#ef4444' },
    { label: 'Learning', count: stats.learning, color: '#f97316' },
    { label: 'Familiar', count: stats.familiar, color: '#eab308' },
    { label: 'Mastered', count: stats.mastered, color: '#22c55e' },
  ];

  const maxCount = Math.max(...masteryData.map(d => d.count), 1);

  return (
    <div className="dashboard">
      <div className="screen-header">
        <button className="btn btn-back" onClick={() => onNavigate('home')}>
          &larr; Back
        </button>
        <h2>Dashboard</h2>
      </div>

      <div className="section">
        <select
          value={selectedListId}
          onChange={e => setSelectedListId(e.target.value)}
        >
          <option value="all">All Lists</option>
          {lists.map(l => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.words.length} words)
            </option>
          ))}
        </select>
      </div>

      {allWords.length === 0 ? (
        <div className="empty-state">
          <p>No words yet. Add some to see your progress.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
            Add Words
          </button>
        </div>
      ) : (
        <>
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Words</span>
            </div>
            <div className="stat">
              <span className="stat-number">{stats.dueToday}</span>
              <span className="stat-label">Due for Review</span>
            </div>
            <div className="stat">
              <span className="stat-number">{accuracy}%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div>

          <div className="section">
            <h3>Mastery Distribution</h3>
            <div className="mastery-chart">
              {masteryData.map(d => (
                <div key={d.label} className="chart-row">
                  <span className="chart-label">{d.label}</span>
                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{
                        width: `${(d.count / maxCount) * 100}%`,
                        backgroundColor: d.color,
                      }}
                    />
                  </div>
                  <span className="chart-count">{d.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Word Lists</h3>
            {filteredLists.map(l => (
              <div key={l.id} className="list-summary">
                <strong>{l.name}</strong> — {l.words.length} words
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
