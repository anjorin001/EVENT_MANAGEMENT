import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/exception';
import { MongooseCleanInterceptor } from './common/interceptors/mongoDb-response-interceptor';
import { ResponseInterceptor } from './common/interceptors/response-Interceptor';
import { SanitizeResponseInterceptor } from './common/interceptors/sanitize-response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(helmet());
  app.enableCors({
    origin: '*',
  });

  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(
    new MongooseCleanInterceptor(),
    new SanitizeResponseInterceptor(),
    new ResponseInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
