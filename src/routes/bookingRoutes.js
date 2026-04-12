import { Router } from 'express';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import Zone from '../models/Zone.js';
import Vehicle from '../models/Vehicle.js';
import { calculateRoutePrice } from '../utils/calculateRoutePrice.js';

const router = Router();

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        {
          model: Destination,
          as: 'pickupDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Destination,
          as: 'dropoffDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Zone,
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Vehicle,
          attributes: ['id', 'name', 'max_passengers', 'image'],
          required: false
        }
      ],
      order: [['id', 'DESC']]
    });

    return res.json({
      ok: true,
      bookings
    });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo reservas'
    });
  }
});

// GET /api/bookings/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Destination,
          as: 'pickupDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Destination,
          as: 'dropoffDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Zone,
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Vehicle,
          attributes: ['id', 'name', 'max_passengers', 'image'],
          required: false
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: 'Reserva no encontrada'
      });
    }

    return res.json({
      ok: true,
      booking
    });
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo reserva'
    });
  }
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      pickup_destination_id,
      dropoff_destination_id,
      vehicle_id,
      trip_type,
      travel_date,
      travel_time,
      passengers,
      flight_number,
      notes
    } = req.body;

    if (
      !full_name ||
      !phone ||
      !pickup_destination_id ||
      !dropoff_destination_id ||
      !vehicle_id ||
      !trip_type ||
      !travel_date ||
      !travel_time ||
      !passengers
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Faltan campos obligatorios'
      });
    }

    if (!['one_way', 'round_trip'].includes(trip_type)) {
      return res.status(400).json({
        ok: false,
        message: 'Tipo de viaje inválido'
      });
    }

    const passengersNumber = Number(passengers);

    if (!Number.isInteger(passengersNumber) || passengersNumber <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'La cantidad de pasajeros debe ser mayor que 0'
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          ok: false,
          message: 'Correo electrónico inválido'
        });
      }
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

    if (passengersNumber > Number(vehicle.max_passengers)) {
      return res.status(400).json({
        ok: false,
        message: `Este vehículo permite hasta ${vehicle.max_passengers} pasajeros`
      });
    }
      const priceResult = await calculateRoutePrice({
        pickupZoneId: pickup.zone_id,
        dropoffZoneId: dropoff.zone_id,
        vehicleId: vehicle.id,
        type: trip_type
      });

      if (!priceResult) {
        return res.status(404).json({
          ok: false,
          message: 'No existe una tarifa configurada para esta ruta y vehículo'
        });
      }

const price = Number(priceResult.price);

    const booking = await Booking.create({
      full_name: full_name.trim(),
      email: email ? email.trim() : null,
      phone: phone.trim(),
      pickup_destination_id: Number(pickup.id),
      dropoff_destination_id: Number(dropoff.id),
      zone_id: Number(dropoff.zone_id),
      vehicle_id: Number(vehicle.id),
      trip_type,
      travel_date,
      travel_time,
      passengers: passengersNumber,
      flight_number: flight_number ? flight_number.trim() : null,
      notes: notes ? notes.trim() : null,
      price,
      status: 'pending'
    });

    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Destination,
          as: 'pickupDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Destination,
          as: 'dropoffDestination',
          attributes: ['id', 'name', 'duration_text'],
          required: false
        },
        {
          model: Zone,
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Vehicle,
          attributes: ['id', 'name', 'max_passengers', 'image'],
          required: false
        }
      ]
    });

    return res.status(201).json({
      ok: true,
      message: 'Reserva creada correctamente',
      booking: createdBooking
    });
  } catch (error) {
    console.error('Error creando reserva:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error creando reserva'
    });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ['pending', 'confirmed', 'completed', 'cancelled'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: 'Status inválido'
      });
    }

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: 'Reserva no encontrada'
      });
    }

    booking.status = status;
    await booking.save();

    return res.json({
      ok: true,
      message: 'Estado actualizado correctamente',
      booking
    });
  } catch (error) {
    console.error('Error actualizando status:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error actualizando status'
    });
  }
});

export default router;