export interface Collector {
  id: string;
  name: string;
  language: string;
  general_location: string;
  created_at: string;
}

export interface Recycler {
  id: string;
  name: string;
  facility_location: string;
  latitude: number;
  longitude: number;
  materials_accepted: string[];
  authorization_number: string;
  authorization_status: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'REJECTED';
  contact: string;
  pickup_available: boolean;
  service_area: number; // km
}

export interface MaterialPrice {
  id: string;
  material_category: string;
  buying_price_min: number;
  buying_price_max: number;
  unit: string;
}

export interface Lot {
  id: string;
  collector_id: string;
  material_category: string;
  weight: number;
  condition: string;
  image_reference: string;
  estimated_value_min: number;
  estimated_value_max: number;
  status: 'DRAFT' | 'CREATED' | 'OFFER_RECEIVED' | 'ACCEPTED' | 'HANDED_OVER' | 'RECYCLER_CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED';
  created_at: string;
  ai_confidence?: number;
  collection_location?: string;
}

export interface Offer {
  id: string;
  lot_id: string;
  recycler_id: string;
  quoted_price: number;
  pickup_available: boolean;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface Transaction {
  id: string;
  lot_id: string;
  collector_id: string;
  recycler_id: string;
  final_price: number;
  handover_reference?: string;
  payment_status: 'PENDING' | 'CASH PAID' | 'PAID';
  transaction_status: 'HANDED_OVER' | 'RECYCLER_CONFIRMED' | 'COMPLETED';
  created_at: string;
}

export const API_BASE = '/api';
