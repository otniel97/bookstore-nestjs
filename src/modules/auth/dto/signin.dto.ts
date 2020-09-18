import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto{
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