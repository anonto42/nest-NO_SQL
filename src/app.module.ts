import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsService } from '../common/utils/utils.service';
import { TemplatesService } from '../common/templates/templates.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI')
      }),
    }),
    UserModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    UtilsService,
    TemplatesService,
  ],
})

export class AppModule {}