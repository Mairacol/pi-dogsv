import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDogById } from '../redux/slices/dogsSlice';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './DetailPage.css';

const DetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dog = useSelector((state) => state.dogs.selectedDog);
  const status = useSelector((state) => state.dogs.status);
  const error = useSelector((state) => state.dogs.error);

  useEffect(() => {
    if (id) {
      dispatch(fetchDogById(id));
    }
  }, [dispatch, id]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error loading dog: {error}</div>;
  }

  if (!dog) {
    return <div>Dog not found</div>;
  }

  const handleBackClick = () => {
    const from = location.state?.from || '/home';
    const page = location.state?.page || 1;
    navigate(from, { state: { page } });
  };

  // Depuración de los datos del perro
  console.log('Dog Data:', dog);

  // Manejar temperamentos para ambas fuentes de datos
  const temperamentsFromApi = dog.temperament 
    ? dog.temperament.split(', ').map(temp => temp.trim()) 
    : [];

  const temperamentsFromDb = Array.isArray(dog.temperaments) 
    ? dog.temperaments 
    : (typeof dog.temperaments === 'string' ? JSON.parse(dog.temperaments) : []);

  const temperaments = temperamentsFromApi.length > 0 
    ? temperamentsFromApi 
    : temperamentsFromDb;

  // Construir la URL de la imagen
  const imageUrl = dog.image && (dog.image.startsWith('http') || dog.image.startsWith('https'))
    ? dog.image
    : (dog.reference_image_id 
        ? `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`
        : 'https://via.placeholder.com/500');

  console.log('Dog Image URL:', imageUrl); // Depuración
  console.log('Reference Image ID:', dog.reference_image_id); // Depuración
  console.log('Constructed Image URL:', imageUrl); // Verifica la URL generada

  const height = dog.height?.metric || dog.height || 'Unknown';
  const weight = dog.weight?.metric || dog.weight || 'Unknown';

  return (
    <div className="detail-page">
      <div className="dog-detail-card">
        <div className="dog-detail-image-container">
          <img
            src={imageUrl}
            alt={dog.name}
            className="dog-detail-image"
          />
        </div>
        <div className="dog-detail-info">
          <h2>{dog.name}</h2>
          <p>ID: {dog.id}</p>
          <p>Height: {height} cm</p>
          <p>Weight: {weight} kg</p>
          <p>Temperaments: {temperaments.length > 0 ? temperaments.join(', ') : 'No temperament available'}</p>
          <p>Life Span: {dog.life_span || dog.lifeSpan}</p>
        </div>
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default DetailPage;
