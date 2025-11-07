import { useState } from 'react';
import { CheckCircle2, Circle, Camera, StickyNote, Upload } from 'lucide-react';
import { BuildInstruction, ProjectProgress } from '../types';

interface ProgressTrackerProps {
  buildInstructions: BuildInstruction[];
  progress: ProjectProgress;
  onUpdateProgress: (progress: ProjectProgress) => void;
}

export default function ProgressTracker({
  buildInstructions,
  progress,
  onUpdateProgress
}: ProgressTrackerProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const toggleStep = (stepNumber: number) => {
    const newCompleted = progress.completedSteps.includes(stepNumber)
      ? progress.completedSteps.filter(s => s !== stepNumber)
      : [...progress.completedSteps, stepNumber];

    onUpdateProgress({
      ...progress,
      completedSteps: newCompleted,
      completedAt: newCompleted.length === buildInstructions.length ? Date.now() : undefined
    });
  };

  const addNote = () => {
    if (selectedStep !== null && note.trim()) {
      onUpdateProgress({
        ...progress,
        notes: {
          ...progress.notes,
          [selectedStep]: note
        }
      });
      setNote('');
    }
  };

  const handlePhotoUpload = (stepNumber: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProgress({
          ...progress,
          photos: {
            ...progress.photos,
            [stepNumber]: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const completionPercentage = Math.round(
    (progress.completedSteps.length / buildInstructions.length) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Progress</h2>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{progress.completedSteps.length} of {buildInstructions.length} steps completed</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {progress.completedAt && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              Project completed on {new Date(progress.completedAt).toLocaleDateString()}!
            </p>
          </div>
        )}
      </div>

      {/* Step List */}
      <div className="space-y-4">
        {buildInstructions.map((step) => {
          const isCompleted = progress.completedSteps.includes(step.stepNumber);
          const hasPhoto = !!progress.photos[step.stepNumber];
          const hasNote = !!progress.notes[step.stepNumber];

          return (
            <div
              key={step.stepNumber}
              className={`border-2 rounded-lg p-4 transition-all ${
                isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleStep(step.stepNumber)}
                  className="flex-shrink-0 mt-1"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="text-green-600" size={24} />
                  ) : (
                    <Circle className="text-gray-400" size={24} />
                  )}
                </button>

                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                    Step {step.stepNumber}: {step.title}
                  </h3>
                  <p className="text-sm text-gray-700">{step.instruction}</p>

                  {/* Photo Upload */}
                  <div className="mt-3 flex items-center space-x-3">
                    <label className="cursor-pointer flex items-center space-x-2 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors">
                      <Camera size={16} />
                      <span>{hasPhoto ? 'Change Photo' : 'Add Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(step.stepNumber, e)}
                      />
                    </label>

                    <button
                      onClick={() => setSelectedStep(step.stepNumber)}
                      className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm transition-colors"
                    >
                      <StickyNote size={16} />
                      <span>{hasNote ? 'Edit Note' : 'Add Note'}</span>
                    </button>
                  </div>

                  {/* Photo Display */}
                  {hasPhoto && (
                    <div className="mt-3">
                      <img
                        src={progress.photos[step.stepNumber]}
                        alt={`Step ${step.stepNumber}`}
                        className="max-w-xs rounded-lg border border-gray-300"
                      />
                    </div>
                  )}

                  {/* Note Display */}
                  {hasNote && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-900">{progress.notes[step.stepNumber]}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note Input Modal */}
      {selectedStep !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Note for Step {selectedStep}
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes, tips, or observations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setSelectedStep(null);
                  setNote('');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  addNote();
                  setSelectedStep(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
