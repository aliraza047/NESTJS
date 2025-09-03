import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    userId: string;
  }) {
    return await this.prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        userId: data.userId,
      },
      include: {
        user: true,
      },
    });
  }

  async getProduct(data: { id: string }) {
    return await this.prisma.product.findUnique({
      where: { id: data.id },
      include: { user: true },
    });
  }

  // For server streaming: fetch multiple products by userId
  async streamProductsByUser(userId: string) {
    return this.prisma.product.findMany({
      where: { userId },
      include: { user: true },
    });
  }
}
