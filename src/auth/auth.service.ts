// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { SignUpDto } from './dto/signUp.dto';
import { UserService } from 'src/user/user.service';
import { ResponseDto } from 'src/common/response.dto';
import { SignInDto } from './dto/signIn.dto';
import { compareHash, hashString } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    if (username === 'test' && password === 'test') {
      return { userId: 1, username: 'test' };
    }
    return null;
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, password, ...rest } = signUpDto;

    const existCheck = await this.userService.findByEmail(email);
    if (existCheck) {
      throw new UnauthorizedException('User already exist');
    }
    const hashedPassword = await hashString(password)
    const user: ResponseDto<User> = await this.userService.create({ email, password: hashedPassword, ...rest });
    return user;
  }


  async signIn(signInDto: SignInDto): Promise<ResponseDto<{ user: User, access_token: string }>> {
    const { email, password } = signInDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const passwordCheck = await compareHash(password, user.password);
    if (!passwordCheck) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, userId: user.id };
    delete user.password;
    const data = {
      user,
      access_token: this.jwtService.sign(payload),
    };
    return {
      statusCode: 200,
      message: 'User logged in successfully',
      data,
    }
  }
}
