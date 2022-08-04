import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {

    console.time('Request-Response time')

    console.log(`Middleware start`)

    res.on('finish', () => console.timeEnd('Request-Response time'))

    next();
  }
}
