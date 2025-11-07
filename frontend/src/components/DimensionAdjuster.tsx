import { useState } from 'react';
import { Ruler } from 'lucide-react';

interface DimensionAdjusterProps {
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  onUpdate: (newDimensions: any) => void;
  onApply: () => void;
}

export default function DimensionAdjuster({ dimensions, onUpdate, onApply }: DimensionAdjusterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: 'length' | 'width' | 'height', value: number) => {
    onUpdate({
      ...dimensions,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 w-full text-left"
      >
        <Ruler size={20} className="text-gray-600" />
        <span className="font-medium text-gray-900">Adjust Dimensions</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Length */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Length</span>
              <span className="text-blue-600">{dimensions.length}"</span>
            </label>
            <input
              type="range"
              min="12"
              max="96"
              step="1"
              value={dimensions.length}
              onChange={(e) => handleChange('length', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Width */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Width</span>
              <span className="text-blue-600">{dimensions.width}"</span>
            </label>
            <input
              type="range"
              min="12"
              max="60"
              step="1"
              value={dimensions.width}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Height */}
          <div>
            <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Height</span>
              <span className="text-blue-600">{dimensions.height}"</span>
            </label>
            <input
              type="range"
              min="6"
              max="84"
              step="1"
              value={dimensions.height}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <button
            onClick={() => {
              onApply();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Changes
          </button>
        </div>
      )}
    </div>
  );
}
