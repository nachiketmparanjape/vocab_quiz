import { useState } from 'react';

export default function QuizQuestion({ question, onAnswer }) {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  function checkAnswer(answer) {
    const correct =
      answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    setSelectedOption(answer);
  }

  function handleTypingSubmit(e) {
    e.preventDefault();
    if (!typedAnswer.trim()) return;
    checkAnswer(typedAnswer);
  }

  function handleNext() {
    onAnswer(isCorrect);
  }

  return (
    <div className="quiz-question">
      <div className="question-prompt">
        <p className="prompt-label">
          {question.showFields.join(' + ')} &rarr; {question.answerField}
        </p>
        <h2 className="prompt-text">{question.prompt}</h2>
      </div>

      {!answered ? (
        question.type === 'multiple-choice' ? (
          <div className="options-grid">
            {question.options.map((opt, i) => (
              <button
                key={i}
                className="btn btn-option"
                onClick={() => checkAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <form className="typing-form" onSubmit={handleTypingSubmit}>
            <input
              type="text"
              placeholder={`Type the ${question.answerField}...`}
              value={typedAnswer}
              onChange={e => setTypedAnswer(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary" type="submit">
              Check
            </button>
          </form>
        )
      ) : (
        <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-header">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>

          {!isCorrect && (
            <div className="correct-answer">
              Correct answer: <strong>{question.correctAnswer}</strong>
            </div>
          )}

          <div className="word-context">
            {Object.entries(question.word.fields).map(([key, val]) => (
              <div key={key} className="context-field">
                <span className="context-key">{key}:</span>{' '}
                <span className="context-value">{val}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
