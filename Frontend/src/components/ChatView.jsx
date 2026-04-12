import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { Send, Bot, User } from 'lucide-react';

export default function ChatView({ userId, financials }) {
  const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Hello! I am your AI Financial Coach. How can I help you regarding your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
      e.preventDefault();
      if (!input.trim() || loading) return;

      const userMsg = input.trim();
      setInput('');
      setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
      setLoading(true);

      try {
          const response = await sendChatMessage(userId, userMsg, financials);
          setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } catch (error) {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI.' }]);
      }
      setLoading(false);
  };

  return (
    <div className="card-fintech h-[calc(100vh-140px)] flex flex-col p-0 overflow-hidden">
        <div className="bg-fintech-blue p-4 text-white flex items-center shadow-md z-10">
            <Bot className="w-6 h-6 mr-3" />
            <div>
                <h3 className="font-semibold">Gemini Financial Coach</h3>
                <p className="text-xs text-blue-200">Powered by Vertex AI</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 no-scrollbar">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${msg.role === 'user' ? 'bg-fintech-blue text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </div>
            ))}
            {loading && (
                <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm rounded-tl-sm flex space-x-1.5 items-center">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your budget, savings..." 
                  className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-fintech-blue transition placeholder-slate-400"
                />
                <button 
                  type="submit" 
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-fintech-blue text-white p-2 text-sm rounded-full hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center w-8 h-8">
                    <Send className="w-4 h-4 ml-0.5" />
                </button>
            </form>
        </div>
    </div>
  );
}
