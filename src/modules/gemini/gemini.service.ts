import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY não configurada');
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateResponse(prompt: string, history: string): Promise<string> {
    try {
      const finalPrompt = `
Você é um assistente útil, claro e objetivo.
Responda sempre em português do Brasil.
Considere o histórico da conversa para entender o contexto da pergunta atual.

Regras de formatação:
- Não use Markdown
- Não use asteriscos
- Não use hashtags
- Não use listas com símbolos como *, -, ou #
- Responda em texto limpo e bem organizado

Histórico da conversa:
${history}

Nova mensagem do usuário:
${prompt}

Responda considerando o contexto completo da conversa.
`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: finalPrompt,
      });

      return response.text ?? 'Sem resposta do modelo.';
    } catch (error) {
      console.error('Erro real do Gemini:', error);
      throw new InternalServerErrorException(
        'Erro ao gerar resposta com Gemini',
      );
    }
  }
}