import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
        ){}
    
    async get(id:  number): Promise<User>{
        if(!id)
           throw new BadRequestException("id must be sent")            
        const user: User = await this._userRepository.findOne(id, 
            { where: {status: status.ACTIVE }
        });
        if(!user)
            throw new NotFoundException();
        return user;
    }

    async getAll(): Promise<User[]>{        
        const users: User[] = await this._userRepository.find( 
            {where: {status: status.ACTIVE}
        });
        if(!users)
            throw new NotFoundException();
        return users;
    }
        
    async create(user: User): Promise<User>{
        const detail = new UserDetails();
        user.details = detail;
        const repo = await getConnection().getRepository(Role);
        const defaultRole = await repo.findOne({where: {name: 'GENERAL'}});
        user.roles = [defaultRole];
        const savedUser: User = await this._userRepository.save(user);
        return savedUser;
    }

    async update(id: number, user: User):Promise<void>{
        await this._userRepository.update(id, user);
    }

    async delete(id: number): Promise<void>{
        const userExists = await this._userRepository.findOne(
            id, { where: {status: status.ACTIVE} });

        if(!userExists)
            throw new NotFoundException();
        
        await this._userRepository.update(id, {status: 'INACTIVE'});
    }

    async setRoleToUser(userId: number, roleId: number){
        const userExists = await this._userRepository.findOne(
            userId, { where: {status: status.ACTIVE} });

        if(!userExists)
            throw new NotFoundException();

        const roleExists = await this._roleRepository.findOne(
            roleId, { where: {status: status.ACTIVE} });
    
        if(!roleExists)
            throw new NotFoundException('Role does not exist');

        userExists.roles.push(roleExists);
        await this._userRepository.save(userExists);
        return true;
    }
}
