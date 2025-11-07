import { SkillLevel } from '../types';
import { GraduationCap, Wrench, Award } from 'lucide-react';

interface SkillLevelSelectorProps {
  selected: SkillLevel;
  onChange: (level: SkillLevel) => void;
}

export default function SkillLevelSelector({ selected, onChange }: SkillLevelSelectorProps) {
  const levels: { value: SkillLevel; icon: any; label: string; description: string }[] = [
    {
      value: 'beginner',
      icon: GraduationCap,
      label: 'Beginner',
      description: 'Simple joints, basic tools, detailed instructions'
    },
    {
      value: 'intermediate',
      icon: Wrench,
      label: 'Intermediate',
      description: 'Moderate complexity, common power tools'
    },
    {
      value: 'advanced',
      icon: Award,
      label: 'Advanced',
      description: 'Complex joinery, advanced techniques'
    }
  ];

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Skill Level</label>
      <div className="grid grid-cols-3 gap-3">
        {levels.map(({ value, icon: Icon, label, description }) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selected === value
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <Icon
              size={32}
              className={`mx-auto mb-2 ${selected === value ? 'text-blue-600' : 'text-gray-400'}`}
            />
            <div className="text-sm font-semibold text-gray-900">{label}</div>
            <div className="text-xs text-gray-600 mt-1">{description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
