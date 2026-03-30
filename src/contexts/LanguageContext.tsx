"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '@/locales/translations';
import type { Language } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // 初始状态固定为 'zh'，避免 SSR 不匹配
  const [lang, setLangState] = useState<Language>('zh');
  const [mounted, setMounted] = useState(false);

  // 组件挂载后初始化语言
  useEffect(() => {
    const initLang = async () => {
      const { getInitialLanguage, setLanguage } = await import('@/lib/i18n');
      const initialLang = getInitialLanguage();
      setLangState(initialLang);
      // 设置 HTML lang 属性
      setLanguage(initialLang);
      setMounted(true);
    };
    initLang();
  }, []);

  // 切换语言
  const setLang = (newLang: Language) => {
    setLangState(newLang);
    import('@/lib/i18n').then(({ setLanguage }) => {
      setLanguage(newLang);
    });
  };

  // 翻译函数
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
    }
    // 开发环境下警告缺失的翻译
    if (process.env.NODE_ENV === 'development' && !value && mounted) {
      console.warn(`[i18n] Missing translation key: ${key} for language: ${lang}`);
    }
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
