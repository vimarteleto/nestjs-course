import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    return next.handle()
    // return next.handle().pipe(map((data) => ({ data }))); // devolve o objeto como {data: {...}}
  }
}

//  nest g itc common/interceptors/wrap-response