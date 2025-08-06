/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const sanitize = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(sanitize);
          } else if (obj && typeof obj === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...rest } = obj;
            for (const key in rest) {
              rest[key] = sanitize(rest[key]);
            }
            return rest;
          }
          return obj;
        };

        return sanitize(data);
      }),
    );
  }
}
