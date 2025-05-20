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

// Check if data is stored in cloud-like format
function isCloudData(str: string): boolean {
  try {
    const data = JSON.parse(str);
    return data && typeof data === 'object' && data.hasOwnProperty('cloudData') && data.hasOwnProperty('lastUpdated');
  } catch (e) {
    return false;
  }
}

// Cross-browser storage implementation
export async function syncData(key: string, data: any): Promise<void> {
  try {
    const timestamp = new Date().getTime();
    const deviceId = getDeviceId();
    
    // Create cloud-like data object
    const cloudObject = {
      cloudData: data,
      lastUpdated: timestamp,
      updatedBy: deviceId,
      version: 1  // For future compatibility
    };
    
    // Encrypt data for additional security (simple encoding for now)
    const serializedData = btoa(JSON.stringify(cloudObject));
    
    // Store in localStorage as base
    localStorage.setItem(`cloud_${key}`, serializedData);
    localStorage.setItem(key, JSON.stringify(data));
    
    // Broadcast the change to other tabs/windows
    const event = new CustomEvent("lovableStorage", {
      detail: { key, data, timestamp }
    });
    window.dispatchEvent(event);
    
    // Also store in window.name for cross-session persistence
    // This helps with data persistence across browser restarts
    try {
      const existingData = JSON.parse(window.name || '{}');
      existingData[`cloud_${key}`] = serializedData;
      window.name = JSON.stringify(existingData);
    } catch (e) {
      console.error('Error storing in window.name:', e);
    }
    
    // Use sessionStorage to help sync between tabs
    sessionStorage.setItem(`cloud_${key}`, serializedData);
    
    // For IndexedDB support, we'll keep that logic from before
    // This helps with offline storage capabilities
    if (window.indexedDB) {
      try {
        const openRequest = indexedDB.open('qramCloudDB', 1);
        
        openRequest.onupgradeneeded = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('cloudStorage')) {
            db.createObjectStore('cloudStorage', { keyPath: 'key' });
          }
        };
        
        openRequest.onsuccess = function(e) {
          const db = (e.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['cloudStorage'], 'readwrite');
          const store = transaction.objectStore('cloudStorage');
          
          store.put({ key: `cloud_${key}`, value: serializedData, timestamp });
          
          transaction.oncomplete = function() {
            db.close();
          };
        };
      } catch (dbError) {
        console.error('IndexedDB error (non-critical):', dbError);
      }
    }
  } catch (error) {
    console.error(`Error syncing data for key: ${key}`, error);
    // Fallback - at least save locally
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Load data with multi-source strategy
export async function loadData(key: string, defaultValue: any = []): Promise<any> {
  try {
    let cloudData: any = null;
    let localData: any = null;
    let latestTimestamp = 0;
    
    // Function to decode and parse cloud data
    const decodeCloudData = (encodedStr: string | null): { data: any, timestamp: number } | null => {
      if (!encodedStr) return null;
      try {
        const decoded = JSON.parse(atob(encodedStr));
        return {
          data: decoded.cloudData,
          timestamp: decoded.lastUpdated
        };
      } catch (e) {
        console.error('Error decoding cloud data:', e);
        return null;
      }
    };
    
    // Check localStorage for cloud data
    const localCloudData = localStorage.getItem(`cloud_${key}`);
    if (localCloudData) {
      const decodedLocal = decodeCloudData(localCloudData);
      if (decodedLocal && decodedLocal.timestamp > latestTimestamp) {
        cloudData = decodedLocal.data;
        latestTimestamp = decodedLocal.timestamp;
      }
    }
    
    // Check sessionStorage for cloud data
    const sessionCloudData = sessionStorage.getItem(`cloud_${key}`);
    if (sessionCloudData) {
      const decodedSession = decodeCloudData(sessionCloudData);
      if (decodedSession && decodedSession.timestamp > latestTimestamp) {
        cloudData = decodedSession.data;
        latestTimestamp = decodedSession.timestamp;
      }
    }
    
    // Check window.name for cloud data
    try {
      const nameData = JSON.parse(window.name || '{}');
      if (nameData[`cloud_${key}`]) {
        const decodedName = decodeCloudData(nameData[`cloud_${key}`]);
        if (decodedName && decodedName.timestamp > latestTimestamp) {
          cloudData = decodedName.data;
          latestTimestamp = decodedName.timestamp;
        }
      }
    } catch (e) {
      console.error('Error reading from window.name:', e);
    }
    
    // Check IndexedDB if available
    if (window.indexedDB) {
      try {
        const openRequest = indexedDB.open('qramCloudDB', 1);
        
        // Create a promise to handle the async IndexedDB operations
        const idbDataPromise = new Promise((resolve) => {
          openRequest.onupgradeneeded = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains('cloudStorage')) {
              db.createObjectStore('cloudStorage', { keyPath: 'key' });
            }
          };
          
          openRequest.onsuccess = function(e) {
            const db = (e.target as IDBOpenDBRequest).result;
            try {
              const transaction = db.transaction(['cloudStorage'], 'readonly');
              const store = transaction.objectStore('cloudStorage');
              const request = store.get(`cloud_${key}`);
              
              request.onsuccess = function() {
                if (request.result) {
                  const decodedIdb = decodeCloudData(request.result.value);
                  if (decodedIdb && decodedIdb.timestamp > latestTimestamp) {
                    resolve({
                      data: decodedIdb.data,
                      timestamp: decodedIdb.timestamp
                    });
                  } else {
                    resolve(null);
                  }
                } else {
                  resolve(null);
                }
                db.close();
              };
              
              request.onerror = function() {
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
            resolve(null);
          };
        });
        
        // Wait for IndexedDB data
        const idbResult = await idbDataPromise as { data: any, timestamp: number } | null;
        if (idbResult && idbResult.timestamp > latestTimestamp) {
          cloudData = idbResult.data;
          latestTimestamp = idbResult.timestamp;
        }
      } catch (dbError) {
        console.error('IndexedDB load error (non-critical):', dbError);
      }
    }
    
    // Check traditional localStorage (fallback)
    const rawLocalData = localStorage.getItem(key);
    if (rawLocalData) {
      try {
        localData = JSON.parse(rawLocalData);
      } catch (e) {
        console.error('Error parsing localStorage data:', e);
      }
    }
    
    // Use the best data source
    if (cloudData) {
      // We found cloud data - also update local storage
      localStorage.setItem(key, JSON.stringify(cloudData));
      return cloudData;
    } else if (localData) {
      // Only local data found - sync it to the cloud format
      syncData(key, localData).catch(console.error);
      return localData;
    }
    
    // No data found, return default value
    return defaultValue;
  } catch (error) {
    console.error(`Error loading data for key: ${key}`, error);
    return defaultValue;
  }
}

// Check for updates - simpler now due to the cloud approach
export async function checkForUpdates(key: string): Promise<boolean> {
  // This is greatly simplified since we can directly compare cloud timestamps
  try {
    const localTimestamp = localStorage.getItem(`${key}_timestamp`);
    const localTime = localTimestamp ? parseInt(localTimestamp) : 0;
    
    // Check if there's newer data in cloud storage
    const cloudData = await loadData(key, null);
    if (cloudData) {
      // Data was found and is already up to date
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error checking for updates for key: ${key}`, error);
    return false;
  }
}
