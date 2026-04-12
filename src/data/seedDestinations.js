import Destination from '../models/Destination.js';

export async function seedDestinations() {
  console.log('🌱 Insertando destinos...');

  const destinations = [
    // ========================
    // PUJ (1)
    // ========================
    { name: 'Aeropuerto Punta Cana (PUJ)', zone_id: 1, duration_text: 'Aeropuerto' },

    // ========================
    // CAP CANA (2)
    // ========================
    { name: 'Hyatt Zilara Cap Cana Adults Only', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hyatt Ziva Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'TRS Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Marina Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'The Westin Punta Cana Resort', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villas en Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Tortuga Bay Hotel at Punta Cana Resort', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Eden Roc Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'The St. Regis Cap Cana Resort', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Sanctuary Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Dreams Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Sports Illustrated Resorts Marina and Villas', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Club Med Punta Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Secrets Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hotel Casa Don Luis Cap Cana by Faranda', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Punta Palmera', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Green Villa Cap Cana Spa', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Arrecife', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Tortuga', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Cap Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Punta Cana', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Margarita', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife St Punta Cana Resort & Club', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 27', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 26', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 25', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 24', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 23 - Dazzling Golf View Property', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 30 by RelaxInn', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Arrecife 32', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 34', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Arrecife 39', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Lorenne', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 48', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Arrecife 15 Villa Tartaruga', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Villa Saman', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda B13', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda A39', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda A40', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda B21', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda B20', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda 51', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda B4', zone_id: 2, duration_text: '20-30 min' },
    { name: 'Hacienda B3', zone_id: 2, duration_text: '20-30 min' },

    // ========================
    // BÁVARO (3)
    // ========================
    { name: 'AC Marriott Hotel Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Hotel Faranda Single 1 Puntacana Adults Only', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Barcelo Bavaro Palace Deluxe', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Barcelo Bavaro Beach Adults Only', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Lopesan Costa Bavaro Resort Spa & Casino', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Melia Punta Cana Beach Wellness Adults Only', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Melia Caribe Beach Resort Family', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Zel Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Paradisus Palma Real', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Paradisus Grand Cana All Suites', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Circle at Paradisus Palma Real', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Waterfall', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Coral Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Julia', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Madonna Cocotal', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Elysium', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Palma', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Cocos 124', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Cocotal', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Dream Royal Beach Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Secrets Royal Beach', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Whala Bavaro Beach', zone_id: 3, duration_text: '25-35 min' },
    { name: 'HM Bavaro Beach Adults Only', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Beach Garden 1', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Beach Garden 2', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Beach Garden 3', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Impressive Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Impressive Premium', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Vista Sol Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Presidential Suites Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'TRS Turquesa Hotel', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Grand Palladium Punta Cana Resort', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Grand Palladium Palace', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Grand Palladium Bavaro', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Occidental Punta Cana Resort', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Grand Bavaro Princess', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Caribe Deluxe Princess', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Punta Cana Princess', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Tropical Deluxe Princess', zone_id: 3, duration_text: '25-35 min' },
    { name: 'VIK Arena Blanca', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Ocean Blue & Sand', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Iberostar Selection Bavaro Suites', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Joia Bavaro by Iberostar', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Iberostar Waves Dominicana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Iberostar Waves Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Riu Bambu', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Riu Palace Bavaro', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Riu Palace Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Riu Palace Macao', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Grand Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Grand Aquamarine', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Fantasia Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Luxury Esmeralda', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Luxury Ambar', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Bahia Principe Grand Turquesa', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Royalton Bavaro', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Royalton Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Royalton Splash', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Hideaway at Royalton Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Majestic Colonial Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Majestic Mirage Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Majestic Elegance Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Occidental Caribe', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Riu Republica Punta Cana Hotel', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Hard Rock Punta Cana Hotel & Casino', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Cana Rock Star', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Vista Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Vista Cana Residentes', zone_id: 3, duration_text: '25-35 min' },
    { name: 'The Towers at Vista Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Chukum Lagoon Hotel & Residences', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Lagoon Residences by Noriega Group', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Vista Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Andrea', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Las Palmitas Punta Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Coral Oasis Feo Lago', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Casa Nova Panorama Garden G4', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Caribe Panorama Park Unit THA3-104', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Palmas III at Vistacana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Primaveral II 22B', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Primaveral Residences 2', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Villa Juana Primaveral II', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Epic Residences', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Costa Cana', zone_id: 3, duration_text: '25-35 min' },
    { name: 'Primaveral Residences I', zone_id: 3, duration_text: '25-35 min' },

    // ========================
    // CABEZA DE TORO (4)
    // ========================
    { name: 'Catalonia Punta Cana', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Catalonia Royal Bavaro', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Serenade Punta Cana Beach & Spa Resort', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Serenade All Suites Adults Only', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Sunscape Coco Punta Cana', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Jewel Palm Beach Punta Cana', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Dreams Flora Resort & Spa', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Blue Beach Punta Cana Luxury Resort', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Bakour Punta Cana Suites', zone_id: 4, duration_text: '20-30 min' },
    { name: 'Be Live Collection Punta Cana', zone_id: 4, duration_text: '20-30 min' },

    // ========================
    // UVERO ALTO (5)
    // ========================
    { name: 'Ocean El Faro', zone_id: 5, duration_text: '45-55 min' },
    { name: 'El Beso Adults Only at Ocean El Faro', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Royalton CHIC Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Nickelodeon Hotels & Resorts Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Wyndham Alltra Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Live Aqua Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Dreams Onyx Resort & Spa', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Breathless Punta Cana Resort & Spa', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Secrets Tides Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Finest Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Excellence El Carmen', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Playa Palmera Beach Resort', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Grand Sirenis Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Excellence Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'Zoetry Agua Punta Cana', zone_id: 5, duration_text: '45-55 min' },
    { name: 'W Punta Cana', zone_id: 5, duration_text: '45-55 min' },

    // ========================
    // BAYAHIBE (6)
    // ========================
    { name: 'Secrets La Romana', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Dreams La Romana', zone_id: 6, duration_text: '55-60 min' },
    { name: 'HM Alma de Bayahibe', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Whala Bayahibe', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Viva Dominicus Beach by Wyndham', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Viva Wyndham Dominicus Palace', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Hotel Catalonia Royal La Romana Adults Only', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Dreams Dominicus La Romana', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Iberostar Selection Hacienda Dominicus', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Sunscape Dominicus', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Hotel en Bayahibe', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Casa de Campo', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Apartments / Villa in Casa de Campo', zone_id: 6, duration_text: '55-60 min' },
    { name: 'Casa de Campo Resorts & Villas Main Resorts', zone_id: 6, duration_text: '55-60 min' },

    // ========================
    // LA ROMANA (7)
    // ========================
    { name: 'Hilton Garden Inn La Romana', zone_id: 7, duration_text: '1h10-1h15' },
    { name: 'Bahia Principe Grand La Romana', zone_id: 7, duration_text: '1h10-1h15' },
    { name: 'Bahia Principe Luxury Boungaville', zone_id: 7, duration_text: '1h10-1h15' },

    // ========================
    // BOCA CHICA (8)
    // ========================
    { name: 'Coral Costa Caribe Beach Resort', zone_id: 8, duration_text: '1h40-1h55' },
    { name: 'Hodelpa Garden Suites', zone_id: 8, duration_text: '1h40-1h55' },
    { name: 'Whala Boca Chica', zone_id: 8, duration_text: '1h40-1h55' },
    { name: 'Don Juan Beach Resort', zone_id: 8, duration_text: '1h40-1h55' },
    { name: 'Hampton by Hilton Santo Domingo Airport', zone_id: 8, duration_text: '1h40-1h55' },

    // ========================
    // SANTO DOMINGO (9)
    // ========================
    { name: 'Hotel Catalonia Santo Domingo', zone_id: 9, duration_text: '2h55' },
    { name: 'Renaissance Santo Domingo Jaragua Hotel & Casino', zone_id: 9, duration_text: '2h55' },
    { name: 'Hotel Sheraton Santo Domingo', zone_id: 9, duration_text: '2h55' },
    { name: 'Crowne Plaza Santo Domingo', zone_id: 9, duration_text: '2h55' },
    { name: 'Hotel Napolitano', zone_id: 9, duration_text: '2h55' },
    { name: 'Hodelpa Caribe Colonial', zone_id: 9, duration_text: '2h55' },
    { name: 'Hodelpa Nicolas de Ovando', zone_id: 9, duration_text: '2h55' },
    { name: 'Conde Santo Domingo', zone_id: 9, duration_text: '2h55' },

    // ========================
    // MICHES (10)
    // ========================
    { name: 'Zemi Miches Punta Cana All-Inclusive Resort Curio', zone_id: 10, duration_text: '1h55' },
    { name: 'Club Med Miches Playa Esmeralda', zone_id: 10, duration_text: '1h55' },
    { name: 'Viva Miches by Wyndham', zone_id: 10, duration_text: '1h55' },
    { name: 'Secrets Playa Esmeralda', zone_id: 10, duration_text: '1h55' },
    { name: 'Dreams Playa Esmeralda', zone_id: 10, duration_text: '1h55' },

    // ========================
    // MACAO (11)
    // ========================
    { name: 'Dreams Macao Beach Punta Cana', zone_id: 11, duration_text: '40-45 min' },
    { name: 'Secrets Macao Beach Punta Cana', zone_id: 11, duration_text: '40-45 min' }
  ];

  for (const dest of destinations) {
    const [record, created] = await Destination.findOrCreate({
      where: { name: dest.name, zone_id: dest.zone_id },
      defaults: {
        name: dest.name,
        zone_id: dest.zone_id,
        duration_text: dest.duration_text,
        is_active: true
      }
    });

    if (!created) {
      record.duration_text = dest.duration_text;
      record.is_active = true;
      await record.save();
    }
  }

  console.log('✅ Destinos listos');
}