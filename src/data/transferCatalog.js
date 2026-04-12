export const AIRPORT_PUJ = {
  code: 'puj',
  name: 'Aeropuerto Punta Cana (PUJ)'
};

export const vehiclesCatalog = [
  {
    id: 1,
    slug: 'suburban_suv',
    name: 'Suburban SUV',
    capacity: '1-6 pax',
    category: 'SUV premium',
    icon: '🚙',
    image: '/img/TAHOE.png'
  },
  {
    id: 2,
    slug: 'suburban_2023',
    name: 'Suburban 2023',
    capacity: '1-6 pax',
    category: 'SUV executive',
    icon: '🚘',
    image: '/img/TAHOE.png'
  },
  {
    id: 3,
    slug: 'cadillac_2020',
    name: 'Cadillac',
    capacity: '1-5 pax',
    category: 'Luxury class',
    icon: '✨',
    image: '/img/TAHOE.png'
  },
  {
    id: 4,
    slug: 'cadillac_2024',
    name: 'Cadillac 2024',
    capacity: '1-5 pax',
    category: 'Ultra luxury',
    icon: '👑',
    image: '/img/TAHOE.png'
  }
];

export const extraServicesCatalog = [
  { key: 'baby_seat_0_12', label: 'Silla de bebé (1-12 meses)', price: 10 },
  { key: 'baby_seat_1_3', label: 'Silla de coche (1-3 años)', price: 10 },
  { key: 'booster_3_plus', label: 'Booster (3+ años)', price: 10 },
  { key: 'sim_claro', label: 'Tarjeta SIM Claro con internet 1 semana', price: 20 },
  { key: 'cigar_box', label: 'Top Dominican cigar (caja de regalo)', price: 70 },
  { key: 'prosecco', label: 'Botella de Prosecco espumoso', price: 65 },
  { key: 'brugal_xv', label: 'Botella de Ron Brugal XV', price: 40 },
  { key: 'presidente_six_pack', label: 'Six Pack Presidente helado', price: 25 }
];

