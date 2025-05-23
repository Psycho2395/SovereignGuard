
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Mic, MicOff, Brain, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI Security Assistant. I can help you with threat analysis, security recommendations, and identity management. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Check my security status',
        'Analyze recent threats',
        'Generate security report',
        'Explain zero-knowledge proofs'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const aiResponses = [
    'Based on my analysis, your current security posture is excellent with a low risk score of 15%.',
    'I\'ve detected some unusual activity patterns. Let me run a comprehensive scan for you.',
    'Your zero-knowledge proofs are working perfectly. All credentials verified without exposing personal data.',
    'I recommend enabling multi-factor authentication for enhanced security.',
    'The blockchain network is operating normally with 99.9% uptime.',
    'Your DID is secure and quantum-resistant. No threats detected in the last 24 hours.',
    'I can help you generate new ZKP credentials. Which type would you like to create?',
    'Security tip: Regular credential rotation enhances your privacy protection.'
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
      timestamp: new Date(),
      suggestions: Math.random() > 0.5 ? [
        'Tell me more',
        'Run security scan',
        'Generate report',
        'What else?'
      ] : undefined
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputValue('Check my security status');
      }, 3000);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">AI Security Assistant</h3>
            <p className="text-sm text-blue-100">Powered by GPT-4 & Machine Learning</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <Brain className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg' 
                  : 'bg-gray-100 text-gray-800 rounded-r-lg rounded-tl-lg'
              } p-3`}>
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
                
                {message.suggestions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-r-lg rounded-tl-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about security, threats, or identity..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceToggle}
            className={isListening ? 'text-red-500' : 'text-gray-500'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Button onClick={() => handleSendMessage(inputValue)} disabled={!inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening...
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
