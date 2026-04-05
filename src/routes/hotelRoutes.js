import { Router } from 'express';
import Hotel from '../models/Hotel.js';

const router = Router();

// GET /api/hotels
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      order: [['name', 'ASC']]
    });

    res.json({
      ok: true,
      hotels
    });
  } catch (error) {
    console.error('Error obteniendo hoteles:', error);
    res.status(500).json({
      ok: false,
      message: 'Error obteniendo hoteles'
    });
  }
});

// GET /api/hotels/zone/:zoneId
router.get('/zone/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;

    const hotels = await Hotel.findAll({
      where: { zone_id: zoneId },
      order: [['name', 'ASC']]
    });

    res.json({
      ok: true,
      hotels
    });
  } catch (error) {
    console.error('Error obteniendo hoteles por zona:', error);
    res.status(500).json({
      ok: false,
      message: 'Error obteniendo hoteles por zona'
    });
  }
});

export default router;