export const destinationsCatalog = [
  {
    id: 101,
    zone_id: 3,
    slug: 'vista-cana-zona-bavaro',
    name: 'Vista Cana',
    zone_name: 'Zona de Bávaro',
    duration: '25 a 35 minutos',
    hotels: [
      'Vista Cana',
      'Vista Cana Residentes',
      'The Towers at Vista Cana',
      'Chukum Lagoon Hotel & Residences',
      'Lagoon Residences by Noriega Group',
      'Villa Vista Cana',
      'Villa Andrea',
      'Villa Las Palmitas Punta Cana',
      'Villa Coral Oasis frente al lago',
      'Casa Nova Panorama Garden G4',
      'Villa Caribe Panorama Park Unit THA3-104',
      'Palmas III at Vistacana',
      'Primaveral II 22B',
      'Primaveral Residences 2',
      'Villa Juana Primaveral II',
      'Epic Residences',
      'Costa Cana',
      'Primaveral Residences I'
    ],
    rates: {
      1: { one_way: 60, round_trip: 120 },
      2: { one_way: 85, round_trip: 170 },
      3: { one_way: 80, round_trip: 160 },
      4: { one_way: 120, round_trip: 240 }
    }
  },
  {
    id: 102,
    zone_id: 6,
    slug: 'bayahibe',
    name: 'Bayahibe',
    zone_name: 'Zona de Bayahibe',
    duration: '55 minutos a 1 hora',
    hotels: [
      'Secrets La Romana, An All-Inclusive Adults Only Resort',
      'Dreams La Romana, An All-Inclusive Family Resort',
      'HM Alma de Bayahibe - Adults Only',
      'Whala! Bayahibe',
      'Viva Dominicus Beach by Wyndham',
      'Viva Wyndham Dominicus Palace',
      'Hotel Catalonia Royal La Romana Adults Only',
      'Dreams Dominicus La Romana',
      'Iberostar Selection Hacienda Dominicus',
      'Sunscape Dominicus',
      'Hotel en Bayahibe',
      'Casa de Campo',
      'Apartments / Villa in Casa de Campo',
      'Casa de Campo Resort & Villas Main Resort'
    ],
    rates: {
      1: { one_way: 140, round_trip: 280 },
      2: { one_way: 160, round_trip: 320 },
      3: { one_way: 160, round_trip: 320 },
      4: { one_way: 190, round_trip: 380 }
    }
  },
  {
    id: 103,
    zone_id: 7,
    slug: 'la-romana',
    name: 'La Romana',
    zone_name: 'Zona de La Romana',
    duration: '1 hora 10 minutos a 1 hora 15 minutos',
    hotels: [
      'Hilton Garden Inn La Romana',
      'Bahía Príncipe Grand La Romana',
      'Bahía Príncipe Luxury Boungaville'
    ],
    rates: {
      1: { one_way: 180, round_trip: 360 },
      2: { one_way: 210, round_trip: 420 },
      3: { one_way: 210, round_trip: 420 },
      4: { one_way: 250, round_trip: 500 }
    }
  },
  {
    id: 104,
    zone_id: 8,
    slug: 'boca-chica',
    name: 'Boca Chica',
    zone_name: 'Zona de Boca Chica',
    duration: '1 hora 40 minutos a 1 hora 55 minutos',
    hotels: [
      'Coral Costa Caribe Beach Resort',
      'Hodelpa Garden Suites',
      'Whala! Boca Chica',
      'Don Juan Beach Resort',
      'Hampton by Hilton Santo Domingo Airport'
    ],
    rates: {
      1: { one_way: 280, round_trip: 560 },
      2: { one_way: 300, round_trip: 600 },
      3: { one_way: 300, round_trip: 600 },
      4: { one_way: 350, round_trip: 700 }
    }
  },
  {
    id: 105,
    zone_id: 9,
    slug: 'santo-domingo',
    name: 'Santo Domingo',
    zone_name: 'Santo Domingo',
    duration: '2 horas 55 minutos',
    hotels: [
      'Hotel Catalonia Santo Domingo',
      'Renaissance Santo Domingo Jaragua Hotel & Casino',
      'Hotel Sheraton Santo Domingo',
      'Crowne Plaza Santo Domingo',
      'Hotel Napolitano',
      'Hodelpa Caribe Colonial',
      'Hodelpa Nicolás de Ovando',
      'Conde Santo Domingo'
    ],
    rates: {
      1: { one_way: 320, round_trip: 640 },
      2: { one_way: 370, round_trip: 740 },
      3: { one_way: 370, round_trip: 740 },
      4: { one_way: 400, round_trip: 800 }
    }
  },
  {
    id: 106,
    zone_id: 10,
    slug: 'miches',
    name: 'Miches',
    zone_name: 'Zona de Miches',
    duration: '1 hora 55 minutos',
    hotels: [
      'Zemi Miches Punta Cana All-Inclusive Resort, Curio',
      'Club Med Miches Playa Esmeralda',
      'Viva Miches by Wyndham',
      'Secrets Playa Esmeralda',
      'Dreams Playa Esmeralda'
    ],
    rates: {
      1: { one_way: 190, round_trip: 380 },
      2: { one_way: 210, round_trip: 420 },
      3: { one_way: 210, round_trip: 420 },
      4: { one_way: 245, round_trip: 490 }
    }
  }
];

export function getDestinationById(destinationId) {
  return destinationsCatalog.find(destination => destination.id === Number(destinationId));
}

export function getVehicleById(vehicleId) {
  return vehiclesCatalog.find(vehicle => vehicle.id === Number(vehicleId));
}

export function resolveTransferRoute(pickup, destination) {
  if (!pickup || !destination || pickup === destination) {
    return null;
  }

  if (pickup === AIRPORT_PUJ.code) {
    return getDestinationById(destination);
  }

  if (destination === AIRPORT_PUJ.code) {
    return getDestinationById(pickup);
  }

  return null;
}

export function getTransferPrice({ pickup, destination, vehicle_id, trip_type }) {
  const route = resolveTransferRoute(pickup, destination);
  if (!route) return null;

  const vehicleRates = route.rates[Number(vehicle_id)];
  if (!vehicleRates) return null;

  return trip_type === 'round_trip' ? vehicleRates.round_trip : vehicleRates.one_way;
}
