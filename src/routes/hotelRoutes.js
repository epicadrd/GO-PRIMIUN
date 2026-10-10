import { Router } from 'express';
import Hotel from '../models/Hotel.js';

const router = Router();

/**
 * GET /api/hotels/zone/:zoneId
 * Devuelve todos los hoteles de una zona
 */
router.get('/zone/:zoneId', async (req, res) => {
  try {
    const { zoneId } = req.params;

    if (!zoneId) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar el zoneId'
      });
    }

    const hotels = await Hotel.findAll({
      where: {
        zone_id: Number(zoneId)
      },
      order: [['name', 'ASC']]
    });

    return res.json({
      ok: true,
      hotels
    });
  } catch (error) {
    console.error('Error obteniendo hoteles por zona:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo hoteles'
    });
  }
});

/**
 * GET /api/hotels
 * (opcional) lista completa
 */
router.get('/', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      order: [['name', 'ASC']]
    });

    return res.json({
      ok: true,
      hotels
    });
  } catch (error) {
    console.error('Error obteniendo hoteles:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo hoteles'
    });
  }
});

export default router;