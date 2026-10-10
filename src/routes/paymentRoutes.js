import { Router } from 'express';

import db from '../config/db.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';
import Zone from '../models/Zone.js';
import Vehicle from '../models/Vehicle.js';

import {
  calculateRoutePrice
} from '../utils/calculateRoutePrice.js';

import {
  capturePayPalOrder,
  createPayPalOrder,
  getPublicPayPalConfig
} from '../services/paypalService.js';

import {
  generateBookingReceiptPdf
} from '../services/invoiceService.js';

import {
  sendBookingReceipt
} from '../services/emailService.js';

import {
  assertVehicleAvailable,
  createHoldExpiration,
  validateReturnAfterOutbound
} from '../services/availabilityService.js';

const router = Router();

const bookingIncludes = [
  {
    model: Destination,
    as: 'pickupDestination',
    attributes: [
      'id',
      'name',
      'duration_text'
    ],
    required: false
  },
  {
    model: Destination,
    as: 'dropoffDestination',
    attributes: [
      'id',
      'name',
      'duration_text'
    ],
    required: false
  },
  {
    model: Zone,
    attributes: [
      'id',
      'name'
    ],
    required: false
  },
  {
    model: Vehicle,
    attributes: [
      'id',
      'name',
      'max_passengers',
      'image'
    ],
    required: false
  }
];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    String(email || '').trim()
  );
}

function createHttpError(
  message,
  statusCode
) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

async function validateAndPrepareBooking(
  body
) {
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
    return_date,
    return_time,
    passengers,
    flight_number,
    notes
  } = body;

  if (
    !full_name ||
    !email ||
    !phone ||
    !pickup_destination_id ||
    !dropoff_destination_id ||
    !vehicle_id ||
    !trip_type ||
    !travel_date ||
    !travel_time ||
    !passengers
  ) {
    throw createHttpError(
      'Completa todos los campos obligatorios',
      400
    );
  }

  if (
    ![
      'one_way',
      'round_trip'
    ].includes(trip_type)
  ) {
    throw createHttpError(
      'Tipo de viaje inválido',
      400
    );
  }

  if (
    trip_type === 'round_trip' &&
    (
      !return_date ||
      !return_time
    )
  ) {
    throw createHttpError(
      'Indica la fecha y la hora del viaje de regreso.',
      400
    );
  }

  if (
    trip_type === 'round_trip'
  ) {
    validateReturnAfterOutbound(
      travel_date,
      travel_time,
      return_date,
      return_time
    );
  }

  if (!isValidEmail(email)) {
    throw createHttpError(
      'Correo electrónico inválido',
      400
    );
  }

  const passengersNumber =
    Number(passengers);

  if (
    !Number.isInteger(
      passengersNumber
    ) ||
    passengersNumber <= 0
  ) {
    throw createHttpError(
      'La cantidad de pasajeros debe ser mayor que 0',
      400
    );
  }

  const [
    pickup,
    dropoff,
    vehicle
  ] = await Promise.all([
    Destination.findByPk(
      pickup_destination_id,
      {
        include: [Zone]
      }
    ),

    Destination.findByPk(
      dropoff_destination_id,
      {
        include: [Zone]
      }
    ),

    Vehicle.findByPk(
      vehicle_id
    )
  ]);

  if (
    !pickup ||
    !pickup.is_active
  ) {
    throw createHttpError(
      'Lugar de recogida no encontrado',
      404
    );
  }

  if (
    !dropoff ||
    !dropoff.is_active
  ) {
    throw createHttpError(
      'Destino no encontrado',
      404
    );
  }

  if (
    !vehicle ||
    !vehicle.is_active
  ) {
    throw createHttpError(
      'Vehículo no encontrado',
      404
    );
  }

  if (
    passengersNumber >
    Number(
      vehicle.max_passengers
    )
  ) {
    throw createHttpError(
      `Este vehículo permite hasta ${vehicle.max_passengers} pasajeros`,
      400
    );
  }

  const priceResult =
    await calculateRoutePrice({
      pickupZoneId:
        pickup.zone_id,

      dropoffZoneId:
        dropoff.zone_id,

      vehicleId:
        vehicle.id,

      type:
        trip_type
    });

  if (!priceResult) {
    throw createHttpError(
      'No existe una tarifa configurada para esta ruta y vehículo',
      404
    );
  }

  return {
    values: {
      full_name:
        full_name.trim(),

      email:
        email
          .trim()
          .toLowerCase(),

      phone:
        phone.trim(),

      pickup_destination_id:
        Number(pickup.id),

      dropoff_destination_id:
        Number(dropoff.id),

      zone_id:
        Number(dropoff.zone_id),

      vehicle_id:
        Number(vehicle.id),

      trip_type,
      travel_date,
      travel_time,

      return_date:
        trip_type === 'round_trip'
          ? return_date
          : null,

      return_time:
        trip_type === 'round_trip'
          ? return_time
          : null,

      passengers:
        passengersNumber,

      flight_number:
        flight_number
          ? flight_number.trim()
          : null,

      notes:
        notes
          ? notes.trim()
          : null,

      price:
        Number(
          priceResult.price
        ),

      status:
        'pending',

      payment_status:
        'pending',

      payment_provider:
        'paypal',

      payment_currency:
        process.env
          .PAYPAL_CURRENCY ||
        'USD',

      reservation_expires_at:
        createHoldExpiration()
    },

    pickup,
    dropoff,
    vehicle
  };
}

