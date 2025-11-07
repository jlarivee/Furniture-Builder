import { useState, useRef, useEffect } from 'react';
import { Send, Lock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../api';
import { FurnitureSpecs, ChatMessage } from '../types';

interface DesignWorkspaceProps {
  sessionId: string;
  specs: FurnitureSpecs;
  previewImage: string;
  chatHistory: ChatMessage[];
  onSpecsUpdate: (specs: FurnitureSpecs) => void;
  onPreviewUpdate: (image: string) => void;
  onChatUpdate: (messages: ChatMessage[]) => void;
  onLockDesign: (specs: FurnitureSpecs) => void;
}

export default function DesignWorkspace({
  sessionId,
  specs,
  previewImage,
  chatHistory,
  onSpecsUpdate,
  onPreviewUpdate,
  onChatUpdate,
  onLockDesign
}: DesignWorkspaceProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    setMessage('');
    setLoading(true);
    setError('');

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    onChatUpdate([...chatHistory, newUserMessage]);

    try {
      // Check if message is asking for a modification
      const isModification = userMessage.toLowerCase().includes('change') ||
                            userMessage.toLowerCase().includes('modify') ||
                            userMessage.toLowerCase().includes('make') ||
                            userMessage.toLowerCase().includes('adjust') ||
                            userMessage.toLowerCase().includes('update');

      let result;
      if (isModification) {
        result = await api.modifyDesign(sessionId, userMessage);
        onSpecsUpdate(result.specs);
        onPreviewUpdate(result.previewImage);
      } else {
        result = await api.chat(sessionId, userMessage);
      }

      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.chatResponse,
        timestamp: Date.now()
      };
      onChatUpdate([...chatHistory, newUserMessage, assistantMessage]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process message');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLockDesign = () => {
    if (window.confirm('Are you sure you want to lock this design? You won\'t be able to make further changes.')) {
      onLockDesign(specs);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-16rem)]">
      {/* Preview Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Design Preview</h2>
          <button
            onClick={handleLockDesign}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            <Lock size={18} />
            <span>Lock Design</span>
          </button>
        </div>

        {/* Preview Image */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Furniture preview"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="text-gray-400">Loading preview...</div>
          )}
        </div>

        {/* Specs Summary */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{specs.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{specs.description}</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Dimensions:</span>
              <span className="ml-2 text-gray-900">
                {specs.dimensions.length}" × {specs.dimensions.width}" × {specs.dimensions.height}"
              </span>
            </div>
            <div>
              <span className="text-gray-500">Style:</span>
              <span className="ml-2 text-gray-900">{specs.style}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Refine Your Design</h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <Loader2 className="animate-spin text-gray-600" size={20} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask questions or request modifications..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            'Make it taller',
            'Change the material',
            'Add storage',
            'Different style'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setMessage(suggestion)}
              disabled={loading}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
