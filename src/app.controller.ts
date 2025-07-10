import { Controller, Get } from '@nestjs/common';
import { TemplatesService } from 'common/templates/templates.service';

@Controller()
export class AppController 
{
    constructor(
        private readonly templatesService: TemplatesService,
    ) {}

    @Get()
    getHello(): string 
    {
        return this.templatesService.homeTemplate();
    }
}
