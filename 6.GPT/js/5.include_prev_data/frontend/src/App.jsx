import React from 'react';
import { useChat } from './hooks/useChat';
import Header from './components/Header';
import MessageArea from './components/MessageArea';
import InputForm from './components/InputForm';

function App() {
  const { messages, isLoading, error, sendMessage } = useChat();

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-4xl mx-auto p-4 h-screen flex flex-col">
        <Header />
        {error && (
          <div className="my-2 p-3 bg-red-800/50 border border-red-700 text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}
        <MessageArea messages={messages} />
        <InputForm onSubmit={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
