import { useState, useEffect } from 'react';
import { onAuth, signInWithGoogle, signOut } from './utils/firebase.js';
import Home from './components/Home.jsx';
import WordUpload from './components/WordUpload.jsx';
import WordList from './components/WordList.jsx';
import QuizSetup from './components/QuizSetup.jsx';
import Quiz from './components/Quiz.jsx';
import Dashboard from './components/Dashboard.jsx';
import './App.css';

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = signed out
  const [screen, setScreen] = useState('home');
  const [quizConfig, setQuizConfig] = useState(null);

  useEffect(() => {
    return onAuth((u) => setUser(u));
  }, []);

  function handleNavigate(target) {
    setScreen(target);
  }

  function handleStartQuiz(config) {
    setQuizConfig(config);
    setScreen('quiz');
  }

  // Auth loading
  if (user === undefined) {
    return <div className="loading">Loading...</div>;
  }

  // Not signed in — show login screen
  if (!user) {
    return (
      <div className="login-screen">
        <h1>Vocab Quiz</h1>
        <p className="subtitle">Learn vocabulary with spaced repetition</p>
        <button className="btn btn-google" onClick={() => signInWithGoogle()}>
          <svg viewBox="0 0 24 24" width="20" height="20" className="google-icon">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    );
  }

  // Signed in — render app with sign-out in header
  const content = (() => {
    switch (screen) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'upload':
        return <WordUpload onNavigate={handleNavigate} />;
      case 'wordlist':
        return <WordList onNavigate={handleNavigate} />;
      case 'quiz-setup':
        return <QuizSetup onNavigate={handleNavigate} onStartQuiz={handleStartQuiz} />;
      case 'quiz':
        return quizConfig ? (
          <Quiz config={quizConfig} onNavigate={handleNavigate} />
        ) : (
          <QuizSetup onNavigate={handleNavigate} onStartQuiz={handleStartQuiz} />
        );
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  })();

  return (
    <>
      <div className="user-bar">
        <span className="user-name">{user.displayName || user.email}</span>
        <button className="btn btn-back btn-sm" onClick={() => signOut()}>
          Sign out
        </button>
      </div>
      {content}
    </>
  );
}
