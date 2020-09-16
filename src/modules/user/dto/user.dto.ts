import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';
import { RoleType } from '../../role/roletype.enum';
import { UserDetails } from '../user.details.entity';

export class UserDto{
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    roles:RoleType[];

    @IsNotEmpty()
    details: UserDetails;
}