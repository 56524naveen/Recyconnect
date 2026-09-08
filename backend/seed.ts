import { db } from './db/index.js';

export function seedDatabase() {
  const state = db.getState();
  
  if (state.materials.length > 0) return; // Already seeded

  state.materials = [
    { id: 'm1', material_category: 'PCB', buying_price_min: 150, buying_price_max: 190, unit: 'kg' },
    { id: 'm2', material_category: 'Cable', buying_price_min: 80, buying_price_max: 120, unit: 'kg' },
    { id: 'm3', material_category: 'Battery', buying_price_min: 70, buying_price_max: 110, unit: 'kg' },
    { id: 'm4', material_category: 'Motor', buying_price_min: 90, buying_price_max: 140, unit: 'kg' },
    { id: 'm5', material_category: 'Mixed Plastics', buying_price_min: 15, buying_price_max: 25, unit: 'kg' },
  ];

  state.recyclers = [
    {
      id: 'r1',
      name: 'ABC Recycling',
      facility_location: 'Andheri East, Mumbai',
      latitude: 19.1136,
      longitude: 72.8697,
      materials_accepted: ['PCB', 'Cable', 'Battery'],
      authorization_number: 'CPCB-EW-2023-01',
      authorization_status: 'VERIFIED',
      contact: '+91-9876543210',
      pickup_available: true,
      service_area: 15
    },
    {
      id: 'r2',
      name: 'GreenEarth E-Waste',
      facility_location: 'Sion, Mumbai',
      latitude: 19.0390,
      longitude: 72.8619,
      materials_accepted: ['PCB', 'Motor', 'Mixed Plastics'],
      authorization_number: 'CPCB-EW-2022-88',
      authorization_status: 'VERIFIED',
      contact: '+91-9988776655',
      pickup_available: false,
      service_area: 10
    },
    {
      id: 'r3',
      name: 'ScrapPro',
      facility_location: 'Kurla, Mumbai',
      latitude: 19.0726,
      longitude: 72.8744,
      materials_accepted: ['Cable', 'Battery'],
      authorization_number: 'PENDING',
      authorization_status: 'PENDING',
      contact: '+91-9123456780',
      pickup_available: true,
      service_area: 5
    }
  ];

  state.collectors = [
    {
      id: 'c1',
      name: 'Raju Bhai',
      language: 'hi',
      general_location: 'Dharavi, Mumbai',
      created_at: new Date().toISOString()
    }
  ];

  // Dummy transactions for analytics
  const pastDate1 = new Date();
  pastDate1.setDate(pastDate1.getDate() - 2);
  
  const pastDate2 = new Date();
  pastDate2.setDate(pastDate2.getDate() - 5);

  state.transactions = [
    {
      id: 't1',
      lot_id: 'l1',
      collector_id: 'c1',
      recycler_id: 'r1',
      final_price: 2700,
      payment_status: 'PAID',
      transaction_status: 'COMPLETED',
      created_at: pastDate1.toISOString()
    },
    {
      id: 't2',
      lot_id: 'l2',
      collector_id: 'c1',
      recycler_id: 'r2',
      final_price: 1800,
      payment_status: 'PAID',
      transaction_status: 'COMPLETED',
      created_at: pastDate2.toISOString()
    }
  ];

  db.save();
}

export function resetDatabase() {
  db.reset();
  seedDatabase();
}
