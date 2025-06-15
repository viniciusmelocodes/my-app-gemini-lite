interface DeepSeekRequest {
  message: string;
}

interface DeepSeekAPIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
  }>;
}

export async function POST(request: Request) {
  try {
    const { message }: DeepSeekRequest = await request.json();

    if (!message || !message.trim()) {
      return Response.json({ error: 'Mensagem é obrigatória' }, { status: 400 });
    }

    if (!process.env.DEEPSEEK_API_KEY) {
      return Response.json({ error: 'API Key não configurada' }, { status: 500 });
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: message
          }
        ],
        stream: false,
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da API DeepSeek:', errorText);
      return Response.json({ 
        error: `Erro da API DeepSeek: ${response.statusText}` 
      }, { status: response.status });
    }

    const data: DeepSeekAPIResponse = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error('Erro interno:', error);
    return Response.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 });
  }
}