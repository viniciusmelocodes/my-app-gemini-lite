'use client'

import { useState } from "react";

export default function GeminiLite() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setResponse('');

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error('Erro na requisição');
            }

            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Erro:', error);
            setResponse('Erro ao processar sua solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const clearChat = (): void => {
        setPrompt('');
        setResponse('');
    };

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">
                Chat com Gemini Lite
            </h1>

            <form onSubmit={handleSubmit} className="mb-8">
                <div className="flex flex-col gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Digite sua pergunta para o Gemini..."
                        className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        disabled={loading}
                    />

                    <div className="flex gap-4 mb-6">
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {loading ? 'Enviando...' : 'Enviar'}
                        </button>
                        <button
                            onClick={clearChat}
                            disabled={loading}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            Limpar
                        </button>
                    </div>
                </div>
            </form>

            {response && (
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Resposta do Gemini:
                    </h2>
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {response}
                    </div>
                </div>
            )}

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Gerando resposta...</span>
                </div>
            )}
        </div>
    );
}