import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

function QuestionCard({ question, onSubmit, timeLeft }) {
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [hasAnswered, setHasAnswered] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);

  // Clear state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowFeedback(false);
  }, [question]);

  const handleAnswerSelect = (index) => {
    if (hasAnswered || timeLeft === 0) return;

    setSelectedAnswer(index);
    setHasAnswered(true);
    
    // Show visual feedback before submitting
    setShowFeedback(true);
    
    // Submit after 1.5s to allow animation
    const timeout = setTimeout(() => {
      onSubmit(index);
      setShowFeedback(false);
    }, 1500);

    return () => clearTimeout(timeout);
  };

  const getAnswerStatus = (index) => {
    if (!showFeedback) return '';
    if (index === question.correctAnswer) return 'correct';
    if (index === selectedAnswer) return 'incorrect';
    return '';
  };

  return (
    <div className="question-card">
      <h2 className="question-text">{question.description}</h2> {/* Use description */}
      
      <div className="options-grid">
        {question.options.map((option, index) => {
          const isCorrect = option.is_correct; // Use API's is_correct flag
          const isSelected = selectedAnswer === index;

          return (
            <button
              key={option.id} // Use unique ID from API
              className={`option-btn 
                ${isSelected ? 'selected' : ''} 
                ${hasAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={hasAnswered || timeLeft === 0}
            >
              <span className="option-content">
                <span className="option-text">{option.description}</span> {/* Show description */}
                {isSelected && (
                  <span className="feedback-indicator">
                    {isCorrect ? '✓' : '✕'}
                  </span>
                )}
              </span>
              
              {hasAnswered && isCorrect && (
                <div className="correct-answer-overlay">Correct Answer</div>
              )}
            </button>
          );
        })}
      </div>

      <div className="time-status" aria-live="assertive">
        {timeLeft > 0 ? (
          `${timeLeft} second${timeLeft !== 1 ? 's' : ''} remaining`
        ) : (
          "Time's up!"
        )}
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.shape({
    text: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    correctAnswer: PropTypes.number.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired,
  timeLeft: PropTypes.number.isRequired
};

export default QuestionCard;
