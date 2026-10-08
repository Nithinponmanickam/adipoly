import React, { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { MessageSquare, Send } from 'lucide-react';

export const ChatPanel: React.FC = () => {
  const { chatMessages, sendChatMessage, roomState } = useGameStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isChatEnabled = roomState?.settings.rules.chatEnabled ?? true;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !isChatEnabled) return;
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-background border-4 border-border shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
      {/* Header */}
      <div className="p-4 border-b-4 border-border bg-surface flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 stroke-[3] text-primary" />
          <h3 className="font-display font-black text-xl uppercase tracking-widest text-text">Lobby Chat</h3>
        </div>
        <span className="font-bold text-sm text-muted">
          {chatMessages.length} msg
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted font-bold p-6">
            <MessageSquare className="w-8 h-8 mb-4 stroke-[3] text-primary" />
            <p className="uppercase tracking-widest text-lg">Empty Chat</p>
            <p className="mt-2 text-sm">Coordinate match rules and say hi!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            if (msg.isSystem) {
              return (
                <div key={msg.id} className="text-center my-4">
                  <span className="inline-block font-bold text-xs uppercase tracking-wider bg-black text-white px-3 py-1 border-2 border-border">
                    {msg.text}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-1">
                  <span
                    className="font-display font-bold text-sm tracking-wide"
                    style={{ color: msg.senderColor || 'var(--color-primary)' }}
                  >
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] font-bold text-muted">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <div className="font-bold text-sm text-text bg-white border-2 border-border shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] px-4 py-2 w-fit max-w-[95%] break-words">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t-4 border-border bg-surface flex items-center gap-3 shrink-0"
      >
        <input
          type="text"
          maxLength={200}
          disabled={!isChatEnabled}
          placeholder={isChatEnabled ? 'Type something loud...' : 'Chat disabled'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-white border-4 border-border focus:outline-none focus:ring-4 focus:ring-primary px-4 py-3 font-bold text-text placeholder:text-muted disabled:opacity-50 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || !isChatEnabled}
          className="bg-primary text-black border-4 border-border shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] px-4 py-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
        >
          <Send className="w-5 h-5 stroke-[3]" />
        </button>
      </form>
    </div>
  );
};
