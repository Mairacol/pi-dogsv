const server = require('./src/app.js');
const { conn } = require('./src/db.js');

// Sincronizando todos los modelos
conn.sync({ force: true }).then(() => {
  const PORT = process.env.PORT || 3001; // Usar el puerto proporcionado por Railway
  server.listen(PORT, () => {
    console.log(`%s listening at ${PORT}`); // eslint-disable-line no-console
  });
}).catch(error => {
  console.error('Unable to connect to the database:', error);
});

