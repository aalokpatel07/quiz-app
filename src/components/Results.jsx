import React from 'react';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';

const Results = ({ score, total, onRestart }) => (
  <div className="results-container">
    <Confetti recycle={false} numberOfPieces={500} />
    <h2>Quiz Complete! 🎉</h2>
    <div className="score-meter">
      <div className="score-fill" style={{ width: `${(score/total)*100}%` }} />
      <div className="score-text">
        {score}/{total} ({(score/total*100).toFixed(1)}%)
      </div>
    </div>
    <button className="restart-button" onClick={onRestart}>
      Play Again
    </button>
  </div>
);

Results.propTypes = {
  score: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onRestart: PropTypes.func.isRequired
};

export default Results;