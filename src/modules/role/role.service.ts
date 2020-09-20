import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { ReadRoleDto } from './dtos/read-role.dto';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto } from './dtos/create-role.dto';
import { RoleType } from './roletype.enum';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
        ){}
    
    async get(id:  number): Promise<ReadRoleDto>{
        if(!id)
           throw new BadRequestException("id must be sent")            
        const role: Role = await this._roleRepository.findOne(id, 
            { where: {status: 'ACTIVE' }
        });
        if(!role)
            throw new NotFoundException();
        return plainToClass(ReadRoleDto, role);
    }

    async getAll(): Promise<ReadRoleDto[]>{        
        const roles: Role[] = await this._roleRepository.find( 
            {where: {status: 'ACTIVE'}
        });
        if(!roles)
            throw new NotFoundException();
        return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
    }
        
    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto>{
        const savedRole: Role = await this._roleRepository.save(role);
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(roleId: number, role: Partial<CreateRoleDto>):Promise<ReadRoleDto>{
        const foundRole: Role = await this._roleRepository.findOne(
            roleId, {where: { status: 'ACTIVE' }});
        if(!foundRole)
            throw new NotFoundException('this role does not exists');
        foundRole.name = role.name;
        foundRole.description = role.description;
        const updateRole: Role = await this._roleRepository.save(foundRole);
        return plainToClass(ReadRoleDto, updateRole);
    }

    async delete(id: number): Promise<void>{
        const roleExists = await this._roleRepository.findOne(
            id, { where: {status: 'ACTIVE'} });

        if(!roleExists)
            throw new NotFoundException();
        
        await this._roleRepository.update(id, {status: 'INACTIVE'});
        
    }
}
