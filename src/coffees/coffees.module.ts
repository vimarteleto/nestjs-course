import { Injectable, Module } from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CoffeesController } from './coffees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Event, EventSchema } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_BRANDS_TWO } from './coffees.constants';

// classes de exemplo para ilustrar diferentes formas de custom providers
class MockCoffeesService {}
class ConfigService {}
class DevConfigService {}
class ProdConfigService {}
@Injectable()
export class CoffeeBrandsFactory {
  create() {
    //...
    return ['chocolate', 'nescafe']
  }
}
/////////////////////////////////////////////////////////////////////////

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coffee.name,
        schema: CoffeeSchema
      },
      {
        name: Event.name,
        schema: EventSchema
      }
    ])
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    { provide: COFFEE_BRANDS, useValue: ['nescafe', 'chocolate'] }, // provider sem classe definida
    { provide: ConfigService, useClass: process.env.NODE_ENV === 'development' ? DevConfigService : ProdConfigService }, // determinar um provider em uma classe dinamicamente
    {
      // useFactory permite chamar funções de classes como custom provider
      provide: COFFEE_BRANDS_TWO,
      useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(),
      inject: [CoffeeBrandsFactory]

    },
  ],
  // providers: [{provide: CoffeesService, useValue: new MockCoffeesService()}],  // para alterar a classe a ser instanciada nos providers, preservando o nome original
  exports: [CoffeesService] // é necessario exportar um modulo para ser chamado em outros modulos
})
export class CoffeesModule {}




