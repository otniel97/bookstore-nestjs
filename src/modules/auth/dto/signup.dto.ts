import { IsNotEmpty, IsString } from 'class-validator';

export class SignupDto{
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}