import { Router } from 'express';
import Destination from '../models/Destination.js';
import Zone from '../models/Zone.js';
import Vehicle from '../models/Vehicle.js';
import { calculateRoutePrice } from '../utils/calculateRoutePrice.js';

const router = Router();

// GET /api/price?pickup_destination_id=1&dropoff_destination_id=2&vehicle_id=3&type=one_way
router.get('/', async (req, res) => {
  try {
    const { pickup_destination_id, dropoff_destination_id, vehicle_id, type } = req.query;

    if (!pickup_destination_id || !dropoff_destination_id || !vehicle_id || !type) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar pickup_destination_id, dropoff_destination_id, vehicle_id y type'
      });
    }

    if (!['one_way', 'round_trip'].includes(type)) {
      return res.status(400).json({
        ok: false,
        message: 'Tipo de viaje inválido'
      });
    }

    const pickup = await Destination.findByPk(pickup_destination_id, {
      include: [
        {
          model: Zone,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!pickup || !pickup.is_active) {
      return res.status(404).json({
        ok: false,
        message: 'Lugar de recogida no encontrado'
      });
    }

    const dropoff = await Destination.findByPk(dropoff_destination_id, {
      include: [
        {
          model: Zone,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!dropoff || !dropoff.is_active) {
      return res.status(404).json({
        ok: false,
        message: 'Destino no encontrado'
      });
    }

    const vehicle = await Vehicle.findByPk(vehicle_id);

    if (!vehicle || !vehicle.is_active) {
      return res.status(404).json({
        ok: false,
        message: 'Vehículo no encontrado'
      });
    }

    const priceResult = await calculateRoutePrice({
      pickupZoneId: pickup.zone_id,
      dropoffZoneId: dropoff.zone_id,
      vehicleId: vehicle.id,
      type
    });

    if (!priceResult || priceResult.error) {
      return res.status(404).json({
        ok: false,
        message: priceResult?.message || 'No existe una tarifa configurada para esta ruta y vehículo'
      });
    }

    return res.json({
      ok: true,
      price: priceResult.price,
      calculation_mode: priceResult.mode,
      breakdown: priceResult.breakdown,
      pickup: {
        id: pickup.id,
        name: pickup.name,
        zone_id: pickup.zone_id,
        zone_name: pickup.zone?.name || null
      },
      dropoff: {
        id: dropoff.id,
        name: dropoff.name,
        zone_id: dropoff.zone_id,
        zone_name: dropoff.zone?.name || null
      },
      vehicle: {
        id: vehicle.id,
        name: vehicle.name
      },
      duration_text: dropoff.duration_text || pickup.duration_text || null
    });
  } catch (error) {
    console.error('Error obteniendo precio:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo precio'
    });
  }
});

export default router;