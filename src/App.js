import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionCard from './components/QuestionCard';
import Results from './components/Results';
import ProgressBar from './components/ProgressBar';
import Timer from './components/Timer';
import './App.css';

// const API_ENDPOINT = 'https://api.jsonserve.com/Uw5CrX';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('/Uw5CrX');
        if (!response.data?.questions) throw new Error('Invalid data format');
        setQuestions(response.data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (!quizCompleted && timeLeft === 0) {
      handleAnswerSelect(null);
    }
  }, [timeLeft]);

  const handleAnswerSelect = (selectedIndex) => {
    const question = questions[currentQuestion];
    const selectedOption = question.options[selectedIndex];
    
    // Use is_correct flag from API
    const isCorrect = selectedOption?.is_correct || false;

    // Score calculation
    setScore(prev => isCorrect ? prev + 10 + Math.min(streak, 5) : prev);
    setStreak(prev => isCorrect ? prev + 1 : 0);

    // Question transition
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setTimeLeft(30);
      } else {
        setQuizCompleted(true);
      }
    }, 100);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setQuizCompleted(false);
    setTimeLeft(30);
  };

  if (loading) return <div className="loader">Loading Quiz...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!questions.length) return <div>No questions available</div>;

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Quiz Challenge</h1>
        <div className="stats">
          <span>Score: {score}</span>
          <span>Streak: {streak}x</span>
        </div>
      </header>

      {!quizCompleted ? (
        <div className="quiz-section">
          <ProgressBar 
            current={currentQuestion + 1} 
            total={questions.length} 
          />
          
          <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} />

          <QuestionCard
            question={questions[currentQuestion]}
            onSubmit={handleAnswerSelect}
            timeLeft={timeLeft}
          />
        </div>
      ) : (
        <Results 
          score={score} 
          total={questions.length * 10} 
          onRestart={handleRestart} 
        />
      )}
    </div>
  );
}

export default App;
