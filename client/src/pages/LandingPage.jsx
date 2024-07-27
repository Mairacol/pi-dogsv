// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Asegúrate de tener un archivo CSS para los estilos

const LandingPage = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/home');
  };

  return (
    <div className="landing-page">
      <img src="path-to-your-background-image.jpg" alt="Background" className="background-image" />
      <button onClick={handleClick} className="enter-button">Go to Home Page</button>
    </div>
  );
};

export default LandingPage;
