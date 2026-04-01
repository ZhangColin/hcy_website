import { PrismaClient } from './node_modules/@prisma/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    const count = await prisma.pageButton.count();
    console.log('Total buttons:', count);
    
    const buttons = await prisma.pageButton.findMany({ take: 3 });
    console.log('Sample buttons:', JSON.stringify(buttons, null, 2));
  } catch (e) {
    console.error('Error:', e.message, e.cause?.message);
  } finally {
    await prisma.$disconnect();
  }
})();
