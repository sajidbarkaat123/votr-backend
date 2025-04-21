import { IsEmail, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrokerDto {
  @ApiProperty({
    description: 'The name of the broker',
    example: 'John Broker',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the broker',
    example: 'john@brokers.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The country of the broker',
    example: 'USA',
  })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    description: 'The age of the broker',
    example: 42,
    minimum: 18,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(18)
  age: number;

  @ApiProperty({
    description: 'The status of the broker',
    example: 'active',
  })
  @IsNotEmpty()
  @IsString()
  status: string;
}
