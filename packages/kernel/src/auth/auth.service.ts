import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(
    tenantId: string,
    userId: string,
    email: string,
    role: string,
    permissions: string[],
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, tenantId, email, role, permissions };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.tokenService.generateRefreshToken(userId, tenantId);
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const token = await this.tokenService.validateRefreshToken(refreshToken);
    if (!token) throw new UnauthorizedException('Invalid refresh token');

    await this.tokenService.revokeRefreshToken(token.id);

    const payload = { sub: token.userId, tenantId: token.tenantId };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.tokenService.generateRefreshToken(token.userId, token.tenantId);
    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    const token = await this.tokenService.findByValue(refreshToken);
    if (token) await this.tokenService.revokeRefreshToken(token.id);
  }

  hashPassword(password: string): Promise<string> {
    return this.passwordService.hash(password);
  }

  verifyPassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.verify(password, hash);
  }
}
