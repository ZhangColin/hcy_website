import { prisma } from "./prisma";

/**
 * 从 base64 token 中解析用户 ID
 * Token 格式: base64(userId + ":" + timestamp + ":" + randomBytes(16))
 */
export function parseAuthToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 3) return null;
    return parts[0]; // userId
  } catch {
    return null;
  }
}

/**
 * 验证管理员 token 是否有效
 * 检查 token 格式和对应的用户是否存在
 */
export async function verifyAdminToken(token: string): Promise<boolean> {
  if (!token) return false;

  const userId = parseAuthToken(token);
  if (!userId) return false;

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: userId },
    });
    return !!user;
  } catch {
    return false;
  }
}

/**
 * 从 NextRequest 中提取并验证 Bearer token
 */
export async function authenticateRequest(request: Request): Promise<boolean> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;

  const token = authHeader.slice(7);
  return verifyAdminToken(token);
}
