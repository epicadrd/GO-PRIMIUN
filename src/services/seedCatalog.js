import Hotel from '../models/Hotel.js';
import Rate from '../models/Rate.js';
import { destinationsCatalog, vehiclesCatalog } from '../data/transferCatalog.js';

export async function seedTransferCatalog() {
  for (const destination of destinationsCatalog) {
    for (const hotelName of destination.hotels) {
      await Hotel.findOrCreate({
        where: {
          zone_id: destination.zone_id,
          name: hotelName
        },
        defaults: {
          zone_id: destination.zone_id,
          name: hotelName,
          is_active: true
        }
      });
    }

    for (const vehicle of vehiclesCatalog) {
      const rates = destination.rates[vehicle.id];
      if (!rates) continue;

      await Rate.findOrCreate({
        where: {
          zone_id: destination.zone_id,
          vehicle_id: vehicle.id
        },
        defaults: {
          zone_id: destination.zone_id,
          vehicle_id: vehicle.id,
          one_way_price: rates.one_way,
          round_trip_price: rates.round_trip
        }
      });
    }
  }
}
