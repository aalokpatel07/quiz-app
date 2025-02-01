import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Timer = ({ timeLeft, setTimeLeft }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft]);

  return null; // Visual display handled in QuestionCard
};

Timer.propTypes = {
  timeLeft: PropTypes.number.isRequired,
  setTimeLeft: PropTypes.func.isRequired
};

export default Timer;