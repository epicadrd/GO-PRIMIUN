import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Zone from './Zone.js';

const Destination = db.define('destinations', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  duration_text: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'destinations',
  timestamps: false
});

// Relación
Destination.belongsTo(Zone, { foreignKey: 'zone_id' });

export default Destination;