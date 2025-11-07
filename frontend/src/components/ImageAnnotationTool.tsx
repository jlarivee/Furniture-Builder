import React, { useEffect, useRef, useState } from 'react';
import { Canvas, IText, Circle as FabricCircle, Rect, Line, Triangle, Group } from 'fabric';
import {
  Pencil,
  Circle as CircleIcon,
  Square,
  Type,
  ArrowRight,
  Eraser,
  Undo,
  Redo,
  Trash2,
  Download,
  Check,
  Palette,
} from 'lucide-react';

interface ImageAnnotationToolProps {
  imageUrl: string;
  onSaveAnnotation: (annotatedImageData: string, notes: string) => void;
  onCancel: () => void;
  initialNotes?: string;
}

const COLORS = [
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#000000', // Black
  '#FFFFFF', // White
];

export default function ImageAnnotationTool({
  imageUrl,
  onSaveAnnotation,
  onCancel,
  initialNotes = '',
}: ImageAnnotationToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('pencil');
  const [selectedColor, setSelectedColor] = useState('#EF4444');
  const [brushWidth, setBrushWidth] = useState(3);
  const [notes, setNotes] = useState(initialNotes);
  const [history, setHistory] = useState<string[]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric.js canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 1000,
      height: 700,
      backgroundColor: '#f3f4f6',
    });

    fabricCanvasRef.current = canvas;

    // Load the image
    const loadImage = async () => {
      const img = await Canvas.loadImage(imageUrl, { crossOrigin: 'anonymous' }) as any;
      if (img) {
        if (!img.width || !img.height) return;

        // Scale image to fit canvas
        const scale = Math.min(
          canvas.width! / img.width,
          canvas.height! / img.height
        );

        img.scale(scale);
        img.set({
          left: (canvas.width! - img.width! * scale) / 2,
          top: (canvas.height! - img.height! * scale) / 2,
          selectable: false,
          evented: false,
        });

        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();

        // Save initial state
        saveHistory();
      }
    };

    loadImage();

    // Enable drawing mode by default
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = selectedColor;
    canvas.freeDrawingBrush.width = brushWidth;

    return () => {
      canvas.dispose();
    };
  }, [imageUrl]);

  // Update canvas when tool changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = selectedTool === 'pencil';

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = selectedColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [selectedTool, selectedColor, brushWidth]);

  const saveHistory = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(json);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newStep = historyStep - 1;
    setHistoryStep(newStep);
    canvas.loadFromJSON(history[newStep], () => {
      canvas.renderAll();
    });
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newStep = historyStep + 1;
    setHistoryStep(newStep);
    canvas.loadFromJSON(history[newStep], () => {
      canvas.renderAll();
    });
  };

  const clearCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    // Keep only the background image (first object)
    for (let i = objects.length - 1; i > 0; i--) {
      canvas.remove(objects[i]);
    }
    canvas.renderAll();
    saveHistory();
  };

  const addShape = (type: 'circle' | 'rectangle' | 'arrow' | 'text') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let shape: any;

    switch (type) {
      case 'circle':
        shape = new FabricCircle({
          radius: 50,
          fill: 'transparent',
          stroke: selectedColor,
          strokeWidth: brushWidth,
          left: 100,
          top: 100,
        });
        break;
      case 'rectangle':
        shape = new Rect({
          width: 100,
          height: 80,
          fill: 'transparent',
          stroke: selectedColor,
          strokeWidth: brushWidth,
          left: 100,
          top: 100,
        });
        break;
      case 'arrow':
        const line = new Line([50, 100, 200, 100], {
          stroke: selectedColor,
          strokeWidth: brushWidth,
        });
        const triangle = new Triangle({
          width: 20,
          height: 20,
          fill: selectedColor,
          left: 200,
          top: 90,
          angle: 90,
        });
        const group = new Group([line, triangle], {
          left: 100,
          top: 100,
        });
        shape = group;
        break;
      case 'text':
        shape = new IText('Add text here', {
          left: 100,
          top: 100,
          fontSize: 24,
          fill: selectedColor,
          fontFamily: 'Arial',
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    saveHistory();
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => canvas.remove(obj));
      canvas.discardActiveObject();
      canvas.renderAll();
      saveHistory();
    }
  };

  const handleSave = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Export canvas as PNG
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 0.9,
    });

    onSaveAnnotation(dataURL, notes);
  };

  const downloadImage = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'annotated-furniture.png';
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Annotate Your Reference Image</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Toolbar */}
          <div className="w-20 border-r border-gray-200 bg-gray-50 p-2 space-y-2 overflow-y-auto">
            <ToolButton
              icon={<Pencil className="w-5 h-5" />}
              label="Draw"
              active={selectedTool === 'pencil'}
              onClick={() => setSelectedTool('pencil')}
            />
            <ToolButton
              icon={<CircleIcon className="w-5 h-5" />}
              label="Circle"
              active={selectedTool === 'circle'}
              onClick={() => {
                setSelectedTool('circle');
                addShape('circle');
              }}
            />
            <ToolButton
              icon={<Square className="w-5 h-5" />}
              label="Rectangle"
              active={selectedTool === 'rectangle'}
              onClick={() => {
                setSelectedTool('rectangle');
                addShape('rectangle');
              }}
            />
            <ToolButton
              icon={<ArrowRight className="w-5 h-5" />}
              label="Arrow"
              active={selectedTool === 'arrow'}
              onClick={() => {
                setSelectedTool('arrow');
                addShape('arrow');
              }}
            />
            <ToolButton
              icon={<Type className="w-5 h-5" />}
              label="Text"
              active={selectedTool === 'text'}
              onClick={() => {
                setSelectedTool('text');
                addShape('text');
              }}
            />

            <div className="border-t border-gray-300 pt-2" />

            <ToolButton
              icon={<Eraser className="w-5 h-5" />}
              label="Delete"
              onClick={deleteSelected}
            />
            <ToolButton
              icon={<Undo className="w-5 h-5" />}
              label="Undo"
              onClick={undo}
              disabled={historyStep <= 0}
            />
            <ToolButton
              icon={<Redo className="w-5 h-5" />}
              label="Redo"
              onClick={redo}
              disabled={historyStep >= history.length - 1}
            />
            <ToolButton
              icon={<Trash2 className="w-5 h-5" />}
              label="Clear"
              onClick={clearCanvas}
            />
            <ToolButton
              icon={<Download className="w-5 h-5" />}
              label="Download"
              onClick={downloadImage}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Canvas Controls */}
            <div className="p-3 border-b border-gray-200 bg-white flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-gray-600" />
                <div className="flex gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded border-2 transition-all ${
                        selectedColor === color
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Brush Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushWidth}
                  onChange={(e) => setBrushWidth(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600 w-8">{brushWidth}px</span>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto bg-gray-100 p-4 flex items-center justify-center">
              <canvas ref={canvasRef} className="border border-gray-300 shadow-lg bg-white" />
            </div>
          </div>

          {/* Notes Panel */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-2">Design Notes</h3>
            <p className="text-sm text-gray-600 mb-3">
              Add notes about what you want to change, emphasize, or customize in this design.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Make the legs shorter, add a drawer on the left side, use oak wood instead of pine..."
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500">
                💡 Tip: Use arrows and text to highlight specific areas you want to modify
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            Use This Image
          </button>
        </div>
      </div>
    </div>
  );
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ToolButton({ icon, label, active, onClick, disabled }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full aspect-square flex flex-col items-center justify-center rounded-lg transition-all ${
        active
          ? 'bg-blue-100 text-blue-600'
          : disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white text-gray-700 hover:bg-gray-100'
      } border border-gray-200`}
      title={label}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}
