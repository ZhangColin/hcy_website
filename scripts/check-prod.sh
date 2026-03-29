#!/bin/bash
# 生产环境诊断脚本 - 在服务器上运行

echo "=== 海创元网站 - 生产环境诊断 ==="
echo ""

# 1. 检查容器
echo "1. 容器状态："
docker ps -a | grep hcy-website || echo "  容器不存在"
echo ""

# 2. 检查环境变量
echo "2. 容器内 DATABASE_URL："
docker exec hcy-website sh -c 'echo $DATABASE_URL' 2>/dev/null || echo "  无法获取"
echo ""

# 3. 测试数据库连接（从容器内）
echo "3. 测试容器内数据库连接："
docker exec hcy-website sh -c 'nc -zv host.docker.internal 5432' 2>&1 | head -1 || echo "  host.docker.internal:5432 连接失败"
docker exec hcy-website sh -c 'nc -zv 43.140.211.9 5432' 2>&1 | head -1 || echo "  43.140.211.9:5432 连接失败"
echo ""

# 4. 查看日志
echo "4. 容器日志（最后 20 行）："
docker logs hcy-website 2>&1 | tail -20
echo ""

# 5. 测试页面访问
echo "5. 测试页面访问："
echo -n "  首页: "
curl -sf http://localhost:3000/ > /dev/null 2>&1 && echo "✓ 正常" || echo "✗ 失败"
echo -n "  后台: "
curl -sf http://localhost:3000/admin > /dev/null 2>&1 && echo "✓ 正常" || echo "✗ 失败"
echo -n "  API健康检查: "
curl -sf http://localhost:3000/api/health > /dev/null 2>&1 && echo "✓ 正常" || echo "✗ 失败"
echo ""

# 6. 网络诊断
echo "6. 网络诊断："
echo "  从容器 ping 宿主机:"
docker exec hcy-website ping -c 2 host.docker.internal 2>&1 | grep "transmitted" || echo "    失败"
echo "  从容器测试数据库端口:"
docker exec hcy-website sh -c 'timeout 3 nc -zv host.docker.internal 5432 2>&1' || echo "    连接失败"
echo ""

echo "=== 诊断完成 ==="
