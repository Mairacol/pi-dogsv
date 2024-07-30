//src/models/Dog.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Dog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lifeSpan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  origin: {
    type: DataTypes.STRING,
    defaultValue: 'DB', // Asume que es de la base de datos por defecto
  },
temperaments: {
  type: DataTypes.JSON, // Campo JSON para almacenar los temperamentos
  allowNull: true,
}
  }, {});

  return sequelize.models.Dog;
};

 