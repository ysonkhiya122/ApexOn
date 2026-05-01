import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleChat, addMessage } from '../../store/slices/chatSlice';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

export const ChatDock: React.FC = () => {
  const dispatch = useDispatch();
  const { chatOpen, messages } = useSelector((state: RootState) => state.chat);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpen) scrollToBottom();
  }, [messages, chatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Math.random().toString(),
      sender: 'user' as const,
      text: inputText,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMsg));
    setInputText('');

    // Trigger AI response
    setTimeout(() => {
      const lowerQuery = userMsg.text.toLowerCase();
      let reply = "That's an interesting F1 query! I'll map this into the performance logs. Feel free to ask about drivers, podium criteria, or tire flags.";

      if (lowerQuery.includes('point') || lowerQuery.includes('points')) {
        reply = 'Drivers in the Top 10 earn points (25, 18, 15, 12, 10, 8, 6, 4, 2, 1). Fastest lap scores 1 bonus point if the driver places in the top 10.';
      } else if (lowerQuery.includes('tire') || lowerQuery.includes('tire')) {
        reply = 'Teams choose from Hard (C1-C2), Medium (C3), or Soft (C4-C5) compounds. Each car must mount at least two unique configurations during full dry sessions.';
      } else if (lowerQuery.includes('who') && lowerQuery.includes('champion')) {
        reply = 'Lewis Hamilton and Michael Schumacher hold the elite record with 7 World Driver Championships each.';
      }

      dispatch(
        addMessage({
          id: Math.random().toString(),
          sender: 'assistant' as const,
          text: reply,
          timestamp: new Date().toISOString(),
        })
      );
    }, 1200);
  };

  return (
    <>
      {/* Floating trigger button */}
      {!chatOpen && (
        <button
          onClick={() => dispatch(toggleChat())}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl hover:bg-red-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <MessageSquare size={24} />
        </button>
      )}

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex h-[450px] w-80 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-950 px-4 py-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="text-red-500 animate-pulse" size={18} />
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-100">Apexon AI</span>
            </div>
            <button
              onClick={() => dispatch(toggleChat())}
              className="text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3.5 py-2 text-sm leading-relaxed ${
                      isUser
                        ? 'bg-red-600 text-slate-100 rounded-br-none'
                        : 'bg-slate-800 text-slate-300 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="flex gap-2 p-3 bg-slate-950 border-t border-slate-800">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Apexon F1 AI..."
              className="flex-1 h-9 bg-slate-900 border border-slate-800 rounded px-3 text-sm text-slate-100 placeholder-slate-500 focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
