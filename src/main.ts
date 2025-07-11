import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from 'src/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from 'src/common/Interceptor/response.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {

  // Configaration
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;
  
  // Global Prefix
  app.setGlobalPrefix('api');


  // Error & Response Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Globall Validation
  app.useGlobalPipes(new ValidationPipe(
    { 
      transform: true, 
      whitelist: true, 
      forbidNonWhitelisted: true, 
      exceptionFactory: (errors) => {
        const firstError = errors[0];
        const message = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Validation failed';
        return new BadRequestException(message);
      }
    }
  ));
  

  // Security
  app.enableCors({
    origin: '*',
    credentials: true,
  })
  app.use(helmet());

  // Run the server 
  await app.listen(port);
  console.log('\x1b[1m\x1b[33m%s\x1b[0m', `Server is running on port ${port}`)
};

bootstrap();