/*
 * Configuración pública necesaria
 * para cargar el SDK de PayPal.
 */
router.get(
  '/config',
  (req, res) => {
    try {
      return res.json({
        ok: true,
        ...getPublicPayPalConfig()
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          ok: false,
          message: error.message
        });
    }
  }
);

/*
 * Descarga protegida del Ticket de reserva.
 *
 * El cliente debe presentar:
 * - ID de la reserva.
 * - ID de la orden de PayPal.
 * - La reserva debe estar pagada.
 */
router.get(
  '/ticket/:bookingId',
  async (req, res) => {
    try {
      const bookingId =
        Number(
          req.params.bookingId
        );

      const orderId =
        String(
          req.query.orderId || ''
        ).trim();

      if (
        !Number.isInteger(
          bookingId
        ) ||
        bookingId <= 0 ||
        !orderId
      ) {
        return res
          .status(400)
          .json({
            ok: false,
            message:
              'Faltan los datos del Ticket de reserva'
          });
      }

      const booking =
        await Booking.findOne({
          where: {
            id: bookingId,
            paypal_order_id:
              orderId,
            payment_status:
              'paid'
          },

          include:
            bookingIncludes
        });

      if (!booking) {
        return res
          .status(404)
          .json({
            ok: false,
            message:
              'No se encontró el Ticket de reserva solicitado'
          });
      }

      const pdfBuffer =
        await generateBookingReceiptPdf(
          booking
        );

      const filename =
        `ticket-reserva-${booking.id}.pdf`;

      res.setHeader(
        'Content-Type',
        'application/pdf'
      );

      res.setHeader(
        'Content-Length',
        pdfBuffer.length
      );

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${filename}"`
      );

      res.setHeader(
        'Cache-Control',
        'private, no-store'
      );

      return res.end(
        pdfBuffer
      );
    } catch (error) {
      console.error(
        'Error generando Ticket de reserva:',
        error
      );

      return res
        .status(500)
        .json({
          ok: false,
          message:
            'No se pudo generar el Ticket de reserva'
        });
    }
  }
);

/*
 * Crea la reserva temporal
 * y la orden de PayPal.
 */
