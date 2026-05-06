import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

/** Modelo padrão: 2.0 Flash-Lite foi descontinuado na API; ver documentação Google. */
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'GEMINI_API_KEY não configurada. Copie .env.example para .env e defina sua chave.',
        },
        { status: 500 }
      );
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    const modelId =
      process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Erro na API Gemini:', error);

    const message =
      error instanceof Error ? error.message : 'Erro interno do servidor';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}