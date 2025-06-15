interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function POST(request: Request) {
  try {
    const { 
      messages, 
      model = 'gpt-3.5-turbo', 
      temperature = 0.7,
      max_tokens = 1000 
    }: OpenAIRequest = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: 'Mensagens são obrigatórias' }, { status: 400 });
    }

    if (!process.env.CHATGPT_API_KEY) {
      return Response.json({ error: 'OpenAI API Key não configurada' }, { status: 500 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CHATGPT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Erro da OpenAI API:', errorData);
      
      if (response.status === 401) {
        return Response.json({ error: 'API Key inválida' }, { status: 401 });
      }
      if (response.status === 429) {
        return Response.json({ error: 'Limite de requisições excedido' }, { status: 429 });
      }
      if (response.status === 400) {
        return Response.json({ error: 'Requisição inválida' }, { status: 400 });
      }
      
      return Response.json({ 
        error: `Erro da OpenAI API: ${response.statusText}` 
      }, { status: response.status });
    }

    const data: OpenAIResponse = await response.json();
    
    // Log para debug (remova em produção)
    console.log('Tokens usados:', data.usage);
    
    return Response.json(data);

  } catch (error) {
    console.error('Erro interno:', error);
    return Response.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}