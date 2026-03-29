#!/bin/bash
# 在生产服务器上运行此脚本进行详细诊断

echo "=== 详细诊断开始 ==="
echo ""

# 1. 检查容器状态
echo "1. 容器状态："
docker ps | grep hcy-website
echo ""

# 2. 查看完整日志
echo "2. 容器完整日志："
docker logs hcy-website 2>&1
echo ""

# 3. 测试首页（带详细输出）
echo "3. 测试首页访问（详细）："
curl -v http://localhost:3000/ 2>&1 | head -50
echo ""

# 4. 检查容器内环境变量
echo "4. 容器内环境变量："
docker exec hcy-website sh -c 'echo "DATABASE_URL=$DATABASE_URL"'
docker exec hcy-website sh -c 'echo "NODE_ENV=$NODE_ENV"'
echo ""

# 5. 测试数据库连接（从容器内）
echo "5. 从容器内测试数据库连接："
docker exec hcy-website sh -c 'nc -zv 43.140.211.9 5432' 2>&1
echo ""

# 6. 进入容器直接测试 Node.js 连接
echo "6. 容器内 Node.js 数据库连接测试："
docker exec hcy-website sh -c 'node -e "
const { PrismaClient } = require(\"@prisma/client\");
const { PrismaPg } = require(\"@prisma/adapter-pg\");
const adapter = new PrismaPg(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });
prisma.homeContent.findFirst().then(data => {
  console.log(\"数据库连接成功, data:\", JSON.stringify(data).substring(0, 100));
  process.exit(0);
}).catch(err => {
  console.error(\"数据库连接失败:\", err.message);
  process.exit(1);
});
"' 2>&1
echo ""

echo "=== 诊断完成 ==="
