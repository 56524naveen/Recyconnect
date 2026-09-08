import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(process.cwd(), 'recyconnect-data.json');

// Core types based on requirement
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

export interface DBState {
  collectors: Collector[];
  recyclers: Recycler[];
  materials: MaterialPrice[];
  lots: Lot[];
  offers: Offer[];
  transactions: Transaction[];
}

export const defaultState: DBState = {
  collectors: [],
  recyclers: [],
  materials: [],
  lots: [],
  offers: [],
  transactions: [],
};

export class JSONDB {
  private state: DBState;

  constructor() {
    this.state = this.load();
  }

  private load(): DBState {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading DB:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  public save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.state, null, 2));
    } catch (e) {
      console.error('Error saving DB:', e);
    }
  }

  public getState() {
    return this.state;
  }
  
  public setState(newState: DBState) {
    this.state = newState;
    this.save();
  }

  public reset() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.save();
  }
}

export const db = new JSONDB();
