import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, CalendarCheck, User, ArrowRight } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      role: 'model', 
      text: '👋 Bonjour ! Je suis l\'assistant du Parquet Parisien.\n\nJe peux vous aider à :\n1️⃣ Visualiser votre sol rénové\n2️⃣ Calculer votre prix en 60s\n3️⃣ Réserver une visite gratuite', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await sendChatMessage(history, userMsg.text);

    const modelMsg: ChatMessage = { 
      id: (Date.now() + 1).toString(), 
      role: 'model', 
      text: responseText || "Désolé, je n'ai pas compris.", 
      timestamp: new Date() 
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleQuickReply = (text: string) => {
      handleSend(text);
  };

  const isBookingConfirmation = (text: string) => text.toLowerCase().includes("rendez-vous confirmé") || text.toLowerCase().includes("sms de confirmation");

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-[60] flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[380px] h-[550px] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col mb-4 overflow-hidden border border-gray-200 animate-slide-up origin-bottom-right">
          {/* Header */}
          <div className="bg-brand-dark p-4 flex justify-between items-center text-white border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative border border-white/20">
                <Sparkles size={18} className="text-action-orange" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-brand-dark rounded-full animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide">Assistant Expert</h4>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Le Parquet Parisien • IA</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-full hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="text-center text-xs text-gray-400 my-4 uppercase tracking-widest font-bold opacity-50">Aujourd'hui</div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
                    <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-auto mb-1 ${msg.role === 'user' ? 'bg-gray-200 text-gray-500' : 'bg-brand-dark text-action-orange'}`}>
                        {msg.role === 'user' ? <User size={12} /> : <Sparkles size={12} />}
                    </div>
                    <div className={`p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                    msg.role === 'user' 
                        ? 'bg-action-orange text-white rounded-br-none' 
                        : 'bg-white text-brand-dark border border-gray-100 rounded-bl-none'
                    }`}>
                        {msg.text.split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
                        {msg.role === 'model' && isBookingConfirmation(msg.text) && (
                            <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-3 flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full text-green-600">
                                    <CalendarCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-green-800 text-xs uppercase">Réservation Validée</p>
                                    <p className="text-green-700 text-xs">Un expert vous contactera.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </div>
            ))}
            
            {!isLoading && messages[messages.length - 1].role === 'model' && messages.length < 3 && (
                <div className="flex flex-col gap-2 ml-9">
                    <button onClick={() => handleQuickReply("Combien coûte une rénovation ?")} className="text-left text-xs bg-white border border-gray-200 hover:bg-gray-50 hover:border-action-orange text-brand-dark px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-2 w-fit">
                        💰 Calculer mon prix <ArrowRight size={12} className="opacity-50" />
                    </button>
                    <button onClick={() => handleQuickReply("Je veux réserver une visite.")} className="text-left text-xs bg-white border border-gray-200 hover:bg-gray-50 hover:border-action-orange text-brand-dark px-4 py-2 rounded-full shadow-sm transition-all flex items-center gap-2 w-fit">
                        📅 Réserver visite gratuite <ArrowRight size={12} className="opacity-50" />
                    </button>
                </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-9 animate-pulse">
                 <Sparkles size={12} /> L'expert écrit...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2 items-center bg-gray-100 rounded-full px-4 py-1.5 border border-transparent focus-within:border-action-orange/50 focus-within:bg-white transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Message..."
                className="flex-1 bg-transparent border-0 py-2 text-sm text-brand-dark placeholder:text-gray-400 focus:ring-0 outline-none"
              />
              <button 
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isLoading}
                className="bg-brand-dark hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-90"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compact Circular Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_10px_30px_rgba(249,115,22,0.4)] transition-all hover:-translate-y-1 bg-action-orange hover:bg-action-hover border-2 border-white"
        aria-label="Ouvrir le chat"
      >
        {isOpen ? (
            <X size={24} className="text-white" />
        ) : (
            <>
                <MessageCircle size={28} className="text-white" />
                <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500 border-2 border-brand-dark"></span>
                </span>
            </>
        )}
      </button>
    </div>
  );
};

export default Chatbot;