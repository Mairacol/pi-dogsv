import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDogById } from '../redux/slices/dogsSlice';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './DetailPage.css'; // Asegúrate de que el archivo CSS esté importado

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
    const from = location.state?.from || '/home'; // Redirige a la página de origen
    const page = location.state?.page || 1; // Usa la página guardada en el estado o por defecto 1
    navigate(from, { state: { page } }); // Redirige a la página anterior con el estado de la página
  };

  const temperaments = Array.isArray(dog.temperament) 
    ? dog.temperament.join(', ') 
    : dog.temperament || 'No temperament available';

  return (
    <div className="detail-page">
      <div className="dog-detail-card">
        <div className="dog-detail-image-container">
          <img
            src={dog.reference_image_id 
              ? `https://cdn2.thedogapi.com/images/${dog.reference_image_id}.jpg`
              : 'https://via.placeholder.com/500'}
            alt={dog.name}
            className="dog-detail-image"
          />
        </div>
        <div className="dog-detail-info">
          <h2>{dog.name}</h2>
          <p>ID: {dog.id}</p>
          <p>Height: {dog.height.metric} cm</p>
          <p>Weight: {dog.weight.metric} kg</p>
          <p>Temperaments: {temperaments}</p>
          <p>Life Span: {dog.life_span}</p>
        </div>
        <button className="back-button" onClick={handleBackClick}>
          Back
        </button>
      </div>
    </div>
  );
};

export default DetailPage;
