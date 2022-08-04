import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiKeyGuard } from './common/guards/api-key.guard';
import { PaginationDataInterceptor } from './common/interceptors/pagination-data.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter())   // utilizando filters para customizar exceptions


  // utilizando guards para controle de acesso com argumentos no constructor, nao pode ser instanciado aqui
  // app.useGlobalGuards(new ApiKeyGuard())


  app.useGlobalInterceptors(new WrapResponseInterceptor(), new TimeoutInterceptor())


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




/*

modulo 6:
building blocks

exception filter: control exceptions behaviors

pipes: handle transformations and validations

guards: auth, authorization, roles

interceptors: bind extra logic, transform results, override methods, like caching responses

*/
