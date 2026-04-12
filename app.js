import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './src/config/db.js';

import destinationRoutes from './src/routes/destinationRoutes.js';
import vehicleRoutes from './src/routes/vehicleRoutes.js';
import priceRoutes from './src/routes/priceRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';

import { seedZones } from './src/data/seedZones.js';
import { seedDestinations } from './src/data/seedDestinations.js';
import { seedVehicles } from './src/data/seedVehicles.js';
import { seedRouteRates } from './src/data/seedRouteRates.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/destinations', destinationRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    /* await db.authenticate(); */
    await db.sync({alter:true});
    console.log('Base de datos conectada ✅');

    await seedZones();
    await seedDestinations();
    await seedVehicles();
    await seedRouteRates();

    console.log('Datos iniciales listos ✅');

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log('Error conectando MySQL ❌', error);
  }
}

startServer();