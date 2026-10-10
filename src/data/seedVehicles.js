import Vehicle from '../models/Vehicle.js';

export async function seedVehicles() {
  console.log('🌱 Insertando vehículos...');

  const vehicles = [
    {
      name: 'Suburban 2019',
      max_passengers: 6,
      image: '/img/suburban2019.png'
    },
    {
      name: 'Suburban 2023',
      max_passengers: 6,
      image: '/img/suburban2023.png'
    },
    {
      name: 'Cadillac 2020',
      max_passengers: 5,
      image: '/img/cadillac.png'
    },
    {
      name: 'Cadillac 2023',
      max_passengers: 5,
      image: '/img/SUV.png'
    }
  ];

  for (const v of vehicles) {
    const [record, created] = await Vehicle.findOrCreate({
      where: { name: v.name },
      defaults: v
    });

    if (!created) {
      record.max_passengers = v.max_passengers;
      record.image = v.image;
      await record.save();
    }
  }

  console.log('✅ Vehículos listos');
}