#!/bin/bash
set -e

# Load .env
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
elif [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Test the API directly
node -e "
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

(async () => {
  try {
    // Simulate the API call
    const pageKey = 'ai-curriculum';
    const buttons = await prisma.pageButton.findMany({
      where: { pageKey },
      orderBy: { order: 'asc' },
    });

    console.log('Found buttons for', pageKey + ':', buttons.length);

    // Group by position
    const grouped = {};
    for (const btn of buttons) {
      if (!grouped[btn.positionKey]) {
        grouped[btn.positionKey] = [];
      }
      grouped[btn.positionKey].push({
        label: btn.label,
        href: btn.href,
        openNewTab: btn.openNewTab,
      });
    }

    console.log('Grouped result:', JSON.stringify(grouped, null, 2));
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.\$disconnect();
  }
})();
"
