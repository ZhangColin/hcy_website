/**
 * 为现有 SQL 文件添加 id 字段
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SQL_FILE = join(__dirname, '..', 'sql', 'news-migration.sql');

const sql = readFileSync(SQL_FILE, 'utf-8');
const lines = sql.split('\n');

const newLines: string[] = [];

for (const line of lines) {
  if (line.startsWith('INSERT INTO "NewsArticle" (')) {
    // 修改列列表，添加 id
    newLines.push(line.replace(
      'INSERT INTO "NewsArticle" (',
      'INSERT INTO "NewsArticle" (id, '
    ));
  } else if (line.startsWith('VALUES (')) {
    // 修改值列表，在开头添加 uuid
    const id = randomUUID();
    newLines.push(line.replace('VALUES (', `VALUES ('${id}', `));
  } else {
    newLines.push(line);
  }
}

writeFileSync(SQL_FILE, newLines.join('\n'), 'utf-8');
console.log('✅ SQL 文件已更新，添加了 id 字段');
