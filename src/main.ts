import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') ?? 3000
  
  await app.listen(port);

  console.log('\x1b[1m\x1b[33m%s\x1b[0m', `Server running on port ${port}`)
};

bootstrap();