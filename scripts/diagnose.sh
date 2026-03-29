#!/bin/bash
# 在服务器上运行此脚本进行诊断

echo "=== 海创元网站诊断 ==="
echo ""

# 1. 容器状态
echo "1. 容器状态："
docker ps -a | grep hcy-website || echo "  容器不存在"
echo ""

# 2. 容器内环境变量
echo "2. 容器内 DATABASE_URL："
docker exec hcy-website sh -c 'echo "DATABASE_URL=$DATABASE_URL"' 2>/dev/null || echo "  无法获取"
echo ""

# 3. 容器日志
echo "3. 容器日志（最后 30 行）："
docker logs hcy-website 2>&1 | tail -30
echo ""

# 4. 测试数据库连接（从容器内）
echo "4. 测试数据库连接："
echo -n "  43.140.211.9:5432: "
docker exec hcy-website sh -c 'nc -zv 43.140.211.9 5432 2>&1' | head -1 || echo "失败"
echo ""

# 5. 测试首页
echo "5. 测试首页："
RESPONSE=$(curl -s http://localhost:3000/ 2>&1)
if echo "$RESPONSE" | grep -q "html"; then
  echo "  ✓ 首页正常"
else
  echo "  ✗ 首页失败"
  echo "  响应: $(echo "$RESPONSE" | head -c 300)"
fi
echo ""

# 6. 测试后台
echo "6. 测试后台："
if curl -sf http://localhost:3000/admin > /dev/null 2>&1; then
  echo "  ✓ 后台正常"
else
  echo "  ✗ 后台失败"
fi
echo ""

echo "=== 诊断完成 ==="
