import { COS } from 'cos-nodejs-sdk';

// COS 客户端配置
const cos = new COS({
  SecretId: process.env.COS_SECRET_ID,
  SecretKey: process.env.COS_SECRET_KEY,
});

// 配置常量
export const COS_CONFIG = {
  bucket: process.env.COS_BUCKET || 'hcy-website-1415442236',
  region: process.env.COS_REGION || 'ap-beijing',
  domain: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '',
};

/**
 * 上传文件到腾讯云 COS
 * @param file - 要上传的文件 (Buffer 或 File)
 * @param type - 文件类型目录，如 "highlights", "news"
 * @param filename - 原始文件名（用于获取扩展名）
 * @returns 上传结果，包含相对路径和完整 URL
 */
export async function uploadFile(
  file: Buffer | File,
  type: string,
  filename?: string
): Promise<{ path: string; url: string }> {
  // 生成文件名: {type}/{YYYYMMDD}-{uuid}.ext
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

  // 从原始文件名或参数获取扩展名
  let ext = 'jpg'; // 默认扩展名
  if (filename) {
    const parts = filename.split('.');
    ext = parts[parts.length - 1]?.toLowerCase() || 'jpg';
  }

  // 生成唯一文件名
  const randomId = crypto.randomUUID();
  const key = `${type}/${date}-${randomId}.${ext}`;

  // 上传到 COS
  await new Promise<void>((resolve, reject) => {
    cos.putObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: key,
      Body: file,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  // 返回相对路径和完整 URL
  return {
    path: `/${key}`,
    url: `${COS_CONFIG.domain}/${key}`,
  };
}

/**
 * 删除 COS 中的文件
 * @param path - 文件相对路径，如 "/highlights/xxx.jpg"
 */
export async function deleteFile(path: string): Promise<void> {
  const key = path.startsWith('/') ? path.slice(1) : path;

  await new Promise<void>((resolve, reject) => {
    cos.deleteObject({
      Bucket: COS_CONFIG.bucket,
      Region: COS_CONFIG.region,
      Key: key,
    }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
