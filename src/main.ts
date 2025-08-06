import { NestFactory, Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exceptions/exception';
import { RolesGuard } from './common/guards/role.guard';
import { ResponseInterceptor } from './common/interceptors/response-Interceptor';
import { SanitizeResponseInterceptor } from './common/interceptors/sanitize-response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('/api/v1');
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new SanitizeResponseInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalGuards(new RolesGuard(new Reflector()));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
