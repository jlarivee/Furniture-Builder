import { Clock, Calendar } from 'lucide-react';
import { BuildInstruction, SkillLevel } from '../types';

interface TimelineEstimatorProps {
  buildInstructions: BuildInstruction[];
  skillLevel: SkillLevel;
}

export default function TimelineEstimator({ buildInstructions, skillLevel }: TimelineEstimatorProps) {
  // Calculate total time based on skill level multiplier
  const skillMultipliers = {
    beginner: 1.5,
    intermediate: 1.0,
    advanced: 0.75
  };

  const baseTime = buildInstructions.reduce((total, step) => {
    return total + (step.estimatedTime || 30); // Default 30 min per step
  }, 0);

  const adjustedTime = baseTime * skillMultipliers[skillLevel];
  const totalHours = Math.ceil(adjustedTime / 60);
  const weekends = Math.ceil(totalHours / 8); // Assuming 8 hours per weekend day

  // Add finishing time (usually 20-30% of build time)
  const finishingTime = Math.ceil(totalHours * 0.25);
  const grandTotal = totalHours + finishingTime;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Clock className="text-blue-600" size={24} />
        <h3 className="text-lg font-semibold text-gray-900">Build Timeline</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 mb-1">Construction Time</p>
          <p className="text-2xl font-bold text-blue-900">{totalHours} hours</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm text-purple-600 mb-1">Finishing Time</p>
          <p className="text-2xl font-bold text-purple-900">{finishingTime} hours</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 mb-1">Total Project Time</p>
          <p className="text-2xl font-bold text-green-900">{grandTotal} hours</p>
        </div>
      </div>

      {/* Timeline Estimate */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
        <div className="flex items-start space-x-3">
          <Calendar className="text-indigo-600 flex-shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-semibold text-indigo-900 mb-2">Estimated Timeline</h4>
            <p className="text-indigo-800 mb-2">
              Based on your <span className="font-semibold capitalize">{skillLevel}</span> skill level:
            </p>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li>
                <span className="font-semibold">Weekend Project:</span>{' '}
                {weekends} {weekends === 1 ? 'weekend' : 'weekends'}
              </li>
              <li>
                <span className="font-semibold">Evening Work (2hrs/day):</span>{' '}
                {Math.ceil(grandTotal / 2)} days
              </li>
              <li>
                <span className="font-semibold">Full Days (8hrs/day):</span>{' '}
                {Math.ceil(grandTotal / 8)} days
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Phase Breakdown */}
      <div className="mt-6">
        <h4 className="font-semibold text-gray-900 mb-3">Time by Phase</h4>
        <div className="space-y-2">
          {buildInstructions.map((step) => {
            const stepTime = Math.ceil((step.estimatedTime || 30) * skillMultipliers[skillLevel] / 60 * 10) / 10;
            return (
              <div key={step.stepNumber} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">
                  Step {step.stepNumber}: {step.title}
                </span>
                <span className="text-sm font-semibold text-gray-900">{stepTime}h</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
            <span className="text-sm font-semibold text-amber-900">Finishing (sanding, stain, poly)</span>
            <span className="text-sm font-bold text-amber-900">{finishingTime}h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
