// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDogs } from '../redux/slices/dogsSlice';
import DogCard from '../components/DogCard';
import SearchBar from '../components/SearchBar';
import './HomePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchTemperaments } from '../redux/slices/temperamentsSlice'; // Asegúrate de tener este slice configurado

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const dogs = useSelector((state) => state.dogs.dogs);
    const temperaments = useSelector((state) => state.temperaments.temperaments); // Obtén temperamentos del estado
    const status = useSelector((state) => state.dogs.status);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDogs, setFilteredDogs] = useState([]);
    const [temperamentFilter, setTemperamentFilter] = useState('');
    const [originFilter, setOriginFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
    const dogsPerPage = 8;
  
    useEffect(() => {
      if (status === 'idle') {
        dispatch(fetchDogs());
        dispatch(fetchTemperaments()); // Carga temperamentos
      }
    }, [dispatch, status]);
  
    useEffect(() => {
      let filtered = dogs;
      if (searchTerm) {
        filtered = filtered.filter(dog => dog.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (temperamentFilter) {
        filtered = filtered.filter(dog => dog.temperament && dog.temperament.includes(temperamentFilter));
      }
      if (originFilter) {
        filtered = filtered.filter(dog => originFilter === 'API' ? !dog.created : dog.created);
      }
      if (sortOrder) {
        if (sortOrder === 'name-asc') {
          filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOrder === 'name-desc') {
          filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortOrder === 'weight-asc') {
          filtered = filtered.sort((a, b) => parseFloat(a.weight.metric.split(' - ')[0]) - parseFloat(b.weight.metric.split(' - ')[0]));
        } else if (sortOrder === 'weight-desc') {
          filtered = filtered.sort((a, b) => parseFloat(b.weight.metric.split(' - ')[0]) - parseFloat(a.weight.metric.split(' - ')[0]));
        }
      }
      setFilteredDogs(filtered);
    }, [searchTerm, temperamentFilter, originFilter, sortOrder, dogs]);
  
    const indexOfLastDog = currentPage * dogsPerPage;
    const indexOfFirstDog = indexOfLastDog - dogsPerPage;
    const currentDogs = filteredDogs.slice(indexOfFirstDog, indexOfLastDog);
  
    const paginate = pageNumber => {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    };
  
    const handleCardClick = (dogId) => {
      console.log("Navigating to:", `/dogs/${dogId}`, { state: { from: location.pathname, page: currentPage } });
      navigate(`/dogs/${dogId}`, { state: { from: location.pathname, page: currentPage } });
    };
  
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
  
    if (status === 'failed') {
      return <div>Error loading dogs</div>;
    }
  
    return (
      <div>
        <SearchBar setSearchTerm={setSearchTerm} />
        <Filters 
          temperaments={temperaments}
          setTemperamentFilter={setTemperamentFilter} 
          setOriginFilter={setOriginFilter} 
          setSortOrder={setSortOrder} 
        />
        <div className="card-container">
          {currentDogs.length > 0 ? (
            currentDogs.map(dog => (
              <DogCard 
                key={dog.id} 
                dogData={dog} 
                onClick={() => handleCardClick(dog.id)} 
              />
            ))
          ) : (
            <p>No dogs found</p>
          )}
        </div>
        <Pagination 
          dogsPerPage={dogsPerPage} 
          totalDogs={filteredDogs.length} 
          paginate={paginate} 
        />
      </div>
    );
  };
  
  const Filters = ({ temperaments, setTemperamentFilter, setOriginFilter, setSortOrder }) => (
    <div className="filters">
      <select onChange={(e) => setTemperamentFilter(e.target.value)}>
        <option value="">All Temperaments</option>
        {temperaments.map((temperament) => (
          <option key={temperament.id} value={temperament.name}>{temperament.name}</option>
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
  
  const Pagination = ({ dogsPerPage, totalDogs, paginate }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalDogs / dogsPerPage); i++) {
      pageNumbers.push(i);
    }
  
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number} className="page-item">
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default HomePage;