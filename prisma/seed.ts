// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Создаём роли, если их нет
  const roles = ['user', 'administrator'];
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // Назначаем роль "administrator" пользователю по email
  const adminEmail = 'sergey@example.com'; // поменяй на свой email
  const user = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!user) {
    console.log('Пользователь не найден. Сначала зарегистрируйся, затем запусти seed.');
  } else {
    const adminRole = await prisma.role.findUnique({ where: { name: 'administrator' } });
    await prisma.user.update({
      where: { id: user.id },
      data: {
        roles: { connect: [{ id: adminRole!.id }] },
      },
    });
    console.log('Роль administrator назначена пользователю', adminEmail);
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
