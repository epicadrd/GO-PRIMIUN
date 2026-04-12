import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Zone from './Zone.js';
import Destination from './Destination.js';
import Vehicle from './Vehicle.js';

const Booking = db.define('bookings', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  full_name: {
    type: DataTypes.STRING(120),
    allowNull: false
  },

  email: {
    type: DataTypes.STRING(120),
    allowNull: true
  },

  phone: {
    type: DataTypes.STRING(30),
    allowNull: false
  },

  pickup_destination_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  dropoff_destination_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  zone_id: {
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

  flight_number: {
    type: DataTypes.STRING(50),
    allowNull: true
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending'
  }

}, {
  tableName: 'bookings',
  timestamps: true
});

Booking.belongsTo(Destination, {
  foreignKey: 'pickup_destination_id',
  as: 'pickupDestination'
});

Booking.belongsTo(Destination, {
  foreignKey: 'dropoff_destination_id',
  as: 'dropoffDestination'
});

Booking.belongsTo(Zone, {
  foreignKey: 'zone_id'
});

Booking.belongsTo(Vehicle, {
  foreignKey: 'vehicle_id'
});

export default Booking;