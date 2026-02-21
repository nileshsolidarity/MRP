import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const STORE_PATH = join('/tmp', 'mrp-process-repo-store.json');

const DEFAULT_STORE = {
  documents: [],
  chunks: [],
  branches: [
    { id: 1, name: 'Head Office', code: 'HO001' },
  ],
  chatSessions: [],
  chatMessages: [],
  testQuestions: [],
  testAttempts: [],
  nextId: { documents: 1, chunks: 1, chatSessions: 1, chatMessages: 1, testQuestions: 1, testAttempts: 1 },
};

export function loadStore() {
  try {
    if (existsSync(STORE_PATH)) {
      const store = JSON.parse(readFileSync(STORE_PATH, 'utf-8'));
      // Always use latest branch list from defaults
      store.branches = DEFAULT_STORE.branches;
      // Ensure new collections exist for existing stores
      if (!store.testQuestions) store.testQuestions = [];
      if (!store.testAttempts) store.testAttempts = [];
      if (!store.nextId.testQuestions) store.nextId.testQuestions = 1;
      if (!store.nextId.testAttempts) store.nextId.testAttempts = 1;
      return store;
    }
  } catch {
    // corrupted file, reset
  }
  saveStore(DEFAULT_STORE);
  return { ...DEFAULT_STORE };
}

export function saveStore(store) {
  writeFileSync(STORE_PATH, JSON.stringify(store));
}

export function getNextId(store, collection) {
  const id = store.nextId[collection];
  store.nextId[collection] = id + 1;
  return id;
}
