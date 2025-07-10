import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsService } from './utils/utils.service';
import { TemplatesService } from './templates/templates.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL ?? 'mongodb://localhost:27017/nest'),
    UserModule,
  ],
  providers: [
    UtilsService,
    TemplatesService,
  ],
})
export class AppModule {}
