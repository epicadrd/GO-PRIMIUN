import { Op } from 'sequelize';
import RouteRate from '../models/RouteRate.js';

const PUJ_ZONE_ID = 1;

export async function calculateRoutePrice({ pickupZoneId, dropoffZoneId, vehicleId, type }) {
  const originZoneId = Number(pickupZoneId);
  const destinationZoneId = Number(dropoffZoneId);
  const normalizedVehicleId = Number(vehicleId);

  if (!originZoneId || !destinationZoneId || !normalizedVehicleId) {
    return null;
  }

  const priceField = type === 'round_trip' ? 'round_trip_price' : 'one_way_price';

  // MISMA ZONA
  if (originZoneId === destinationZoneId) {
    // Primero intenta encontrar una tarifa explícita zona -> misma zona
    const sameZoneRate = await RouteRate.findOne({
      where: {
        origin_zone_id: originZoneId,
        destination_zone_id: destinationZoneId,
        vehicle_id: normalizedVehicleId
      }
    });

    if (sameZoneRate) {
      return {
        price: Number(sameZoneRate[priceField]),
        mode: 'same_zone',
        breakdown: [
          {
            from_zone_id: originZoneId,
            to_zone_id: destinationZoneId,
            price: Number(sameZoneRate[priceField])
          }
        ]
      };
    }

    // Si no existe, usa la tarifa base entre PUJ y esa zona
    const fallbackZoneRate = await RouteRate.findOne({
      where: {
        vehicle_id: normalizedVehicleId,
        [Op.or]: [
          {
            origin_zone_id: originZoneId,
            destination_zone_id: PUJ_ZONE_ID
          },
          {
            origin_zone_id: PUJ_ZONE_ID,
            destination_zone_id: originZoneId
          }
        ]
      }
    });

    if (!fallbackZoneRate) {
      return {
        error: true,
        message: 'No existe una tarifa configurada para esta zona'
      };
    }

    return {
      price: Number(fallbackZoneRate[priceField]),
      mode: 'same_zone_fallback',
      breakdown: [
        {
          from_zone_id: originZoneId,
          to_zone_id: destinationZoneId,
          price: Number(fallbackZoneRate[priceField])
        }
      ]
    };
  }

  const oneIsPUJ = originZoneId === PUJ_ZONE_ID || destinationZoneId === PUJ_ZONE_ID;

  // PUJ <-> ZONA
  if (oneIsPUJ) {
    const directRate = await RouteRate.findOne({
      where: {
        vehicle_id: normalizedVehicleId,
        [Op.or]: [
          {
            origin_zone_id: originZoneId,
            destination_zone_id: destinationZoneId
          },
          {
            origin_zone_id: destinationZoneId,
            destination_zone_id: originZoneId
          }
        ]
      }
    });

    if (!directRate) {
      return {
        error: true,
        message: 'No existe una tarifa configurada para esta ruta'
      };
    }

    return {
      price: Number(directRate[priceField]),
      mode: 'direct_puj',
      breakdown: [
        {
          from_zone_id: originZoneId,
          to_zone_id: destinationZoneId,
          price: Number(directRate[priceField])
        }
      ]
    };
  }

  // ZONA -> ZONA DIFERENTE
  const [originToPUJ, PUJToDestination] = await Promise.all([
    RouteRate.findOne({
      where: {
        vehicle_id: normalizedVehicleId,
        [Op.or]: [
          {
            origin_zone_id: originZoneId,
            destination_zone_id: PUJ_ZONE_ID
          },
          {
            origin_zone_id: PUJ_ZONE_ID,
            destination_zone_id: originZoneId
          }
        ]
      }
    }),
    RouteRate.findOne({
      where: {
        vehicle_id: normalizedVehicleId,
        [Op.or]: [
          {
            origin_zone_id: PUJ_ZONE_ID,
            destination_zone_id: destinationZoneId
          },
          {
            origin_zone_id: destinationZoneId,
            destination_zone_id: PUJ_ZONE_ID
          }
        ]
      }
    })
  ]);

  if (!originToPUJ || !PUJToDestination) {
    return {
      error: true,
      message: 'No existen tarifas configuradas para calcular esta ruta entre zonas'
    };
  }

  const firstLeg = Number(originToPUJ[priceField]);
  const secondLeg = Number(PUJToDestination[priceField]);

  return {
    price: firstLeg + secondLeg,
    mode: 'zone_plus_zone',
    breakdown: [
      {
        from_zone_id: originZoneId,
        to_zone_id: PUJ_ZONE_ID,
        price: firstLeg
      },
      {
        from_zone_id: PUJ_ZONE_ID,
        to_zone_id: destinationZoneId,
        price: secondLeg
      }
    ]
  };
}