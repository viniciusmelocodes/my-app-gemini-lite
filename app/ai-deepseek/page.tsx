'use client'

import { useState } from "react";

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export default function DeepSeek() {
  const [input, setInput] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) {
      setError('Por favor, insira uma mensagem');
      return;
    }

    setLoading(true);
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input
        }),
      });

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data: DeepSeekResponse = await res.json();
      
      if (data.choices && data.choices[0]) {
        setResponse(data.choices[0].message.content);
      } else {
        throw new Error('Resposta inválida da API');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido');
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
    setInput('');
    setResponse('');
    setError('');
  };

  const copyResponse = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(response);
      // Você pode adicionar um toast aqui se quiser
      alert('Resposta copiada!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
            Chat com DeepSeek
        </h1>

      <div className="mb-8">
        <textarea
          id="message-input"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua pergunta ou mensagem aqui... (Ctrl+Enter para enviar)"
          rows={6}
          className="w-full p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition-all"
          disabled={loading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Pressione Ctrl+Enter para enviar rapidamente
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Enviando...
            </div>
          ) : (
            'Enviar'
          )}
        </button>
        
        <button
          onClick={clearChat}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Limpar
        </button>
      </div>

      {/* Área de resposta */}
      {response && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Resposta do DeepSeek:
            </label>
            <button
              onClick={copyResponse}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              📋 Copiar
            </button>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px]">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}