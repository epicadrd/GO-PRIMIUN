import { Router } from 'express';
import Booking from '../models/Booking.js';
import Hotel from '../models/Hotel.js';
import Rate from '../models/Rate.js';
import Driver from '../models/Driver.js'

const router = Router();

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
            include: [
        {
            model: Hotel,
            attributes: ['name']
        },
        {
            model: Driver,
            as: 'driver',
            attributes: ['id', 'full_name']
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

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      zone_id,
      hotel_id,
      vehicle_id,
      trip_type,
      travel_date,
      travel_time,
      passengers,
      notes
    } = req.body;

    // Validaciones básicas
    if (
      !full_name ||
      !phone ||
      !zone_id ||
      !hotel_id ||
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

    if (Number(passengers) <= 0) {
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

    // Validar hotel y que pertenezca a la zona
    const hotel = await Hotel.findOne({
      where: {
        id: hotel_id,
        zone_id: zone_id
      }
    });

    if (!hotel) {
      return res.status(404).json({
        ok: false,
        message: 'El hotel no existe o no pertenece a la zona seleccionada'
      });
    }

    // Buscar tarifa
    const rate = await Rate.findOne({
      where: {
        zone_id,
        vehicle_id
      }
    });

    if (!rate) {
      return res.status(404).json({
        ok: false,
        message: 'No existe una tarifa para la zona y vehículo seleccionados'
      });
    }

    // Calcular precio en backend
    const price =
      trip_type === 'round_trip'
        ? rate.round_trip_price
        : rate.one_way_price;

    // Crear reserva
    const booking = await Booking.create({
      full_name: full_name.trim(),
      email: email ? email.trim() : null,
      phone: phone.trim(),
      zone_id: Number(zone_id),
      hotel_id: Number(hotel_id),
      vehicle_id: Number(vehicle_id),
      trip_type,
      price,
      travel_date,
      travel_time,
      passengers: Number(passengers),
      notes: notes ? notes.trim() : null,
      status: 'pending'
    });

    return res.status(201).json({
      ok: true,
      message: 'Reserva creada correctamente',
      booking
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

    // Validar status
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: 'Status inválido'
      });
    }

    // Buscar reserva
    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: 'Reserva no encontrada'
      });
    }

    // Actualizar status
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

// PATCH /api/bookings/:id/assign-driver
router.patch('/:id/assign-driver', async (req, res) => {
  try {
    const { id } = req.params;
    const { driver_id } = req.body;

    if (!driver_id) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar el driver_id'
      });
    }

    const booking = await Booking.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        ok: false,
        message: 'Reserva no encontrada'
      });
    }

    const driver = await Driver.findByPk(driver_id);

    if (!driver) {
      return res.status(404).json({
        ok: false,
        message: 'Conductor no encontrado'
      });
    }

    booking.driver_id = driver_id;
    await booking.save();

    return res.json({
      ok: true,
      message: 'Conductor asignado correctamente',
      booking
    });
  } catch (error) {
    console.error('Error asignando conductor:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error asignando conductor'
    });
  }
});

export default router;