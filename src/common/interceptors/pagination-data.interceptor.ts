import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PaginationDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest()
    const { limit, offset } = request.query

    // informações de paginação por interceptor ?? verificar obtenção do total de resultados
    console.log(context.switchToHttp().getResponse())
    if (limit) {
      return next.handle().pipe(
        map(data => ({
          data: data,
          pagination: {
            offset: parseInt(offset) || 0,
            limit: parseInt(limit),
          }
        }))
      );
    }
    return next.handle()
  }
}


// return next.handle().pipe(map((data) => ({ data })));
