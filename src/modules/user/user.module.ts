import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { Sharedodule } from '../../shared/shared.module';
import { UserController } from './user.controller';

@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), Sharedodule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {
}