router.post(
  '/create-order',
  async (req, res) => {
    let booking;

    try {
      const prepared =
        await validateAndPrepareBooking(
          req.body
        );

      const segments = [
        {
          date:
            prepared.values
              .travel_date,

          time:
            prepared.values
              .travel_time,

          label:
            'La fecha de ida'
        }
      ];

      if (
        prepared.values
          .trip_type ===
        'round_trip'
      ) {
        segments.push({
          date:
            prepared.values
              .return_date,

          time:
            prepared.values
              .return_time,

          label:
            'La fecha de regreso'
        });
      }

      /*
       * GET_LOCK impide que dos clientes
       * reserven simultáneamente el mismo
       * vehículo y horario.
       */
      booking =
        await db.transaction(
          async transaction => {
            const lockName =
              `vehicle-${prepared.values.vehicle_id}`;

            const [lockRows] =
              await db.query(
                'SELECT GET_LOCK(:lockName, 5) AS acquired',
                {
                  replacements: {
                    lockName
                  },
                  transaction
                }
              );

            if (
              Number(
                lockRows?.[0]
                  ?.acquired
              ) !== 1
            ) {
              throw createHttpError(
                'No pudimos comprobar la disponibilidad. Intenta nuevamente.',
                409
              );
            }

            try {
              await assertVehicleAvailable({
                vehicleId:
                  prepared.values
                    .vehicle_id,

                segments,
                transaction
              });

              return await Booking.create(
                prepared.values,
                {
                  transaction
                }
              );
            } finally {
              await db.query(
                'SELECT RELEASE_LOCK(:lockName)',
                {
                  replacements: {
                    lockName
                  },
                  transaction
                }
              ).catch(() => {});
            }
          }
        );

      const order =
        await createPayPalOrder({
          bookingId:
            booking.id,

          amount:
            booking.price,

          description:
            `${prepared.pickup.name} a ` +
            `${prepared.dropoff.name} · ` +
            `${prepared.vehicle.name}`
        });

      booking.paypal_order_id =
        order.id;

      await booking.save();

      return res
        .status(201)
        .json({
          ok: true,

          bookingId:
            booking.id,

          orderId:
            order.id,

          amount:
            Number(
              booking.price
            ).toFixed(2),

          currency:
            booking
              .payment_currency
        });
    } catch (error) {
      /*
       * Si PayPal no pudo crear la orden,
       * elimina la reserva temporal.
       */
      if (
        booking &&
        !booking.paypal_order_id
      ) {
        await booking
          .destroy()
          .catch(() => {});
      }

      console.error(
        'Error creando orden PayPal:',
        error
      );

      return res
        .status(
          error.statusCode ||
          500
        )
        .json({
          ok: false,

          message:
            error.message ||
            'No se pudo iniciar el pago'
        });
    }
  }
);

/*
 * Libera el horario cuando el usuario
 * cancela el proceso de PayPal.
 */
router.post(
  '/release-order',
  async (req, res) => {
    try {
      const booking =
        await Booking.findOne({
          where: {
            id: Number(
              req.body.bookingId
            ),

            paypal_order_id:
              String(
                req.body.orderId ||
                ''
              ),

            payment_status:
              'pending'
          }
        });

      if (booking) {
        booking.status =
          'cancelled';

        booking
          .reservation_expires_at =
          new Date();

        await booking.save();
      }

      return res.json({
        ok: true
      });
    } catch (error) {
      console.error(
        'Error liberando horario:',
        error
      );

      return res
        .status(500)
        .json({
          ok: false,
          message:
            'No se pudo liberar el horario.'
        });
    }
  }
);

/*
 * Captura y confirma el pago.
 */
