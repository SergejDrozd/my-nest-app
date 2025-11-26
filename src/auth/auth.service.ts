// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  // Регистрация пользователя с ролью "user" по умолчанию
  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверяем, есть ли роль "user", если нет — создаём
    let userRole = await this.prisma.role.findUnique({ where: { name: 'user' } });
    if (!userRole) {
      userRole = await this.prisma.role.create({ data: { name: 'user' } });
    }

    return this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          connect: [{ id: userRole.id }],
        },
      },
    });
  }

  // Проверка логина
  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  // Выдача JWT
  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '60m' }) };
  }
}
