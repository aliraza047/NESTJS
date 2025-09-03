import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';

export const grpcClientOptions: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'product',
    protoPath: join(
      '/home/zapta/Desktop/NestJS/my-project',
      'proto/product.proto',
    ),
    url: '0.0.0.0:50051', // gRPC server will listen here
    // onLoadPackageDefinition: (pkg, server) => {
    //   new ReflectionService(pkg).addToServer(server);
    // },
  },
};
