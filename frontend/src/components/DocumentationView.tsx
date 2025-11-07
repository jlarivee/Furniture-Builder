import { useState, useEffect } from 'react';
import { Download, FileText, Loader2, Package, Box, Layers } from 'lucide-react';
import { api } from '../api';
import { FurnitureSpecs, GeneratedDocuments } from '../types';
import Furniture3DViewer from './Furniture3DViewer';
import CADExporter from './CADExporter';

interface DocumentationViewProps {
  sessionId: string;
  specs: FurnitureSpecs;
  documents: GeneratedDocuments | null;
  onDocumentsGenerated: (docs: GeneratedDocuments) => void;
}

export default function DocumentationView({
  sessionId,
  specs,
  documents,
  onDocumentsGenerated
}: DocumentationViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'cutlist' | 'materials' | 'instructions' | 'views' | '3d' | 'cad'>('cutlist');

  useEffect(() => {
    if (!documents) {
      generateDocuments();
    }
  }, []);

  const generateDocuments = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await api.generateDocuments(sessionId, specs);
      onDocumentsGenerated(result.documents);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate documents');
      console.error('Error generating documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = () => {
    window.open(api.exportZip(sessionId), '_blank');
  };

  const handleDownloadPdf = (docType: string) => {
    window.open(api.exportPdf(sessionId, docType), '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md p-8">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Generating Your Complete Build Plan
        </h2>
        <p className="text-gray-600 text-center max-w-md">
          This may take a minute as we create cut lists, materials lists, build instructions,
          and visual guides...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={generateDocuments}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!documents) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with download buttons */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{specs.name}</h2>
            <p className="text-gray-600 mt-1">Complete Build Documentation</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleDownloadZip}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <Package size={18} />
              <span>Download All (ZIP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex flex-wrap space-x-4 px-6" aria-label="Tabs">
            {[
              { id: 'cutlist', label: 'Cut List' },
              { id: 'materials', label: 'Materials' },
              { id: 'instructions', label: 'Build Instructions' },
              { id: 'views', label: 'Multiple Views' },
              { id: '3d', label: '3D Viewer', icon: Box },
              { id: 'cad', label: 'CAD Export', icon: Layers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon && <tab.icon size={16} />}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Cut List Tab */}
          {activeTab === 'cutlist' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Cut List</h3>
                <button
                  onClick={() => handleDownloadPdf('cutlist')}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} />
                  <span>PDF</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Part</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Length</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Width</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thickness</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.cutList.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.partName}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.length}"</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.width}"</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.thickness}"</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.material}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === 'materials' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Materials List</h3>
                <button
                  onClick={() => handleDownloadPdf('materials')}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-6">
                {/* Lumber */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Lumber</h4>
                  <div className="space-y-2">
                    {documents.materialsList.lumber?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.item}</p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hardware */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Hardware</h4>
                  <div className="space-y-2">
                    {documents.materialsList.hardware?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.item}</p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Finishing */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Finishing</h4>
                  <div className="space-y-2">
                    {documents.materialsList.finishing?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.item}</p>
                          <p className="text-xs text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{item.estimatedCost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Tools Required</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {documents.materialsList.tools?.map((tool, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm text-gray-700">
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Estimated Cost</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {documents.materialsList.totalEstimatedCost}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Build Instructions Tab */}
          {activeTab === 'instructions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Step-by-Step Build Instructions</h3>
                <button
                  onClick={() => handleDownloadPdf('build')}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download size={16} />
                  <span>PDF</span>
                </button>
              </div>

              <div className="space-y-6">
                {documents.buildInstructions.map((step) => (
                  <div key={step.stepNumber} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{step.instruction}</p>

                        {/* Assembly image if available */}
                        {documents.assemblyImages[step.stepNumber] && (
                          <div className="mb-4">
                            <img
                              src={documents.assemblyImages[step.stepNumber]}
                              alt={`Step ${step.stepNumber}`}
                              className="rounded-lg border border-gray-300 max-w-md"
                            />
                          </div>
                        )}

                        {/* Safety notes */}
                        {step.safetyNotes && step.safetyNotes.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 font-semibold mb-2">⚠ Safety Notes:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {step.safetyNotes.map((note, index) => (
                                <li key={index} className="text-red-700 text-sm">{note}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multiple Views Tab */}
          {activeTab === 'views' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Multiple Angle Views</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(documents.multipleViews).map(([angle, url]) => (
                  url && (
                    <div key={angle} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                        {angle} View
                      </h4>
                      <img
                        src={url}
                        alt={`${angle} view`}
                        className="w-full rounded-lg"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* 3D Viewer Tab */}
          {activeTab === '3d' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive 3D Model</h3>
              <p className="text-gray-600 mb-4">
                Explore your furniture design in 3D. Rotate, zoom, and inspect from any angle.
              </p>
              <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
                <Furniture3DViewer specs={specs} className="w-full h-full" />
              </div>
            </div>
          )}

          {/* CAD Export Tab */}
          {activeTab === 'cad' && (
            <div>
              <CADExporter specs={specs} cutList={documents.cutList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
