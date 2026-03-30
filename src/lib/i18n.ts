export type Language = 'zh' | 'en';

const STORAGE_KEY = 'hcy-website-language';

export function getInitialLanguage(): Language {
  // 只在客户端执行
  if (typeof window === 'undefined') return 'zh';

  try {
    // 1. 尝试从 localStorage 读取
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch (e) {
    // localStorage 可能不可用
    console.warn('Failed to read from localStorage:', e);
  }

  // 2. 检测浏览器语言
  const browserLang = navigator.language;
  if (browserLang.startsWith('en')) return 'en';

  // 3. 默认中文
  return 'zh';
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    console.warn('Failed to write to localStorage:', e);
  }

  // 更新 HTML lang 属性
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}
