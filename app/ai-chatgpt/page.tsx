'use client'

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export default function ChatGPT() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) {
      setError('Por favor, insira uma mensagem');
      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setInput('');

    try {
      const res = await fetch('/api/chatgpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data: OpenAIResponse = await res.json();
      
      if (data.choices && data.choices[0]) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.choices[0].message.content,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Resposta inválida da API');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
      // Remove a mensagem do usuário se houve erro
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = (): void => {
    setMessages([]);
    setInput('');
    setError('');
  };

  const copyMessage = async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      // Você pode adicionar um toast aqui
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Chat com ChatGPT
      </h1>

      {/* Área de conversas */}
      <div className="mb-6 h-96 overflow-y-auto bg-gray-50 rounded-lg p-4 border">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">💬</div>
              <p>Inicie uma conversa com o ChatGPT!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg relative group ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Botão copiar */}
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-black bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
            
            {/* Indicador de loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>ChatGPT está digitando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Exibir erro se houver */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Área de input */}
      <div className="mb-4">
        <div className="flex flex-col space-y-2">
          <textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem... (Ctrl+Enter para enviar)"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all"
            disabled={loading}
          />
          
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Ctrl+Enter para enviar • {input.length} caracteres
            </p>
            
            <div className="flex gap-4 mb-6">              
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}          
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
              <button
                onClick={clearChat}
                disabled={loading || messages.length === 0}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}