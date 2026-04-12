import { Router } from 'express';
import Vehicle from '../models/Vehicle.js';

const router = Router();

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      where: { is_active: true },
      order: [['id', 'ASC']]
    });

    return res.json({
      ok: true,
      vehicles
    });
  } catch (error) {
    console.error('Error obteniendo vehículos:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo vehículos'
    });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle || !vehicle.is_active) {
      return res.status(404).json({
        ok: false,
        message: 'Vehículo no encontrado'
      });
    }

    return res.json({
      ok: true,
      vehicle
    });
  } catch (error) {
    console.error('Error obteniendo vehículo:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo vehículo'
    });
  }
});

export default router;