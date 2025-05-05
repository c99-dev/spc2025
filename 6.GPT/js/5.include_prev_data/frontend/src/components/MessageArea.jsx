import React, { useEffect, useRef } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import MessageBubble from './MessageBubble';

function MessageArea({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <ScrollArea.Root className="flex-1 mb-4 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur-sm overflow-hidden">
      <ScrollArea.Viewport ref={scrollRef} className="h-full w-full p-4">
        <div className="space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>아직 대화가 없습니다.</p>
              <p className="text-sm">메시지를 입력하여 대화를 시작하세요.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="flex select-none touch-none p-0.5 bg-gray-800/50 transition-colors duration-150 ease-out hover:bg-gray-700/50 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2.5"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="flex-1 bg-gray-600/50 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

export default MessageArea;
