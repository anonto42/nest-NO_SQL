import { UserRole } from "./user.enum";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto 
{
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({},{ message: 'Email must be a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Age is required' })
    age: number;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    @IsNotEmpty({ message: 'Role is required' })
    role: UserRole;

    @IsString({ message: 'Avatar must be a string' })
    avatar?: string;
}

export class UpdateUserDto 
{
    name?: string;
    email?: string;
    age?: number;
    password?: string;
    role?: UserRole;
    avatar?: string;
}
  
