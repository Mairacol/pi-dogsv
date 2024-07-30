'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   // Añadir la columna 'origin' a la tabla 'Dogs'
   await queryInterface.addColumn('Dogs', 'origin', {
    type: Sequelize.STRING,
    defaultValue: 'DB',
  });
},

down: async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('Dogs', 'origin');
}
};