import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsUUID()
  @IsNotEmpty()
  roleId: string;


  @IsArray()
  @IsOptional()
  licensesIds: string[]

  @IsNotEmpty()
  @IsString()
  password: string;
}
