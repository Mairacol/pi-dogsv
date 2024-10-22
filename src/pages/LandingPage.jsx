// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <button onClick={handleClick} className="enter-button">¡Welcome!</button>
    </div>
  );
};

export default LandingPage;
