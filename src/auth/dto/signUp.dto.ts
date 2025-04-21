import { IsString, IsEmail, IsNotEmpty, MinLength, IsUUID, IsArray, ArrayNotEmpty, IsOptional } from 'class-validator';

export class SignUpDto {
    @IsString()
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsUUID()
    @IsNotEmpty({ message: 'Role ID is required' })
    roleId: string;

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true, message: 'Each license ID must be a valid UUID' })
    licensesIds: string[];

    @IsString()
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}
