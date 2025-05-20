
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function extractYoutubeId(url: string): string | null {
  try {
    // Try to parse as URL first
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.substring(1);
    } else if (urlObj.hostname.includes('youtube.com')) {
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v');
    }
  } catch (error) {
    // If URL parsing fails, try simple string extraction
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1].split('&')[0];
    }
  }
  
  // If it's already an ID (no protocol/domain)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
}

export function getYoutubeThumbnail(url: string): string {
  const videoId = extractYoutubeId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

// IndexedDB database setup
const DB_NAME = 'qramAppDatabase';
const DB_VERSION = 1;
let db: IDBDatabase | null = null;

// Initialize IndexedDB
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('Error opening IndexedDB');
      };

      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const database = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores for each data type
        if (!database.objectStoreNames.contains('adminVideos')) {
          database.createObjectStore('adminVideos', { keyPath: 'id' });
        }
        
        if (!database.objectStoreNames.contains('adminDocuments')) {
          database.createObjectStore('adminDocuments', { keyPath: 'id' });
        }
        
        if (!database.objectStoreNames.contains('adminPatents')) {
          database.createObjectStore('adminPatents', { keyPath: 'id' });
        }
        
        if (!database.objectStoreNames.contains('recentUpdates')) {
          database.createObjectStore('recentUpdates', { keyPath: 'id' });
        }
        
        if (!database.objectStoreNames.contains('syncTimestamps')) {
          database.createObjectStore('syncTimestamps', { keyPath: 'key' });
        }
      };
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
      reject(error);
    }
  });
}

// Store data in IndexedDB + localStorage for backup
export async function syncData(key: string, data: any): Promise<void> {
  try {
    // Always save to localStorage as backup
    localStorage.setItem(key, JSON.stringify(data));
    
    // Save to sessionStorage for cross-tab sharing
    sessionStorage.setItem(key, JSON.stringify(data));
    
    // Save timestamp for sync checking
    const timestamp = new Date().getTime();
    localStorage.setItem(`${key}_timestamp`, timestamp.toString());
    
    // Save to IndexedDB
    try {
      const database = await initDB();
      return new Promise((resolve, reject) => {
        const transaction = database.transaction([key, 'syncTimestamps'], 'readwrite');
        
        // Store the data
        const objectStore = transaction.objectStore(key);
        
        // Handle array data by clearing and adding all items
        if (Array.isArray(data)) {
          const clearRequest = objectStore.clear();
          clearRequest.onsuccess = () => {
            // Add each item
            let completed = 0;
            data.forEach((item) => {
              const request = objectStore.add(item);
              request.onsuccess = () => {
                completed++;
                if (completed === data.length) {
                  // Update timestamp
                  const timestampStore = transaction.objectStore('syncTimestamps');
                  timestampStore.put({ key, timestamp });
                  
                  // Broadcast the change to other tabs/windows
                  const event = new CustomEvent("lovableStorage", {
                    detail: { key, data, timestamp }
                  });
                  window.dispatchEvent(event);
                  
                  resolve();
                }
              };
              request.onerror = (e) => reject(e);
            });
          };
        } else {
          // For non-array data
          const request = objectStore.put(data);
          request.onsuccess = () => {
            // Update timestamp
            const timestampStore = transaction.objectStore('syncTimestamps');
            timestampStore.put({ key, timestamp });
            
            // Broadcast the change
            const event = new CustomEvent("lovableStorage", {
              detail: { key, data, timestamp }
            });
            window.dispatchEvent(event);
            
            resolve();
          };
          request.onerror = (e) => reject(e);
        }
      });
    } catch (dbError) {
      console.error('IndexedDB save error, using localStorage only:', dbError);
      // Already saved to localStorage above, so just return
      return;
    }
  } catch (error) {
    console.error(`Error syncing data for key: ${key}`, error);
    throw error;
  }
}

// Load data from IndexedDB with fallback to localStorage
export async function loadData(key: string, defaultValue: any = []): Promise<any> {
  try {
    try {
      // Try to load from IndexedDB first
      const database = await initDB();
      
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(key, 'readonly');
        const objectStore = transaction.objectStore(key);
        
        // For array data like videos, documents, etc.
        if (Array.isArray(defaultValue)) {
          const allRequest = objectStore.getAll();
          
          allRequest.onsuccess = () => {
            const results = allRequest.result;
            if (results && results.length > 0) {
              resolve(results);
            } else {
              // Fall back to localStorage
              const localData = localStorage.getItem(key);
              if (localData) {
                const parsedData = JSON.parse(localData);
                // Save it to IndexedDB for next time
                syncData(key, parsedData).catch(console.error);
                resolve(parsedData);
              } else {
                resolve(defaultValue);
              }
            }
          };
          
          allRequest.onerror = () => {
            // Fall back to localStorage on error
            const localData = localStorage.getItem(key);
            resolve(localData ? JSON.parse(localData) : defaultValue);
          };
        } else {
          // For single objects
          const getRequest = objectStore.get(key);
          
          getRequest.onsuccess = () => {
            const result = getRequest.result;
            if (result) {
              resolve(result);
            } else {
              // Fall back to localStorage
              const localData = localStorage.getItem(key);
              resolve(localData ? JSON.parse(localData) : defaultValue);
            }
          };
          
          getRequest.onerror = () => {
            // Fall back to localStorage on error
            const localData = localStorage.getItem(key);
            resolve(localData ? JSON.parse(localData) : defaultValue);
          };
        }
      });
    } catch (dbError) {
      console.error('IndexedDB load error, using localStorage:', dbError);
      // Fall back to localStorage
      const localData = localStorage.getItem(key);
      return localData ? JSON.parse(localData) : defaultValue;
    }
  } catch (error) {
    console.error(`Error loading data for key: ${key}`, error);
    return defaultValue;
  }
}

// Check if there are newer updates available from other devices/browsers
export async function checkForUpdates(key: string): Promise<boolean> {
  try {
    // Get local timestamp
    const localTimestamp = localStorage.getItem(`${key}_timestamp`);
    
    // Simulate checking a cloud service for newer data
    // In a real app, this would be an API call to your backend
    // For now, we'll check IndexedDB to see if there's newer data
    
    try {
      const database = await initDB();
      
      return new Promise((resolve) => {
        const transaction = database.transaction('syncTimestamps', 'readonly');
        const timestampStore = transaction.objectStore('syncTimestamps');
        const request = timestampStore.get(key);
        
        request.onsuccess = () => {
          const result = request.result;
          if (result && result.timestamp) {
            const dbTimestamp = result.timestamp;
            const local = localTimestamp ? parseInt(localTimestamp) : 0;
            
            // If db timestamp is newer, we need to update
            resolve(dbTimestamp > local);
          } else {
            resolve(false);
          }
        };
        
        request.onerror = () => {
          resolve(false);
        };
      });
    } catch (dbError) {
      console.error('Error checking IndexedDB for updates:', dbError);
      return false;
    }
  } catch (error) {
    console.error(`Error checking for updates for key: ${key}`, error);
    return false;
  }
}
