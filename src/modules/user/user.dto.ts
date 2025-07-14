import { UserRole } from "./user.enum";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto 
{
    name?: string;
    email?: string;
    age?: number;
    password?: string;
    role?: UserRole;
    avatar?: string;
}
  
