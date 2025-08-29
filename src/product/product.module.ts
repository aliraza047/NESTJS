import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/grpc-client.options';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductResolver],
})
export class ProductModule {}
