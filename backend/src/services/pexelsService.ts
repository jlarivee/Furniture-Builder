import axios from 'axios';

const PEXELS_API_URL = 'https://api.pexels.com/v1';
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

/**
 * Search for furniture photos on Pexels
 */
export async function searchFurniturePhotos(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<PexelsSearchResponse> {
  try {
    const response = await axios.get(`${PEXELS_API_URL}/search`, {
      params: {
        query,
        page,
        per_page: perPage,
        orientation: 'landscape',
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Pexels API error:', error);
    throw new Error('Failed to search Pexels photos');
  }
}

/**
 * Get curated furniture photos
 */
export async function getCuratedPhotos(
  page: number = 1,
  perPage: number = 30
): Promise<PexelsSearchResponse> {
  try {
    const response = await axios.get(`${PEXELS_API_URL}/curated`, {
      params: {
        page,
        per_page: perPage,
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Pexels API error:', error);
    throw new Error('Failed to get curated photos');
  }
}

/**
 * Normalize Pexels response to match Unsplash format for easier frontend handling
 */
export function normalizePexelsPhoto(photo: PexelsPhoto) {
  return {
    id: photo.id.toString(),
    urls: {
      raw: photo.src.original,
      full: photo.src.large2x,
      regular: photo.src.large,
      small: photo.src.medium,
      thumb: photo.src.tiny,
    },
    alt_description: photo.alt,
    description: photo.alt,
    user: {
      name: photo.photographer,
      username: photo.photographer,
      links: {
        html: photo.photographer_url,
      },
    },
    links: {
      html: photo.url,
      download: photo.src.original,
    },
    width: photo.width,
    height: photo.height,
    source: 'pexels' as const,
  };
}
