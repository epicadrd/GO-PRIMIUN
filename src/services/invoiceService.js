import PDFDocument from 'pdfkit';

function formatMoney(
  value,
  currency = 'USD'
) {
  return new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency
    }
  ).format(
    Number(value || 0)
  );
}

function formatTripType(type) {
  return type === 'round_trip'
    ? 'Ida y vuelta'
    : 'Una vía';
}

export function generateBookingReceiptPdf(
  booking
) {
  return new Promise(
    (
      resolve,
      reject
    ) => {
      const doc =
        new PDFDocument({
          size: 'A4',
          margin: 50
        });

      const chunks = [];

      doc.on(
        'data',
        chunk =>
          chunks.push(chunk)
      );

      doc.on(
        'end',
        () =>
          resolve(
            Buffer.concat(
              chunks
            )
          )
      );

      doc.on(
        'error',
        reject
      );

      const blue =
        '#2596BE';

      const dark =
        '#0B1B2B';

      const muted =
        '#5F7388';

      doc
        .fillColor(blue)
        .fontSize(23)
        .font(
          'Helvetica-Bold'
        )
        .text(
          'GO PREMIUM TRANSFER'
        );

      doc.moveDown(0.2);

      doc
        .fillColor(muted)
        .fontSize(10)
        .font('Helvetica')
        .text(
          'TICKET DE RESERVA'
        );

      doc.moveDown(1.4);

      doc
        .strokeColor(
          '#DCEAF2'
        )
        .lineWidth(1)
        .moveTo(
          50,
          doc.y
        )
        .lineTo(
          545,
          doc.y
        )
        .stroke();

      doc.moveDown(1.2);

      doc
        .fillColor(dark)
        .fontSize(13)
        .font(
          'Helvetica-Bold'
        )
        .text(
          `Ticket de reserva #${booking.id}`
        );

      doc.moveDown(0.7);

      const vehicleName =
        booking.Vehicle?.name ||
        booking.vehicle?.name ||
        booking.vehicles?.name ||
        '-';

      const rows = [
        [
          'Cliente',
          booking.full_name
        ],

        [
          'Correo',
          booking.email
        ],

        [
          'Teléfono',
          booking.phone
        ],

        [
          'Recogida',
          booking
            .pickupDestination
            ?.name ||
          '-'
        ],

        [
          'Destino',
          booking
            .dropoffDestination
            ?.name ||
          '-'
        ],

        [
          'Fecha de ida',
          booking.travel_date
        ],

        [
          'Hora de ida',
          String(
            booking.travel_time ||
            ''
          ).slice(0, 5)
        ],

        [
          'Pasajeros',
          String(
            booking.passengers
          )
        ],

        [
          'Vehículo',
          vehicleName
        ],

        [
          'Tipo de viaje',
          formatTripType(
            booking.trip_type
          )
        ],

        [
          'Vuelo',
          booking.flight_number ||
          'No especificado'
        ]
      ];

      /*
       * Incluye los datos del regreso
       * únicamente para reservas de
       * ida y vuelta.
       */
      if (
        booking.trip_type ===
        'round_trip'
      ) {
        rows.splice(
          7,
          0,

          [
            'Fecha de regreso',
            booking.return_date ||
            '-'
          ],

          [
            'Hora de regreso',
            String(
              booking.return_time ||
              ''
            ).slice(0, 5) ||
            '-'
          ]
        );
      }

      rows.forEach(
        (
          [
            label,
            value
          ]
        ) => {
          const y = doc.y;

          doc
            .fillColor(muted)
            .fontSize(10)
            .font(
              'Helvetica-Bold'
            )
            .text(
              label,
              50,
              y,
              {
                width: 135
              }
            );

          doc
            .fillColor(dark)
            .fontSize(10)
            .font(
              'Helvetica'
            )
            .text(
              String(
                value ||
                '-'
              ),
              185,
              y,
              {
                width: 360
              }
            );

          doc.moveDown(0.75);
        }
      );

      doc.moveDown(0.4);

      doc
        .strokeColor(
          '#DCEAF2'
        )
        .moveTo(
          50,
          doc.y
        )
        .lineTo(
          545,
          doc.y
        )
        .stroke();

      doc.moveDown(1);

      doc
        .fillColor(dark)
        .fontSize(12)
        .font(
          'Helvetica-Bold'
        )
        .text(
          'Información del pago'
        );

      doc.moveDown(0.7);

      const paymentRows = [
        [
          'Estado',
          'PAGADO'
        ],

        [
          'Método',
          'PayPal'
        ],

        [
          'Orden PayPal',
          booking.paypal_order_id
        ],

        [
          'Transacción',
          booking.paypal_capture_id
        ],

        [
          'Fecha de pago',
          booking.paid_at
            ? new Date(
                booking.paid_at
              ).toLocaleString(
                'es-DO',
                {
                  timeZone:
                    'America/Santo_Domingo'
                }
              )
            : '-'
        ],

        [
          'Monto pagado',
          formatMoney(
            booking.paid_amount,
            booking
              .payment_currency ||
            'USD'
          )
        ]
      ];

      paymentRows.forEach(
        (
          [
            label,
            value
          ]
        ) => {
          const y = doc.y;

          doc
            .fillColor(muted)
            .fontSize(10)
            .font(
              'Helvetica-Bold'
            )
            .text(
              label,
              50,
              y,
              {
                width: 135
              }
            );

          doc
            .fillColor(dark)
            .fontSize(10)
            .font(
              'Helvetica'
            )
            .text(
              String(
                value ||
                '-'
              ),
              185,
              y,
              {
                width: 360
              }
            );

          doc.moveDown(0.75);
        }
      );

      if (booking.notes) {
        doc.moveDown(0.5);

        doc
          .fillColor(dark)
          .fontSize(11)
          .font(
            'Helvetica-Bold'
          )
          .text('Notas');

        doc.moveDown(0.3);

        doc
          .fillColor(muted)
          .fontSize(10)
          .font(
            'Helvetica'
          )
          .text(
            booking.notes
          );
      }

      doc.moveDown(2);

      doc
        .fillColor(muted)
        .fontSize(9)
        .font(
          'Helvetica'
        )
        .text(
          'Este Ticket de reserva confirma el pago y los datos del traslado. No constituye un comprobante fiscal con NCF.',
          {
            align: 'center'
          }
        );

      doc.end();
    }
  );
}