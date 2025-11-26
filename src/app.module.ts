import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module'; 
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, TasksModule, PrismaModule],
})
export class AppModule {}
