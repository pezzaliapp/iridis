const DB_NAME = 'iridis-visione';
const DB_VERSION = 1;
const SCHEMA_VERSION = 1;

export const APP_VERSION = '0.2.0';

const LEGACY_KEYS = {
  calibration: 'iridis-visione/calibration',
  frequency: 'iridis-visione/frequency'
};

let dbPromise = null;
let initPromise = null;

function openDb() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta');
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function txMeta(mode, fn) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('meta', mode);
    const req = fn(tx.objectStore('meta'));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

function txSessions(mode, fn) {
  return openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', mode);
    const req = fn(tx.objectStore('sessions'));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

const handle = {
  getSchemaVersion: () => txMeta('readonly', s => s.get('schemaVersion')),

  getCalibration: () => txMeta('readonly', s => s.get('calibration')),
  setCalibration: (value) => txMeta('readwrite', s => s.put(value, 'calibration')),

  getFrequency: () => txMeta('readonly', s => s.get('frequency')),
  setFrequency: (value) => txMeta('readwrite', s => s.put(value, 'frequency')),

  addSession: (record) => txSessions('readwrite', s => s.add(record)),
  getSession: (id) => txSessions('readonly', s => s.get(id)),
  getSessions: () => openDb().then(db => new Promise((resolve, reject) => {
    const tx = db.transaction('sessions', 'readonly');
    const objStore = tx.objectStore('sessions');
    const results = [];
    const req = objStore.openCursor();
    req.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        results.push({ id: cursor.primaryKey, ...cursor.value });
        cursor.continue();
      } else {
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  })),

  clearAll: async () => {
    await Promise.all([
      txMeta('readwrite', s => s.clear()),
      txSessions('readwrite', s => s.clear())
    ]);
    await txMeta('readwrite', s => s.put(SCHEMA_VERSION, 'schemaVersion'));
  }
};

async function migrate() {
  if (await handle.getSchemaVersion() === undefined) {
    await txMeta('readwrite', s => s.put(SCHEMA_VERSION, 'schemaVersion'));
  }

  if (await handle.getCalibration() === undefined) {
    const raw = localStorage.getItem(LEGACY_KEYS.calibration);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.pixelsPerMm === 'number') {
          await handle.setCalibration(parsed);
          localStorage.removeItem(LEGACY_KEYS.calibration);
        }
      } catch (_) {
        // entry localStorage corrotta: la lasciamo per debug, non la migriamo
      }
    }
  }

  if (await handle.getFrequency() === undefined) {
    const raw = localStorage.getItem(LEGACY_KEYS.frequency);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && ['daily', 'weekly', 'custom'].includes(parsed.mode)) {
          await handle.setFrequency(parsed);
          localStorage.removeItem(LEGACY_KEYS.frequency);
        }
      } catch (_) {
        // come sopra
      }
    }
  }
}

async function init() {
  await openDb();
  await migrate();
}

async function open() {
  if (!initPromise) initPromise = init();
  await initPromise;
  return handle;
}

export const store = { open };
