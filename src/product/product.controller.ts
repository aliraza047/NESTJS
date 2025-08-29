import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from './product.service';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod('ProductService', 'CreateProduct')
  async createProduct(data: {
    name: string;
    description: string;
    price: number;
    userId: string;
  }) {
    const product = await this.productService.createProduct(data);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      user: {
        id: product.user.id,
        name: product.user.name,
        email: product.user.email,
      },
    };
  }

  @GrpcMethod('ProductService', 'GetProduct')
  async getProduct(data: { id: string }) {
    const product = await this.productService.getProduct(data);

    if (!product) {
      return null;
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      user: {
        id: product.user.id,
        name: product.user.name,
        email: product.user.email,
      },
    };
  }
}
