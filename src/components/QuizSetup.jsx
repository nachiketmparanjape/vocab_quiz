import { useState } from 'react';
import { getQuizModes } from '../utils/quizEngine.js';
import { useLists } from '../hooks/useLists.js';

export default function QuizSetup({ onNavigate, onStartQuiz }) {
  const { lists, loading } = useLists();
  const [selectedListId, setSelectedListId] = useState('');

  const effectiveListId = selectedListId || lists[0]?.id || '';
  const currentList = lists.find(l => l.id === effectiveListId);
  const modes = currentList ? getQuizModes(currentList.fields) : [];

  function handleStartQuiz(mode) {
    onStartQuiz({
      listId: effectiveListId,
      showFields: mode.showFields,
      answerField: mode.answerField,
      mode: 'quiz',
    });
  }

  function handleStartFlashcard(mode) {
    onStartQuiz({
      listId: effectiveListId,
      showFields: mode.showFields,
      answerField: mode.answerField,
      mode: 'flashcard',
    });
  }

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="quiz-setup">
      <div className="screen-header">
        <button className="btn btn-back" onClick={() => onNavigate('home')}>
          &larr; Back
        </button>
        <h2>Quiz Setup</h2>
      </div>

      {lists.length === 0 ? (
        <div className="empty-state">
          <p>No word lists available.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('upload')}>
            Add Words
          </button>
        </div>
      ) : (
        <>
          <div className="section">
            <h3>Choose a Word List</h3>
            <select
              value={effectiveListId}
              onChange={e => setSelectedListId(e.target.value)}
            >
              {lists.map(l => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.words.length} words)
                </option>
              ))}
            </select>
          </div>

          {currentList && (
            <div className="section">
              <h3>Choose Quiz Mode</h3>
              <p className="hint">
                Pick what you see and what you answer.
              </p>
              <div className="quiz-modes">
                {modes.map((mode, i) => (
                  <button
                    key={i}
                    className="btn btn-mode"
                    onClick={() => handleStartQuiz(mode)}
                  >
                    <span className="mode-show">
                      {mode.showFields.join(' + ')}
                    </span>
                    <span className="mode-arrow">&rarr;</span>
                    <span className="mode-answer">{mode.answerField}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentList && (
            <div className="section">
              <h3>Flashcard Mode</h3>
              <p className="hint">
                See the prompt, reveal the answer, then rate yourself.
              </p>
              <div className="quiz-modes">
                {modes.map((mode, i) => (
                  <button
                    key={i}
                    className="btn btn-mode"
                    onClick={() => handleStartFlashcard(mode)}
                  >
                    <span className="mode-show">
                      {mode.showFields.join(' + ')}
                    </span>
                    <span className="mode-arrow">&rarr;</span>
                    <span className="mode-answer">{mode.answerField}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
