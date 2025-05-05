import React from 'react';

function MessageBubble({ message }) {
  const { text, isUser } = message;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-gray-700/60 hover:bg-gray-700/80 border border-gray-600/50'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {text}
        </p>
      </div>
    </div>
  );
}

export default MessageBubble;
