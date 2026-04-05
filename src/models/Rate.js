import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Rate = db.define('rates', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  zone_id: { type: DataTypes.INTEGER },
  vehicle_id: { type: DataTypes.INTEGER },
  one_way_price: { type: DataTypes.FLOAT },
  round_trip_price: { type: DataTypes.FLOAT }
}, {
  timestamps: false
});

export default Rate;