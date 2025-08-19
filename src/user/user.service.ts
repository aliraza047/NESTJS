import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { ApiResponse, ResponseUtil } from 'src/shared/utility/response';
import { Tokens } from 'src/shared/utility/types';
import { SignInUserDto } from './dto/sign-in.dto';
import { UserHelper } from './helpers';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly userHelper: UserHelper,
  ) {}

  async signUp(dto: SignUpUserDto): Promise<any> {
    const emailLower = dto.email.toLowerCase();

    // 🚫 Check for existing user
    const existing = await this.prisma.user.findUnique({
      where: { email: emailLower },
    });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // 🔐 Hash password
    const hashed = await bcrypt.hash(dto.password, 10);

    // ✅ Create user in DB
    const user = await this.prisma.user.create({
      data: {
        email: emailLower,
        name: dto.name,
        password: hashed,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return ResponseUtil.success('SignUp Successfully!');
  }

  async signIn(signInDto: SignInUserDto): Promise<ApiResponse<Tokens>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: signInDto.email,
        },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      // If user does not exist, deny access
      if (!user) {
        throw new BadRequestException('INVALID_EMAIL');
      }

      // Verify the provided password against the stored hashed password
      const passwordMatches = await bcrypt.compare(
        signInDto.password,
        user.password,
      );
      if (!passwordMatches) {
        throw new BadRequestException('PASSWORD_MISMATCH');
      }

      const tokens = await this.userHelper.getTokens(user.id, user.email);
      return ResponseUtil.success('ACCOUNT_ACCESSED_SUCCESSFULLY', tokens);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserInfo(userId: string): Promise<ApiResponse<any>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new BadRequestException('USER_NOT_FOUND');
      }

      return ResponseUtil.success('USER_INFO_RETRIEVED', user);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
