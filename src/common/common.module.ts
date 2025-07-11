import { Module } from '@nestjs/common';
import { UtilsService } from './utils/utils.service';
import { TemplatesService } from './templates/templates.service';
import { ResponseInterceptor } from './Interceptor/response.interceptor';

@Module({
    providers:[
        UtilsService,
        TemplatesService,
        ResponseInterceptor,
    ],
    exports:[
        UtilsService,
        TemplatesService,
        ResponseInterceptor,
    ]
})
export class CommonModule {}
