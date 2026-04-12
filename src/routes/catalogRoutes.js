/**
 * Lógica de cálculo:
 * 
 * 1. PUJ + Zona = precio normal
 * 2. Zona + PUJ = mismo precio
 * 3. Zona + Zona diferente = suma de ambos tramos (pasando por PUJ)
 */

// 👉 Aquí defines los precios BASE desde/hacia PUJ
const basePricesFromPUJ = {
  "Cap Cana": 60,
  "Bávaro": 35,
  "Punta Cana Village": 25,
  "Uvero Alto": 80,
  "Cabeza de Toro": 30,
  "Arena Gorda": 40,
  "Macao": 70,
  "Verón": 20,
  // 👉 agrega aquí todos los destinos que me vas a pasar
};

// 👉 función principal
export function calculateRoutePrice(origin, destination) {
  // Si es el mismo punto
  if (origin === destination) {
    return 0;
  }

  // 🔹 Caso 1: PUJ → Zona
  if (origin === "PUJ" && basePricesFromPUJ[destination]) {
    return basePricesFromPUJ[destination];
  }

  // 🔹 Caso 2: Zona → PUJ
  if (destination === "PUJ" && basePricesFromPUJ[origin]) {
    return basePricesFromPUJ[origin];
  }

  // 🔹 Caso 3: Zona → Zona diferente
  if (basePricesFromPUJ[origin] && basePricesFromPUJ[destination]) {
    return basePricesFromPUJ[origin] + basePricesFromPUJ[destination];
  }

  // 🔸 Si no existe la ruta
  return null;
}