import { DataTypes } from 'sequelize';
import { sequelize } from '../db.js';

const Character = sequelize.define('Character', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Character;