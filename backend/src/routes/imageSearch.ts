import { Router, Request, Response } from 'express';
import * as unsplashService from '../services/unsplashService';
import * as pexelsService from '../services/pexelsService';

const router = Router();

/**
 * Search for furniture images from both Unsplash and Pexels
 * GET /api/images/search?query=modern+sofa&page=1&source=both
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { query, page = '1', per_page = '30', source = 'both' } = req.query;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const pageNum = parseInt(page as string, 10);
    const perPage = parseInt(per_page as string, 10);

    let results: any = {
      query,
      page: pageNum,
      total: 0,
      photos: [],
    };

    // Search both sources or specific source
    if (source === 'unsplash' || source === 'both') {
      try {
        const unsplashResults = await unsplashService.searchFurniturePhotos(
          query,
          pageNum,
          source === 'both' ? Math.floor(perPage / 2) : perPage
        );
        results.photos.push(
          ...unsplashResults.results.map((photo) => ({
            ...photo,
            source: 'unsplash',
          }))
        );
        results.total += unsplashResults.total;
      } catch (error) {
        console.error('Unsplash search failed:', error);
      }
    }

    if (source === 'pexels' || source === 'both') {
      try {
        const pexelsResults = await pexelsService.searchFurniturePhotos(
          query,
          pageNum,
          source === 'both' ? Math.floor(perPage / 2) : perPage
        );
        results.photos.push(
          ...pexelsResults.photos.map(pexelsService.normalizePexelsPhoto)
        );
        results.total += pexelsResults.total_results;
      } catch (error) {
        console.error('Pexels search failed:', error);
      }
    }

    // Shuffle results for variety
    results.photos.sort(() => Math.random() - 0.5);

    res.json(results);
  } catch (error) {
    console.error('Image search error:', error);
    res.status(500).json({ error: 'Failed to search images' });
  }
});

/**
 * Get popular furniture categories
 * GET /api/images/categories
 */
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await unsplashService.getFurnitureCategories();
    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

/**
 * Get curated furniture photos for inspiration
 * GET /api/images/curated?page=1
 */
router.get('/curated', async (req: Request, res: Response) => {
  try {
    const { page = '1', source = 'both' } = req.query;
    const pageNum = parseInt(page as string, 10);

    let results: any = {
      page: pageNum,
      photos: [],
    };

    if (source === 'unsplash' || source === 'both') {
      try {
        const unsplashResults = await unsplashService.getCuratedFurniturePhotos(
          'furniture interior design',
          pageNum
        );
        results.photos.push(
          ...unsplashResults.results.map((photo) => ({
            ...photo,
            source: 'unsplash',
          }))
        );
      } catch (error) {
        console.error('Unsplash curated failed:', error);
      }
    }

    if (source === 'pexels' || source === 'both') {
      try {
        const pexelsResults = await pexelsService.getCuratedPhotos(pageNum, 15);
        results.photos.push(
          ...pexelsResults.photos.map(pexelsService.normalizePexelsPhoto)
        );
      } catch (error) {
        console.error('Pexels curated failed:', error);
      }
    }

    // Shuffle for variety
    results.photos.sort(() => Math.random() - 0.5);

    res.json(results);
  } catch (error) {
    console.error('Get curated error:', error);
    res.status(500).json({ error: 'Failed to get curated photos' });
  }
});

/**
 * Track photo download for attribution
 * POST /api/images/track-download
 */
router.post('/track-download', async (req: Request, res: Response) => {
  try {
    const { downloadUrl, source } = req.body;

    if (!downloadUrl) {
      return res.status(400).json({ error: 'Download URL is required' });
    }

    if (source === 'unsplash') {
      await unsplashService.trackPhotoDownload(downloadUrl);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Track download error:', error);
    res.status(500).json({ error: 'Failed to track download' });
  }
});

export default router;
