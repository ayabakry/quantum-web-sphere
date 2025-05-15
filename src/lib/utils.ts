
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

// Store data both in localStorage and in the cloud database
export function syncData(key: string, data: any): void {
  try {
    // Save data to localStorage
    localStorage.setItem(key, JSON.stringify(data));
    
    // Also save to session storage for temporary cross-tab sharing
    sessionStorage.setItem(key, JSON.stringify(data));
    
    // Save to cloud storage - we'll use a simple approach with API
    saveToCloud(key, data);
    
    // Broadcast the change to other tabs/windows
    const event = new CustomEvent("lovableStorage", {
      detail: { key, data }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error(`Error syncing data for key: ${key}`, error);
  }
}

// Load data from localStorage or cloud
export async function loadData(key: string, defaultValue: any = []): Promise<any> {
  try {
    // First check localStorage for fresh data
    const localData = localStorage.getItem(key);
    if (localData) {
      return JSON.parse(localData);
    }
    
    // Then try to load from cloud
    const cloudData = await loadFromCloud(key);
    if (cloudData) {
      // Save to localStorage for faster access next time
      localStorage.setItem(key, JSON.stringify(cloudData));
      return cloudData;
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error loading data for key: ${key}`, error);
    return defaultValue;
  }
}

// Helper function to save data to cloud (using localStorage as backup for now)
async function saveToCloud(key: string, data: any): Promise<void> {
  // In a real app, this would be an API call to your backend
  // For now, we'll use localStorage with a different prefix as our "cloud"
  try {
    localStorage.setItem(`cloud_${key}`, JSON.stringify(data));
    
    // This is where you would typically make an API call:
    // await fetch('your-api-endpoint', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ key, data }),
    // });
    
  } catch (error) {
    console.error(`Error saving to cloud for key: ${key}`, error);
  }
}

// Helper function to load data from cloud (using localStorage as backup for now)
async function loadFromCloud(key: string): Promise<any | null> {
  // In a real app, this would be an API call to your backend
  // For now, we'll use localStorage with a different prefix as our "cloud"
  try {
    const cloudData = localStorage.getItem(`cloud_${key}`);
    return cloudData ? JSON.parse(cloudData) : null;
    
    // This is where you would typically make an API call:
    // const response = await fetch(`your-api-endpoint?key=${key}`);
    // if (response.ok) {
    //   return await response.json();
    // }
    // return null;
    
  } catch (error) {
    console.error(`Error loading from cloud for key: ${key}`, error);
    return null;
  }
}
