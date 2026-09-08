import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface RecyConnectDB extends DBSchema {
  sync_queue: {
    key: string;
    value: {
      id: string;
      url: string;
      method: string;
      body: any;
      timestamp: number;
    };
  };
  local_cache: {
    key: string;
    value: {
      key: string;
      data: any;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<RecyConnectDB>>;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB<RecyConnectDB>('recyconnect-offline-db', 1, {
      upgrade(db) {
        db.createObjectStore('sync_queue', { keyPath: 'id' });
        db.createObjectStore('local_cache', { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

export async function addToSyncQueue(url: string, method: string, body: any) {
  const db = await initDB();
  const id = Date.now().toString();
  await db.put('sync_queue', {
    id,
    url,
    method,
    body,
    timestamp: Date.now(),
  });
  
  // Try sync immediately if online
  if (navigator.onLine) {
    syncNow();
  }
}

export async function setCache(key: string, data: any) {
  const db = await initDB();
  await db.put('local_cache', {
    key,
    data,
    timestamp: Date.now(),
  });
}

export async function getCache(key: string) {
  const db = await initDB();
  const res = await db.get('local_cache', key);
  return res ? res.data : null;
}

export async function syncNow() {
  const db = await initDB();
  const queue = await db.getAll('sync_queue');
  
  for (const item of queue) {
    try {
      const res = await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });
      if (res.ok) {
        await db.delete('sync_queue', item.id);
      }
    } catch (e) {
      console.error('Sync failed for item', item.id, e);
    }
  }
}

// Hook into online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', syncNow);
}
