import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, MapPin, Phone, HelpCircle } from 'lucide-react';
import { ChatMessage, StoreInfo } from '../types';

interface AICustomerBotProps {
  isOpen: boolean;
  onClose: () => void;
  storeInfo: StoreInfo;
}

export const AICustomerBot: React.FC<AICustomerBotProps> = ({
  isOpen,
  onClose,
  storeInfo
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I am the VD PAPER PLATES AI Customer Support Assistant. 
I can help you with our paper plates catalog, wholesale prices (Plate 1-3: ₹1.90, Plate 4: ₹1.85, Plate 5: ₹1.80, Plate 6: ₹0.90), our 400-plate minimum order policy, 3-day advance booking rule, 20% advance transfer guidelines (PhonePe scanner / SBI Barri Jayanth), or directions to our Kotturu factory!

How can I help you today?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "Thank you for contacting VD PAPER PLATES. Please WhatsApp our support at 9182879375 or call 7382468841 for immediate assistance.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: `VD PAPER PLATES Quick Info:
• Factory Location: Kotturu mandal, metturu bit-2 road 4 opposite.
• Support Contacts: 9182879375 (WhatsApp & Call), 7382468841 (Call only).
• Order Notice Policy: Minimum 400 plates, must order at least 3 days in advance.
• Payment: 20% advance via PhonePe QR scanner or SBI bank transfer (Holder: Barri Jayanth, Acc: 38621595047, IFSC: SBIN0006636, UPI: barrijayanth@ybl). Upload screenshot in app.
• Prices: Plate 1 (₹1.90), Plate 2 (₹1.90), Plate 3 (₹1.90), Plate 4 (₹1.85), Plate 5 (₹1.80), Plate 6 (₹0.90).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    'Show all plate prices',
    'Where is your shop in Kotturu?',
    'What are the support contact numbers?',
    'Explain the 3-day advance rule',
    'How do I pay 20% advance?'
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-88 max-h-[620px] h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6">
      {/* Bot Header matching Design HTML */}
      <div className="bg-slate-800 text-white p-4 rounded-t-2xl flex justify-between items-center border-b border-slate-700 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
          <div>
            <span className="text-sm font-semibold tracking-tight">VD AI Assistant</span>
            <span className="text-[10px] text-slate-400 block font-normal">Kotturu Factory Support</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700/60 cursor-pointer"
          title="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages list matching Design HTML */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-[13px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-xl leading-relaxed whitespace-pre-line text-slate-900 ${
                msg.sender === 'user'
                  ? 'bg-amber-100 rounded-tr-none ml-8 text-right border border-amber-200/70 shadow-2xs'
                  : 'bg-slate-200 rounded-tl-none mr-8 text-left border border-slate-300/50 shadow-2xs'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-slate-200/70 p-2.5 rounded-xl rounded-tl-none mr-8">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>VD AI is preparing answer...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-amber-400 shrink-0 font-medium transition-colors cursor-pointer shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input bar matching Design HTML */}
      <div className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2">
        <input
          id="chat-input-field"
          type="text"
          placeholder="Ask about orders, prices, policy..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 text-sm bg-slate-100 border-none rounded-full px-4 py-2 outline-none text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500"
        />
        <button
          id="chat-send-btn"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 rounded-full text-white cursor-pointer transition-colors shadow-xs shrink-0"
          title="Send message"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};
