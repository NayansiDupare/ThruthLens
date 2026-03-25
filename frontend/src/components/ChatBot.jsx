import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ChatBot({ articleContext, analysisResults }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);

  const predefinedQuestions = [
    "Why is this fake?",
    "What are the red flags?",
    "Find me the real version of this",
    "Should I share this?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { role: 'assistant', content: 'Hello! I am TruthLens AI. How can I help you understand this analysis?' }
      ]);
    }
    scrollToBottom();
  }, [isOpen, messages]);

  const connectWebSocket = (onOpenCallback = null) => {
    const wsUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('http', 'ws') + '/api/chat/ws'
      : 'ws://localhost:8000/api/chat/ws';
    
    const ws = new WebSocket(wsUrl);
    
    if (onOpenCallback) {
       ws.onopen = () => onOpenCallback(ws);
    }
    
    ws.onmessage = (event) => {
      const data = event.data;
      if (data === "[DONE]") {
        setIsTyping(false);
        setMessages(prev => {
           const newMsg = [...prev];
           const last = newMsg[newMsg.length - 1];
           if (last && last.role === 'assistant') {
              last.isStreaming = false;
           }
           return newMsg;
        });
      } else {
        setIsTyping(false);
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          // If the last message is an actively streaming assistant message, append to it
          if (lastMsg && lastMsg.role === 'assistant' && lastMsg.isStreaming) {
             lastMsg.content += data;
          } else {
             // Otherwise create a new streaming assistant message
             newMessages.push({ role: 'assistant', content: data, isStreaming: true });
          }
          return newMessages;
        });
      }
    };

    wsRef.current = ws;
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
         wsRef.current.close();
      }
    };
  }, []);

  const handleSend = async (textMessage = input) => {
    if (!textMessage.trim()) return;
    
    const userMsg = { role: 'user', content: textMessage, isStreaming: false };
    setMessages(prev => {
       // Stop any ongoing streams before adding new user message
       const history = prev.map(m => ({...m, isStreaming: false}));
       return [...history, userMsg];
    });
    setInput('');
    setIsTyping(true);

    const pushPayload = (activeWs) => {
      activeWs.send(JSON.stringify({
        message: textMessage,
        article_context: articleContext || "Context unavailable",
        analysis_results: analysisResults || {},
        chat_history: messages.map(m => ({ role: m.role, content: m.content }))
      }));
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      pushPayload(wsRef.current);
    } else {
      // Attempt auto-reconnect reliably via onopen
      connectWebSocket((newWs) => {
         pushPayload(newWs);
      });
      
      setTimeout(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          setMessages(prev => {
            if (prev.length > 0 && prev[prev.length - 1].content === 'Connection permanently lost. Please refresh the page.') return prev;
            return [...prev, { role: 'assistant', content: 'Connection permanently lost. Please refresh the page.' }];
          });
          setIsTyping(false);
        }
      }, 5000); // Give it a full 5 seconds to wake up
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`${isOpen ? 'hidden' : 'flex'} fixed bottom-6 right-6 p-4 rounded-full bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/30 transition-all z-50 items-center justify-center`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 h-[32rem] bg-darkCard border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-darkBg border-b border-slate-700 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-grotesk font-bold">TruthLens AI</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-textMuted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-900/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary' : 'bg-slate-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-primary" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[75%] text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-textMain rounded-tl-none border border-slate-700'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex gap-3">
               <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                 <Bot className="w-4 h-4 text-primary" />
               </div>
               <div className="p-3 rounded-2xl bg-slate-800 rounded-tl-none border border-slate-700 flex items-center gap-2">
                 <Loader2 className="w-4 h-4 text-textMuted animate-spin" />
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Suggested Qs */}
        <div className="p-4 bg-darkBg border-t border-slate-700 rounded-b-2xl">
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSend(q)} className="text-xs bg-slate-800 hover:bg-slate-700 text-textMuted hover:text-white px-3 py-1.5 rounded-full border border-slate-700 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about this article..."
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-textMain focus:outline-none focus:border-primary"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="absolute right-2 p-1.5 bg-primary rounded-full text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
