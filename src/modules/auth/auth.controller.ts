import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly _authService: AuthService){

    }

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signup(@Body() sigupDto: SignupDto): Promise<void>{
        return this._authService.singup(sigupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe)
    async signin(@Body() siginDto: SigninDto){
        return this._authService.signin(siginDto);

    }
}
