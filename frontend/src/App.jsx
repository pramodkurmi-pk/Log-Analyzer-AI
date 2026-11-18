import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

// Simulated API function using fetch. Replace with your actual backend endpoint.
const sendTextToBackend = async (text) => {
  const response = await fetch('http://localhost:5000/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: text,
  });

  if (!response.ok) {
    throw new Error('Server response was not ok');
  }

  return response.json();
};

export default function App() {
  const [inputText, setInputText] = useState('');

  // Setup React Query Mutation
  const mutation = useMutation({
    mutationFn: sendTextToBackend,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    mutation.mutate(inputText);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="w-full py-6 px-8 border-b border-slate-200/60 bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Log Analyzer <span className="text-indigo-600">AI</span>
          </h1>
          <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
            React Query Active
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
          {/* Input Textbox Section */}
          <div className="flex flex-col gap-2 flex-1 min-h-[220px]">
            <label 
              htmlFor="input-text" 
              className="text-sm font-medium text-slate-600 flex justify-between"
            >
              <span>Error Log</span>
              <span className="text-xs text-slate-400">{inputText.length} chars</span>
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or write your error log here..."
              className="w-full flex-1 p-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y scrollable text-slate-700 placeholder:text-slate-400"
              style={{ minHeight: '100px', maxHeight: '400px' }}
            />
          </div>

          {/* Action Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={mutation.isPending || !inputText.trim()}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Analyze Log'
              )}
            </button>
          </div>
        </form>

        {/* Server Response Display Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-600">
            Log Analysis Result
          </label>
          <div 
            className="w-full p-4 bg-white border border-slate-200 rounded-xl shadow-sm overflow-y-auto scrollable text-slate-700 font-mono text-sm"
            style={{ maxHeight: '250px', minHeight: '100px' }}
          >
            {mutation.isPending && (
              <p className="text-slate-400 italic font-sans">Awaiting response from server...</p>
            )}
            {mutation.isError && (
              <p className="text-rose-600 font-sans">Error: {mutation.error.message}</p>
            )}
            {mutation.isSuccess && (
              <pre className="whitespace-pre-wrap">
                {typeof mutation.data === 'object' 
                  ? JSON.stringify(mutation.data, null, 2) 
                  : mutation.data}
              </pre>
            )}
            {!mutation.isPending && !mutation.isError && !mutation.isSuccess && (
              <p className="text-slate-400 italic font-sans">Response data will appear here...</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-200/60 text-center text-xs text-slate-400 bg-white/50">
        Built with React, NodeJS, Express, and TailwindCSS. Powered by Google Gemini AI.
      </footer>
    </div>
  );
}