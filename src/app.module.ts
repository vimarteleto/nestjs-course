import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/nest-course`
      })
    }),
    ConfigModule.forRoot(), // npm install @nestjs/config // configurações de ambiente no .env
    CoffeesModule,
    CoffeeRatingModule,
    CommonModule // esse modulo foi feito para instanciar o guard com argumentos no constructor
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
