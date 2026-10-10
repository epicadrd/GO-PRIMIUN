import { DataTypes } from 'sequelize';
import db from '../config/db.js';

import Vehicle from './Vehicle.js';

const VehicleSchedule = db.define(
  'vehicle_schedules',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    /*
     * Días:
     * 0 = Domingo
     * 1 = Lunes
     * 2 = Martes
     * 3 = Miércoles
     * 4 = Jueves
     * 5 = Viernes
     * 6 = Sábado
     */
    day_of_week: {
      type: DataTypes.TINYINT,
      allowNull: false
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: 'vehicle_schedules',
    timestamps: true
  }
);

VehicleSchedule.belongsTo(
  Vehicle,
  {
    foreignKey: 'vehicle_id'
  }
);

Vehicle.hasMany(
  VehicleSchedule,
  {
    foreignKey: 'vehicle_id'
  }
);

export default VehicleSchedule;