// Local storage utility functions for data persistence

// Storage keys
const STORAGE_KEYS = {
  QUOTES: 'shiva_quotes',
  CONTACTS: 'shiva_contacts',
  SETTINGS: 'shiva_settings',
  LAST_SAVED: 'shiva_last_saved'
};

// Generic save function
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error);
  }
};

// Generic load function
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData) as T;
  } catch (error) {
    console.error(`Error loading data from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Specific functions for quotes
export const saveQuotes = (quotes: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.QUOTES, quotes);
};

export const loadQuotes = (): any[] => {
  return loadFromLocalStorage(STORAGE_KEYS.QUOTES, []);
};

// Specific functions for contacts
export const saveContacts = (contacts: any[]): void => {
  saveToLocalStorage(STORAGE_KEYS.CONTACTS, contacts);
};

export const loadContacts = (): any[] => {
  return loadFromLocalStorage(STORAGE_KEYS.CONTACTS, []);
};

// Get last saved timestamp
export const getLastSavedTime = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_SAVED);
};

// Clear all stored data (for logout)
export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};