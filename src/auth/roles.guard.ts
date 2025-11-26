// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем список ролей, которые нужны для доступа
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) return true;

    // Берём пользователя из JWT (req.user)
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) return false;

    // Загружаем роли пользователя из базы
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    const userRoles = user?.roles.map((r) => r.name) ?? [];
    // Проверяем, есть ли пересечение
    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
