import React, { useState, useEffect, useRef } from 'react';
import './FormPage.css';

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    height: '',
    weight: '',
    lifeSpan: '',
    image: '',
    temperaments: [],
  });

  const [errors, setErrors] = useState({
    name: '',
    height: '',
    weight: '',
    lifeSpan: '',
    image: '',
    temperaments: '',
  });

  const [success, setSuccess] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    // Inicializar Slim Select después de que el componente haya sido montado
    const select = new SlimSelect({
      select: selectRef.current,
      placeholder: 'Select temperaments',
      allowDeselect: true,
      deselectLabel: '<span>&times;</span>',
      showSearch: true,
      searchText: 'No Results',
      searchPlaceholder: 'Search',
      closeOnSelect: false,
      maxSelected: 5,
      afterClose: () => {
        const selectedOptions = Array.from(selectRef.current.options)
          .filter(option => option.selected)
          .map(option => option.value);
        setFormData({ ...formData, temperaments: selectedOptions });
      },
    });

    // Cleanup Slim Select on component unmount
    return () => {
      select.destroy();
    };
  }, [formData]);

  useEffect(() => {
    // Fetch temperaments from the server
    const fetchTemperaments = async () => {
      try {
        const response = await fetch('http://localhost:3001/temperaments');
        const temperaments = await response.json();
        const selectElement = selectRef.current;

        temperaments.forEach(temperament => {
          const option = document.createElement('option');
          option.value = temperament.name;
          option.text = temperament.name;
          selectElement.appendChild(option);
        });
      } catch (error) {
        console.error('Error fetching temperaments:', error);
      }
    };

    fetchTemperaments();
  }, []);

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    if (name.length < 2 || name.length > 30) return 'Name must be between 2 and 30 characters';
    if (!nameRegex.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateHeight = (height) => {
    const heightNum = parseFloat(height);
    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 200) return 'Height must be between 1 and 200 cm';
    return '';
  };

  const validateWeight = (weight) => {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 100) return 'Weight must be between 1 and 100 kg';
    return '';
  };

  const validateLifeSpan = (lifeSpan) => {
    const lifeSpanNum = parseInt(lifeSpan, 10);
    if (isNaN(lifeSpanNum) || lifeSpanNum <= 0 || lifeSpanNum > 30) return 'Life Span must be between 1 and 30 years';
    return '';
  };

  const validateTemperaments = (temperaments) => {
    if (temperaments.length < 1 || temperaments.length > 5) return 'You must select between 1 and 5 temperaments';
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the changed field
    setErrors({
      ...errors,
      [name]: name === 'name' ? validateName(value) :
              name === 'height' ? validateHeight(value) :
              name === 'weight' ? validateWeight(value) :
              name === 'lifeSpan' ? validateLifeSpan(value) :
              name === 'temperaments' ? validateTemperaments(value) : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos antes de enviar
    const newErrors = {
      name: validateName(formData.name),
      height: validateHeight(formData.height),
      weight: validateWeight(formData.weight),
      lifeSpan: validateLifeSpan(formData.lifeSpan),
      temperaments: validateTemperaments(formData.temperaments),
    };

    if (Object.values(newErrors).some(error => error !== '')) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = {
      name: formData.name,
      height: formData.height,
      weight: formData.weight,
      lifeSpan: formData.lifeSpan,
      imageUrl: formData.image,
      temperaments: formData.temperaments,
    };

    try {
      const response = await fetch('http://localhost:3001/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      setSuccess(true);
      setFormData({
        name: '',
        height: '',
        weight: '',
        lifeSpan: '',
        image: '',
        temperaments: [],
      });
      setErrors({
        name: '',
        height: '',
        weight: '',
        lifeSpan: '',
        image: '',
        temperaments: '',
      });
    } catch (err) {
      setErrors({ ...errors, form: err.message });
    }
  };

  // Effect to remove notification after some time
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="form-page">
      <div className="form-container">
        <h1>Create New Dog</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="height">Height (cm)</label>
            <input
              type="text"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
            />
            {errors.height && <p className="error">{errors.height}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight (kg)</label>
            <input
              type="text"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
            />
            {errors.weight && <p className="error">{errors.weight}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="lifeSpan">Life Span (years)</label>
            <input
              type="text"
              id="lifeSpan"
              name="lifeSpan"
              value={formData.lifeSpan}
              onChange={handleChange}
              required
            />
            {errors.lifeSpan && <p className="error">{errors.lifeSpan}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="http://example.com/image.jpg"
            />
            {errors.image && <p className="error">{errors.image}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="temperaments">Temperaments</label>
            <select
              id="temperaments"
              name="temperaments"
              ref={selectRef}
              multiple
              required
            ></select>
            {errors.temperaments && <p className="error">{errors.temperaments}</p>}
          </div>
          <button type="submit" className="submit-button">Create Dog</button>
          <div className='container-back-button'>
            <a className="submit-button back-home" href="/home">Back</a>
          </div>
        </form>
        {success && <p className="notification">Dog created successfully!</p>}
        
      </div>
    </div>
  );
};

export default FormPage;



