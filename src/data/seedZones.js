import Zone from '../models/Zone.js';

export async function seedZones() {
  console.log('🌱 Verificando zonas...');

  const zones = [
    { id: 1, name: 'PUJ' },
    { id: 2, name: 'Cap Cana' },
    { id: 3, name: 'Bávaro' },
    { id: 4, name: 'Cabeza de Toro' },
    { id: 5, name: 'Uvero Alto' },
    { id: 6, name: 'Bayahibe' },
    { id: 7, name: 'La Romana' },
    { id: 8, name: 'Boca Chica' },
    { id: 9, name: 'Santo Domingo' },
    { id: 10, name: 'Miches' },
    { id: 11, name: 'Macao' }
  ];

  for (const zone of zones) {
    const [record, created] = await Zone.findOrCreate({
      where: { id: zone.id },
      defaults: zone
    });

    if (!created && record.name !== zone.name) {
      record.name = zone.name;
      await record.save();
    }
  }

  console.log('✅ Zonas listas');
}