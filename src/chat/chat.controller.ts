import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CurrentUser } from 'src/shared/decorator/get-current-user-id.decorator';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  async getUserChats(@CurrentUser('userId') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Get('messages/:chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getChatMessages(chatId);
  }
}
