import { useState } from 'react';
import { Hammer, Search, AlertCircle } from 'lucide-react';
import { joineryDatabase } from '../data/joineryTypes';
import { JoineryType, SkillLevel } from '../types';

interface JoineryEncyclopediaProps {
  skillLevel?: SkillLevel;
}

export default function JoineryEncyclopedia({ skillLevel }: JoineryEncyclopediaProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJoint, setSelectedJoint] = useState<JoineryType | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | SkillLevel>('all');

  const filteredJoints = joineryDatabase.filter(joint => {
    const matchesSearch = joint.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || joint.difficulty === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: SkillLevel) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'low': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Hammer className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Joinery Encyclopedia</h2>
      </div>

      {skillLevel && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-2">
          <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm text-blue-800">
            Showing joints suitable for your <span className="font-semibold capitalize">{skillLevel}</span> skill level
          </p>
        </div>
      )}

      {/* Search and filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search joinery techniques..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Joint list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {filteredJoints.map((joint) => (
          <button
            key={joint.name}
            onClick={() => setSelectedJoint(joint)}
            className={`text-left p-4 rounded-lg border-2 transition-all ${
              selectedJoint?.name === joint.name
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <h3 className="font-semibold text-gray-900 mb-2">{joint.name}</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`px-2 py-1 rounded ${getDifficultyColor(joint.difficulty)}`}>
                {joint.difficulty}
              </span>
              <span className={`px-2 py-1 rounded bg-gray-100 ${getStrengthColor(joint.strength)}`}>
                {joint.strength} strength
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected joint details */}
      {selectedJoint && (
        <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">{selectedJoint.name}</h3>
            <span className={`px-3 py-1 rounded ${getDifficultyColor(selectedJoint.difficulty)}`}>
              {selectedJoint.difficulty}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{selectedJoint.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Strength</h4>
              <p className={`text-lg font-semibold capitalize ${getStrengthColor(selectedJoint.strength)}`}>
                {selectedJoint.strength}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">When to Use</h4>
              <p className="text-gray-700">{selectedJoint.whenToUse}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Required Tools</h4>
            <div className="flex flex-wrap gap-2">
              {selectedJoint.toolsRequired.map((tool) => (
                <span key={tool} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
