// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    SharedModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: '1234',
      signOptions: { expiresIn: '1hr' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule { }
