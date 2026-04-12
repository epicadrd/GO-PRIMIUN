import { Router } from 'express';
import Destination from '../models/Destination.js';
import Zone from '../models/Zone.js';

const router = Router();

// GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: { is_active: true },
      include: [
        {
          model: Zone,
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['zone_id', 'ASC'],
        ['name', 'ASC']
      ]
    });

    return res.json({
      ok: true,
      destinations
    });
  } catch (error) {
    console.error('Error obteniendo destinos:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo destinos'
    });
  }
});

// GET /api/destinations/grouped
router.get('/grouped', async (req, res) => {
  try {
    const destinations = await Destination.findAll({
      where: { is_active: true },
      include: [
        {
          model: Zone,
          attributes: ['id', 'name']
        }
      ],
      order: [
        ['zone_id', 'ASC'],
        ['name', 'ASC']
      ]
    });

    const groupedMap = new Map();

    for (const destination of destinations) {
      const zoneId = destination.zone_id;
      const zoneName = destination.zone?.name || 'Sin zona';

      if (!groupedMap.has(zoneId)) {
        groupedMap.set(zoneId, {
          zone_id: zoneId,
          zone_name: zoneName,
          destinations: []
        });
      }

      groupedMap.get(zoneId).destinations.push({
        id: destination.id,
        name: destination.name,
        duration_text: destination.duration_text
      });
    }

    return res.json({
      ok: true,
      groups: Array.from(groupedMap.values())
    });
  } catch (error) {
    console.error('Error obteniendo destinos agrupados:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo destinos agrupados'
    });
  }
});

// GET /api/destinations/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id, {
      include: [
        {
          model: Zone,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!destination) {
      return res.status(404).json({
        ok: false,
        message: 'Destino no encontrado'
      });
    }

    return res.json({
      ok: true,
      destination
    });
  } catch (error) {
    console.error('Error obteniendo destino:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo destino'
    });
  }
});

export default router;