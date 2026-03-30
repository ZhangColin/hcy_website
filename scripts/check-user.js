const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.adminUser.findMany().then(users => {
  console.log('Users found:', users.length);
  users.forEach(u => console.log('Username:', u.username, 'Name:', u.name));
  process.exit(0);
}).catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
