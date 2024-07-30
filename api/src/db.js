require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, DB_PORT,
} = process.env;

// Imprimir variables de entorno para verificar que están cargadas correctamente
console.log('DB User:', DB_USER);
console.log('DB Password:', DB_PASSWORD);
console.log('DB Host:', DB_HOST);
console.log('DB Name:', DB_NAME);
console.log('DB Port:', DB_PORT || 'default: 5432'); // Valor por defecto si no está definido

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT || 5432}/${DB_NAME}`, {
  logging: false, // Puedes cambiar esto a `console.log` para habilitar el registro de consultas SQL
  native: false,
});

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, 'models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, 'models', file)));
  });

// Injectamos la conexión (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));

// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map(([key, value]) => [key[0].toUpperCase() + key.slice(1), value]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Dog, Temperament } = sequelize.models;

// Relaciones
Dog.belongsToMany(Temperament, { through: 'DogTemperament' });
Temperament.belongsToMany(Dog, { through: 'DogTemperament' });

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Dog, Temperament } = require('./db.js');
  conn: sequelize,     // para importar la conexión { conn } = require('./db.js');
};

// Verificar conexión
sequelize.authenticate()
  .then(() => {
    console.log('La conexión con la base de datos se ha establecido correctamente.');
  })
  .catch(err => {
    console.error('No se puede conectar a la base de datos:', err);
  });
