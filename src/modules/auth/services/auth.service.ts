import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto, LoginDto } from '../dtos/auth.schema';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(data: RegisterDto) {
    const exists = await this.usersService.findByEmail(data.email);
    if (exists) {
      throw new BadRequestException({ errors: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...result } = user;
    return { data: result };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedException({ errors: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ errors: 'Invalid credentials' });
    }

    return this.generateTokens(user);
  }

  async refresh(oldRefreshToken: string) {
    try {
      const payload = this.jwtService.verify(oldRefreshToken, {
        secret: process.env.JWT_SECRET || ''
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.refreshToken !== oldRefreshToken) {
        throw new UnauthorizedException({ errors: 'Invalid refresh token' });
      }
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException({ errors: 'Invalid refresh token' });
    }
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
    return { data: 'OK' };
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      data: {
        accessToken,
        refreshToken,
      }
    };
  }
}
