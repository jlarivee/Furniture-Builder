import { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../api';
import { FurnitureSpecs } from '../types';

interface InputInterfaceProps {
  onDesignGenerated: (
    sessionId: string,
    specs: FurnitureSpecs,
    previewImage: string,
    initialMessage: string
  ) => void;
}

export default function InputInterface({ onDesignGenerated }: InputInterfaceProps) {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setError('Please provide a description of the furniture you want to build.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await api.generateDesign(description, imageFile || undefined);
      onDesignGenerated(
        result.sessionId,
        result.specs,
        result.previewImage,
        description
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate design. Please try again.');
      console.error('Error generating design:', err);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "A modern coffee table, 48 inches long, 24 inches wide, made from walnut with hairpin legs",
    "Rustic dining table for 6 people, farmhouse style, using reclaimed wood",
    "Mid-century modern bookshelf, 6 feet tall, 3 shelves, made from oak",
    "Simple nightstand with one drawer, Scandinavian style, white oak finish"
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Describe Your Furniture
        </h2>
        <p className="text-gray-600 mb-8">
          Tell us what you want to build, or upload a reference image. Be as specific as possible
          about dimensions, materials, and style.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Furniture Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={6}
              placeholder="Example: I want a modern coffee table, 48 inches long, 24 inches wide, made from walnut with hairpin legs..."
              disabled={loading}
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Image (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={20} />
                <span>Upload Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              {imageFile && (
                <span className="text-sm text-gray-600">{imageFile.name}</span>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Reference"
                  className="max-w-xs rounded-lg border border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !description.trim()}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Generating Design...</span>
              </>
            ) : (
              <>
                <ImageIcon size={20} />
                <span>Generate Design</span>
              </>
            )}
          </button>
        </form>

        {/* Examples */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Example descriptions:</h3>
          <div className="space-y-2">
            {examples.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setDescription(example)}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
