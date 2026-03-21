import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';
import { SendMessageDto } from './dto/send-message.dto';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversa não encontrada');
    }

    const trimmedContent = dto.content.trim();

    const userMessage = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: 'user',
        content: trimmedContent,
      },
    });

    this.websocketGateway.emitToConversation(
      dto.conversationId,
      'messageCreated',
      {
        message: userMessage,
      },
    );

    this.websocketGateway.emitToConversation(
      dto.conversationId,
      'assistantTyping',
      {
        conversationId: dto.conversationId,
        status: true,
      },
    );

    const conversationMessages = await this.prisma.message.findMany({
      where: { conversationId: dto.conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const history = conversationMessages
      .map((message) => {
        const role = message.role === 'user' ? 'Usuário' : 'Assistente';
        return `${role}: ${message.content}`;
      })
      .join('\n');

    const assistantText = await this.geminiService.generateResponse(
      trimmedContent,
      history,
    );

    const assistantMessage = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        role: 'assistant',
        content: assistantText,
      },
    });

    this.websocketGateway.emitToConversation(
      dto.conversationId,
      'assistantTyping',
      {
        conversationId: dto.conversationId,
        status: false,
      },
    );

    this.websocketGateway.emitToConversation(
      dto.conversationId,
      'messageCreated',
      {
        message: assistantMessage,
      },
    );

    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: {
        updatedAt: new Date(),
        title:
          conversation.title === 'Nova conversa'
            ? trimmedContent.slice(0, 40)
            : conversation.title,
      },
    });

    return {
      userMessage,
      assistantMessage,
    };
  }
}
