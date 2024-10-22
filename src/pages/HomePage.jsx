// src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDogs } from '../redux/slices/dogsSlice';
import { extractTemperaments } from '../redux/slices/temperamentsSlice';
import DogCard from '../components/DogCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import { filterDogs } from '../utils/filterDogs';
import './HomePage.css';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const dogs = useSelector((state) => state.dogs.dogs);
    const temperaments = useSelector((state) => state.temperaments.temperaments);
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
            dispatch(fetchDogs()).then((response) => {
                dispatch(extractTemperaments(response.payload));
            });
        }
    }, [dispatch, status]);

    useEffect(() => {
        const filtered = filterDogs(dogs, searchTerm, temperamentFilter, originFilter, sortOrder);
        setFilteredDogs(filtered);
    }, [searchTerm, temperamentFilter, originFilter, sortOrder, dogs]);

    const indexOfLastDog = currentPage * dogsPerPage;
    const indexOfFirstDog = indexOfLastDog - dogsPerPage;
    const currentDogs = filteredDogs.slice(indexOfFirstDog, indexOfLastDog);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleCardClick = (dogId) => {
        navigate(`/dogs/${dogId}`, { state: { from: location.pathname, page: currentPage } });
    };

    const handleFormPageRedirect = () => {
        navigate('/create');
    };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading dogs</div>;
    }

    return (
        <div>
            <div className="header">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <button className="create-breed-button" onClick={handleFormPageRedirect}>
                    Create New Dog
                </button>
                <Filters 
                    temperaments={temperaments}
                    setTemperamentFilter={setTemperamentFilter} 
                    setOriginFilter={setOriginFilter} 
                    setSortOrder={setSortOrder} 
                    temperamentFilter={temperamentFilter} 
                    originFilter={originFilter} 
                    sortOrder={sortOrder} 
                />
            </div>
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
                currentPage={currentPage}
                totalItems={filteredDogs.length}
                itemsPerPage={dogsPerPage}
                onPageChange={paginate}
            />
        </div>
    );
};

export default HomePage;
