const { Router } = require('express');
const { Dog, Temperament } = require('../db');
const axios = require('axios');
const { Sequelize } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const router = Router();

// Función para obtener un perro desde la base de datos
const getDogFromDB = async (id) => {
    try {
        const dog = await Dog.findOne({
            where: {
                id: id
            },
            include: Temperament,
        });

        if (dog) {
            return {
                id: dog.id,
                name: dog.name,
                height: dog.height,
                weight: dog.weight,
                life_span: dog.lifeSpan,
                temperaments: dog.Temperaments ? dog.Temperaments.map(t => t.name) : [],
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al buscar en la base de datos:', error);
        return null;
    }
};

// Función para obtener un perro desde la API externa por nombre
const getDogFromAPIByName = async (name) => {
    try {
        const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${name}&api_key=${process.env.API_KEY}`);
        const dogsFromApi = apiResponse.data;

        if (dogsFromApi.length > 0) {
            return dogsFromApi[0];
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error al buscar en la API externa:', error);
        return null;
    }
};

// Ruta para obtener un perro por nombre
router.get('/name', async (req, res) => {
    const { name } = req.query;
    console.log('Searching for name:', name);

    if (!name) {
        return res.status(400).json({ message: 'Name query parameter is required' });
    }

    try {
        const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds/search?q=${name}&api_key=${process.env.API_KEY}`);
        const dogsFromApi = apiResponse.data;
        console.log('Dogs from API:', dogsFromApi);

        const dogsFromDb = await Dog.findAll({
            where: {
                name: {
                    [Sequelize.Op.iLike]: `%${name}%`,
                },
            },
            include: Temperament,
        });
        console.log('Dogs from DB:', dogsFromDb);

        const allDogs = [...dogsFromApi, ...dogsFromDb];

        if (allDogs.length > 0) {
            return res.json(allDogs);
        } else {
            return res.status(404).json({ message: 'Dog not found' });
        }
    } catch (error) {
        console.error('Error en la búsqueda por nombre:', error);
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener todas las razas de perros
router.get('/', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${process.env.API_KEY}`);
        const dogsFromApi = apiResponse.data;

        const dogsFromDb = await Dog.findAll({
            include: Temperament,
        });

        const allDogs = [...dogsFromApi, ...dogsFromDb];
        res.json(allDogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para obtener una raza específica por ID
router.get('/:idRaza', async (req, res) => {
  const { idRaza } = req.params;

  try {
      // Intentar obtener el perro de la base de datos
      let dog = await getDogFromDB(idRaza);

      if (!dog) {
          // Si no está en la base de datos, buscar en la API externa
          const apiResponse = await axios.get(`https://api.thedogapi.com/v1/breeds`);
          const dogsFromApi = apiResponse.data;

          const dogFromApi = dogsFromApi.find(d => d.id == idRaza);

          if (dogFromApi) {
              dog = {
                  id: dogFromApi.id,
                  name: dogFromApi.name,
                  height: dogFromApi.height.metric,
                  weight: dogFromApi.weight.metric,
                  life_span: dogFromApi.life_span,
                  temperaments: dogFromApi.temperament ? dogFromApi.temperament.split(', ') : [],
              };
          }
      }

      if (!dog) {
          return res.status(404).json({ message: 'Dog not found' });
      }

      res.json(dog);
  } catch (error) {
      console.error('Error al obtener el detalle del perro:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// Ruta para crear un nuevo perro
router.post('/', async (req, res) => {
    const { name, image, height, weight, lifeSpan, temperaments } = req.body;
    try {
        // Generar un UUID para el nuevo perro
        const newDogId = uuidv4();

        const newDog = await Dog.create({
            id: newDogId, // Asegúrate de usar el UUID aquí
            name,
            image,
            height,
            weight,
            lifeSpan,
        });

        const temperamentInstances = await Temperament.findAll({
            where: { name: temperaments },
        });

        await newDog.addTemperaments(temperamentInstances);
        res.status(201).json(newDog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;


