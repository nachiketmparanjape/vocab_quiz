import { useState, useMemo, useEffect } from 'react';
import { loadLists, updateWord } from '../utils/storage.js';
import { processAnswer } from '../utils/srs.js';
import { selectQuizWords, generateQuestion } from '../utils/quizEngine.js';
import QuizQuestion from './QuizQuestion.jsx';
import FlashcardQuestion from './FlashcardQuestion.jsx';

export default function Quiz({ config, onNavigate }) {
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLists()
      .then((lists) => {
        setList(lists.find(l => l.id === config.listId) || null);
      })
      .finally(() => setLoading(false));
  }, [config.listId]);

  const quizWords = useMemo(
    () => (list ? selectQuizWords(list.words) : []),
    [list]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [finished, setFinished] = useState(false);

  if (loading) return <div className="loading">Loading...</div>;

  if (!list || quizWords.length === 0) {
    return (
      <div className="quiz">
        <div className="screen-header">
          <button className="btn btn-back" onClick={() => onNavigate('home')}>
            &larr; Back
          </button>
          <h2>Quiz</h2>
        </div>
        <div className="empty-state">
          <p>No words available for review right now.</p>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentWord = quizWords[currentIndex];
  const question = currentWord
    ? generateQuestion(currentWord, list.words, config.showFields, config.answerField)
    : null;

  async function handleAnswer(answer) {
    const isCorrect = typeof answer === 'object' ? answer.isCorrect : answer;
    const quality = typeof answer === 'object' ? answer.quality : null;
    const updatedWord = processAnswer(currentWord, isCorrect, quality);
    await updateWord(config.listId, updatedWord);

    setTotalAnswered(prev => prev + 1);
    if (isCorrect) setCorrectCount(prev => prev + 1);

    if (currentIndex + 1 >= quizWords.length) {
      setFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }

  if (finished) {
    const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
    return (
      <div className="quiz">
        <div className="quiz-complete">
          <h2>Quiz Complete!</h2>
          <div className="results">
            <div className="result-stat">
              <span className="result-number">{correctCount}</span>
              <span className="result-label">Correct</span>
            </div>
            <div className="result-stat">
              <span className="result-number">{totalAnswered - correctCount}</span>
              <span className="result-label">Incorrect</span>
            </div>
            <div className="result-stat">
              <span className="result-number">{accuracy}%</span>
              <span className="result-label">Accuracy</span>
            </div>
          </div>
          <div className="quiz-complete-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('quiz-setup')}>
              Quiz Again
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('home')}>
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <button className="btn btn-back" onClick={() => onNavigate('home')}>
          &larr; Quit
        </button>
        <div className="quiz-progress-info">
          {currentIndex + 1} / {quizWords.length}
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentIndex + 1) / quizWords.length) * 100}%` }}
        />
      </div>

      {config.mode === 'flashcard' ? (
        <FlashcardQuestion
          key={currentWord.id + '-' + currentIndex}
          question={question}
          onAnswer={handleAnswer}
        />
      ) : (
        <QuizQuestion
          key={currentWord.id + '-' + currentIndex}
          question={question}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
}
