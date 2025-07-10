import { UserRole } from "./user.enum";

export class CreateUserDto 
{
    readonly name: string;
    readonly email: string;
    readonly age: number;
    readonly password: string;
    readonly role: UserRole;
    readonly avatar?: string;
}

export class UpdateUserDto 
{
    readonly name?: string;
    readonly email?: string;
    readonly age?: number;
}
  
