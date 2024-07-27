// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDogsByName, fetchDogs } from '../redux/slices/dogsSlice'; // Importar fetchDogs para recargar todos los perros
import './SearchBar.css';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate para la redirección

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Usar navigate para la redirección

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      dispatch(fetchDogsByName(localSearchTerm));
      setSearchTerm(localSearchTerm);
      setLocalSearchTerm('');
    }
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    setSearchTerm('');
    dispatch(fetchDogs()); // Volver a cargar todos los perros
    navigate('/Home'); // Redirigir a la página principal
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-icon"></div>
      <input
        type="text"
        value={localSearchTerm}
        onChange={(e) => setLocalSearchTerm(e.target.value)}
        placeholder="Search for a dog breed..."
      />
      <button type="submit">Search</button>
      <button type="button" onClick={handleClear}>Clear</button>
    </form>
  );
};

export default SearchBar;
