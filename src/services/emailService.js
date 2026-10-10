import nodemailer from 'nodemailer';

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const SMTP_HOST =
    String(
      process.env.SMTP_HOST ||
      ''
    ).trim();

  const SMTP_PORT =
    String(
      process.env.SMTP_PORT ||
      ''
    ).trim();

  const SMTP_USER =
    String(
      process.env.SMTP_USER ||
      ''
    ).trim();

  const SMTP_PASS =
    String(
      process.env.SMTP_PASS ||
      ''
    ).trim();

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASS
  ) {
    throw new Error(
      'Faltan variables SMTP para enviar correos'
    );
  }

  transporter =
    nodemailer.createTransport({
      host: SMTP_HOST,

      port:
        Number(SMTP_PORT),

      secure:
        Number(SMTP_PORT) ===
        465,

      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

  return transporter;
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll(
      '&',
      '&amp;'
    )
    .replaceAll(
      '<',
      '&lt;'
    )
    .replaceAll(
      '>',
      '&gt;'
    )
    .replaceAll(
      '"',
      '&quot;'
    )
    .replaceAll(
      "'",
      '&#039;'
    );
}

export async function sendBookingReceipt({
  booking,
  pdfBuffer
}) {
  const mailer =
    getTransporter();

  const fromEmail =
    String(
      process.env
        .SMTP_FROM_EMAIL ||
      ''
    ).trim();

  const fromName =
    String(
      process.env
        .SMTP_FROM_NAME ||
      'Go Premium Transfer'
    ).trim();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(fromEmail)
  ) {
    throw new Error(
      'SMTP_FROM_EMAIL no contiene un correo válido'
    );
  }

  await mailer.sendMail({
    /*
     * Se utiliza el formato de objeto
     * para evitar el error SMTP:
     * "Was expecting MAIL arg syntax".
     */
    from: {
      name: fromName,
      address: fromEmail
    },

    to:
      booking.email,

    subject:
      `Ticket de reserva #${booking.id} · Go Premium Transfer`,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        color: #0b1b2b;
        line-height: 1.6;
        max-width: 640px;
        margin: auto;
      ">
        <h2 style="color: #2596be;">
          ¡Tu pago fue confirmado!
        </h2>

        <p>
          Hola
          <strong>
            ${escapeHtml(
              booking.full_name
            )}
          </strong>,
        </p>

        <p>
          Recibimos correctamente
          el pago de tu traslado privado.
        </p>

        <p>
          <strong>
            Reserva:
          </strong>

          #${booking.id}

          <br>

          <strong>
            Recogida:
          </strong>

          ${escapeHtml(
            booking
              .pickupDestination
              ?.name
          )}

          <br>

          <strong>
            Destino:
          </strong>

          ${escapeHtml(
            booking
              .dropoffDestination
              ?.name
          )}

          <br>

          <strong>
            Fecha de ida:
          </strong>

          ${escapeHtml(
            booking.travel_date
          )}

          <br>

          <strong>
            Hora de ida:
          </strong>

          ${escapeHtml(
            String(
              booking.travel_time ||
              ''
            ).slice(0, 5)
          )}

          <br>

          ${
            booking.trip_type ===
            'round_trip'
              ? `
                <strong>
                  Fecha de regreso:
                </strong>

                ${escapeHtml(
                  booking.return_date
                )}

                <br>

                <strong>
                  Hora de regreso:
                </strong>

                ${escapeHtml(
                  String(
                    booking.return_time ||
                    ''
                  ).slice(0, 5)
                )}

                <br>
              `
              : ''
          }

          <strong>
            Monto pagado:
          </strong>

          USD
          ${Number(
            booking.paid_amount
          ).toFixed(2)}
        </p>

        <p>
          Adjuntamos tu Ticket de reserva
          con la confirmación del pago
          y todos los datos del traslado.
        </p>

        <p>
          Gracias por elegir
          <strong>
            Go Premium Transfer
          </strong>.
        </p>
      </div>
    `,

    attachments: [
      {
        filename:
          `ticket-reserva-${booking.id}.pdf`,

        content:
          pdfBuffer,

        contentType:
          'application/pdf'
      }
    ]
  });
}