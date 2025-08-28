import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { AppModule } from 'src/app.module';

describe('ProductService (e2e)', () => {
  let app: INestApplication;
  let clientGrpc: ClientGrpc;
  let productService: any;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule, // Import your full module with ProductService provider
        ClientsModule.register([
          {
            name: 'PRODUCT_PACKAGE',
            transport: Transport.GRPC,
            options: {
              package: 'product',
              protoPath: join(
                '/home/zapta/Desktop/NestJS/my-project',
                'proto/product.proto',
              ),
              url: 'localhost:50052',
            },
          },
        ]),
      ],
    }).compile();

    app = module.createNestApplication();

    // Connect microservice and start it
    app.connectMicroservice({
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: join(__dirname, '../../proto/product.proto'),
        url: 'localhost:50052',
      },
    });

    await app.startAllMicroservices();
    await app.init();

    clientGrpc = app.get<ClientGrpc>('PRODUCT_PACKAGE');
    productService = clientGrpc.getService('ProductService');
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create product', async () => {
    const product = await productService
      .createProduct({
        name: 'Test Product',
        description: 'desc',
        price: 9.99,
        userId: '6880b75c2e5734cfe06a3a50',
      })
      .toPromise();

    expect(product).toHaveProperty('id');
    expect(product.name).toEqual('Test Product');
  });
});
