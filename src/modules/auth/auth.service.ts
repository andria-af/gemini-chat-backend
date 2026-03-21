import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(dto: LoginDto) {
    const normalizedUsername = dto.username.trim();

    let user = await this.prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { username: normalizedUsername },
      });
    }

    return user;
  }
}