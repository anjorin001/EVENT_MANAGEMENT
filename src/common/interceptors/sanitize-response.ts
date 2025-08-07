/* eslint-disable @typescript-eslint/no-unused-vars */
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
        const sanitize = (obj: any, seen = new WeakSet()): any => {
          if (obj && typeof obj === 'object') {
            if (seen.has(obj)) return obj;
            seen.add(obj);

            if (Array.isArray(obj)) {
              return obj.map((item) => sanitize(item, seen));
            }

            const { password, ...rest } = obj;
            const sanitized: any = {};
            for (const key in rest) {
              if (Object.prototype.hasOwnProperty.call(rest, key)) {
                sanitized[key] = sanitize(rest[key], seen);
              }
            }
            return sanitized;
          }

          return obj;
        };
        return sanitize(data)
      }),
    );
  }
}
