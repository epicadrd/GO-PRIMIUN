const API_BASE = '/api';

const pickupDestinationSelect =
  document.getElementById(
    'pickup_destination_id'
  );

const dropoffDestinationSelect =
  document.getElementById(
    'dropoff_destination_id'
  );

const vehicleSelect =
  document.getElementById(
    'vehicle_id'
  );

const tripTypeInput =
  document.getElementById(
    'trip_type'
  );

const zoneInput =
  document.getElementById(
    'zone_id'
  );

const travelDateInput =
  document.getElementById(
    'travel_date'
  );

const travelTimeSelect =
  document.getElementById(
    'travel_time'
  );

const returnFields =
  document.getElementById(
    'returnFields'
  );

const returnDateInput =
  document.getElementById(
    'return_date'
  );

const returnTimeSelect =
  document.getElementById(
    'return_time'
  );

const outboundAvailabilityText =
  document.getElementById(
    'outboundAvailabilityText'
  );

const returnAvailabilityText =
  document.getElementById(
    'returnAvailabilityText'
  );

const form =
  document.getElementById(
    'bookingForm'
  );

const alertBox =
  document.getElementById(
    'alertBox'
  );

const priceText =
  document.getElementById(
    'priceText'
  );

const oneWayCheck =
  document.getElementById(
    'oneWayCheck'
  );

const roundTripCheck =
  document.getElementById(
    'roundTripCheck'
  );

const openBookingDetailsBtn =
  document.getElementById(
    'openBookingDetailsBtn'
  );

const bookingDetailsModal =
  document.getElementById(
    'bookingDetailsModal'
  );

const closeBookingModal =
  document.getElementById(
    'closeBookingModal'
  );

const backToFormBtn =
  document.getElementById(
    'backToFormBtn'
  );

const paypalButtonsContainer =
  document.getElementById(
    'paypalButtonsContainer'
  );

const paypalStatus =
  document.getElementById(
    'paypalStatus'
  );

const selectedVehicleImage =
  document.getElementById(
    'selectedVehicleImage'
  );

const selectedVehicleName =
  document.getElementById(
    'selectedVehicleName'
  );

const selectedVehiclePax =
  document.getElementById(
    'selectedVehiclePax'
  );

const summaryDurationBadge =
  document.getElementById(
    'summaryDurationBadge'
  );

const increasePassengers =
  document.getElementById(
    'increasePassengers'
  );

const decreasePassengers =
  document.getElementById(
    'decreasePassengers'
  );

const passengersInput =
  document.getElementById(
    'passengers'
  );

const summaryZone =
  document.getElementById(
    'summaryZone'
  );

const summaryDestination =
  document.getElementById(
    'summaryDestination'
  );

const summaryVehicle =
  document.getElementById(
    'summaryVehicle'
  );

const summaryType =
  document.getElementById(
    'summaryType'
  );

const fallbackVehicleImage =
  '/img/TAHOE.png';

let paypalButtonsRendered = false;

async function downloadBookingTicket(
  ticketUrl,
  bookingId
) {
  const response =
    await fetch(ticketUrl);

  if (!response.ok) {
    let message =
      'No se pudo descargar el Ticket de reserva';

    try {
      const errorData =
        await response.json();

      message =
        errorData.message ||
        message;
    } catch (_) {
      // La respuesta no era JSON.
    }

    throw new Error(message);
  }

  const pdfBlob =
    await response.blob();

  const blobUrl =
    URL.createObjectURL(
      pdfBlob
    );

  const downloadLink =
    document.createElement('a');

  downloadLink.href =
    blobUrl;

  downloadLink.download =
    `ticket-reserva-${bookingId}.pdf`;

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();
  downloadLink.remove();

  setTimeout(
    () =>
      URL.revokeObjectURL(
        blobUrl
      ),
    1000
  );
}

