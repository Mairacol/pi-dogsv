// src/pages/FormPage.jsx
import React, { useState } from 'react';
import './FormPage.css'; // Asegúrate de que el archivo CSS esté importado

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    heightMin: '',
    heightMax: '',
    weightMin: '',
    weightMax: '',
    lifeSpan: '',
    temperaments: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectTemperament = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      temperaments: [...formData.temperaments, value]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar el envío del formulario
    console.log('Form submitted:', formData);
  };

  return (
    <div className="form-page">
      <h1>Create a New Dog Breed</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="heightMin">Min Height (cm):</label>
          <input
            type="number"
            id="heightMin"
            name="heightMin"
            value={formData.heightMin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="heightMax">Max Height (cm):</label>
          <input
            type="number"
            id="heightMax"
            name="heightMax"
            value={formData.heightMax}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="weightMin">Min Weight (kg):</label>
          <input
            type="number"
            id="weightMin"
            name="weightMin"
            value={formData.weightMin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="weightMax">Max Weight (kg):</label>
          <input
            type="number"
            id="weightMax"
            name="weightMax"
            value={formData.weightMax}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lifeSpan">Life Span (years):</label>
          <input
            type="text"
            id="lifeSpan"
            name="lifeSpan"
            value={formData.lifeSpan}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="temperaments">Temperaments:</label>
          <select
            id="temperaments"
            name="temperaments"
            onChange={handleSelectTemperament}
            multiple
          >
            {/* Aquí puedes agregar opciones de temperamentos */}
            <option value="Friendly">Friendly</option>
            <option value="Loyal">Loyal</option>
            <option value="Energetic">Energetic</option>
            {/* Añade más opciones según sea necesario */}
          </select>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default FormPage;






