import { Controller, Get, Param, Post, Body, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { ReadRoleDto } from './dtos/read-role.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService){}

    @Get(':roleId')
    getRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto>{
        return this._roleService.get(roleId);
    }

    @Get()
    async getRoles(): Promise<ReadRoleDto[]>{
        return this._roleService.getAll();
    }

    @Post('create')
    async createRole(@Body() role: Partial<CreateRoleDto>): Promise<ReadRoleDto>{
        return this._roleService.create(role);
    }

    @Patch(':roleId')
    async updateRole(@Param('roleId', ParseIntPipe) roleId: number, @Body() role:Partial<UpdateRoleDto>){
        return this._roleService.update(roleId, role);
    }

    @Delete(':roleId')
    async deleteRole(@Param('roleId', ParseIntPipe) roleId: number){
        return this._roleService.delete(roleId);
    }

}
