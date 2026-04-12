import RouteRate from '../models/RouteRate.js';
import Zone from '../models/Zone.js';
import Vehicle from '../models/Vehicle.js';

export const seedRouteRates = async () => {
  console.log('🌱 Insertando tarifas por ruta...');

  const zones = await Zone.findAll();
  const vehicles = await Vehicle.findAll();

  const normalize = (text = '') =>
    text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const getZone = (name) =>
    zones.find(z => normalize(z.name) === normalize(name));

  const getVehicle = (name) =>
    vehicles.find(v => normalize(v.name).includes(normalize(name)));

  const PUJ = getZone('PUJ');
  const CAP_CANA = getZone('Cap Cana');
  const BAVARO = getZone('Bávaro');
  const CABEZA_TORO = getZone('Cabeza de Toro');
  const UVERO_ALTO = getZone('Uvero Alto');
  const BAYAHIBE = getZone('Bayahibe');
  const LA_ROMANA = getZone('La Romana');
  const BOCA_CHICA = getZone('Boca Chica');
  const SANTO_DOMINGO = getZone('Santo Domingo');
  const MICHES = getZone('Miches');
  const MACAO = getZone('Macao');

  const SUBURBAN_2019 = getVehicle('Suburban SUV') || getVehicle('2019');
  const SUBURBAN_2023 = getVehicle('Suburban 2023') || getVehicle('2023');
  const CADILLAC_2020 = getVehicle('Cadillac') || getVehicle('2020');
  const CADILLAC_2024 = getVehicle('Cadillac 2024') || getVehicle('2024') || getVehicle('Cadillac 2023');

  const rates = [
    { from: PUJ, to: CAP_CANA, vehicle: SUBURBAN_2019, one_way: 60, round_trip: 120 },
    { from: PUJ, to: CAP_CANA, vehicle: SUBURBAN_2023, one_way: 85, round_trip: 170 },
    { from: PUJ, to: CAP_CANA, vehicle: CADILLAC_2020, one_way: 80, round_trip: 160 },
    { from: PUJ, to: CAP_CANA, vehicle: CADILLAC_2024, one_way: 120, round_trip: 240 },

    { from: PUJ, to: BAVARO, vehicle: SUBURBAN_2019, one_way: 60, round_trip: 120 },
    { from: PUJ, to: BAVARO, vehicle: SUBURBAN_2023, one_way: 85, round_trip: 170 },
    { from: PUJ, to: BAVARO, vehicle: CADILLAC_2020, one_way: 80, round_trip: 160 },
    { from: PUJ, to: BAVARO, vehicle: CADILLAC_2024, one_way: 120, round_trip: 240 },

    { from: PUJ, to: CABEZA_TORO, vehicle: SUBURBAN_2019, one_way: 60, round_trip: 120 },
    { from: PUJ, to: CABEZA_TORO, vehicle: SUBURBAN_2023, one_way: 85, round_trip: 170 },
    { from: PUJ, to: CABEZA_TORO, vehicle: CADILLAC_2020, one_way: 80, round_trip: 160 },
    { from: PUJ, to: CABEZA_TORO, vehicle: CADILLAC_2024, one_way: 120, round_trip: 240 },

    { from: PUJ, to: UVERO_ALTO, vehicle: SUBURBAN_2019, one_way: 80, round_trip: 160 },
    { from: PUJ, to: UVERO_ALTO, vehicle: SUBURBAN_2023, one_way: 110, round_trip: 210 },
    { from: PUJ, to: UVERO_ALTO, vehicle: CADILLAC_2020, one_way: 100, round_trip: 190 },
    { from: PUJ, to: UVERO_ALTO, vehicle: CADILLAC_2024, one_way: 150, round_trip: 300 },

    { from: PUJ, to: MACAO, vehicle: SUBURBAN_2019, one_way: 80, round_trip: 160 },
    { from: PUJ, to: MACAO, vehicle: SUBURBAN_2023, one_way: 110, round_trip: 210 },
    { from: PUJ, to: MACAO, vehicle: CADILLAC_2020, one_way: 100, round_trip: 190 },
    { from: PUJ, to: MACAO, vehicle: CADILLAC_2024, one_way: 150, round_trip: 300 },

    { from: PUJ, to: BAYAHIBE, vehicle: SUBURBAN_2019, one_way: 140, round_trip: 280 },
    { from: PUJ, to: BAYAHIBE, vehicle: SUBURBAN_2023, one_way: 160, round_trip: 320 },
    { from: PUJ, to: BAYAHIBE, vehicle: CADILLAC_2020, one_way: 160, round_trip: 320 },
    { from: PUJ, to: BAYAHIBE, vehicle: CADILLAC_2024, one_way: 190, round_trip: 380 },

    { from: PUJ, to: LA_ROMANA, vehicle: SUBURBAN_2019, one_way: 180, round_trip: 360 },
    { from: PUJ, to: LA_ROMANA, vehicle: SUBURBAN_2023, one_way: 210, round_trip: 420 },
    { from: PUJ, to: LA_ROMANA, vehicle: CADILLAC_2020, one_way: 210, round_trip: 420 },
    { from: PUJ, to: LA_ROMANA, vehicle: CADILLAC_2024, one_way: 250, round_trip: 500 },

    { from: PUJ, to: BOCA_CHICA, vehicle: SUBURBAN_2019, one_way: 280, round_trip: 560 },
    { from: PUJ, to: BOCA_CHICA, vehicle: SUBURBAN_2023, one_way: 300, round_trip: 600 },
    { from: PUJ, to: BOCA_CHICA, vehicle: CADILLAC_2020, one_way: 300, round_trip: 600 },
    { from: PUJ, to: BOCA_CHICA, vehicle: CADILLAC_2024, one_way: 350, round_trip: 700 },

    { from: PUJ, to: SANTO_DOMINGO, vehicle: SUBURBAN_2019, one_way: 320, round_trip: 640 },
    { from: PUJ, to: SANTO_DOMINGO, vehicle: SUBURBAN_2023, one_way: 370, round_trip: 740 },
    { from: PUJ, to: SANTO_DOMINGO, vehicle: CADILLAC_2020, one_way: 370, round_trip: 740 },
    { from: PUJ, to: SANTO_DOMINGO, vehicle: CADILLAC_2024, one_way: 400, round_trip: 800 },

    { from: PUJ, to: MICHES, vehicle: SUBURBAN_2019, one_way: 190, round_trip: 380 },
    { from: PUJ, to: MICHES, vehicle: SUBURBAN_2023, one_way: 210, round_trip: 420 },
    { from: PUJ, to: MICHES, vehicle: CADILLAC_2020, one_way: 210, round_trip: 420 },
    { from: PUJ, to: MICHES, vehicle: CADILLAC_2024, one_way: 245, round_trip: 490 }
  ];

  for (const rate of rates) {
    if (!rate.from || !rate.to || !rate.vehicle) {
      console.warn('⚠️ Tarifa omitida por datos incompletos:', {
        from: rate.from?.name || null,
        to: rate.to?.name || null,
        vehicle: rate.vehicle?.name || null
      });
      continue;
    }

    const [record, created] = await RouteRate.findOrCreate({
      where: {
        origin_zone_id: rate.from.id,
        destination_zone_id: rate.to.id,
        vehicle_id: rate.vehicle.id
      },
      defaults: {
        one_way_price: rate.one_way,
        round_trip_price: rate.round_trip
      }
    });

    if (!created) {
      record.one_way_price = rate.one_way;
      record.round_trip_price = rate.round_trip;
      await record.save();
    }

    const [reverseRecord, reverseCreated] = await RouteRate.findOrCreate({
      where: {
        origin_zone_id: rate.to.id,
        destination_zone_id: rate.from.id,
        vehicle_id: rate.vehicle.id
      },
      defaults: {
        one_way_price: rate.one_way,
        round_trip_price: rate.round_trip
      }
    });

    if (!reverseCreated) {
      reverseRecord.one_way_price = rate.one_way;
      reverseRecord.round_trip_price = rate.round_trip;
      await reverseRecord.save();
    }
  }

  console.log('✅ Tarifas por ruta listas');
};