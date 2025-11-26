import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, User } from '../../generated/prisma';


@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

async create(title: string, description: string | undefined, userId: number): Promise<Task> {
  return this.prisma.task.create({
    data: {
      title,
      description,
      userId, 
    },
  });
}


  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: { user: true },
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async update(id: number, updateData: Partial<Task>): Promise<Task | null> {
    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.task.delete({
      where: { id },
    });
  }


  async createForUser(userId: number, title: string, description?: string): Promise<Task> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return this.prisma.task.create({
      data: {
        title,
        description,
        userId: user.id,
      },
    });
  }

  async findAllForUser(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { userId },
      include: { user: true },
    });
  }
}
