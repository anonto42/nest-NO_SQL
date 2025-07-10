import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController 
{
    constructor(
        private readonly userService: UserService,
    ){}

    @Get('/')
    profile()
    {
        return 'profile';
    }

    @Post('/')
    register(
        @Body() createUserDto: CreateUserDto
    )
    {
        return this.userService.register( createUserDto )
    }

    @Put('/')
    update()
    {
        return 'update';
    }

    @Patch('/')
    change()
    {
        return 'change';
    }

    @Delete('/')
    delete()
    {
        return 'delete';
    }

}
