import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from 'src/user/user.dto';
import { User, UserModel } from 'src/user/user.schema';
import { LoginUserDto } from './auth.dto';
import { UtilsService } from 'src/common/utils/utils.service';

@Injectable()
export class AuthService {

    constructor(

        @InjectModel( User.name )
        private readonly userModel: UserModel,

        private readonly utilsService: UtilsService
    ){}

    async register(createUserDto: CreateUserDto): Promise<User>
    {
        const user = await this.userModel.create( createUserDto )

        if ( !user ) throw new HttpException('User not created', HttpStatus.BAD_REQUEST )
            
        return user
    }

    async login(loginUserDto: LoginUserDto): Promise<{ user: User, accessToken: string, refreshToken: string }> 
    {
        const user = await this.userModel.findOne( { email: loginUserDto.email } )

        if ( !user ) throw new HttpException('User not found', HttpStatus.NOT_FOUND )

        const isMatch = await this.userModel.comparePassword(loginUserDto.password, user.password)

        if ( !isMatch ) throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST )

        const accessToken = this.utilsService.createAccessToken({id: user._id as string, role: user.role})

        const refreshToken = this.utilsService.createRefreshToken({id: user._id as string, role: user.role})

        return { user, accessToken, refreshToken }
    }
    
}
