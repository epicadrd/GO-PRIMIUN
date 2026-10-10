import express from 'express';
import dotenv from 'dotenv';

import {
  DataTypes
} from 'sequelize';

import path from 'path';

import {
  fileURLToPath
} from 'url';

import db
  from './src/config/db.js';

import destinationRoutes
  from './src/routes/destinationRoutes.js';

import vehicleRoutes
  from './src/routes/vehicleRoutes.js';

import priceRoutes
  from './src/routes/priceRoutes.js';

import availabilityRoutes
  from './src/routes/availabilityRoutes.js';

import paymentRoutes
  from './src/routes/paymentRoutes.js';

import {
  seedZones
} from './src/data/seedZones.js';

import {
  seedDestinations
} from './src/data/seedDestinations.js';

import {
  seedVehicles
} from './src/data/seedVehicles.js';

import {
  seedRouteRates
} from './src/data/seedRouteRates.js';

import VehicleSchedule
  from './src/models/VehicleSchedule.js';

dotenv.config();

const app = express();

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

app.use(
  express.json()
);

/*
 * Impide utilizar la página
 * administrativa antigua.
 */
app.get(
  '/admin-bookings.html',
  (req, res) => {
    return res
      .status(404)
      .send(
        'Página no encontrada'
      );
  }
);

app.use(
  express.static(
    path.join(
      __dirname,
      'public'
    )
  )
);

app.get(
  '/',
  (req, res) => {
    res.sendFile(
      path.join(
        __dirname,
        'public',
        'index.html'
      )
    );
  }
);

app.use(
  '/api/destinations',
  destinationRoutes
);

app.use(
  '/api/vehicles',
  vehicleRoutes
);

app.use(
  '/api/price',
  priceRoutes
);

app.use(
  '/api/payments/paypal',
  paymentRoutes
);

app.use(
  '/api/availability',
  availabilityRoutes
);

const PORT =
  Number(
    process.env.PORT ||
    3000
  );

/*
 * Agrega exclusivamente las columnas
 * faltantes.
 *
 * No utiliza sync({ alter: true }), por
 * lo que no vuelve a crear índices en
 * cada reinicio.
 */
async function syncRequiredTables() {
  const queryInterface =
    db.getQueryInterface();

  const bookingColumns =
    await queryInterface
      .describeTable(
        'bookings'
      );

  const requiredColumns = {
    driver_id: {
      type:
        DataTypes.INTEGER,

      allowNull:
        true
    },

    return_date: {
      type:
        DataTypes.DATEONLY,

      allowNull:
        true
    },

    return_time: {
      type:
        DataTypes.TIME,

      allowNull:
        true
    },

    reservation_expires_at: {
      type:
        DataTypes.DATE,

      allowNull:
        true
    }
  };

  for (
    const [
      columnName,
      definition
    ]
    of Object.entries(
      requiredColumns
    )
  ) {
    if (
      !bookingColumns[
        columnName
      ]
    ) {
      await queryInterface
        .addColumn(
          'bookings',
          columnName,
          definition
        );

      console.log(
        `Columna bookings.${columnName} creada ✅`
      );
    }
  }

  /*
   * Solo sincronizamos esta tabla nueva.
   * No altera la tabla de reservas.
   */
  await VehicleSchedule.sync();
}

async function startServer() {
  try {
    await db.authenticate();

    console.log(
      'Base de datos conectada ✅'
    );

    await syncRequiredTables();

    const runSeeds = process.env.RUN_SEEDS === 'true';

if (runSeeds) {
  console.log('Inicializando catálogo...');

  await seedZones();
  await seedDestinations();
  await seedVehicles();
  await seedRouteRates();

  console.log('Datos iniciales listos ✅');
} else {
  console.log('Inicialización del catálogo omitida ✅');
}

    app.listen(
      PORT,
      () => {
        console.log(
          `Servidor en http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      'Error conectando MySQL ❌',
      error
    );
  }
}

startServer();