import { useState } from 'react';
import { AppPhase, FurnitureSpecs, ChatMessage, GeneratedDocuments } from './types';
import InputInterface from './components/InputInterface';
import DesignWorkspace from './components/DesignWorkspace';
import DocumentationView from './components/DocumentationView';
import FurnitureImageBrowser from './components/FurnitureImageBrowser';
import ImageAnnotationTool from './components/ImageAnnotationTool';

function App() {
  const [phase, setPhase] = useState<AppPhase>('inspiration');
  const [sessionId, setSessionId] = useState<string>('');
  const [specs, setSpecs] = useState<FurnitureSpecs | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocuments | null>(null);

  // New state for inspiration phase
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [selectedReferenceImage, setSelectedReferenceImage] = useState<string>('');
  const [showAnnotationTool, setShowAnnotationTool] = useState(false);
  const [annotatedImageData, setAnnotatedImageData] = useState<string>('');
  const [annotationNotes, setAnnotationNotes] = useState<string>('');

  const handleDesignGenerated = (
    newSessionId: string,
    newSpecs: FurnitureSpecs,
    image: string,
    initialMessage: string
  ) => {
    setSessionId(newSessionId);
    setSpecs(newSpecs);
    setPreviewImage(image);
    setChatHistory([
      {
        role: 'user',
        content: initialMessage,
        timestamp: Date.now()
      },
      {
        role: 'assistant',
        content: 'I\'ve created an initial design based on your description. You can see the preview on the left. Feel free to request any modifications!',
        timestamp: Date.now()
      }
    ]);
    setPhase('design');
  };

  const handleDesignLocked = (finalSpecs: FurnitureSpecs) => {
    setSpecs(finalSpecs);
    setPhase('documentation');
  };

  const handleDocumentsGenerated = (generatedDocs: GeneratedDocuments) => {
    setDocuments(generatedDocs);
  };

  const handleStartOver = () => {
    setPhase('inspiration');
    setSessionId('');
    setSpecs(null);
    setPreviewImage('');
    setChatHistory([]);
    setDocuments(null);
    setShowImageBrowser(false);
    setSelectedReferenceImage('');
    setShowAnnotationTool(false);
    setAnnotatedImageData('');
    setAnnotationNotes('');
  };

  const handleSelectImage = (imageUrl: string, _photoData: any) => {
    setSelectedReferenceImage(imageUrl);
    setShowImageBrowser(false);
    setShowAnnotationTool(true);
  };

  const handleSaveAnnotation = (annotatedData: string, notes: string) => {
    setAnnotatedImageData(annotatedData);
    setAnnotationNotes(notes);
    setShowAnnotationTool(false);
    setPhase('input');
  };

  const handleCancelAnnotation = () => {
    setShowAnnotationTool(false);
    setShowImageBrowser(true);
  };

  const handleSkipInspiration = () => {
    setPhase('input');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Furniture Plan Generator
            </h1>
            {phase !== 'input' && (
              <button
                onClick={handleStartOver}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Start Over
              </button>
            )}
          </div>

          {/* Phase indicator */}
          <div className="mt-4 flex items-center space-x-2">
            <div className={`flex items-center ${phase === 'inspiration' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'inspiration' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm">Inspiration</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${phase === 'input' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'input' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm">Input</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${phase === 'design' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'design' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm">Design</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${phase === 'documentation' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'documentation' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                4
              </div>
              <span className="ml-2 text-sm">Documentation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {phase === 'inspiration' && (
          <div className="text-center py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get Inspired by Real Furniture
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Browse thousands of furniture photos to find inspiration for your build.
              Select an image and annotate it to guide the AI in creating your perfect design.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowImageBrowser(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Browse Furniture Photos
              </button>
              <button
                onClick={handleSkipInspiration}
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-lg font-medium transition-all"
              >
                Skip to Description
              </button>
            </div>
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Search & Browse</h3>
                  <p className="text-gray-600 text-sm">
                    Search for any furniture type or style from thousands of high-quality photos
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">✏️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Annotate</h3>
                  <p className="text-gray-600 text-sm">
                    Draw on the image to highlight features you want to change or emphasize
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Design</h3>
                  <p className="text-gray-600 text-sm">
                    The AI uses your annotations and notes to create a custom build plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'input' && (
          <InputInterface
            onDesignGenerated={handleDesignGenerated}
            initialReferenceImage={annotatedImageData || selectedReferenceImage}
            initialDescription={annotationNotes}
          />
        )}

        {phase === 'design' && specs && (
          <DesignWorkspace
            sessionId={sessionId}
            specs={specs}
            previewImage={previewImage}
            chatHistory={chatHistory}
            onSpecsUpdate={setSpecs}
            onPreviewUpdate={setPreviewImage}
            onChatUpdate={setChatHistory}
            onLockDesign={handleDesignLocked}
          />
        )}

        {phase === 'documentation' && specs && (
          <DocumentationView
            sessionId={sessionId}
            specs={specs}
            documents={documents}
            onDocumentsGenerated={handleDocumentsGenerated}
          />
        )}
      </main>

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <FurnitureImageBrowser
          onSelectImage={handleSelectImage}
          onClose={() => setShowImageBrowser(false)}
        />
      )}

      {/* Annotation Tool Modal */}
      {showAnnotationTool && selectedReferenceImage && (
        <ImageAnnotationTool
          imageUrl={selectedReferenceImage}
          onSaveAnnotation={handleSaveAnnotation}
          onCancel={handleCancelAnnotation}
        />
      )}
    </div>
  );
}

export default App;
