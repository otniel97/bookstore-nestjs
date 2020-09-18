import { Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto';
import { compare } from 'bcryptjs';
import { IJwtPayload } from './jw-payload.interface';
import { User } from '../user/user.entity';
import { RoleType } from '../role/roletype.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private _authRepository: AuthRepository,
        private readonly _jwtService: JwtService,
        ){}

    async singup(singupDto: SignupDto): Promise<void>{
        const { username, email } = singupDto;
        const userExists = await this._authRepository.findOne({
            where: [ { username }, { email }]
        });

        if(userExists)
            throw new ConflictException('username or email already exists');

        return this._authRepository.singup(singupDto);
    }

    async signin(signinDto: SigninDto): Promise<{ token: string }>{
        const { username, email, password } = signinDto; 
        const user: User = await this._authRepository.findOne({
            where: [{username}, {email}]
        })

        if(!user)
            throw new NotFoundException("User does not exist");
        
        const isMatch = await compare(password, user.password);
        if(!isMatch)
            throw new UnauthorizedException("invalid credentials");
        
        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(r => r.name as RoleType)
        }

        const token = await this._jwtService.sign(payload);
        return { token };
    }
}
