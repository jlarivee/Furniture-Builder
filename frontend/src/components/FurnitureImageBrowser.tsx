import { useState, useEffect } from 'react';
import { Search, Grid, List, Loader2, User } from 'lucide-react';
import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';

interface Photo {
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
  source?: 'unsplash' | 'pexels';
}

interface FurnitureImageBrowserProps {
  onSelectImage: (imageUrl: string, photo: Photo) => void;
  onClose: () => void;
}

const POPULAR_SEARCHES = [
  'modern sofa',
  'wooden table',
  'rustic chair',
  'bookshelf',
  'coffee table',
  'dining table',
  'bed frame',
  'cabinet',
  'desk',
  'bench',
  'sideboard',
  'dresser',
];

export default function FurnitureImageBrowser({ onSelectImage, onClose }: FurnitureImageBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
    loadCuratedPhotos();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/images/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadCuratedPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/images/curated`, {
        params: { page: 1, source: 'both' },
      });
      setPhotos(response.data.photos);
    } catch (error) {
      console.error('Failed to load curated photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadCuratedPhotos();
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await axios.get(`${API_URL}/api/images/search`, {
        params: {
          query,
          page: 1,
          per_page: 30,
          source: 'both',
        },
      });
      setPhotos(response.data.photos);
      setPage(1);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSelectPhoto = async (photo: Photo) => {
    // Track download for attribution
    try {
      await axios.post(`${API_URL}/api/images/track-download`, {
        downloadUrl: photo.links.download,
        source: photo.source,
      });
    } catch (error) {
      console.error('Failed to track download:', error);
    }

    onSelectImage(photo.urls.regular, photo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Browse Furniture Inspiration</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                placeholder="Search for furniture types, styles, or materials..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleSearch(searchQuery)}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Search
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCHES.map((query) => (
              <button
                key={query}
                onClick={() => handleQuickSearch(query)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid/List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && photos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {hasSearched ? (
                <>
                  <p className="text-lg mb-2">No results found</p>
                  <p className="text-sm">Try a different search term</p>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">Browse furniture inspiration</p>
                  <p className="text-sm">Search or select from popular categories above</p>
                </>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                  onClick={() => handleSelectPhoto(photo)}
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description || 'Furniture'}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                      <p className="text-sm font-medium truncate">
                        {photo.description || photo.alt_description || 'Untitled'}
                      </p>
                      <div className="flex items-center gap-1 text-xs mt-1">
                        <User className="w-3 h-3" />
                        <span>{photo.user.name}</span>
                      </div>
                    </div>
                  </div>
                  {photo.source && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                      {photo.source}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectPhoto(photo)}
                >
                  <img
                    src={photo.urls.small}
                    alt={photo.alt_description || 'Furniture'}
                    className="w-32 h-32 object-cover rounded"
                    loading="lazy"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {photo.description || photo.alt_description || 'Untitled'}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Photo by {photo.user.name}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{photo.width} × {photo.height}</span>
                      {photo.source && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {photo.source}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-600 text-center">
          Photos provided by{' '}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Unsplash
          </a>
          {' '}and{' '}
          <a href="https://pexels.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Pexels
          </a>
        </div>
      </div>
    </div>
  );
}
