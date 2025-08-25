import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/utility/exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  //Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NestJS with Prisma Documentation')
    .setDescription('The NestJS with Prisma description')
    .addBearerAuth(
      {
        description: `[just text field] Please enter token in following format: <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-documentation', app, documentFactory);
  //Swagger setup end

  await app.listen(process.env.PORT ?? 2000, () => {
    console.log(`Server is listening on port ${process.env.PORT ?? 2000}`);
  });
}
bootstrap();
