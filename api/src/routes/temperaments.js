// src/routes/temperaments.js

const { Router } = require('express');
const axios = require('axios');
const { Temperament } = require('../db');

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Obtener temperamentos desde la API externa
    const response = await axios.get('https://api.thedogapi.com/v1/breeds');
    const breeds = response.data;

    // Extraer temperamentos y eliminar duplicados
    const temperaments = breeds
      .flatMap(breed => breed.temperament ? breed.temperament.split(', ') : [])
      .filter((value, index, self) => self.indexOf(value) === index);

    // Guardar temperamentos en la base de datos
    const temperamentPromises = temperaments.map(name => 
      Temperament.findOrCreate({ where: { name } })
    );
    await Promise.all(temperamentPromises);

    // Obtener todos los temperamentos desde la base de datos
    const allTemperaments = await Temperament.findAll();

    // Convertir los resultados a JSON
    const temperamentsJSON = allTemperaments.map(temperament => temperament.toJSON());

    // Enviar respuesta JSON
    res.json(temperamentsJSON);
  } catch (error) {
    console.error('Error al obtener temperamentos:', error);
    res.status(500).json({ error: 'Error al obtener temperamentos' });
  }
});

module.exports = router;