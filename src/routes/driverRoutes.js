import { Router } from 'express';
import Driver from '../models/Driver.js';

const router = Router();

// GET /api/drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.findAll({
      where: { is_active: true },
      order: [['full_name', 'ASC']]
    });

    res.json({
      ok: true,
      drivers
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error obteniendo conductores'
    });
  }
});

export default router;