import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Hotel from './Hotel.js';
import Driver from './Driver.js';

const Booking = db.define('bookings', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zone_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trip_type: {
    type: DataTypes.ENUM('one_way', 'round_trip'),
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  travel_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  travel_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  passengers: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
}, {
  timestamps: false
});

Booking.belongsTo(Hotel, { foreignKey: 'hotel_id' });
Booking.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver'});

export default Booking;