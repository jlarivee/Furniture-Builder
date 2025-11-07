import { useState } from 'react';
import { Download, FileCode, Image, Layers } from 'lucide-react';
import { FurnitureSpecs, CutListItem } from '../types';
import { exportCAD } from '../utils/cadExporter';

interface CADExporterProps {
  specs: FurnitureSpecs;
  cutList: CutListItem[];
}

export default function CADExporter({ specs, cutList }: CADExporterProps) {
  const [selectedFormat, setSelectedFormat] = useState<'dxf' | 'svg'>('svg');
  const [selectedView, setSelectedView] = useState<'top' | 'front' | 'side'>('top');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportCAD(selectedFormat, specs, cutList, selectedView);
      setTimeout(() => setIsExporting(false), 1000);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export CAD file. Please try again.');
      setIsExporting(false);
    }
  };

  const formats = [
    {
      id: 'svg',
      name: 'SVG',
      description: 'Scalable Vector Graphics - Best for web & laser cutting',
      icon: Image
    },
    {
      id: 'dxf',
      name: 'DXF',
      description: 'AutoCAD Drawing Exchange Format - For CAD software',
      icon: FileCode
    }
  ];

  const views = [
    {
      id: 'top',
      name: 'Top View',
      description: 'Bird\'s eye view showing length × width'
    },
    {
      id: 'front',
      name: 'Front View',
      description: 'Front elevation showing length × height'
    },
    {
      id: 'side',
      name: 'Side View',
      description: 'Side elevation showing width × height'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Layers className="text-blue-600" size={24} />
        <h2 className="text-xl font-bold text-gray-900">CAD Export</h2>
      </div>

      <p className="text-gray-600 mb-6">
        Export technical drawings for use in CAD software, laser cutting, or CNC machining.
      </p>

      {/* Format Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formats.map(({ id, name, description, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedFormat(id as 'dxf' | 'svg')}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedFormat === id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  size={24}
                  className={selectedFormat === id ? 'text-blue-600' : 'text-gray-400'}
                />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* View Selection */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Drawing View</h3>
        <div className="space-y-2">
          {views.map(({ id, name, description }) => (
            <button
              key={id}
              onClick={() => setSelectedView(id as 'top' | 'front' | 'side')}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                selectedView === id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">{name}</h4>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
                {selectedView === id && (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preview Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Export Preview</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p><span className="font-medium">Furniture:</span> {specs.name}</p>
          <p><span className="font-medium">Dimensions:</span> {specs.dimensions.length}" × {specs.dimensions.width}" × {specs.dimensions.height}"</p>
          <p><span className="font-medium">Parts:</span> {cutList.length} components</p>
          <p><span className="font-medium">Format:</span> {selectedFormat.toUpperCase()}</p>
          <p><span className="font-medium">View:</span> {views.find(v => v.id === selectedView)?.name}</p>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Download size={20} />
        <span>{isExporting ? 'Exporting...' : `Export ${selectedFormat.toUpperCase()} File`}</span>
      </button>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Usage Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>SVG files</strong> can be opened in Inkscape, Adobe Illustrator, or web browsers</li>
          <li>• <strong>DXF files</strong> work with AutoCAD, Fusion 360, and most CAD software</li>
          <li>• Export all three views for a complete technical drawing set</li>
          <li>• SVG files are ideal for laser cutting or CNC routing</li>
          <li>• DXF files preserve precise measurements for manufacturing</li>
        </ul>
      </div>

      {/* Additional Export Options */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={() => { setSelectedView('top'); handleExport(); }}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Export Top
        </button>
        <button
          onClick={() => { setSelectedView('front'); handleExport(); }}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Export Front
        </button>
        <button
          onClick={() => { setSelectedView('side'); handleExport(); }}
          className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          Export Side
        </button>
      </div>
    </div>
  );
}
