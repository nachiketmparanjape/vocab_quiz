import { useState } from 'react';

export default function FlashcardQuestion({ question, onAnswer }) {
  const [revealed, setRevealed] = useState(false);

  function handleRating(quality) {
    const isCorrect = quality !== 'again';
    onAnswer({ isCorrect, quality });
  }

  return (
    <div className="quiz-question">
      <div className="question-prompt">
        <p className="prompt-label">
          {question.showFields.join(' + ')} &rarr; {question.answerField}
        </p>
        <h2 className="prompt-text">{question.prompt}</h2>
      </div>

      {!revealed ? (
        <div className="flashcard-reveal">
          <button
            className="btn btn-primary flashcard-show-btn"
            onClick={() => setRevealed(true)}
          >
            Show Answer
          </button>
        </div>
      ) : (
        <div className="flashcard-answer">
          <div className="flashcard-correct-answer">
            <span className="prompt-label">{question.answerField}</span>
            <strong>{question.correctAnswer}</strong>
          </div>

          <div className="word-context">
            {Object.entries(question.word.fields).map(([key, val]) => (
              <div key={key} className="context-field">
                <span className="context-key">{key}:</span>{' '}
                <span className="context-value">{val}</span>
              </div>
            ))}
          </div>

          <div className="flashcard-ratings">
            <button
              className="btn btn-rating-again"
              onClick={() => handleRating('again')}
            >
              Again
            </button>
            <button
              className="btn btn-rating-hard"
              onClick={() => handleRating('hard')}
            >
              Hard
            </button>
            <button
              className="btn btn-rating-good"
              onClick={() => handleRating('good')}
            >
              Good
            </button>
            <button
              className="btn btn-rating-easy"
              onClick={() => handleRating('easy')}
            >
              Easy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
