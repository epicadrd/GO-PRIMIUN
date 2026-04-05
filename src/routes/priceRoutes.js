import { Router } from 'express';
import Rate from '../models/Rate.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { zone_id, vehicle_id, type } = req.query;

    const rate = await Rate.findOne({
      where: {
        zone_id,
        vehicle_id
      }
    });

    if (!rate) {
      return res.status(404).json({
        ok: false,
        message: 'Tarifa no encontrada'
      });
    }

    const price = type === 'round_trip'
      ? rate.round_trip_price
      : rate.one_way_price;

    res.json({
      ok: true,
      price
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error obteniendo precio'
    });
  }
});

export default router;