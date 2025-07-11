import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from 'src/common/Interceptor/response.interceptor';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') ?? 3000;

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port);

  console.log('\x1b[1m\x1b[33m%s\x1b[0m', `Server running on port ${port}`)
};

bootstrap();