import { Body, Controller, Delete, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/common/guards/jwt.guard';

@Controller('user')
export class UserController 
{
    constructor(
        private readonly userService: UserService,
    ){}

    @UseGuards(JwtGuard) // This will use for the authontication
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
