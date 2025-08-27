import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(private readonly chatService: ChatService) {}

  // When client connects, register them as online
  handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      this.server.emit('userOnline', userId);
    }
  }

  // When client disconnects, remove from online users
  handleDisconnect(@ConnectedSocket() client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        this.server.emit('userOffline', userId);
        break;
      }
    }
  }

  // Listen for sendMessage event from client
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    data: {
      senderId: string;
      receiverId: string;
      content: string;
    },
  ) {
    const { senderId, receiverId, content } = data;

    // Save message via chat service (creates chat if none exists)
    const { chatId, message } = await this.chatService.sendMessage(
      senderId,
      receiverId,
      content,
    );

    // Emit newMessage event to receiver if online
    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('newMessage', { chatId, message });
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody()
    data: {
      chatId: string;
      senderId: string;
      receiverId: string;
    },
  ) {
    const { chatId, senderId, receiverId } = data;

    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('typing', { chatId, senderId });
    }
  }

  @SubscribeMessage('stopTyping')
  handleStopTyping(
    @MessageBody()
    data: {
      chatId: string;
      senderId: string;
      receiverId: string;
    },
  ) {
    const { chatId, senderId, receiverId } = data;

    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('stopTyping', { chatId, senderId });
    }
  }
}
