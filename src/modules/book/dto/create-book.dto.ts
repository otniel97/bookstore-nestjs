import { IsNotEmpty, IsString } from "class-validator";
import { User } from '../../user/user.entity';

export class CreateBookDto{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;

    @IsNotEmpty()
    readonly authors: User[];
}