import { useState } from 'react';
import { Book, Hammer, DollarSign, Clock } from 'lucide-react';
import WoodSpeciesGuide from './WoodSpeciesGuide';
import JoineryEncyclopedia from './JoineryEncyclopedia';
import { SkillLevel } from '../types';

interface ResourcesHubProps {
  skillLevel?: SkillLevel;
}

export default function ResourcesHub({ skillLevel }: ResourcesHubProps) {
  const [activeTab, setActiveTab] = useState<'wood' | 'joinery' | 'tips'>('wood');

  const buildingTips = {
    beginner: [
      {
        title: 'Measure Twice, Cut Once',
        content: 'Always double-check your measurements before making cuts. Mistakes in cutting are hard to fix.'
      },
      {
        title: 'Start with Softwoods',
        content: 'Pine and poplar are forgiving woods for beginners. They\'re easy to work with and affordable for practice.'
      },
      {
        title: 'Invest in Quality Basics',
        content: 'A good tape measure, square, and sharp pencil are more important than fancy power tools.'
      },
      {
        title: 'Sand Progressively',
        content: 'Start with coarser grits (80-100) and work up to finer grits (180-220). Never skip more than one grit level.'
      },
      {
        title: 'Test Finishes First',
        content: 'Always test stains and finishes on scrap wood from your project to see the true color.'
      }
    ],
    intermediate: [
      {
        title: 'Account for Wood Movement',
        content: 'Wood expands and contracts with humidity. Allow for movement in your joinery, especially on wide panels.'
      },
      {
        title: 'Sharp Tools = Safe Tools',
        content: 'Dull tools require more force and are more dangerous. Learn to sharpen chisels and plane irons.'
      },
      {
        title: 'Grain Direction Matters',
        content: 'Always plane and sand with the grain. Going against it causes tear-out and rough surfaces.'
      },
      {
        title: 'Dry Fit Everything',
        content: 'Assemble projects without glue first. This catches problems when they\'re still easy to fix.'
      },
      {
        title: 'Climate Control',
        content: 'Let wood acclimate to your shop for at least 48 hours before working with it.'
      }
    ],
    advanced: [
      {
        title: 'Understanding Wood Grain',
        content: 'Study quarter-sawn, rift-sawn, and flat-sawn cuts. Each has different stability and appearance characteristics.'
      },
      {
        title: 'Complex Joinery Planning',
        content: 'Layout joinery in the order of operations. Some joints must be cut before others to maintain reference faces.'
      },
      {
        title: 'Finishing Techniques',
        content: 'Master oil-varnish blends, shellac, and water-based finishes. Each has specific applications and benefits.'
      },
      {
        title: 'Jig Building',
        content: 'Create custom jigs for repeated operations. A well-made jig saves time and improves consistency.'
      },
      {
        title: 'Wood Selection',
        content: 'Choose boards carefully. Look for straight grain, minimal knots, and consistent color for fine furniture.'
      }
    ]
  };

  const currentTips = skillLevel ? buildingTips[skillLevel] : buildingTips.beginner;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Woodworking Resources</h1>
        <p className="text-gray-600">
          Educational guides and references to help you build better furniture
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'wood', label: 'Wood Species Guide', icon: Book },
              { id: 'joinery', label: 'Joinery Encyclopedia', icon: Hammer },
              { id: 'tips', label: 'Building Tips', icon: DollarSign }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'wood' && <WoodSpeciesGuide />}
          {activeTab === 'joinery' && <JoineryEncyclopedia skillLevel={skillLevel} />}
          {activeTab === 'tips' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Building Tips {skillLevel && `for ${skillLevel.charAt(0).toUpperCase() + skillLevel.slice(1)}s`}
                </h2>
                <p className="text-gray-600">
                  Curated advice to improve your woodworking skills
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentTips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tip.title}</h3>
                    <p className="text-gray-700">{tip.content}</p>
                  </div>
                ))}
              </div>

              {/* Additional Resources */}
              <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Reminders</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Always wear safety glasses when using power tools or hand tools</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Use hearing protection with loud power tools (table saw, router, planer)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Wear a dust mask or respirator when sanding or working with fine particles</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Never remove safety guards from power tools</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Keep your work area clean and well-lit</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-600 font-bold">•</span>
                    <span>Unplug tools before changing blades or bits</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
