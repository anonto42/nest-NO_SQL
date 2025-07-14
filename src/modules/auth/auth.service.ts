import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChangePasswordDto, CreateUserDto, ForgotPasswordDto, LoginUserDto, OtpUserDto, RefreshUserDto, VerifyOtpDto } from './auth.dto';
import { UtilsService } from 'src/common/utils/utils.service';
import { User, UserModel } from '../user/user.schema';

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

        user.refreshToken = refreshToken;
        await user.save();

        return { user, accessToken, refreshToken }
    }

    async refresh(refreshUserDto: RefreshUserDto): Promise<{ accessToken: string }> 
    {
        const user = await this.userModel.findOne( { refreshToken: refreshUserDto.refreshToken } )

        if ( !user ) throw new HttpException('User not found', HttpStatus.NOT_FOUND )

        const isVarified = await this.utilsService.verifyJwtToken(refreshUserDto.refreshToken)

        if ( !isVarified ) throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST )

        const accessToken = this.utilsService.createAccessToken({id: user._id as string, role: user.role})

        return { accessToken }
    }

    async otp(otpUserDto: OtpUserDto): Promise<{ message: string, value: null }> 
    {
        const user = await this.userModel.findOne( { email: otpUserDto.email } )

        if ( !user ) throw new HttpException('User not found', HttpStatus.NOT_FOUND )
        
        const otp = this.utilsService.generateOtp(6)

        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
        await user.save();

        this.utilsService.sendMail(user.email, otp,"Here is your OTP for verification:")

        return { message: "Otp sent successfully" , value: null }
    }

    async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string, forget_password_token: string }> 
    {
        const user = await this.userModel.findOne( { email: verifyOtpDto.email } )

        if ( !user ) throw new HttpException('User not found', HttpStatus.NOT_FOUND )

        if ( user.otp !== verifyOtpDto.otp ) throw new HttpException('Invalid otp', HttpStatus.BAD_REQUEST )

        if ( user.otpExpiry && user.otpExpiry < new Date() ) throw new HttpException('Otp expired', HttpStatus.BAD_REQUEST )

        user.otp = undefined;
        
        user.otpExpiry = undefined;
        
        const value = this.utilsService.generateOtp(5).toString();

        if ( !user.isVerified ) user.resetPasswordToken = value;
        else if ( user.isVerified ) user.resetPasswordToken = undefined, user.resetPasswordTokenExpiry = new Date( Date.now() + 10 * 60 * 1000 );

        await user.save();

        const hash_value = this.utilsService.ganarateHash(value)

        return { message: "Otp verified successfully", forget_password_token:  hash_value }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> 
    {
        const user = await this.userModel.findOne( { email: forgotPasswordDto.email } )

        if ( !user ) throw new HttpException('User not found', HttpStatus.NOT_FOUND )

        if ( !user.resetPasswordToken ) throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST )

        const isTokenValide = this.utilsService.compareHash(user.resetPasswordToken, forgotPasswordDto.token)

        if ( !isTokenValide ) throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST )

        if ( user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date() ) throw new HttpException('Refresh Password Token expired', HttpStatus.BAD_REQUEST )

        if ( forgotPasswordDto.password !== forgotPasswordDto.confirmPassword ) throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST )

        user.password = forgotPasswordDto.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiry = undefined;
        await user.save();

        return { message: "Password changed successfully" }
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ message: string }> 
    {
        
        console.log(changePasswordDto)

        return { message: "Password changed successfully" }
    }
}
