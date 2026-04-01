#!/bin/bash
set -e

# Load .env
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Use psql with DATABASE_URL
echo "Testing database connection and page_buttons table..."
node -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    // Test connection
    await prisma.\$connect();
    console.log('Connected to database');
    
    // Check if table exists and has data
    const count = await prisma.pageButton.count();
    console.log('Total buttons in DB:', count);
    
    if (count > 0) {
      const buttons = await prisma.pageButton.findMany({ take: 3 });
      console.log('Sample buttons:', JSON.stringify(buttons, null, 2));
    } else {
      console.log('No buttons found in database!');
      console.log('Need to run: psql -f sql/init_page_buttons.sql');
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.\$disconnect();
  }
})();
"
