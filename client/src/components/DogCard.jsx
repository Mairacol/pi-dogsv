import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DogCard.css';

const DogCard = ({ dogData }) => {
    const navigate = useNavigate();

    console.log('Dog Data:', dogData);

    // Maneja diferentes formatos de datos para la imagen
    let imageUrl;
    if (dogData.image) {
        imageUrl = dogData.image; // URL de imagen directamente desde la base de datos
    } else if (dogData.reference_image_id) {
        imageUrl = `https://cdn2.thedogapi.com/images/${dogData.reference_image_id}.jpg`; // URL de imagen de TheDogAPI
    } else {
        imageUrl = 'https://via.placeholder.com/150'; // Imagen de placeholder si no hay URL disponible
    }

    console.log('Image URL:', imageUrl);

    // Maneja diferentes formatos para el peso
    const weight = dogData.weight && dogData.weight.metric 
        ? `${dogData.weight.metric} kg` 
        : dogData.weight 
        ? dogData.weight 
        : 'Unknown weight';

    console.log('Weight:', weight);

    // Maneja la presentación de temperamentos
    const temperaments = dogData.temperament
        ? Array.isArray(dogData.temperament)
            ? dogData.temperament.join(', ') // Si es un array, únelos con comas
            : typeof dogData.temperament === 'string'
            ? dogData.temperament.split(', ').join(', ') // Si es un string, reemplaza comas
            : 'No temperament available'
        : 'No temperament available';

    console.log('Temperaments:', temperaments);

    const handleClick = () => {
        navigate(`/dogs/${dogData.id}`);
    };
  
    return (
        <div className="dog-card" onClick={handleClick}>
            <div className="dog-card-image-container">
                <img src={imageUrl} alt={dogData.name} className="dog-card-image" />
            </div>
            <div className="dog-card-content">
                <h3>{dogData.name}</h3>
                <p>{temperaments}</p>
                <p>Weight: {weight}</p>
            </div>
        </div>
    );
};

export default DogCard;

