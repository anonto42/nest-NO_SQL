import { Module } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';
import { TemplatesService } from './templates/templates.service';
import { AuthMiddleware } from './middleware/auth.middleware';
import { ResponseInterceptor } from './Interceptor/response.interceptor';

@Module({
    providers:[
        UtilsService,
        TemplatesService,
        AuthMiddleware,
        ResponseInterceptor,
    ],
    exports:[
        UtilsService,
        TemplatesService,
        AuthMiddleware,
        ResponseInterceptor,
    ]
})
export class CommonModule {}
