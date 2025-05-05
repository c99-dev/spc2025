import { useState, useCallback } from 'react';

const API_URL = 'http://localhost:5000/chat/stream';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (messageText) => {
      if (!messageText.trim()) return;

      setIsLoading(true);
      setError(null);
      const newUserMessage = { text: messageText, isUser: true };

      const currentMessages = messages;
      const apiMessages = currentMessages.map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text,
      }));
      apiMessages.push({ role: 'user', content: messageText });

      setMessages((prev) => [...prev, newUserMessage]);

      let botMessageId = null;

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: '서버 응답 오류' }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        if (!response.body) {
          throw new Error('응답 스트림이 없습니다.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk
            .split('\n')
            .filter((line) => line.startsWith('data: '));

          for (const line of lines) {
            try {
              const jsonString = line.slice(6);
              if (jsonString.trim() === '[DONE]') continue;

              const data = JSON.parse(jsonString);

              if (data.error) {
                setError(`스트림 오류: ${data.error}`);
                setIsLoading(false);
                return;
              }

              if (data.message) {
                setMessages((prev) => {
                  if (botMessageId === null) {
                    const lastMsg = prev[prev.length - 1];
                    if (lastMsg?.isUser || prev.length === 0) {
                      botMessageId = prev.length;
                    } else if (!lastMsg?.isUser) {
                      botMessageId = prev.length - 1;
                    }
                  }

                  const lastMessage = prev[prev.length - 1];
                  if (
                    lastMessage &&
                    !lastMessage.isUser &&
                    botMessageId === prev.length - 1
                  ) {
                    const updatedMessages = [...prev];
                    updatedMessages[prev.length - 1] = {
                      ...lastMessage,
                      text: lastMessage.text + data.message,
                    };
                    return updatedMessages;
                  } else if (botMessageId === prev.length) {
                    return [...prev, { text: data.message, isUser: false }];
                  } else {
                    return prev;
                  }
                });
              }
            } catch (e) {
              setError(`클라이언트 오류: ${e.message || '알 수 없는 오류'}`);
            }
          }
        }
      } catch (err) {
        setError(`클라이언트 오류: ${err.message || '알 수 없는 오류'}`);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, error, sendMessage };
}
