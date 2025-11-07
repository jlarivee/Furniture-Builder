import { useState } from 'react';
import { Palette, RefreshCw } from 'lucide-react';
import { woodSpeciesDatabase } from '../data/woodSpecies';

interface MaterialSwapperProps {
  currentMaterials: string[];
  onSwap: (newMaterials: string[]) => void;
  onRegeneratePreview: () => void;
}

export default function MaterialSwapper({ currentMaterials, onSwap, onRegeneratePreview }: MaterialSwapperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(currentMaterials[0] || '');

  const handleSwap = () => {
    const newMaterials = [selectedMaterial, ...currentMaterials.slice(1)];
    onSwap(newMaterials);
    onRegeneratePreview();
    setIsOpen(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 w-full text-left"
      >
        <Palette size={20} className="text-gray-600" />
        <span className="font-medium text-gray-900">Change Materials</span>
      </button>

      {isOpen && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Wood Species
          </label>
          <select
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 mb-4"
          >
            <option value="">Select wood...</option>
            {woodSpeciesDatabase.map((wood) => (
              <option key={wood.name} value={wood.name}>
                {wood.name} ({wood.cost} cost)
              </option>
            ))}
          </select>

          {selectedMaterial && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              {(() => {
                const wood = woodSpeciesDatabase.find(w => w.name === selectedMaterial);
                return wood ? (
                  <div className="text-sm">
                    <p className="text-gray-700 mb-2">{wood.characteristics.join(', ')}</p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Workability:</span> {wood.workability}
                    </p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={!selectedMaterial}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={18} />
            <span>Apply & Regenerate Preview</span>
          </button>

          <p className="text-xs text-gray-500 mt-2">
            This will generate a new preview with the selected material
          </p>
        </div>
      )}
    </div>
  );
}
