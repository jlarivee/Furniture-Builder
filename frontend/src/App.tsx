import { useState } from 'react';
import { AppPhase, FurnitureSpecs, ChatMessage, GeneratedDocuments } from './types';
import InputInterface from './components/InputInterface';
import DesignWorkspace from './components/DesignWorkspace';
import DocumentationView from './components/DocumentationView';

function App() {
  const [phase, setPhase] = useState<AppPhase>('input');
  const [sessionId, setSessionId] = useState<string>('');
  const [specs, setSpecs] = useState<FurnitureSpecs | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [documents, setDocuments] = useState<GeneratedDocuments | null>(null);

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
    setPhase('input');
    setSessionId('');
    setSpecs(null);
    setPreviewImage('');
    setChatHistory([]);
    setDocuments(null);
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
          <div className="mt-4 flex items-center space-x-4">
            <div className={`flex items-center ${phase === 'input' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'input' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2">Input</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${phase === 'design' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'design' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2">Design</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center ${phase === 'documentation' ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${phase === 'documentation' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                3
              </div>
              <span className="ml-2">Documentation</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {phase === 'input' && (
          <InputInterface onDesignGenerated={handleDesignGenerated} />
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
    </div>
  );
}

export default App;
