import { Module } from '@nestjs/common';
import { CoffeesModule } from 'src/coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
  providers: [CoffeeRatingService],
  imports: [CoffeesModule] // importa o que for exportado no modulo listado
})
export class CoffeeRatingModule {}
