import { Injectable } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
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
    });
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: { id: string }) {
    return await this.prisma.product.findUnique({
      where: { id: data.id },
      include: { user: true },
    });
  }
}
