import express from 'express';
import dotenv from 'dotenv';
import db from './src/config/db.js';
import hotelRoutes from './src/routes/hotelRoutes.js';
import priceRoutes from './src/routes/priceRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import driverRoutes from './src/routes/driverRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);

const PORT = process.env.PORT || 3000;

db.authenticate()
  .then(() => {
    console.log('Base de datos conectada ✅');

    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Error conectando MySQL ❌', error);
  });