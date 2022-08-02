import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //  npm i class-validator class-transformer
  app.useGlobalPipes(new ValidationPipe({
    transform: true,              // transforma os tipos recebidos nas requests de forma apropriada
    whitelist: true,              // não considera os valores que não fazem parte do DTO
    forbidNonWhitelisted: true,   // retorna erro para propriedades que não fazem parte do DTO
    transformOptions: {
      enableImplicitConversion: true  // conversao baseada no tipo
    }
  }));

  await app.listen(3000);
}
bootstrap();
