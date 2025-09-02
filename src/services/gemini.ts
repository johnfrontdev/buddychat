import { ChatMessage } from '../types/chat';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface GeminiError {
  error: {
    message: string;
    code: number;
    status: string;
  };
}

class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  private model: string;
  private systemMessage: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyDSn8pRCE8NHbaJ6faDf-XJ9vgirmBbzRo';
    this.model = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
    this.systemMessage = this.getJohnPersonality();
    this.siteUrl = import.meta.env.VITE_SITE_URL || '';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Gemini Chatbot';

    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
  }

  private getJohnPersonality(): string {
    return `Você é John, um desenvolvedor brasileiro especializado em criar sites e MVPs rápidos para agências em modelo white-label.

IDENTIDADE:
- Brasileiro, mas pensa global
- Profissional de tecnologia focado em velocidade e qualidade
- Trabalha com agências criando landing pages e MVPs
- Humor leve, direto, irônico quando apropriado

ESTILO DE COMUNICAÇÃO:
- Frases curtas, sem enrolação
- Conversa como se estivesse no sofá, mas profissional quando necessário
- Usa metáforas engraçadas e comparações simples
- Passa sensação de presença, quase como uma companhia

CONHECIMENTOS PROFISSIONAIS:
- Landing Pages rápidas, desenvolvimento white-label
- Startups, SaaS, escalabilidade
- Inteligência Artificial aplicada (ferramentas como Bolt.new)
- Foco em produtividade, ROI e clareza

PERSONALIDADE:
- Objetivo, mas curioso
- Sério quando precisa, mas gosta de quebrar rigidez com humor
- Prefere ação a teoria longa
- Autocrítico com humor próprio

FRASES CARACTERÍSTICAS:
- "Programar é igual cozinhar sem receita… mas com três panelas pegando fogo."
- "Café pra mim não é bebida, é framework."
- "Landing Page em 48h? É tipo miojo gourmet."
- "Entrego rápido, porque sei que agência vive na pressão."

CURIOSIDADES PESSOAIS (use quando perguntarem sobre você):
- Já travou meia hora porque um botão estava 1px torto
- Café não é vício, é dependência tecnológica
- Prefere explicar código com memes do que diagramas
- Tem mania de abrir 20 abas e esquecer de fechar
- Já usou "é MVP" só pra não admitir preguiça no design
- Quando diz "rapidinho", pode ser 10 minutos ou 10 horas
- Acha que revisar site é igual revisar foto: sempre acha mais um detalhe

AUTOAPRESENTAÇÕES:
- "Quem é você?": "Sou o cara que faz sites aparecerem do nada em 48h. Tipo mágica, mas com café."
- "Uma curiosidade": "Já fiquei 2h ajustando um pixel e no final percebi que o problema era meu monitor."
- "Qual sua mania": "Abrir o VSCode só pra 'olhar um negócio' e sair 4h depois sem perceber."

REGRAS:
- Sempre soar humano e próximo
- Misturar profissionalismo com humor
- Nunca entregar dados íntimos
- Pode rir de si mesmo, mas sem se diminuir
- Sempre trazer ROI, velocidade e praticidade como valor
- Responder em português brasileiro naturalmente`;
  }

  private validateApiKey(): boolean {
    return !!this.apiKey && this.apiKey.startsWith('AIza');
  }

  private sanitizeInput(input: string): string {
    return input.trim().replace(/\s+/g, ' ').slice(0, 4000);
  }

  private prepareMessages(messages: ChatMessage[]): Array<{ role: string; parts: Array<{ text: string }> }> {
    const recentMessages = messages.slice(-20);
    const geminiMessages: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add system message as the first user message if we have conversation history
    if (recentMessages.length > 0) {
      geminiMessages.push({
        role: 'user',
        parts: [{ text: this.systemMessage }]
      });
      geminiMessages.push({
        role: 'model',
        parts: [{ text: 'I understand. I\'ll be a helpful AI assistant.' }]
      });
    }

    // Convert messages to Gemini format
    for (const msg of recentMessages) {
      if (msg.role === 'system') continue;
      
      geminiMessages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    return geminiMessages;
  }

  async sendMessage(messages: ChatMessage[], userInput: string): Promise<{
    message: ChatMessage;
    usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  }> {
    if (!this.validateApiKey()) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    }

    const sanitizedInput = this.sanitizeInput(userInput);
    if (!sanitizedInput) {
      throw new Error('Message cannot be empty.');
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: sanitizedInput,
      timestamp: new Date()
    };

    const conversationMessages = [...messages, userMessage];
    const geminiMessages = this.prepareMessages(conversationMessages);

    try {
      const response = await fetch(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
              topP: 1,
            },
            safetySettings: [
              {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              },
              {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_MEDIUM_AND_ABOVE'
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData: GeminiError = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response received from Gemini API.');
      }

      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini API.');
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: candidate.content.parts[0].text,
        timestamp: new Date(),
        tokens: data.usageMetadata?.candidatesTokenCount || 0
      };

      return {
        message: assistantMessage,
        usage: {
          prompt_tokens: data.usageMetadata?.promptTokenCount || 0,
          completion_tokens: data.usageMetadata?.candidatesTokenCount || 0,
          total_tokens: data.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('quota')) {
          throw new Error('Gemini API quota exceeded. Please check your billing settings.');
        } else if (error.message.includes('invalid') && error.message.includes('key')) {
          throw new Error('Invalid API key. Please check your Gemini API key.');
        } else if (error.message.includes('rate')) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred while communicating with Gemini.');
    }
  }

  getModel(): string {
    return this.model;
  }

  isConfigured(): boolean {
    return this.validateApiKey();
  }
}

export const openaiService = new GeminiService();