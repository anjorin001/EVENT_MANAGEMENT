/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
// interceptors/mongoose-clean.interceptor.ts
// interceptors/mongoose-clean.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MongooseCleanInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // If the response has a 'data' property (like your API response structure)
        if (data && typeof data === 'object' && data.data !== undefined) {
          return {
            ...data,
            data: this.cleanMongooseObject(data.data),
          };
        }
        // Otherwise clean the entire response
        return this.cleanMongooseObject(data);
      }),
    );
  }

  private cleanMongooseObject(obj: any): any {
    if (!obj) return obj;

    try {
      // Handle Mongoose documents first
      if (obj._doc && obj.$__) {
        // This is a Mongoose document, extract the _doc part
        return this.cleanMongooseObject(obj._doc);
      }

      if (Array.isArray(obj)) {
        return obj.map(item => this.cleanMongooseObject(item));
      }

      if (obj && typeof obj === 'object') {
        const cleaned: any = {};

        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            try {
              // Handle ObjectId specifically
              if (key === '_id' && value) {
                if (value.buffer && typeof value.buffer === 'object') {
                  // Convert buffer to ObjectId string
                  cleaned[key] = this.bufferToObjectId(value.buffer);
                } else if (value.toString && typeof value.toString === 'function') {
                  cleaned[key] = value.toString();
                } else {
                  cleaned[key] = value;
                }
              }
              // Skip version key
              else if (key === '__v') {
                continue;
              }
              // Handle dates more safely
              else if (value instanceof Date) {
                cleaned[key] = value.toISOString();
              }
              else if (value && typeof value === 'object' && 
                       value.constructor && 
                       value.constructor.name === 'Date') {
                cleaned[key] = value.toISOString();
              }
              // Handle timestamp fields specifically
              else if ((key === 'createdAt' || key === 'updatedAt' || key === 'startTime' || key === 'endTime') && value) {
                if (value instanceof Date) {
                  cleaned[key] = value.toISOString();
                } else if (typeof value === 'string') {
                  // If it's already a string, keep it
                  cleaned[key] = value;
                } else if (value === null) {
                  // Keep null values as null
                  cleaned[key] = null;
                } else if (typeof value === 'object' && Object.keys(value).length === 0) {
                  // Keep empty timestamp objects as null
                  cleaned[key] = null;
                } else {
                  cleaned[key] = value;
                }
              }
              // Handle other empty objects
              else if (value && typeof value === 'object' && Object.keys(value).length === 0) {
                cleaned[key] = null;
              }
              // Recursively clean nested objects
              else if (value && typeof value === 'object') {
                cleaned[key] = this.cleanMongooseObject(value);
              }
              // Primitive values
              else {
                cleaned[key] = value;
              }
            } catch (error) {
              // If there's an error processing this field, keep the original value
              console.warn(`Error cleaning field ${key}:`, error);
              cleaned[key] = value;
            }
          }
        }

        return cleaned;
      }

      return obj;
    } catch (error) {
      console.error('Error in cleanMongooseObject:', error);
      return obj; // Return original object if cleaning fails
    }
  }

  // Helper function to convert buffer to ObjectId string
  private bufferToObjectId(buffer: any): string {
    try {
      if (!buffer || typeof buffer !== 'object') return '';

      let hexString = '';
      
      // Handle both array-like and object-like buffers
      if (Array.isArray(buffer)) {
        for (let i = 0; i < Math.min(buffer.length, 12); i++) {
          if (buffer[i] !== undefined) {
            hexString += buffer[i].toString(16).padStart(2, '0');
          }
        }
      } else {
        // Handle object with numeric string keys (like your case)
        for (let i = 0; i < 12; i++) {
          const byte = buffer[i] || buffer[i.toString()];
          if (byte !== undefined && typeof byte === 'number') {
            hexString += byte.toString(16).padStart(2, '0');
          }
        }
      }
      
      return hexString || '';
    } catch (error) {
      console.warn('Error converting buffer to ObjectId:', error);
      return '';
    }
  }
}

// Alternative simpler interceptor using JSON serialization
@Injectable()
export class SimpleMongooseCleanInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.simpleCleanMongoose(data);
      }),
    );
  }

  private simpleCleanMongoose(obj: any): any {
    return JSON.parse(JSON.stringify(obj, (key, value) => {
      // Handle ObjectId buffers
      if (key === '_id' && value && value.buffer) {
        return this.bufferToObjectId(value.buffer);
      }
      // Skip version key
      if (key === '__v') {
        return undefined;
      }
      // Handle empty objects
      if (value && typeof value === 'object' && Object.keys(value).length === 0) {
        return null;
      }
      return value;
    }));
  }

  private bufferToObjectId(buffer: any): string {
    if (!buffer || typeof buffer !== 'object') return '';

    let hexString = '';
    for (let i = 0; i < 12; i++) {
      const byte = buffer[i.toString()];
      if (byte !== undefined) {
        hexString += byte.toString(16).padStart(2, '0');
      }
    }
    return hexString;
  }
}