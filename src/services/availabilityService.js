import { Op } from 'sequelize';

import Booking from '../models/Booking.js';
import VehicleSchedule from '../models/VehicleSchedule.js';

export const SLOT_MINUTES = Number(
  process.env.BOOKING_SLOT_MINUTES || 30
);

export const SERVICE_MINUTES = Number(
  process.env.BOOKING_SERVICE_MINUTES || 120
);

export const HOLD_MINUTES = Number(
  process.env.BOOKING_HOLD_MINUTES || 15
);

export const BUSINESS_TIME_ZONE =
  process.env.BUSINESS_TIME_ZONE ||
  'America/Santo_Domingo';

function timeToMinutes(value) {
  const [hours, minutes] = String(value || '')
    .slice(0, 5)
    .split(':')
    .map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes)
  ) {
    return NaN;
  }

  return hours * 60 + minutes;
}

function minutesToTime(total) {
  const hours = String(
    Math.floor(total / 60)
  ).padStart(2, '0');

  const minutes = String(
    total % 60
  ).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function overlaps(
  startA,
  endA,
  startB,
  endB
) {
  return (
    startA < endB &&
    startB < endA
  );
}

function localNowParts() {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone:
          BUSINESS_TIME_ZONE,

        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      }
    );

  const parts =
    Object.fromEntries(
      formatter
        .formatToParts(new Date())
        .filter(
          part =>
            part.type !== 'literal'
        )
        .map(
          part => [
            part.type,
            part.value
          ]
        )
    );

  return {
    date:
      `${parts.year}-` +
      `${parts.month}-` +
      `${parts.day}`,

    minutes:
      Number(parts.hour) * 60 +
      Number(parts.minute)
  };
}

export function validateDateTime(
  date,
  time,
  label = 'La fecha'
) {
  const dateValue = String(
    date || ''
  );

  const timeValue = String(
    time || ''
  );

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(
      dateValue
    ) ||
    !/^\d{2}:\d{2}/.test(
      timeValue
    )
  ) {
    const error = new Error(
      `${label} y la hora no son válidas.`
    );

    error.statusCode = 400;
    throw error;
  }

  const parsedDate = new Date(
    `${dateValue}T12:00:00Z`
  );

  if (
    Number.isNaN(
      parsedDate.getTime()
    ) ||
    parsedDate
      .toISOString()
      .slice(0, 10) !== dateValue
  ) {
    const error = new Error(
      `${label} no es válida.`
    );

    error.statusCode = 400;
    throw error;
  }

  const minutes =
    timeToMinutes(timeValue);

  if (
    !Number.isFinite(minutes) ||
    minutes < 0 ||
    minutes >= 1440
  ) {
    const error = new Error(
      `${label} y la hora no son válidas.`
    );

    error.statusCode = 400;
    throw error;
  }

  const now = localNowParts();

  if (
    dateValue < now.date ||
    (
      dateValue === now.date &&
      minutes <= now.minutes
    )
  ) {
    const error = new Error(
      `${label} debe estar en el futuro.`
    );

    error.statusCode = 400;
    throw error;
  }
}

export function validateReturnAfterOutbound(
  outboundDate,
  outboundTime,
  returnDate,
  returnTime
) {
  const outbound = Date.parse(
    `${outboundDate}T` +
    `${String(outboundTime).slice(0, 5)}:00Z`
  );

  const returning = Date.parse(
    `${returnDate}T` +
    `${String(returnTime).slice(0, 5)}:00Z`
  );

  const minimumReturnTime =
    outbound +
    SERVICE_MINUTES *
      60 *
      1000;

  if (
    !Number.isFinite(outbound) ||
    !Number.isFinite(returning) ||
    returning < minimumReturnTime
  ) {
    const error = new Error(
      `El regreso debe comenzar al menos ` +
      `${SERVICE_MINUTES} minutos después de la salida.`
    );

    error.statusCode = 400;
    throw error;
  }
}

function bookingSegments(booking) {
  const segments = [
    {
      date: booking.travel_date,
      time: booking.travel_time
    }
  ];

  if (
    booking.trip_type ===
      'round_trip' &&
    booking.return_date &&
    booking.return_time
  ) {
    segments.push({
      date: booking.return_date,
      time: booking.return_time
    });
  }

  return segments;
}

function activeBookingWhere(
  excludeBookingId
) {
  const where = {
    status: {
      [Op.ne]: 'cancelled'
    },

    [Op.or]: [
      {
        payment_status: 'paid'
      },
      {
        status: 'confirmed'
      },
      {
        reservation_expires_at: {
          [Op.gt]: new Date()
        }
      }
    ]
  };

  if (excludeBookingId) {
    where.id = {
      [Op.ne]: excludeBookingId
    };
  }

  return where;
}

async function getConflictingBookings({
  vehicleId,
  driverId,
  dates,
  excludeBookingId,
  transaction
}) {
  const where =
    activeBookingWhere(
      excludeBookingId
    );

  if (vehicleId) {
    where.vehicle_id = vehicleId;
  }

  if (driverId) {
    where.driver_id = driverId;
  }

  where[Op.and] = [
    {
      [Op.or]: [
        {
          travel_date: {
            [Op.in]: dates
          }
        },
        {
          return_date: {
            [Op.in]: dates
          }
        }
      ]
    }
  ];

  return Booking.findAll({
    where,
    transaction
  });
}

