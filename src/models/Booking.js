import { DataTypes } from 'sequelize';
import db from '../config/db.js';

import Zone from './Zone.js';
import Destination from './Destination.js';
import Vehicle from './Vehicle.js';

const Booking = db.define(
  'bookings',
  {
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

    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    trip_type: {
      type: DataTypes.ENUM(
        'one_way',
        'round_trip'
      ),
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

    return_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    return_time: {
      type: DataTypes.TIME,
      allowNull: true
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
      type: DataTypes.ENUM(
        'pending',
        'confirmed',
        'completed',
        'cancelled'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },

    payment_status: {
      type: DataTypes.ENUM(
        'pending',
        'paid',
        'failed',
        'refunded'
      ),
      allowNull: false,
      defaultValue: 'pending'
    },

    payment_provider: {
      type: DataTypes.STRING(30),
      allowNull: true
    },

    paypal_order_id: {
      type: DataTypes.STRING(40),
      allowNull: true,
      unique: true
    },

    paypal_capture_id: {
      type: DataTypes.STRING(40),
      allowNull: true,
      unique: true
    },

    paid_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    payment_currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: 'USD'
    },

    payer_email: {
      type: DataTypes.STRING(120),
      allowNull: true
    },

    paid_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    invoice_sent_at: {
      type: DataTypes.DATE,
      allowNull: true
    },

    /*
     * Mientras el cliente completa el pago,
     * este campo mantiene reservado el horario.
     */
    reservation_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'bookings',
    timestamps: true
  }
);

Booking.belongsTo(
  Destination,
  {
    foreignKey: 'pickup_destination_id',
    as: 'pickupDestination'
  }
);

Booking.belongsTo(
  Destination,
  {
    foreignKey: 'dropoff_destination_id',
    as: 'dropoffDestination'
  }
);

Booking.belongsTo(
  Zone,
  {
    foreignKey: 'zone_id'
  }
);

Booking.belongsTo(
  Vehicle,
  {
    foreignKey: 'vehicle_id'
  }
);

export default Booking;