function todayInDominicanRepublic() {
  const formatter =
    new Intl.DateTimeFormat(
      'en-CA',
      {
        timeZone:
          'America/Santo_Domingo',

        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
    );

  const parts =
    Object.fromEntries(
      formatter
        .formatToParts(
          new Date()
        )
        .filter(
          part =>
            part.type !==
            'literal'
        )
        .map(
          part => [
            part.type,
            part.value
          ]
        )
    );

  return (
    `${parts.year}-` +
    `${parts.month}-` +
    `${parts.day}`
  );
}

function renderSlots(
  select,
  slots,
  emptyMessage
) {
  const previous =
    select.value;

  select.innerHTML =
    `<option value="">` +
    `${emptyMessage}` +
    `</option>`;

  slots.forEach(time => {
    const option =
      document.createElement(
        'option'
      );

    option.value = time;

    option.textContent =
      new Date(
        `2000-01-01T${time}:00`
      ).toLocaleTimeString(
        'es-DO',
        {
          hour: 'numeric',
          minute: '2-digit'
        }
      );

    select.appendChild(
      option
    );
  });

  select.disabled =
    slots.length === 0;

  if (
    slots.includes(previous)
  ) {
    select.value = previous;
  }
}

async function loadAvailableSlots(
  kind = 'outbound'
) {
  const isReturn =
    kind === 'return';

  const dateInput =
    isReturn
      ? returnDateInput
      : travelDateInput;

  const timeSelect =
    isReturn
      ? returnTimeSelect
      : travelTimeSelect;

  const helpText =
    isReturn
      ? returnAvailabilityText
      : outboundAvailabilityText;

  const vehicleId =
    vehicleSelect.value;

  const date =
    dateInput.value;

  if (
    !vehicleId ||
    !date
  ) {
    renderSlots(
      timeSelect,
      [],
      'Selecciona fecha y vehículo'
    );

    helpText.textContent =
      'Mostraremos únicamente horarios disponibles.';

    return [];
  }

  timeSelect.disabled = true;

  timeSelect.innerHTML =
    '<option value="">Consultando disponibilidad...</option>';

  try {
    const url =
      `${API_BASE}/availability` +
      `?vehicle_id=${encodeURIComponent(vehicleId)}` +
      `&date=${encodeURIComponent(date)}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.ok
    ) {
      throw new Error(
        data.message ||
        'No se pudo consultar la disponibilidad.'
      );
    }

    let slots =
      data.slots;

    /*
     * Si el regreso es el mismo día,
     * elimina las horas que se cruzan
     * con el traslado de ida.
     */
    if (
      isReturn &&
      date ===
        travelDateInput.value &&
      travelTimeSelect.value
    ) {
      const [
        outHours,
        outMinutes
      ] = travelTimeSelect
        .value
        .split(':')
        .map(Number);

      const minimumReturn =
        outHours * 60 +
        outMinutes +
        Number(
          data.service_minutes ||
          120
        );

      slots =
        slots.filter(time => {
          const [
            hours,
            minutes
          ] = time
            .split(':')
            .map(Number);

          return (
            hours * 60 +
            minutes >=
            minimumReturn
          );
        });
    }

    renderSlots(
      timeSelect,
      slots,
      slots.length
        ? 'Selecciona una hora'
        : 'No hay horarios disponibles'
    );

    helpText.textContent =
      slots.length
        ? `${slots.length} horarios disponibles para esta fecha.`
        : 'Este vehículo no tiene horarios libres en la fecha seleccionada.';

    return slots;
  } catch (error) {
    console.error(
      'Error consultando horarios:',
      error
    );

    renderSlots(
      timeSelect,
      [],
      'No se pudo cargar'
    );

    helpText.textContent =
      error.message;

    return [];
  }
}

function setTripType(type) {
  if (
    type === 'round_trip'
  ) {
    roundTripCheck.checked =
      true;

    oneWayCheck.checked =
      false;

    tripTypeInput.value =
      'round_trip';
  } else {
    oneWayCheck.checked =
      true;

    roundTripCheck.checked =
      false;

    tripTypeInput.value =
      'one_way';
  }

  const isRoundTrip =
    type === 'round_trip';

  returnFields.classList.toggle(
    'is-hidden',
    !isRoundTrip
  );

  returnDateInput.required =
    isRoundTrip;

  returnTimeSelect.required =
    isRoundTrip;

  if (!isRoundTrip) {
    returnDateInput.value = '';

    returnTimeSelect.innerHTML =
      '<option value="">No aplica</option>';

    returnTimeSelect.disabled =
      true;
  } else {
    if (
      travelDateInput.value &&
      !returnDateInput.value
    ) {
      returnDateInput.value =
        travelDateInput.value;
    }

    loadAvailableSlots(
      'return'
    );
  }

  updateSummary();
  getPrice();
}

oneWayCheck.addEventListener(
  'change',
  () => {
    if (
      oneWayCheck.checked
    ) {
      setTripType(
        'one_way'
      );
    } else if (
      !roundTripCheck.checked
    ) {
      oneWayCheck.checked =
        true;
    }
  }
);

roundTripCheck.addEventListener(
  'change',
  () => {
    if (
      roundTripCheck.checked
    ) {
      setTripType(
        'round_trip'
      );
    } else if (
      !oneWayCheck.checked
    ) {
      roundTripCheck.checked =
        true;
    }
  }
);

increasePassengers.addEventListener(
  'click',
  () => {
    const option =
      getSelectedVehicleOption();

    const maximum =
      Number(
        option?.dataset
          .maxPassengers || 1
      );

    const current =
      Number(
        passengersInput.value || 1
      );

    if (current >= maximum) {
      alert(
        `Este vehículo permite un máximo de ${maximum} pasajeros.`
      );

      passengersInput.value =
        maximum;

      return;
    }

    passengersInput.value =
      current + 1;
  }
);

decreasePassengers.addEventListener(
  'click',
  () => {
    const current =
      Number(
        passengersInput.value || 1
      );

    passengersInput.value =
      current > 1
        ? current - 1
        : 1;
  }
);

async function loadDestinations() {
  try {
    const response =
      await fetch(
        `${API_BASE}/destinations/grouped`
      );

    const data =
      await response.json();

    if (!data.ok) {
      pickupDestinationSelect.innerHTML =
        '<option value="">No se pudieron cargar los lugares</option>';

      dropoffDestinationSelect.innerHTML =
        '<option value="">No se pudieron cargar los destinos</option>';

      return;
    }

    pickupDestinationSelect.innerHTML =
      '<option value="">Selecciona lugar de recogida</option>';

    dropoffDestinationSelect.innerHTML =
      '<option value="">Selecciona destino</option>';

    data.groups.forEach(
      group => {
        const pickupGroup =
          document.createElement(
            'optgroup'
          );

        pickupGroup.label =
          group.zone_name;

        const dropoffGroup =
          document.createElement(
            'optgroup'
          );

        dropoffGroup.label =
          group.zone_name;

        group.destinations.forEach(
          destination => {
            const pickupOption =
              document.createElement(
                'option'
              );

            pickupOption.value =
              destination.id;

            pickupOption.textContent =
              destination.name;

            pickupOption.dataset.zoneId =
              group.zone_id;

            pickupOption.dataset.zoneName =
              group.zone_name;

            pickupOption.dataset.duration =
              destination
                .duration_text ||
              '';

            pickupGroup.appendChild(
              pickupOption
            );

            const dropoffOption =
              document.createElement(
                'option'
              );

            dropoffOption.value =
              destination.id;

            dropoffOption.textContent =
              destination.name;

            dropoffOption.dataset.zoneId =
              group.zone_id;

            dropoffOption.dataset.zoneName =
              group.zone_name;

            dropoffOption.dataset.duration =
              destination
                .duration_text ||
              '';

            dropoffGroup.appendChild(
              dropoffOption
            );
          }
        );

        pickupDestinationSelect
          .appendChild(
            pickupGroup
          );

        dropoffDestinationSelect
          .appendChild(
            dropoffGroup
          );
      }
    );
  } catch (error) {
    console.error(
      'Error cargando destinos:',
      error
    );

    pickupDestinationSelect.innerHTML =
      '<option value="">Error cargando lugares</option>';

    dropoffDestinationSelect.innerHTML =
      '<option value="">Error cargando destinos</option>';
  }
}

async function loadVehicles() {
  try {
    const response =
      await fetch(
        `${API_BASE}/vehicles`
      );

    const data =
      await response.json();

    if (!data.ok) {
      vehicleSelect.innerHTML =
        '<option value="">No se pudieron cargar los vehículos</option>';

      return;
    }

    vehicleSelect.innerHTML =
      '<option value="">Selecciona un vehículo</option>';

    data.vehicles.forEach(
      vehicle => {
        const option =
          document.createElement(
            'option'
          );

        option.value =
          vehicle.id;

        option.textContent =
          vehicle.name;

        option.dataset.maxPassengers =
          vehicle.max_passengers;

        option.dataset.image =
          vehicle.image ||
          fallbackVehicleImage;

        vehicleSelect.appendChild(
          option
        );
      }
    );
  } catch (error) {
    console.error(
      'Error cargando vehículos:',
      error
    );

    vehicleSelect.innerHTML =
      '<option value="">Error cargando vehículos</option>';
  }
}

function getSelectedPickupOption() {
  return (
    pickupDestinationSelect
      .options[
        pickupDestinationSelect
          .selectedIndex
      ] ||
    null
  );
}

function getSelectedDropoffOption() {
  return (
    dropoffDestinationSelect
      .options[
        dropoffDestinationSelect
          .selectedIndex
      ] ||
    null
  );
}

function getSelectedVehicleOption() {
  return (
    vehicleSelect.options[
      vehicleSelect.selectedIndex
    ] ||
    null
  );
}

function updateSelectedZoneFromDestination() {
  const pickupOption =
    getSelectedPickupOption();

  const dropoffOption =
    getSelectedDropoffOption();

  if (
    !pickupOption ||
    !dropoffOption ||
    !pickupOption.dataset.zoneId ||
    !dropoffOption.dataset.zoneId
  ) {
    zoneInput.value = '';

    summaryDurationBadge.textContent =
      'Duración estimada: -';

    return;
  }

  zoneInput.value =
    `${pickupOption.dataset.zoneId}-` +
    `${dropoffOption.dataset.zoneId}`;

  summaryDurationBadge.textContent =
    'Duración estimada: ' +
    (
      dropoffOption.dataset.duration ||
      pickupOption.dataset.duration ||
      '-'
    );
}

function updateVehiclePreview() {
  const option =
    getSelectedVehicleOption();

  if (
    !option ||
    !option.value
  ) {
    selectedVehicleImage.src =
      fallbackVehicleImage;

    selectedVehicleName.textContent =
      'Vehículo no seleccionado';

    selectedVehiclePax.textContent =
      'Selecciona un vehículo para ver su capacidad';

    return;
  }

  selectedVehicleImage.src =
    option.dataset.image ||
    fallbackVehicleImage;

  selectedVehicleName.textContent =
    option.textContent ||
    'Vehículo seleccionado';

  selectedVehiclePax.textContent =
    `Capacidad máxima: ` +
    `${option.dataset.maxPassengers || '-'} pasajeros`;
}

function updateSummary() {
  const pickupOption =
    getSelectedPickupOption();

  const dropoffOption =
    getSelectedDropoffOption();

  const vehicleOption =
    getSelectedVehicleOption();

  summaryZone.textContent =
    pickupOption?.dataset.zoneName &&
    dropoffOption?.dataset.zoneName
      ? `${pickupOption.dataset.zoneName} → ${dropoffOption.dataset.zoneName}`
      : '-';

  summaryDestination.textContent =
    pickupOption?.textContent &&
    dropoffOption?.textContent
      ? `${pickupOption.textContent} → ${dropoffOption.textContent}`
      : '-';

  summaryVehicle.textContent =
    vehicleOption?.textContent ||
    '-';

  summaryType.textContent =
    tripTypeInput.value ===
    'round_trip'
      ? 'Ida y vuelta'
      : 'Una vía';

  updateSelectedZoneFromDestination();
  updateVehiclePreview();
}

async function getPrice() {
  const pickupId =
    pickupDestinationSelect.value;

  const dropoffId =
    dropoffDestinationSelect.value;

  const vehicleId =
    vehicleSelect.value;

  const type =
    tripTypeInput.value;

  if (
    !pickupId ||
    !dropoffId ||
    !vehicleId ||
    !type
  ) {
    priceText.textContent =
      '$0.00';

    alertBox.innerHTML = '';

    return;
  }

  try {
    alertBox.innerHTML = '';

    const url =
      `${API_BASE}/price` +
      `?pickup_destination_id=${pickupId}` +
      `&dropoff_destination_id=${dropoffId}` +
      `&vehicle_id=${vehicleId}` +
      `&type=${type}`;

    const response =
      await fetch(url);

    const data =
      await response.json();

    if (data.ok) {
      priceText.textContent =
        `$${Number(data.price).toFixed(2)}`;

      summaryZone.textContent =
        data.pickup?.zone_name &&
        data.dropoff?.zone_name
          ? `${data.pickup.zone_name} → ${data.dropoff.zone_name}`
          : '-';

      summaryDestination.textContent =
        data.pickup?.name &&
        data.dropoff?.name
          ? `${data.pickup.name} → ${data.dropoff.name}`
          : '-';

      summaryDurationBadge.textContent =
        `Duración estimada: ${data.duration_text || '-'}`;
    } else {
      priceText.textContent =
        '$0.00';

      alertBox.innerHTML = `
        <div class="alert alert-danger">
          ${
            data.message ||
            'No se pudo calcular el precio para esta ruta.'
          }
        </div>
      `;
    }
  } catch (error) {
    console.error(
      'Error calculando precio:',
      error
    );

    priceText.textContent =
      '$0.00';

    alertBox.innerHTML = `
      <div class="alert alert-danger">
        Error conectando con el servidor al calcular el precio.
      </div>
    `;
  }
}

function openModal() {
  bookingDetailsModal
    .classList
    .add('show');

  document.body.style.overflow =
    'hidden';
}

function closeModal() {
  bookingDetailsModal
    .classList
    .remove('show');

  document.body.style.overflow =
    '';
}

function validateStepOne() {
  const required = [
    pickupDestinationSelect.value,
    dropoffDestinationSelect.value,
    travelDateInput.value,
    travelTimeSelect.value,
    passengersInput.value,
    vehicleSelect.value
  ];

  if (
    !required.every(Boolean)
  ) {
    return false;
  }

  if (
    tripTypeInput.value ===
    'round_trip'
  ) {
    return Boolean(
      returnDateInput.value &&
      returnTimeSelect.value
    );
  }

  return true;
}

openBookingDetailsBtn.addEventListener(
  'click',
  async () => {
    updateSummary();
    await getPrice();

    const selectedOutbound =
      travelTimeSelect.value;

    const selectedReturn =
      returnTimeSelect.value;

    const outboundSlots =
      await loadAvailableSlots(
        'outbound'
      );

    if (
      outboundSlots.includes(
        selectedOutbound
      )
    ) {
      travelTimeSelect.value =
        selectedOutbound;
    }

    const returnSlots =
      tripTypeInput.value ===
      'round_trip'
        ? await loadAvailableSlots(
            'return'
          )
        : [];

    if (
      returnSlots.includes(
        selectedReturn
      )
    ) {
      returnTimeSelect.value =
        selectedReturn;
    }

    if (
      !validateStepOne() ||
      !outboundSlots.includes(
        travelTimeSelect.value
      ) ||
      (
        tripTypeInput.value ===
          'round_trip' &&
        !returnSlots.includes(
          returnTimeSelect.value
        )
      )
    ) {
      alertBox.innerHTML = `
        <div class="alert alert-danger">
          Completa todos los datos y selecciona horarios que continúen disponibles.
        </div>
      `;

      return;
    }

    alertBox.innerHTML = '';

    openModal();

    await new Promise(
      resolve =>
        requestAnimationFrame(
          resolve
        )
    );

    await initPayments();
  }
);

closeBookingModal.addEventListener(
  'click',
  closeModal
);

backToFormBtn.addEventListener(
  'click',
  closeModal
);

bookingDetailsModal.addEventListener(
  'click',
  event => {
    if (
      event.target ===
      bookingDetailsModal
    ) {
      closeModal();
    }
  }
);

pickupDestinationSelect.addEventListener(
  'change',
  async () => {
    updateSummary();
    await getPrice();
  }
);

dropoffDestinationSelect.addEventListener(
  'change',
  async () => {
    updateSummary();
    await getPrice();
  }
);

vehicleSelect.addEventListener(
  'change',
  async () => {
    const option =
      getSelectedVehicleOption();

    const maximum =
      Number(
        option?.dataset
          .maxPassengers || 1
      );

    if (
      Number(
        passengersInput.value || 1
      ) > maximum
    ) {
      passengersInput.value =
        maximum;
    }

    updateSummary();

    await getPrice();

    await loadAvailableSlots(
      'outbound'
    );

    if (
      tripTypeInput.value ===
      'round_trip'
    ) {
      await loadAvailableSlots(
        'return'
      );
    }
  }
);

travelDateInput.addEventListener(
  'change',
  async () => {
    if (
      travelDateInput.value &&
      (
        !returnDateInput.value ||
        returnDateInput.value <
          travelDateInput.value
      )
    ) {
      returnDateInput.value =
        travelDateInput.value;
    }

    returnDateInput.min =
      travelDateInput.value ||
      todayInDominicanRepublic();

    await loadAvailableSlots(
      'outbound'
    );

    if (
      tripTypeInput.value ===
      'round_trip'
    ) {
      await loadAvailableSlots(
        'return'
      );
    }
  }
);

returnDateInput.addEventListener(
  'change',
  () =>
    loadAvailableSlots(
      'return'
    )
);

travelTimeSelect.addEventListener(
  'change',
  () => {
    if (
      tripTypeInput.value ===
      'round_trip'
    ) {
      loadAvailableSlots(
        'return'
      );
    }
  }
);

function getBookingPayload() {
  return {
    full_name:
      document
        .getElementById(
          'full_name'
        )
        .value
        .trim(),

    email:
      document
        .getElementById(
          'email'
        )
        .value
        .trim(),

    phone:
      document
        .getElementById(
          'phone'
        )
        .value
        .trim(),

    pickup_destination_id:
      Number(
        pickupDestinationSelect
          .value
      ),

    dropoff_destination_id:
      Number(
        dropoffDestinationSelect
          .value
      ),

    vehicle_id:
      Number(
        vehicleSelect.value
      ),

    trip_type:
      tripTypeInput.value,

    travel_date:
      travelDateInput.value,

    travel_time:
      travelTimeSelect.value
        ? `${travelTimeSelect.value}:00`
        : '',

    return_date:
      tripTypeInput.value ===
      'round_trip'
        ? returnDateInput.value
        : null,

    return_time:
      tripTypeInput.value ===
        'round_trip' &&
      returnTimeSelect.value
        ? `${returnTimeSelect.value}:00`
        : null,

    passengers:
      Number(
        passengersInput.value
      ),

    flight_number:
      document
        .getElementById(
          'flight_number'
        )
        .value
        .trim(),

    notes:
      document
        .getElementById(
          'notes'
        )
        .value
        .trim()
  };
}

function validateBookingPayload(
  payload
) {
  if (
    !payload.full_name ||
    !payload.email ||
    !payload.phone ||
    !payload.pickup_destination_id ||
    !payload.dropoff_destination_id ||
    !payload.vehicle_id ||
    !payload.travel_date ||
    !payload.travel_time ||
    !payload.passengers
  ) {
    throw new Error(
      'Completa todos los datos obligatorios, incluyendo el correo.'
    );
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(payload.email)
  ) {
    throw new Error(
      'Escribe un correo electrónico válido.'
    );
  }

  if (
    payload.trip_type ===
      'round_trip' &&
    (
      !payload.return_date ||
      !payload.return_time
    )
  ) {
    throw new Error(
      'Selecciona la fecha y hora de regreso.'
    );
  }
}

function resetBookingForm() {
  form.reset();

  document
    .getElementById(
      'full_name'
    )
    .value = '';

  document
    .getElementById(
      'email'
    )
    .value = '';

  document
    .getElementById(
      'phone'
    )
    .value = '';

  document
    .getElementById(
      'flight_number'
    )
    .value = '';

  document
    .getElementById(
      'notes'
    )
    .value = '';

  travelTimeSelect.innerHTML =
    '<option value="">Selecciona fecha y vehículo</option>';

  travelTimeSelect.disabled =
    true;

  returnTimeSelect.innerHTML =
    '<option value="">No aplica</option>';

  returnTimeSelect.disabled =
    true;

  returnFields.classList.add(
    'is-hidden'
  );

  passengersInput.value = 1;

  oneWayCheck.checked = true;
  roundTripCheck.checked = false;

  tripTypeInput.value =
    'one_way';

  zoneInput.value = '';

  priceText.textContent =
    '$0.00';

  summaryZone.textContent = '-';
  summaryDestination.textContent = '-';
  summaryVehicle.textContent = '-';
  summaryType.textContent = '-';

  summaryDurationBadge.textContent =
    'Duración estimada: -';

  selectedVehicleImage.src =
    fallbackVehicleImage;

  selectedVehicleName.textContent =
    'Vehículo no seleccionado';

  selectedVehiclePax.textContent =
    'Selecciona un vehículo para ver su capacidad';

  pickupDestinationSelect
    .selectedIndex = 0;

  dropoffDestinationSelect
    .selectedIndex = 0;

  vehicleSelect.selectedIndex = 0;
}

async function loadPayPalSdk() {
  const response =
    await fetch(
      `${API_BASE}/payments/paypal/config`
    );

  const config =
    await response.json();

  if (
    !response.ok ||
    !config.ok
  ) {
    throw new Error(
      config.message ||
      'No se pudo cargar la configuración de PayPal'
    );
  }

  await new Promise(
    (
      resolve,
      reject
    ) => {
      if (window.paypal) {
        resolve();
        return;
      }

      const script =
        document.createElement(
          'script'
        );

      script.src =
        'https://www.paypal.com/sdk/js' +
        `?client-id=${encodeURIComponent(config.clientId)}` +
        `&currency=${encodeURIComponent(config.currency)}` +
        '&intent=capture' +
        '&components=buttons,funding-eligibility' +
        '&enable-funding=card';

      script.onload =
        resolve;

      script.onerror =
        () => {
          reject(
            new Error(
              'No se pudo cargar PayPal'
            )
          );
        };

      document.head.appendChild(
        script
      );
    }
  );
}

async function renderPayPalButtons() {
  if (paypalButtonsRendered) {
    return;
  }

  await loadPayPalSdk();

  let pendingBookingId =
    null;

  let pendingOrderId =
    null;

  const paymentCallbacks = {
    createOrder:
      async () => {
        paypalStatus.innerHTML =
          '';

        const payload =
          getBookingPayload();

        validateBookingPayload(
          payload
        );

        const response =
          await fetch(
            `${API_BASE}/payments/paypal/create-order`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.ok
        ) {
          throw new Error(
            data.message ||
            'No se pudo iniciar el pago'
          );
        }

        pendingBookingId =
          data.bookingId;

        pendingOrderId =
          data.orderId;

        return data.orderId;
      },

    onApprove:
      async data => {
        paypalStatus.innerHTML = `
          <div class="alert alert-success">
            Confirmando tu pago...
          </div>
        `;

        const response =
          await fetch(
            `${API_BASE}/payments/paypal/capture-order`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  bookingId:
                    pendingBookingId,

                  orderId:
                    data.orderID
                })
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.ok
        ) {
          throw new Error(
            result.message ||
            'No se pudo confirmar el pago'
          );
        }

        const ticketUrl =
          result.ticketUrl ||
          null;

        if (ticketUrl) {
          await downloadBookingTicket(
            ticketUrl,
            result.bookingId
          ).catch(error => {
            console.error(
              'No se pudo descargar automáticamente el ticket:',
              error
            );
          });
        }

        closeModal();

        alertBox.innerHTML = `
          <div class="alert alert-success">
            <strong>
              Pago confirmado.
            </strong>

            Tu reserva es la
            #${result.bookingId}.

            <br>

            ${
              ticketUrl
                ? `
                  <a
                    href="${ticketUrl}"
                    download="ticket-reserva-${result.bookingId}.pdf"
                  >
                    Descargar Ticket de reserva
                  </a>
                  <br>
                `
                : ''
            }

            ${
              result.emailSent
                ? 'También enviamos el Ticket de reserva a tu correo.'
                : (
                    result.emailWarning ||
                    'El correo no pudo enviarse, pero puedes descargar el Ticket de reserva.'
                  )
            }
          </div>
        `;

        paypalStatus.innerHTML =
          '';

        pendingBookingId =
          null;

        pendingOrderId =
          null;

        resetBookingForm();
      },

    onCancel: () => {
      if (
        pendingBookingId &&
        pendingOrderId
      ) {
        fetch(
          `${API_BASE}/payments/paypal/release-order`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({
                bookingId:
                  pendingBookingId,

                orderId:
                  pendingOrderId
              })
          }
        ).catch(() => {});
      }

      pendingBookingId =
        null;

      pendingOrderId =
        null;

      paypalStatus.innerHTML = `
        <div class="alert alert-danger">
          El pago fue cancelado.
          No se realizó ningún cobro.
        </div>
      `;
    },

    onError: error => {
      console.error(
        'Error PayPal:',
        error
      );

      paypalStatus.innerHTML = `
        <div class="alert alert-danger">
          ${
            error.message ||
            'Ocurrió un error procesando el pago con PayPal.'
          }
        </div>
      `;
    }
  };

  paypalButtonsContainer.innerHTML =
    '';

  const fundingSources = [
    window.paypal
      .FUNDING.PAYPAL,

    window.paypal
      .FUNDING.CARD
  ];

  let renderedButtons = 0;

  for (
    const fundingSource
    of fundingSources
  ) {
    const isPayPal =
      fundingSource ===
      window.paypal
        .FUNDING.PAYPAL;

    const button =
      window.paypal.Buttons({
        ...paymentCallbacks,

        fundingSource,

        style: {
          layout: 'vertical',
          shape: 'rect',
          height: 40,
          tagline: false,

          ...(
            isPayPal
              ? {
                  color: 'gold',
                  label: 'paypal'
                }
              : {
                  color: 'black',
                  label: 'pay'
                }
          )
        }
      });

    if (
      button.isEligible()
    ) {
      await button.render(
        paypalButtonsContainer
      );

      renderedButtons += 1;
    }
  }

  if (!renderedButtons) {
    throw new Error(
      'PayPal no está disponible en este navegador.'
    );
  }

  paypalButtonsRendered =
    true;
}

async function initPayments() {
  if (paypalButtonsRendered) {
    return;
  }

  try {
    paypalStatus.innerHTML = `
      <div class="alert">
        Cargando opciones de pago...
      </div>
    `;

    await renderPayPalButtons();

    paypalStatus.innerHTML =
      '';
  } catch (error) {
    console.error(error);

    paypalStatus.innerHTML = `
      <div class="alert alert-danger">
        No se pudo cargar PayPal.
        Intenta nuevamente más tarde.
      </div>
    `;
  }
}

async function init() {
  const minimumDate =
    todayInDominicanRepublic();

  travelDateInput.min =
    minimumDate;

  returnDateInput.min =
    minimumDate;

  await loadDestinations();
  await loadVehicles();

  updateSummary();
}

init();