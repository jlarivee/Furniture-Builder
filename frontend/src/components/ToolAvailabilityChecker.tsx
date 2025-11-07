import { useState } from 'react';
import { Wrench, Check } from 'lucide-react';
import { commonWoodworkingTools, toolsBySkillLevel } from '../data/commonTools';
import { SkillLevel } from '../types';

interface ToolAvailabilityCheckerProps {
  skillLevel?: SkillLevel;
  onToolsSelected: (tools: string[]) => void;
}

export default function ToolAvailabilityChecker({ skillLevel, onToolsSelected }: ToolAvailabilityCheckerProps) {
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const recommendedTools = skillLevel ? toolsBySkillLevel[skillLevel] : [];
  const displayTools = showAll ? commonWoodworkingTools : recommendedTools;

  const toggleTool = (tool: string) => {
    const newSelected = new Set(selectedTools);
    if (newSelected.has(tool)) {
      newSelected.delete(tool);
    } else {
      newSelected.add(tool);
    }
    setSelectedTools(newSelected);
    onToolsSelected(Array.from(newSelected));
  };

  const selectAll = () => {
    setSelectedTools(new Set(displayTools));
    onToolsSelected(displayTools);
  };

  const clearAll = () => {
    setSelectedTools(new Set());
    onToolsSelected([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wrench className="text-blue-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Available Tools</h3>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Select All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Select the tools you have available. We'll tailor the build instructions accordingly.
      </p>

      {skillLevel && !showAll && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Showing recommended tools for <span className="font-semibold capitalize">{skillLevel}</span> level.{' '}
            <button
              onClick={() => setShowAll(true)}
              className="font-semibold underline hover:no-underline"
            >
              Show all tools
            </button>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
        {displayTools.map((tool) => (
          <button
            key={tool}
            onClick={() => toggleTool(tool)}
            className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all text-left ${
              selectedTools.has(tool)
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
              selectedTools.has(tool)
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {selectedTools.has(tool) && <Check size={14} className="text-white" />}
            </div>
            <span className="text-sm text-gray-900">{tool}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">{selectedTools.size}</span> tools selected
        </p>
      </div>
    </div>
  );
}
