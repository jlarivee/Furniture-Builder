import { useState } from 'react';
import { Book, Search, DollarSign, Leaf } from 'lucide-react';
import { woodSpeciesDatabase } from '../data/woodSpecies';
import { WoodSpecies } from '../types';

export default function WoodSpeciesGuide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWood, setSelectedWood] = useState<WoodSpecies | null>(null);
  const [filterCost, setFilterCost] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredWoods = woodSpeciesDatabase.filter(wood => {
    const matchesSearch = wood.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCost = filterCost === 'all' || wood.cost === filterCost;
    return matchesSearch && matchesCost;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Book className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Wood Species Guide</h2>
      </div>

      {/* Search and filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search wood species..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCost}
          onChange={(e) => setFilterCost(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Costs</option>
          <option value="low">Low Cost</option>
          <option value="medium">Medium Cost</option>
          <option value="high">High Cost</option>
        </select>
      </div>

      {/* Wood list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {filteredWoods.map((wood) => (
          <button
            key={wood.name}
            onClick={() => setSelectedWood(wood)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedWood?.name === wood.name
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{wood.name}</h3>
            <div className="flex items-center space-x-4 text-sm">
              <span className={`px-2 py-1 rounded ${
                wood.cost === 'low' ? 'bg-green-100 text-green-800' :
                wood.cost === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {wood.cost} cost
              </span>
              <span className="text-gray-600">Hardness: {wood.hardness}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected wood details */}
      {selectedWood && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{selectedWood.name}</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Janka Hardness</p>
              <p className="text-lg font-semibold text-gray-900">{selectedWood.hardness}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Workability</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{selectedWood.workability}</p>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={20} className="text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Cost</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedWood.cost}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Sustainability</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">{selectedWood.sustainability}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Characteristics</h4>
            <div className="flex flex-wrap gap-2">
              {selectedWood.characteristics.map((char) => (
                <span key={char} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                  {char}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Best Uses</h4>
            <ul className="list-disc list-inside space-y-1">
              {selectedWood.bestUses.map((use) => (
                <li key={use} className="text-gray-700">{use}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
