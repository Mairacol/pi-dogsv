// src/components/DogCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DogCard.css';

const DogCard = ({ dogData }) => {
    const navigate = useNavigate(); // Importa y usa el hook useNavigate

    console.log('Dog Data:', dogData); // Log para verificar la estructura de dogData

    const imageUrl = dogData.reference_image_id 
      ? `https://cdn2.thedogapi.com/images/${dogData.reference_image_id}.jpg` 
      : 'https://via.placeholder.com/150';

    const handleClick = () => {
        navigate(`/dogs/${dogData.id}`); // Usa navigate para redirigir
    };
  
    return (
        <div className="dog-card" onClick={handleClick}>
            <div className="dog-card-image-container">
                <img src={imageUrl} alt={dogData.name} className="dog-card-image" />
            </div>
            <div className="dog-card-content">
                <h3>{dogData.name}</h3>
                <p>{dogData.temperament}</p>
                <p>Weight: {dogData.weight.metric} kg</p>
            </div>
        </div>
    );
};

export default DogCard;

  
