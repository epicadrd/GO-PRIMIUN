import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Zone = db.define('zones', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false
  }
}, {
  tableName: 'zones',
  timestamps: false
});

export default Zone;