export async function isVehicleInsideSchedule({
  vehicleId,
  date,
  time,
  transaction
}) {
  const dayOfWeek =
    new Date(
      `${date}T12:00:00Z`
    ).getUTCDay();

  const schedules =
    await VehicleSchedule.findAll({
      where: {
        vehicle_id: vehicleId,
        day_of_week: dayOfWeek,
        is_active: true
      },

      transaction
    });

  const start =
    timeToMinutes(time);

  const end =
    start + SERVICE_MINUTES;

  return schedules.some(
    schedule => {
      const scheduleStart =
        timeToMinutes(
          schedule.start_time
        );

      const scheduleEnd =
        timeToMinutes(
          schedule.end_time
        );

      return (
        start >= scheduleStart &&
        end <= scheduleEnd
      );
    }
  );
}

export async function findResourceConflict({
  vehicleId,
  driverId,
  segments,
  excludeBookingId,
  transaction
}) {
  const dates = [
    ...new Set(
      segments.map(
        segment => segment.date
      )
    )
  ];

  const bookings =
    await getConflictingBookings({
      vehicleId,
      driverId,
      dates,
      excludeBookingId,
      transaction
    });

  for (
    const requested of segments
  ) {
    const requestedStart =
      timeToMinutes(
        requested.time
      );

    const requestedEnd =
      requestedStart +
      SERVICE_MINUTES;

    for (
      const booking of bookings
    ) {
      for (
        const existing of
          bookingSegments(booking)
      ) {
        if (
          existing.date !==
          requested.date
        ) {
          continue;
        }

        const existingStart =
          timeToMinutes(
            existing.time
          );

        const existingEnd =
          existingStart +
          SERVICE_MINUTES;

        if (
          overlaps(
            requestedStart,
            requestedEnd,
            existingStart,
            existingEnd
          )
        ) {
          return booking;
        }
      }
    }
  }

  return null;
}

export async function assertVehicleAvailable({
  vehicleId,
  segments,
  excludeBookingId,
  transaction
}) {
  for (
    const segment of segments
  ) {
    validateDateTime(
      segment.date,
      segment.time,
      segment.label ||
        'La fecha'
    );

    const insideSchedule =
      await isVehicleInsideSchedule({
        vehicleId,
        date: segment.date,
        time: segment.time,
        transaction
      });

    if (!insideSchedule) {
      const error = new Error(
        `El vehículo no trabaja el ` +
        `${segment.date} a las ` +
        `${String(segment.time).slice(0, 5)}.`
      );

      error.statusCode = 409;
      throw error;
    }
  }

  /*
   * Evita que la ida y el regreso
   * de la misma reserva se crucen.
   */
  for (
    let index = 0;
    index < segments.length;
    index += 1
  ) {
    for (
      let other = index + 1;
      other < segments.length;
      other += 1
    ) {
      if (
        segments[index].date !==
        segments[other].date
      ) {
        continue;
      }

      const firstStart =
        timeToMinutes(
          segments[index].time
        );

      const secondStart =
        timeToMinutes(
          segments[other].time
        );

      if (
        overlaps(
          firstStart,
          firstStart +
            SERVICE_MINUTES,
          secondStart,
          secondStart +
            SERVICE_MINUTES
        )
      ) {
        const error = new Error(
          'Los horarios de ida y regreso no pueden superponerse.'
        );

        error.statusCode = 409;
        throw error;
      }
    }
  }

  const conflict =
    await findResourceConflict({
      vehicleId,
      segments,
      excludeBookingId,
      transaction
    });

  if (conflict) {
    const error = new Error(
      'El vehículo acaba de ser reservado para una de las horas seleccionadas. Elige otro horario.'
    );

    error.statusCode = 409;
    throw error;
  }
}

export async function getAvailableSlots({
  vehicleId,
  date
}) {
  /*
   * Usamos 23:59 únicamente para
   * validar que la fecha no sea pasada.
   */
  validateDateTime(
    date,
    '23:59',
    'La fecha'
  );

  const dayOfWeek =
    new Date(
      `${date}T12:00:00Z`
    ).getUTCDay();

  const schedules =
    await VehicleSchedule.findAll({
      where: {
        vehicle_id: vehicleId,
        day_of_week: dayOfWeek,
        is_active: true
      },

      order: [
        ['start_time', 'ASC']
      ]
    });

  if (!schedules.length) {
    return [];
  }

  const now = localNowParts();

  const bookings =
    await getConflictingBookings({
      vehicleId,
      dates: [date]
    });

  const occupied =
    bookings
      .flatMap(
        booking =>
          bookingSegments(booking)
      )
      .filter(
        segment =>
          segment.date === date
      );

  const slots = [];

  for (
    const schedule of schedules
  ) {
    const start =
      timeToMinutes(
        schedule.start_time
      );

    const end =
      timeToMinutes(
        schedule.end_time
      );

    for (
      let minute = start;
      minute +
        SERVICE_MINUTES <= end;
      minute += SLOT_MINUTES
    ) {
      if (
        date === now.date &&
        minute <= now.minutes
      ) {
        continue;
      }

      const blocked =
        occupied.some(
          segment => {
            const occupiedStart =
              timeToMinutes(
                segment.time
              );

            return overlaps(
              minute,
              minute +
                SERVICE_MINUTES,
              occupiedStart,
              occupiedStart +
                SERVICE_MINUTES
            );
          }
        );

      if (!blocked) {
        slots.push(
          minutesToTime(minute)
        );
      }
    }
  }

  return [
    ...new Set(slots)
  ];
}

export function createHoldExpiration() {
  return new Date(
    Date.now() +
    HOLD_MINUTES *
      60 *
      1000
  );
}