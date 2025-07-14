import { INestApplication, Module, VersioningType } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from './common/utils/utils.service';
import { TemplatesService } from './common/templates/templates.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    UtilsService,
    TemplatesService,
  ],
})

export class AppModule {}