import React, { useState } from 'react';
import { MessageCircle, X, Send, Bot, ShieldCheck, User } from 'lucide-react';
import { usePetStore } from '../context/PetStoreContext';

export const LiveChatDrawer: React.FC = () => {
  const { isChatOpen, setIsChatOpen } = usePetStore();
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'concierge'; text: string; time: string }>>([
    {
      sender: 'concierge',
      text: 'Welcome to YourPets Luxury Concierge. How may I assist you with pet health, breeder verification, or flight delivery today?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#002045] text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group"
        id="live-chat-floating-btn"
      >
        <MessageCircle className="w-6 h-6 text-emerald-400" />
        <span className="text-xs font-bold pr-1 hidden group-hover:inline">Concierge Support</span>
        <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute top-0 right-0"></span>
      </button>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryText = inputText.trim();
    if (!queryText) return;

    const userMsg = { sender: 'user' as const, text: queryText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/search-grounded-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await response.json();

      let answerText = data.answer || 'Thank you for reaching out! Our concierge team is standing by to assist you.';
      if (data.groundingChunks && data.groundingChunks.length > 0) {
        const sources = data.groundingChunks
          .filter((c: any) => c.web?.title && c.web?.uri)
          .slice(0, 2)
          .map((c: any) => `• ${c.web.title}`)
          .join('\n');
        if (sources) {
          answerText += `\n\n🔍 Live Grounded Web Sources:\n${sources}`;
        }
      }

      const conciergeMsg = {
        sender: 'concierge' as const,
        text: answerText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, conciergeMsg]);
    } catch (err) {
      const conciergeMsg = {
        sender: 'concierge' as const,
        text: `Thank you for reaching out! All pets on YourPets include certified health passports, 40-point vet exams, and climate-controlled flight delivery options.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, conciergeMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 w-full max-w-sm bg-white dark:bg-[#1a1c1e] rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col h-[480px] animate-fade-in">
      {/* Header */}
      <div className="p-4 bg-[#002045] text-white flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
            YP
          </div>
          <div>
            <h3 className="font-bold text-xs">YourPets Concierge</h3>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Licensed Vet Staff Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/13305161283"
            target="_blank"
            rel="noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors"
          >
            WhatsApp
          </a>
          <button onClick={() => setIsChatOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-surface-low dark:bg-surface-high text-xs">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] p-3 rounded-2xl ${
                m.sender === 'user'
                  ? 'bg-[#002045] text-white rounded-br-none'
                  : 'bg-white dark:bg-[#282c31] text-on-surface border border-outline-variant/30 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-on-surface-variant mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="text-[11px] text-on-surface-variant italic flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-emerald-600 animate-spin" /> Concierge typing response...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-[#1a1c1e] border-t border-outline-variant/30 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder=""
          className="flex-1 px-3 py-2 text-xs rounded-full border border-outline-variant bg-surface-low dark:bg-surface-high text-on-surface focus:outline-none"
        />
        <button
          type="submit"
          className="p-2.5 rounded-full bg-[#002045] text-white hover:bg-[#1a365d] transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
