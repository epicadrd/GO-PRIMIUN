import { Router } from 'express';

import Vehicle from '../models/Vehicle.js';

import {
  getAvailableSlots,
  SERVICE_MINUTES
} from '../services/availabilityService.js';

const router = Router();

/*
 * GET /api/availability
 *
 * Ejemplo:
 * /api/availability?vehicle_id=1&date=2026-10-20
 */
router.get(
  '/',
  async (req, res) => {
    try {
      const vehicleId = Number(
        req.query.vehicle_id
      );

      const date = String(
        req.query.date || ''
      );

      if (
        !Number.isInteger(vehicleId) ||
        vehicleId <= 0 ||
        !date
      ) {
        return res
          .status(400)
          .json({
            ok: false,
            message:
              'Selecciona un vehículo y una fecha.'
          });
      }

      const vehicle =
        await Vehicle.findOne({
          where: {
            id: vehicleId,
            is_active: true
          }
        });

      if (!vehicle) {
        return res
          .status(404)
          .json({
            ok: false,
            message:
              'Vehículo no disponible.'
          });
      }

      const slots =
        await getAvailableSlots({
          vehicleId,
          date
        });

      return res.json({
        ok: true,

        date,

        vehicle_id:
          vehicleId,

        /*
         * El frontend utiliza este valor para
         * evitar que el regreso se cruce con la ida.
         */
        service_minutes:
          SERVICE_MINUTES,

        slots
      });
    } catch (error) {
      console.error(
        'Error consultando disponibilidad:',
        error
      );

      return res
        .status(
          error.statusCode || 500
        )
        .json({
          ok: false,

          message:
            error.message ||
            'No se pudo consultar la disponibilidad.'
        });
    }
  }
);

export default router;