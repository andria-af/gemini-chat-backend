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

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text ?? 'Sem resposta do modelo.';
    } catch (error) {
      console.error('Erro real do Gemini:', error);
      throw new InternalServerErrorException('Erro ao gerar resposta com Gemini');
    }
  }
}