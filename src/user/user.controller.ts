import { Body, Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

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