router.post(
  '/capture-order',
  async (req, res) => {
    try {
      const {
        bookingId,
        orderId
      } = req.body;

      if (
        !bookingId ||
        !orderId
      ) {
        return res
          .status(400)
          .json({
            ok: false,
            message:
              'Faltan los datos del pago'
          });
      }

      const booking =
        await Booking.findByPk(
          bookingId
        );

      if (
        !booking ||
        booking.paypal_order_id !==
          orderId
      ) {
        return res
          .status(404)
          .json({
            ok: false,
            message:
              'La orden no corresponde con la reserva'
          });
      }

      /*
       * Respuesta idempotente:
       * si ya está pagada, no vuelve
       * a capturar el dinero.
       */
      if (
        booking.payment_status ===
        'paid'
      ) {
        return res.json({
          ok: true,

          message:
            'Este pago ya fue confirmado',

          bookingId:
            booking.id,

          emailSent:
            Boolean(
              booking
                .invoice_sent_at
            ),

          ticketUrl:
            `/api/payments/paypal/ticket/${booking.id}` +
            `?orderId=${encodeURIComponent(orderId)}`
        });
      }

      /*
       * No captura pagos de reservas
       * cuya retención ya venció.
       */
      if (
        booking
          .reservation_expires_at &&
        new Date(
          booking
            .reservation_expires_at
        ) <= new Date()
      ) {
        booking.status =
          'cancelled';

        await booking.save();

        return res
          .status(409)
          .json({
            ok: false,
            message:
              'El tiempo para completar el pago venció. Consulta nuevamente la disponibilidad.'
          });
      }

      const paypalOrder =
        await capturePayPalOrder({
          orderId,

          bookingId:
            booking.id
        });

      const capture =
        paypalOrder
          ?.purchase_units?.[0]
          ?.payments
          ?.captures?.[0];

      const capturedAmount =
        Number(
          capture?.amount?.value
        );

      const capturedCurrency =
        capture
          ?.amount
          ?.currency_code;

      const expectedAmount =
        Number(
          booking.price
        );

      const amountIsCorrect =
        Math.abs(
          capturedAmount -
          expectedAmount
        ) <= 0.01;

      const currencyIsCorrect =
        capturedCurrency ===
        booking.payment_currency;

      if (
        paypalOrder.status !==
          'COMPLETED' ||
        capture?.status !==
          'COMPLETED' ||
        !amountIsCorrect ||
        !currencyIsCorrect
      ) {
        booking.payment_status =
          'failed';

        await booking.save();

        return res
          .status(422)
          .json({
            ok: false,
            message:
              'PayPal no confirmó correctamente el monto del pago'
          });
      }

      booking.payment_status =
        'paid';

      booking.status =
        'confirmed';

      booking.paypal_capture_id =
        capture.id;

      booking.paid_amount =
        capturedAmount;

      booking.payer_email =
        paypalOrder
          ?.payer
          ?.email_address ||
        null;

      booking.paid_at =
        new Date(
          capture.create_time ||
          Date.now()
        );

      /*
       * Al pagar, la reserva deja de ser
       * temporal y pasa a ser definitiva.
       */
      booking.reservation_expires_at =
        null;

      await booking.save();

      const completeBooking =
        await Booking.findByPk(
          booking.id,
          {
            include:
              bookingIncludes
          }
        );

      let emailSent = false;
      let emailWarning = null;

      try {
        const pdfBuffer =
          await generateBookingReceiptPdf(
            completeBooking
          );

        await sendBookingReceipt({
          booking:
            completeBooking,

          pdfBuffer
        });

        completeBooking
          .invoice_sent_at =
          new Date();

        await completeBooking.save();

        emailSent = true;
      } catch (emailError) {
        console.error(
          'Pago confirmado, pero falló el correo:',
          emailError
        );

        emailWarning =
          'El pago fue confirmado, pero no se pudo enviar el Ticket de reserva por correo.';
      }

      return res.json({
        ok: true,

        message:
          'Pago confirmado y reserva completada',

        bookingId:
          completeBooking.id,

        captureId:
          completeBooking
            .paypal_capture_id,

        emailSent,
        emailWarning,

        ticketUrl:
          `/api/payments/paypal/ticket/${completeBooking.id}` +
          `?orderId=${encodeURIComponent(orderId)}`
      });
    } catch (error) {
      console.error(
        'Error capturando orden PayPal:',
        error
      );

      return res
        .status(500)
        .json({
          ok: false,

          message:
            error.message ||
            'No se pudo confirmar el pago'
        });
    }
  }
);

export default router;