import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { LoggedInDto } from './dto/logged-in.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService){

    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    signup(@Body() sigupDto: SignupDto): Promise<void>{
        return this._authService.singup(sigupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    signin(@Body() siginDto: SigninDto): Promise<LoggedInDto>{
        return this._authService.signin(siginDto);

    }
}
