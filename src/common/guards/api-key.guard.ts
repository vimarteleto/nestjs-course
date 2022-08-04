import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // verificação de custom decorator public.decorator.ts
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler())
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const auth = request.header('Authorization')

    return auth === process.env.API_KEY
  }
}


// nest g guard common/guards/api-key