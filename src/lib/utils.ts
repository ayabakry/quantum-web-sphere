
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

export function syncData(key: string, data: any): void {
  try {
    // Save data to localStorage
    localStorage.setItem(key, JSON.stringify(data));
    
    // Broadcast the change to other tabs/windows
    const event = new CustomEvent("lovableStorage", {
      detail: { key, data }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error(`Error syncing data for key: ${key}`, error);
  }
}

export function loadData(key: string, defaultValue: any = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error loading data for key: ${key}`, error);
    return defaultValue;
  }
}

