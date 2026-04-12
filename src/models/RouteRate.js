import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const RouteRate = db.define('route_rates', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  origin_zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  destination_zone_id: {
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
  timestamps: false,
  tableName: 'route_rates'
});

export default RouteRate;