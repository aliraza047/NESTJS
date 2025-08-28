import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from './types';

@Injectable()
export class UserHelper {
  constructor(private readonly jwtService: JwtService) {}

  // Generate access and refresh tokens
  async getTokens(userId: string, email: string): Promise<Tokens> {
    const payload: JwtPayload = {
      userId: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: '100d',
        secret: process.env.JWT_SECRET || 'JWT_SECRET',
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET || 'JWT_SECRET',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}
