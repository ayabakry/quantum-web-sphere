
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const extractYoutubeId = (url: string): string | null => {
  try {
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
  
  return null;
};

export const getYoutubeThumbnail = (url: string): string => {
  const videoId = extractYoutubeId(url);
  
  if (videoId) {
    // Use the high quality thumbnail from YouTube
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  // Fallback to placeholder
  return 'https://placehold.co/600x400?text=Video+Thumbnail';
};
