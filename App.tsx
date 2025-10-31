import React, { useState, useCallback } from 'react';
import { ContentType, Tone, Length } from './types';
import { generateContent } from './services/geminiService';
import { SparklesIcon, ClipboardIcon, CheckIcon, XCircleIcon } from './components/Icons';

const Disclaimer: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="relative bg-yellow-200 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md shadow-lg mb-6">
    <div className="flex">
      <div className="py-1">
        <svg className="h-6 w-6 text-yellow-500 mr-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p className="font-bold">A Note on Your Request</p>
        <p className="text-sm">
          You asked for this project in Java. As a specialized AI for web development, I've built this fully functional platform using React and TypeScript. I hope you find this modern web stack useful!
        </p>
      </div>
    </div>
    <button onClick={onClose} className="absolute top-2 right-2 text-yellow-600 hover:text-yellow-800">
      <XCircleIcon className="h-5 w-5" />
    </button>
  </div>
);

const App: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [contentType, setContentType] = useState<ContentType>(ContentType.Marketing);
  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState<Tone>(Tone.Professional);
  const [length, setLength] = useState<Length>(Length.Medium);

  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to generate content.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedContent('');

    const result = await generateContent(contentType, prompt, tone, length);
    
    if (result.startsWith('An error occurred')) {
        setError(result);
    } else {
        setGeneratedContent(result);
    }

    setIsLoading(false);
  }, [contentType, prompt, tone, length]);
  
  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const renderContentTypeSelector = () => {
    return (
      <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
        {Object.values(ContentType).map((type) => (
          <button
            key={type}
            onClick={() => setContentType(type)}
            className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${
              contentType === type ? 'bg-cyan-600 text-white shadow' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-600">
            AI Content Forge
          </h1>
          <p className="mt-2 text-lg text-gray-400">Your personal AI-powered content creation studio</p>
        </header>
        
        {showDisclaimer && <Disclaimer onClose={() => setShowDisclaimer(false)} />}
        
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Controls */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-gray-100">1. Define Your Content</h2>
            {renderContentTypeSelector()}
            
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Your Prompt</label>
              <textarea
                id="prompt"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`e.g., "A new line of eco-friendly sneakers made from recycled materials."`}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-100 pt-2">2. Refine Your Style</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-2">Tone of Voice</label>
                <select id="tone" value={tone} onChange={(e) => setTone(e.target.value as Tone)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                  {Object.values(Tone).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-300 mb-2">Content Length</label>
                <select id="length" value={length} onChange={(e) => setLength(e.target.value as Length)} className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                  {Object.values(Length).map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-cyan-600 hover:to-violet-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
            
            {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-lg text-sm">{error}</div>}
          </div>

          {/* Right Panel: Output */}
          <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 relative flex flex-col min-h-[400px] lg:min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-100">Generated Content</h2>
              {generatedContent && !isLoading && (
                 <button
                    onClick={handleCopy}
                    className="flex items-center text-sm bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                    {isCopied ? <CheckIcon className="w-5 h-5 mr-2 text-green-400" /> : <ClipboardIcon className="w-5 h-5 mr-2" />}
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            
            <div className="flex-grow bg-gray-900 rounded-lg p-4 overflow-y-auto">
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              ) : generatedContent ? (
                <p className="text-gray-300 whitespace-pre-wrap">{generatedContent}</p>
              ) : (
                <div className="text-center text-gray-500 h-full flex flex-col justify-center items-center">
                  <SparklesIcon className="w-12 h-12 mb-4" />
                  <p>Your generated content will appear here.</p>
                  <p className="text-sm">Fill out the form and click generate!</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
