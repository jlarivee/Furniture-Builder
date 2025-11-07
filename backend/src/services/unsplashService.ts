import axios from 'axios';

const UNSPLASH_API_URL = 'https://api.unsplash.com';
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download: string;
  };
  width: number;
  height: number;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

/**
 * Search for furniture photos on Unsplash
 */
export async function searchFurniturePhotos(
  query: string,
  page: number = 1,
  perPage: number = 30
): Promise<UnsplashSearchResponse> {
  try {
    const response = await axios.get(`${UNSPLASH_API_URL}/search/photos`, {
      params: {
        query,
        page,
        per_page: perPage,
        orientation: 'landscape', // Better for furniture photos
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Unsplash API error:', error);
    throw new Error('Failed to search Unsplash photos');
  }
}

/**
 * Get popular furniture categories
 */
export async function getFurnitureCategories(): Promise<string[]> {
  return [
    'modern furniture',
    'rustic furniture',
    'industrial furniture',
    'minimalist furniture',
    'vintage furniture',
    'scandinavian furniture',
    'farmhouse furniture',
    'mid-century modern furniture',
    'contemporary furniture',
    'traditional furniture',
  ];
}

/**
 * Get curated furniture collections
 */
export async function getCuratedFurniturePhotos(
  category: string = 'furniture',
  page: number = 1
): Promise<UnsplashSearchResponse> {
  return searchFurniturePhotos(category, page, 20);
}

/**
 * Track download for Unsplash attribution requirements
 */
export async function trackPhotoDownload(downloadUrl: string): Promise<void> {
  try {
    await axios.get(downloadUrl);
  } catch (error) {
    console.error('Failed to track download:', error);
  }
}
