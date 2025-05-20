
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

// Get a unique device/browser identifier
function getDeviceId(): string {
  let deviceId = localStorage.getItem('qram_device_id');
  if (!deviceId) {
    // Generate a new unique ID for this device/browser
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('qram_device_id', deviceId);
  }
  return deviceId;
}

// Cross-browser storage implementation with improved reliability
export async function syncData(key: string, data: any): Promise<void> {
  try {
    // Directly store standard JSON in localStorage for basic compatibility
    localStorage.setItem(key, JSON.stringify(data));
    
    // Create a timestamp for versioning
    const timestamp = new Date().getTime();
    localStorage.setItem(`${key}_timestamp`, timestamp.toString());
    
    // Broadcast the change to other tabs/windows
    const event = new CustomEvent("lovableStorage", {
      detail: { key, data, timestamp }
    });
    window.dispatchEvent(event);
    
    // Store in sessionStorage for temporary cross-tab support
    sessionStorage.setItem(key, JSON.stringify(data));
    sessionStorage.setItem(`${key}_timestamp`, timestamp.toString());
    
    // Use IndexedDB for more persistent storage if available
    if (window.indexedDB) {
      try {
        const openRequest = indexedDB.open('qramDB', 1);
        
        openRequest.onupgradeneeded = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('dataStore')) {
            db.createObjectStore('dataStore', { keyPath: 'key' });
          }
        };
        
        openRequest.onsuccess = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['dataStore'], 'readwrite');
          const store = transaction.objectStore('dataStore');
          
          store.put({ key: key, value: data, timestamp });
          
          transaction.oncomplete = function() {
            db.close();
          };
        };
      } catch (dbError) {
        console.error('IndexedDB error (non-critical):', dbError);
      }
    }
    
    // Use a cookie for additional cross-browser support
    try {
      // Store a reference to the data in a cookie (not the data itself as cookies have size limits)
      document.cookie = `${key}_updated=${timestamp};path=/;max-age=31536000`; // 1 year expiry
    } catch (cookieError) {
      console.error('Cookie storage error (non-critical):', cookieError);
    }
  } catch (error) {
    console.error(`Error syncing data for key: ${key}`, error);
  }
}

// Load data with multi-source strategy and improved reliability
export async function loadData(key: string, defaultValue: any = []): Promise<any> {
  try {
    let latestData = defaultValue;
    let latestTimestamp = 0;
    
    // Helper function to parse and validate data
    const parseData = (dataStr: string | null): any => {
      if (!dataStr) return null;
      try {
        return JSON.parse(dataStr);
      } catch (e) {
        console.error('Error parsing data:', e);
        return null;
      }
    };
    
    // Check localStorage (primary source)
    const localData = parseData(localStorage.getItem(key));
    const localTimestamp = parseInt(localStorage.getItem(`${key}_timestamp`) || '0');
    
    if (localData && localTimestamp > latestTimestamp) {
      latestData = localData;
      latestTimestamp = localTimestamp;
    }
    
    // Check sessionStorage (for cross-tab support)
    const sessionData = parseData(sessionStorage.getItem(key));
    const sessionTimestamp = parseInt(sessionStorage.getItem(`${key}_timestamp`) || '0');
    
    if (sessionData && sessionTimestamp > latestTimestamp) {
      latestData = sessionData;
      latestTimestamp = sessionTimestamp;
    }
    
    // Check IndexedDB if available
    if (window.indexedDB) {
      try {
        // Create a promise to handle the async IndexedDB operations
        const idbDataPromise = new Promise<{data: any, timestamp: number} | null>((resolve) => {
          const openRequest = indexedDB.open('qramDB', 1);
          
          openRequest.onupgradeneeded = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('dataStore')) {
              db.createObjectStore('dataStore', { keyPath: 'key' });
            }
          };
          
          openRequest.onsuccess = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            try {
              // Check if the dataStore object store exists
              if (!db.objectStoreNames.contains('dataStore')) {
                resolve(null);
                db.close();
                return;
              }
              
              const transaction = db.transaction(['dataStore'], 'readonly');
              const store = transaction.objectStore('dataStore');
              const request = store.get(key);
              
              request.onsuccess = function() {
                if (request.result) {
                  resolve({
                    data: request.result.value,
                    timestamp: request.result.timestamp
                  });
                } else {
                  resolve(null);
                }
                db.close();
              };
              
              request.onerror = function() {
                console.error('IndexedDB read error:', request.error);
                resolve(null);
                db.close();
              };
            } catch (err) {
              console.error('Error in IndexedDB transaction:', err);
              resolve(null);
              db.close();
            }
          };
          
          openRequest.onerror = function() {
            console.error('IndexedDB open error:', openRequest.error);
            resolve(null);
          };
        });
        
        // Wait for IndexedDB data
        const idbResult = await idbDataPromise;
        if (idbResult && idbResult.timestamp > latestTimestamp) {
          latestData = idbResult.data;
          latestTimestamp = idbResult.timestamp;
        }
      } catch (dbError) {
        console.error('IndexedDB load error (non-critical):', dbError);
      }
    }
    
    // If we found data from any source, update all storage mechanisms to ensure consistency
    if (latestTimestamp > 0 && latestData !== defaultValue) {
      // Update localStorage and sessionStorage silently (no events)
      localStorage.setItem(key, JSON.stringify(latestData));
      localStorage.setItem(`${key}_timestamp`, latestTimestamp.toString());
      sessionStorage.setItem(key, JSON.stringify(latestData));
      sessionStorage.setItem(`${key}_timestamp`, latestTimestamp.toString());
    }
    
    return latestData;
  } catch (error) {
    console.error(`Error loading data for key: ${key}`, error);
    return defaultValue;
  }
}

// Simple function to check if there are updates available
export function checkForUpdates(key: string): Promise<boolean> {
  return Promise.resolve(true); // Simplified since we now handle this in the main context
}
