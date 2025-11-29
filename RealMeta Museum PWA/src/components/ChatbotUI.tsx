// Artwork-scoped chatbot interface
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { sendChatMessage, trackEvent, getSessionId } from '../lib/mockServices';
import { ChatMessage } from '../lib/types';

interface ChatbotUIProps {
  artworkId: string;
  artworkTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotUI: React.FC<ChatbotUIProps> = ({ 
  artworkId, 
  artworkTitle, 
  isOpen, 
  onClose 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello! I'm your guide for "${artworkTitle}". Ask me anything about this artwork!`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Track chat query
    trackEvent({
      sessionId: getSessionId(),
      artworkId,
      event: 'chat_query',
      timestamp: new Date().toISOString()
    });

    try {
      const response = await sendChatMessage(
        getSessionId(),
        artworkId,
        userMessage.content,
        messages
      );

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.replyText,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'When was this created?',
    'What technique was used?',
    'Tell me about the artist',
    'What does it symbolize?',
    'Where is it located?'
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl sm:max-h-[80vh] h-[85vh] sm:h-auto flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D4A574]">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-5 h-5 text-[#8B4513]" />
            <div>
              <h3 className="text-[#2C2C2C]">Art Guide Chat</h3>
              <p className="text-sm text-[#6B6B6B]">{artworkTitle}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-[#6B6B6B] hover:text-[#2C2C2C]"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-[#8B4513] text-white'
                    : 'bg-[#FAF6F1] text-[#2C2C2C] border border-[#D4A574]'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-[#D4A574]' : 'text-[#6B6B6B]'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FAF6F1] rounded-lg p-3 border border-[#D4A574]">
                <Loader2 className="w-5 h-5 text-[#8B4513] animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-[#6B6B6B] mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#FAF6F1] text-[#8B4513] border border-[#D4A574] hover:bg-[#D4A574] hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#D4A574]">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this artwork..."
              disabled={isLoading}
              className="flex-1 border-[#D4A574] focus:border-[#8B4513]"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#8B4513] hover:bg-[#6D3410] text-white"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-[#6B6B6B] mt-2">
            This chatbot can only answer questions about the current artwork.
          </p>
        </form>
      </div>
    </div>
  );
};
