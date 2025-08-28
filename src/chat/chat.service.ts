import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseUtil } from 'src/shared/utility/response';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // Get chats of a user with last message
  async getUserChats(userId: string) {
    const userChats = await this.prisma.userChat.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            userChats: {
              include: { user: true },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: {
        chat: {
          updatedAt: 'desc',
        },
      },
    });

    const resp = userChats.map((uc) => {
      const chat = uc.chat;
      return {
        chatId: chat.id,
        users: chat.userChats.map((u) => ({
          id: u.user.id,
          email: u.user.email,
          name: u.user.name,
        })),
        lastMessage: chat.messages[0] || null,
      };
    });

    return ResponseUtil.success('Chat fetched successfully!', resp);
  }

  // Get all messages in a chat
  async getChatMessages(chatId: string) {
    const messages = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });

    return ResponseUtil.success('Message fetched successfully!', messages);
  }

  // Send message (create chat if needed)
  async sendMessage(senderId: string, receiverId: string, content: string) {
    // Find existing chat between sender and receiver
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          { userChats: { some: { userId: senderId } } },
          { userChats: { some: { userId: receiverId } } },
        ],
      },
      include: { userChats: true },
    });

    let chat: any = existingChat;

    if (!chat) {
      // Create new chat and link users
      chat = await this.prisma.chat.create({
        data: {
          userChats: {
            create: [{ userId: senderId }, { userId: receiverId }],
          },
        },
      });
    }

    // Create message
    const message = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        senderId,
        content,
      },
    });

    // Update chat updatedAt
    await this.prisma.chat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    return { chatId: chat.id, message };
  }
}
