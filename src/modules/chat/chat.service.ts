import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: 'user',
        content: dto.content.trim(),
      },
    });

    const assistantText = await this.geminiService.generateResponse(
      dto.content.trim(),
    );

    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: 'assistant',
        content: assistantText,
      },
    });

    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        updatedAt: new Date(),
        title:
          conversation.title === 'Nova conversa'
            ? dto.content.trim().slice(0, 40)
            : conversation.title,
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }
}