import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'referix-dev-secret-change-in-production',
      signOptions: {
        expiresIn: '15m',
        issuer: 'referix',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, PasswordService, JwtStrategy],
  exports: [AuthService, TokenService, PasswordService, JwtModule],
})
export class AuthModule {}
