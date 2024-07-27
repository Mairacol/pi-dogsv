// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FormPage from './pages/FormPage';
import { useSelector } from 'react-redux';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dogs/:id" element={<DetailPage />} />
        <Route path="/create" element={<FormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
