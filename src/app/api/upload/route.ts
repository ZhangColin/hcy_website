import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { uploadFile } from '@/lib/cos';

// 文件验证配置
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

// 允许的图片类型目录
const ALLOWED_TYPES_DIRS = ['highlights', 'news', 'news/editor', 'hero', 'partners', 'honors', 'uploads', 'contacts', 'qrcode', 'cases', 'cases/cover', 'cases/logo', 'cases/trophy', 'experts'];

export async function POST(request: NextRequest) {
  // 1. 验证权限
  const isAuthenticated = await authenticateRequest(request);
  if (!isAuthenticated) {
    return NextResponse.json(
      { error: '未授权，请先登录' },
      { status: 401 }
    );
  }

  // 2. 解析表单数据
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: '无效的表单数据' },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;
  const type = formData.get('type') as string | null;

  // 3. 验证参数
  if (!file) {
    return NextResponse.json(
      { error: '缺少文件参数' },
      { status: 400 }
    );
  }

  if (!type || !ALLOWED_TYPES_DIRS.includes(type)) {
    return NextResponse.json(
      { error: `无效的类型参数，允许的值: ${ALLOWED_TYPES_DIRS.join(', ')}` },
      { status: 400 }
    );
  }

  // 4. 验证文件类型
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `不支持的文件类型: ${file.type}，仅支持: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    );
  }

  // 5. 验证文件大小
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `文件过大，最大支持 ${MAX_FILE_SIZE / 1024 / 1024}MB` },
      { status: 400 }
    );
  }

  // 6. 验证文件扩展名
  const filename = file.name;
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json(
      { error: `不支持的文件扩展名: .${ext}` },
      { status: 400 }
    );
  }

  // 7. 转换 File 为 Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 8. 上传到 COS
  try {
    const result = await uploadFile(buffer, type, filename);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[Upload Error]', error);
    return NextResponse.json(
      { error: '上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
