// src/components/Filters.jsx
// src/components/Filters.jsx
import React from 'react';

const Filters = ({ temperaments, setTemperamentFilter, setOriginFilter, setSortOrder }) => (
  <div className="filters">
    <select onChange={(e) => setTemperamentFilter(e.target.value)}>
      <option value="">All Temperaments</option>
      {temperaments.map((temperament) => (
        <option key={temperament} value={temperament}>{temperament}</option>
      ))}
    </select>
    <select onChange={(e) => setOriginFilter(e.target.value)}>
      <option value="">All Origins</option>
      <option value="API">API</option>
      <option value="DB">Database</option>
    </select>
    <select onChange={(e) => setSortOrder(e.target.value)}>
      <option value="">Sort By</option>
      <option value="name-asc">Name (A-Z)</option>
      <option value="name-desc">Name (Z-A)</option>
      <option value="weight-asc">Weight (Low-High)</option>
      <option value="weight-desc">Weight (High-Low)</option>
    </select>
  </div>
);

export default Filters;
