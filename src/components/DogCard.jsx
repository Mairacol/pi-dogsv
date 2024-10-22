import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DogCard.css';

const DogCard = ({ dogData }) => {
    const navigate = useNavigate();

    console.log('Dog Data:', dogData);

    // Maneja diferentes formatos de datos para la imagen
    const imageUrl = dogData.image 
        ? dogData.image 
        : dogData.reference_image_id 
        ? `https://cdn2.thedogapi.com/images/${dogData.reference_image_id}.jpg` 
        : 'https://via.placeholder.com/150';

    console.log('Image URL:', imageUrl);

    // Maneja diferentes formatos para el peso
    const weight = dogData.weight && dogData.weight.metric 
        ? `${dogData.weight.metric} kg` 
        : dogData.weight 
        ? dogData.weight 
        : 'Unknown weight';

    console.log('Weight:', weight);

    // Maneja la presentación de temperamentos
    const temperaments = dogData.temperaments
        ? Array.isArray(dogData.temperaments)
            ? dogData.temperaments.join(', ')
            : typeof dogData.temperaments === 'string'
            ? dogData.temperaments
                .replace(/[\[\]"']/g, '') // Elimina caracteres no deseados
                .split(',')
                .map(temp => temp.trim())
                .join(', ')
            : 'No temperament available'
        : dogData.temperament
        ? Array.isArray(dogData.temperament)
            ? dogData.temperament.join(', ')
            : typeof dogData.temperament === 'string'
            ? dogData.temperament
                .replace(/[\[\]"']/g, '') // Elimina caracteres no deseados
                .split(',')
                .map(temp => temp.trim())
                .join(', ')
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

