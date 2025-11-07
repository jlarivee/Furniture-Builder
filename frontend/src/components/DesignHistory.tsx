import { useState } from 'react';
import { History, Eye, RotateCcw, Trash2 } from 'lucide-react';
import { DesignVersion } from '../types';

interface DesignHistoryProps {
  versions: DesignVersion[];
  onRestore: (version: DesignVersion) => void;
  onDelete: (versionId: string) => void;
}

export default function DesignHistory({ versions, onRestore, onDelete }: DesignHistoryProps) {
  const [previewVersion, setPreviewVersion] = useState<DesignVersion | null>(null);

  const sortedVersions = [...versions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <History className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">Design History</h2>
      </div>

      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No previous versions saved yet.</p>
          <p className="text-sm mt-2">Versions are saved automatically when you modify your design.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedVersions.map((version, index) => (
            <div
              key={version.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        Current
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {new Date(version.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{version.specs.name}</h3>
                  <p className="text-sm text-gray-600">
                    {version.specs.dimensions.length}" × {version.specs.dimensions.width}" × {version.specs.dimensions.height}"
                  </p>
                  {version.notes && (
                    <p className="text-sm text-gray-700 mt-2 italic">"{version.notes}"</p>
                  )}
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <button
                    onClick={() => setPreviewVersion(version)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                  >
                    <Eye size={16} />
                    <span>Preview</span>
                  </button>
                  {index !== 0 && (
                    <>
                      <button
                        onClick={() => onRestore(version)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors"
                      >
                        <RotateCcw size={16} />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={() => onDelete(version.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewVersion.specs.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(previewVersion.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setPreviewVersion(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {previewVersion.previewImage && (
              <img
                src={previewVersion.previewImage}
                alt="Design preview"
                className="w-full rounded-lg mb-4"
              />
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Dimensions</p>
                <p className="font-semibold text-gray-900">
                  {previewVersion.specs.dimensions.length}" × {previewVersion.specs.dimensions.width}" × {previewVersion.specs.dimensions.height}"
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Style</p>
                <p className="font-semibold text-gray-900">{previewVersion.specs.style}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setPreviewVersion(null)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onRestore(previewVersion);
                  setPreviewVersion(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Restore This Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
