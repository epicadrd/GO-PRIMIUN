import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Zone from './Zone.js';
import Vehicle from './Vehicle.js';

const Rate = db.define('rates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  one_way_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  round_trip_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'rates',
  timestamps: false
});

// Relaciones
Rate.belongsTo(Zone, { foreignKey: 'zone_id' });
Rate.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

export default Rate;