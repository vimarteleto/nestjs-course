import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { LoggingMiddleware } from './middleware/logging.middleware';

@Module({
    providers: [{ provide: APP_GUARD, useClass: ApiKeyGuard }]
})
export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {

        // para algumas rotas:
        // consumer.apply(LoggingMiddleware).forRoutes(
        //     {
        //         path: 'coffees',
        //         method: RequestMethod.GET
        //     },
        //     {
        //         path: 'coffees/:id',
        //         method: RequestMethod.GET
        //     }
        // )

        consumer.apply(LoggingMiddleware).forRoutes('*') // para todas as rotas
    }
}
