import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { GeminiModule } from '../gemini/gemini.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [GeminiModule, WebsocketModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}