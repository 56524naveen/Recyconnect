import { collection, doc, getDocs, getDoc, setDoc, updateDoc, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { MaterialPrice, Recycler, Lot, Offer, Transaction } from '../types';

export const materialsRef = collection(db, 'materials');
export const recyclersRef = collection(db, 'recyclers');
export const lotsRef = collection(db, 'lots');
export const offersRef = collection(db, 'offers');
export const transactionsRef = collection(db, 'transactions');
export const usersRef = collection(db, 'users');

// ---- USERS ----
export async function getUserProfile(uid: string) {
  const docRef = doc(usersRef, uid);
  const snap = await getDoc(docRef);
  return snap.exists() ? snap.data() : null;
}

export async function createUserProfile(uid: string, data: any) {
  await setDoc(doc(usersRef, uid), { ...data, created_at: new Date().toISOString() });
}

// ---- MATERIALS ----
export async function getMaterials(): Promise<MaterialPrice[]> {
  const snapshot = await getDocs(materialsRef);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as MaterialPrice));
}

// ---- RECYCLERS ----
export async function getRecyclers(): Promise<Recycler[]> {
  const snapshot = await getDocs(recyclersRef);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recycler));
}

export async function getMatchingRecyclers(materialCategory: string): Promise<Recycler[]> {
  const q = query(recyclersRef, where('materials_accepted', 'array-contains', materialCategory));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Recycler));
}

// ---- LOTS ----
export async function createLot(data: Omit<Lot, 'id' | 'created_at'>): Promise<Lot> {
  const docRef = doc(lotsRef);
  const lot: Lot = {
    ...data,
    id: docRef.id,
    created_at: new Date().toISOString()
  };
  await setDoc(docRef, lot);
  return lot;
}

export async function getLot(id: string): Promise<Lot | null> {
  const docRef = doc(db, 'lots', id);
  const snap = await getDoc(docRef);
  return snap.exists() ? (snap.data() as Lot) : null;
}

export async function getLotsByCollector(collectorId: string): Promise<Lot[]> {
  const q = query(lotsRef, where('collector_id', '==', collectorId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lot));
}

export async function getAllLots(): Promise<Lot[]> {
  const snapshot = await getDocs(lotsRef);
  // Manual sort if index is missing
  const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lot));
  return results.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function updateLot(id: string, data: Partial<Lot>) {
  const docRef = doc(db, 'lots', id);
  await updateDoc(docRef, data);
}

// ---- OFFERS ----
export async function createOffer(data: Omit<Offer, 'id' | 'created_at'>): Promise<Offer> {
  const docRef = doc(offersRef);
  const offer: Offer = {
    ...data,
    id: docRef.id,
    created_at: new Date().toISOString()
  };
  await setDoc(docRef, offer);
  
  // Also update lot status
  await updateLot(offer.lot_id, { status: 'OFFER_RECEIVED' });
  
  return offer;
}

// ---- TRANSACTIONS ----
export async function createTransaction(data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
  const docRef = doc(transactionsRef);
  const tx: Transaction = {
    ...data,
    id: docRef.id,
    created_at: new Date().toISOString()
  };
  await setDoc(docRef, tx);
  return tx;
}

export async function getTransactionsByCollector(collectorId: string): Promise<Transaction[]> {
  const q = query(transactionsRef, where('collector_id', '==', collectorId), orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
}

export async function getAllTransactions(): Promise<Transaction[]> {
  const snapshot = await getDocs(transactionsRef);
  const results = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Transaction));
  return results.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

// ---- SEEDING ----
export async function seedFirestore() {
  const materialsSnap = await getDocs(materialsRef);
  if (materialsSnap.size > 0) return; // Already seeded

  const materials = [
    { id: 'm1', material_category: 'PCB', buying_price_min: 150, buying_price_max: 190, unit: 'kg' },
    { id: 'm2', material_category: 'Cable', buying_price_min: 80, buying_price_max: 120, unit: 'kg' },
    { id: 'm3', material_category: 'Battery', buying_price_min: 70, buying_price_max: 110, unit: 'kg' },
    { id: 'm4', material_category: 'Motor', buying_price_min: 90, buying_price_max: 140, unit: 'kg' },
    { id: 'm5', material_category: 'Mixed Plastics', buying_price_min: 15, buying_price_max: 25, unit: 'kg' },
  ];

  for (const m of materials) {
    await setDoc(doc(db, 'materials', m.id), m);
  }

  const recyclers = [
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

  for (const r of recyclers) {
    await setDoc(doc(db, 'recyclers', r.id), r);
  }
}
