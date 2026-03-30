# 国际化 (i18n) 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为网站添加中英文切换功能，翻译所有静态文本

**Architecture:** 使用 React Context API 管理语言状态，翻译字典为 JSON 文件，localStorage 持久化，useEffect 初始化避免 hydration mismatch

**Tech Stack:** React 19, Next.js 16.2.1 (App Router), TypeScript, localStorage API

---

## File Structure

```
src/
├── locales/                    # 新建目录
│   ├── zh.json                 # 中文翻译字典
│   ├── en.json                 # 英文翻译字典
│   └── translations.ts         # 翻译导入模块
├── lib/
│   └── i18n.ts                 # 语言检测与持久化工具
├── contexts/                   # 新建目录
│   └── LanguageContext.tsx     # 语言状态管理 Context
├── hooks/                      # 新建目录
│   └── useTranslation.ts       # 翻译 Hook
├── components/
│   ├── Header.tsx              # 修改：添加翻译
│   ├── Footer.tsx              # 修改：添加翻译
│   ├── HomeClient.tsx          # 修改：添加翻译
│   ├── AboutPageClient.tsx     # 修改：添加翻译
│   ├── ContactPageClient.tsx   # 修改：添加翻译
│   ├── JoinPageClient.tsx      # 修改：添加翻译
│   └── NewsListClient.tsx      # 修改：添加翻译
└── app/
    └── layout.tsx              # 修改：包裹 LanguageProvider
```

---

## Task 1: 创建目录结构

**Files:**
- Create: `src/locales/`
- Create: `src/contexts/`
- Create: `src/hooks/`

- [ ] **Step 1: 创建 locales 目录**

```bash
mkdir -p src/locales
```

- [ ] **Step 2: 创建 contexts 目录**

```bash
mkdir -p src/contexts
```

- [ ] **Step 3: 创建 hooks 目录**

```bash
mkdir -p src/hooks
```

- [ ] **Step 4: 验证目录创建**

```bash
ls -la src/ | grep -E "locales|contexts|hooks"
```

Expected: 输出显示三个新目录

- [ ] **Step 5: 提交**

```bash
git add src/locales src/contexts src/hooks
git commit -m "chore: create directories for i18n implementation"
```

---

## Task 2: 创建中文翻译字典

**Files:**
- Create: `src/locales/zh.json`

- [ ] **Step 1: 创建中文翻译字典文件**

```bash
cat > src/locales/zh.json << 'EOF'
{
  "common": {
    "home": "首页",
    "learnMore": "了解更多",
    "contactUs": "联系我们",
    "consultNow": "立即咨询",
    "search": "搜索",
    "searchPlaceholder": "搜索...",
    "close": "关闭",
    "openMenu": "打开菜单",
    "backToTop": "返回顶部"
  },
  "header": {
    "brand": "海创元AI教育",
    "about": "关于海创元",
    "services": "智教服务集群",
    "aiCurriculum": "AI课程入校",
    "aiCurriculumDesc": "将前沿AI课程体系引入校园，赋能基础教育与高等教育",
    "teacherTraining": "AI师资培训与认证",
    "teacherTrainingDesc": "面向教师的AI能力提升培训及专业资质认证",
    "aiResearchStudy": "AI研学",
    "aiResearchStudyDesc": "沉浸式AI主题研学旅行与实践项目",
    "ecosystemAlliance": "生态产品联盟",
    "ecosystemAllianceDesc": "联合优质AI教育产品，构建开放生态",
    "ecosystem": "产融生态矩阵",
    "enterpriseTraining": "政企AI赋能培训",
    "enterpriseTrainingDesc": "为政府与企业定制AI转型培训方案",
    "opc": "OPC生态",
    "opcDesc": "开放产业合作平台，连接教育与产业资源",
    "smartServices": "智创专项服务",
    "smartServicesDesc": "AI技术咨询与定制化智能解决方案",
    "assetRevitalization": "不良资产盘活",
    "assetRevitalizationDesc": "以AI技术赋能资产价值重塑与运营优化",
    "cases": "案例与成果",
    "news": "新闻动态",
    "onlineConsultation": "在线咨询"
  },
  "footer": {
    "aboutSection": "关于海创元",
    "companyIntro": "公司简介",
    "timeline": "发展历程",
    "honors": "荣誉资质",
    "partners": "合作伙伴",
    "joinUs": "加入我们",
    "friendlyLinks": "友情链接",
    "address": "地址：",
    "followUs": "关注我们",
    "wechatOfficial": "微信公众号",
    "wechatService": "微信客服",
    "socialPlatforms": {
      "weibo": "微博",
      "douyin": "抖音",
      "bilibili": "哔哩哔哩",
      "xiaohongshu": "小红书",
      "zhihu": "知乎",
      "weixin": "微信视频号"
    }
  },
  "home": {
    "heroDefaultTitle": "海创元AI教育",
    "heroDefaultSubtitle": "赋能千行万业 AI引领未来",
    "dataStrip": {
      "coverage": "覆盖省市",
      "schools": "服务院校",
      "channels": "合作渠道",
      "champions": "全球总冠军",
      "nationalChampions": "全国总冠军",
      "hours": "累计授课"
    },
    "businessOverview": "双轮驱动业务全景",
    "eduServices": "智教服务集群",
    "ecoMatrix": "产融生态矩阵",
    "highlights": "核心亮点",
    "partners": "合作伙伴",
    "news": "新闻动态",
    "viewMore": "查看更多",
    "cta": {
      "slogan": "AI赋能千行万业",
      "tagline": "国企担当引领未来",
      "eduServices": "智教服务",
      "ecoMatrix": "产融生态",
      "enterpriseTraining": "政企培训",
      "opc": "OPC生态",
      "aiPartyBuilding": "AI党建"
    }
  },
  "services": {
    "title": "智教服务集群",
    "aiCurriculum": {
      "title": "AI课程入校",
      "desc": "1+N综合解决方案，覆盖小初高全学段"
    },
    "teacherTraining": {
      "title": "AI师资培训与认证",
      "desc": "工信部权威认证，初/中/高三级体系"
    },
    "aiResearchStudy": {
      "title": "AI研学",
      "desc": "沉浸式AI科技研学体验营"
    },
    "ecosystemAlliance": {
      "title": "生态产品联盟",
      "desc": "优质AI教育产品集成与推荐"
    }
  },
  "ecosystem": {
    "title": "产融生态矩阵",
    "enterpriseTraining": {
      "title": "政企AI赋能培训",
      "desc": "定制化AI转型培训方案"
    },
    "opc": {
      "title": "OPC生态",
      "desc": "培训即就业，真实订单驱动"
    },
    "smartServices": {
      "title": "智创专项服务",
      "desc": "AI创新项目孵化与技术支持"
    },
    "assetRevitalization": {
      "title": "不良资产盘活",
      "desc": "AI赋能资产处置与价值重塑"
    }
  },
  "about": {
    "breadcrumb": {
      "home": "首页",
      "current": "关于海创元"
    },
    "companyIntro": "公司简介",
    "subsidiary": "海淀国投集团全资企业",
    "culture": "企业文化",
    "cultureDesc": "以使命为引领，以创新为驱动，构建可持续发展的AI教育生态",
    "mission": "使命",
    "vision": "愿景",
    "values": {
      "stateOwned": "国企担当",
      "stateOwnedDesc": "秉承国有企业社会责任，以教育公平为己任",
      "innovation": "创新驱动",
      "innovationDesc": "以AI技术为核心驱动力，持续引领教育变革",
      "ecosystem": "生态共赢",
      "ecosystemDesc": "构建开放合作生态，与伙伴共享发展红利",
      "practical": "实战为本",
      "practicalDesc": "聚焦实际应用场景，培养新质生产力人才",
      "education": "教育为本",
      "educationDesc": "聚焦教育本质，培养面向未来的创新人才"
    },
    "timeline": "发展历程",
    "timelineDesc": "从创立之初到业务遍布全国，海创元始终砥砺前行",
    "honors": "荣誉资质",
    "honorsDesc": "多项行业认证与赛事成就，彰显专业实力",
    "honorTabs": {
      "all": "全部",
      "industry": "行业荣誉",
      "competition": "赛事成就",
      "certification": "合作认证",
      "patent": "软著专利"
    },
    "partners": "合作伙伴",
    "partnersDesc": "携手行业领军企业与优质院校，共建AI教育新生态",
    "strategicPartners": "战略合作伙伴",
    "ecosystemPartners": "生态代理品牌",
    "stats": {
      "coverage": "覆盖省市",
      "schools": "服务院校",
      "channels": "合作渠道"
    }
  },
  "contact": {
    "breadcrumb": {
      "home": "首页",
      "current": "联系我们"
    },
    "title": "联系我们",
    "subtitle": "期待与您携手，共同探索AI赋能教育与产业的无限可能",
    "address": "公司地址",
    "addressDesc": "欢迎莅临指导，期待与您面对面交流",
    "officeAddress": "办公地址",
    "phone": "联系电话",
    "email": "电子邮箱",
    "mapNotConfigured": "地图未配置",
    "mapNotConfiguredDesc": "请在后台设置地图坐标",
    "contacts": "分业务线联系人",
    "contactsDesc": "根据您的需求，直接联系对应业务负责人",
    "onlineConsultation": "在线咨询",
    "onlineConsultationDesc": "填写以下信息，我们将尽快与您取得联系",
    "form": {
      "name": "姓名",
      "company": "单位",
      "phone": "电话",
      "email": "邮箱",
      "needType": "需求类型",
      "message": "留言",
      "submit": "提交咨询",
      "continue": "继续咨询",
      "required": "必填",
      "placeholder": {
        "name": "请输入您的姓名",
        "company": "请输入您的单位名称",
        "phone": "请输入您的联系电话",
        "email": "请输入您的邮箱地址",
        "needType": "请选择需求类型",
        "message": "请简要描述您的需求或问题"
      },
      "needTypes": {
        "aiCurriculum": "AI课程入校",
        "teacherTraining": "AI师资培训与认证",
        "aiResearchStudy": "AI研学",
        "ecosystemAlliance": "生态产品联盟",
        "enterpriseTraining": "政企AI赋能培训",
        "opc": "OPC生态",
        "smartServices": "智创专项服务",
        "assetRevitalization": "不良资产盘活",
        "aiPartyBuilding": "AI党建业务",
        "other": "其他"
      },
      "success": {
        "title": "提交成功",
        "message": "感谢您的咨询，我们将在1-2个工作日内与您联系。"
      },
      "errors": {
        "networkError": "网络错误，请稍后重试"
      },
      "wechat": {
        "title": "微信客服",
        "desc": "扫码添加微信客服，获取即时咨询服务",
        "workHours": "工作日 9:00 - 18:00",
        "responseTime": "24小时内响应",
        "qrNotConfigured": "二维码未配置"
      }
    }
  },
  "join": {
    "breadcrumb": {
      "home": "首页",
      "current": "加入我们"
    },
    "title": "加入我们",
    "subtitle": "期待你的加入，共同创造AI教育的未来"
  },
  "news": {
    "breadcrumb": {
      "home": "首页",
      "current": "新闻动态"
    },
    "title": "新闻动态",
    "categories": {
      "all": "全部",
      "company": "公司新闻",
      "industry": "行业资讯",
      "media": "媒体报道"
    }
  },
  "cases": {
    "title": "案例与成果",
    "schools": "服务院校案例",
    "honors": "赛事荣誉",
    "coverage": "业务覆盖版图"
  }
}
EOF
```

- [ ] **Step 2: 验证 JSON 格式**

```bash
cat src/locales/zh.json | jq empty
```

Expected: 无输出（JSON 有效）

- [ ] **Step 3: 提交**

```bash
git add src/locales/zh.json
git commit -m "i18n: add Chinese translation dictionary"
```

---

## Task 3: 创建英文翻译字典

**Files:**
- Create: `src/locales/en.json`

- [ ] **Step 1: 创建英文翻译字典文件**

```bash
cat > src/locales/en.json << 'EOF'
{
  "common": {
    "home": "Home",
    "learnMore": "Learn More",
    "contactUs": "Contact Us",
    "consultNow": "Consult Now",
    "search": "Search",
    "searchPlaceholder": "Search...",
    "close": "Close",
    "openMenu": "Open Menu",
    "backToTop": "Back to Top"
  },
  "header": {
    "brand": "Haichuangyuan AI Education",
    "about": "About Us",
    "services": "Education Services",
    "aiCurriculum": "AI Curriculum",
    "aiCurriculumDesc": "Bringing cutting-edge AI curriculum to campuses, empowering K-12 and higher education",
    "teacherTraining": "Teacher Training",
    "teacherTrainingDesc": "AI capability enhancement training and professional certification for teachers",
    "aiResearchStudy": "AI Research Study",
    "aiResearchStudyDesc": "Immersive AI-themed study tours and practical programs",
    "ecosystemAlliance": "Ecosystem Alliance",
    "ecosystemAllianceDesc": "Uniting quality AI education products to build an open ecosystem",
    "ecosystem": "Industry Ecosystem",
    "enterpriseTraining": "Enterprise Training",
    "enterpriseTrainingDesc": "Customized AI transformation training for government and enterprises",
    "opc": "OPC Ecosystem",
    "opcDesc": "Open industry cooperation platform connecting education and industrial resources",
    "smartServices": "Smart Services",
    "smartServicesDesc": "AI technical consulting and customized intelligent solutions",
    "assetRevitalization": "Asset Revitalization",
    "assetRevitalizationDesc": "Empowering asset value reshaping and operational optimization with AI",
    "cases": "Cases & Achievements",
    "news": "News",
    "onlineConsultation": "Online Consultation"
  },
  "footer": {
    "aboutSection": "About Us",
    "companyIntro": "Company Profile",
    "timeline": "Timeline",
    "honors": "Honors",
    "partners": "Partners",
    "joinUs": "Join Us",
    "friendlyLinks": "Friendly Links",
    "address": "Address: ",
    "followUs": "Follow Us",
    "wechatOfficial": "WeChat Official Account",
    "wechatService": "WeChat Service",
    "socialPlatforms": {
      "weibo": "Weibo",
      "douyin": "Douyin",
      "bilibili": "Bilibili",
      "xiaohongshu": "Xiaohongshu",
      "zhihu": "Zhihu",
      "weixin": "WeChat"
    }
  },
  "home": {
    "heroDefaultTitle": "Haichuangyuan AI Education",
    "heroDefaultSubtitle": "Empowering Industries with AI, Leading the Future",
    "dataStrip": {
      "coverage": "Provinces Covered",
      "schools": "Schools Served",
      "channels": "Partnership Channels",
      "champions": "Global Champions",
      "nationalChampions": "National Champions",
      "hours": "Hours Taught"
    },
    "businessOverview": "Dual-Drive Business Overview",
    "eduServices": "Education Services",
    "ecoMatrix": "Industry Ecosystem",
    "highlights": "Core Highlights",
    "partners": "Partners",
    "news": "News",
    "viewMore": "View More",
    "cta": {
      "slogan": "Empowering Industries with AI",
      "tagline": "State-Owned Enterprise Leading the Future",
      "eduServices": "Education Services",
      "ecoMatrix": "Industry Ecosystem",
      "enterpriseTraining": "Enterprise Training",
      "opc": "OPC Ecosystem",
      "aiPartyBuilding": "AI Party Building"
    }
  },
  "services": {
    "title": "Education Services",
    "aiCurriculum": {
      "title": "AI Curriculum",
      "desc": "1+N comprehensive solution covering K-12 education"
    },
    "teacherTraining": {
      "title": "Teacher Training & Certification",
      "desc": "Authorized by MIIT, three-level certification system"
    },
    "aiResearchStudy": {
      "title": "AI Research Study",
      "desc": "Immersive AI technology study experience camps"
    },
    "ecosystemAlliance": {
      "title": "Ecosystem Alliance",
      "desc": "Integration and recommendation of quality AI education products"
    }
  },
  "ecosystem": {
    "title": "Industry Ecosystem",
    "enterpriseTraining": {
      "title": "Enterprise AI Training",
      "desc": "Customized AI transformation training programs"
    },
    "opc": {
      "title": "OPC Ecosystem",
      "desc": "Training for employment, driven by real orders"
    },
    "smartServices": {
      "title": "Smart Services",
      "desc": "AI innovation project incubation and technical support"
    },
    "assetRevitalization": {
      "title": "Asset Revitalization",
      "desc": "AI-empowered asset disposal and value reshaping"
    }
  },
  "about": {
    "breadcrumb": {
      "home": "Home",
      "current": "About Us"
    },
    "companyIntro": "Company Profile",
    "subsidiary": "A Wholly-Owned Enterprise of Haidian State Investment",
    "culture": "Corporate Culture",
    "cultureDesc": "Mission-driven, innovation-focused, building a sustainable AI education ecosystem",
    "mission": "Mission",
    "vision": "Vision",
    "values": {
      "stateOwned": "State-Owned Responsibility",
      "stateOwnedDesc": "Upholding social responsibility as a state-owned enterprise, committed to educational equity",
      "innovation": "Innovation-Driven",
      "innovationDesc": "AI technology as the core driver, continuously leading educational transformation",
      "ecosystem": "Ecosystem Win-Win",
      "ecosystemDesc": "Building an open cooperation ecosystem, sharing development dividends with partners",
      "practical": "Practice-Oriented",
      "practicalDesc": "Focusing on real application scenarios, cultivating new quality productivity talent",
      "education": "Education-Focused",
      "educationDesc": "Focusing on the essence of education, cultivating innovative talent for the future"
    },
    "timeline": "Timeline",
    "timelineDesc": "From inception to nationwide presence, Haichuangyuan keeps moving forward",
    "honors": "Honors & Qualifications",
    "honorsDesc": "Multiple industry certifications and competition achievements demonstrating professional strength",
    "honorTabs": {
      "all": "All",
      "industry": "Industry Honors",
      "competition": "Competition Achievements",
      "certification": "Partnership Certifications",
      "patent": "Software Patents"
    },
    "partners": "Partners",
    "partnersDesc": "Collaborating with leading enterprises and quality institutions to build a new AI education ecosystem",
    "strategicPartners": "Strategic Partners",
    "ecosystemPartners": "Ecosystem Brands",
    "stats": {
      "coverage": "Provinces Covered",
      "schools": "Schools Served",
      "channels": "Partnership Channels"
    }
  },
  "contact": {
    "breadcrumb": {
      "home": "Home",
      "current": "Contact Us"
    },
    "title": "Contact Us",
    "subtitle": "Looking forward to working with you to explore the infinite possibilities of AI in education and industry",
    "address": "Office Address",
    "addressDesc": "Welcome to visit us, looking forward to face-to-face communication",
    "officeAddress": "Office Address",
    "phone": "Contact Phone",
    "email": "Email",
    "mapNotConfigured": "Map Not Configured",
    "mapNotConfiguredDesc": "Please set map coordinates in the admin panel",
    "contacts": "Business Line Contacts",
    "contactsDesc": "Contact the relevant business contact person directly based on your needs",
    "onlineConsultation": "Online Consultation",
    "onlineConsultationDesc": "Fill in the information below and we will contact you as soon as possible",
    "form": {
      "name": "Name",
      "company": "Organization",
      "phone": "Phone",
      "email": "Email",
      "needType": "Requirement Type",
      "message": "Message",
      "submit": "Submit",
      "continue": "Continue",
      "required": "Required",
      "placeholder": {
        "name": "Enter your name",
        "company": "Enter your organization name",
        "phone": "Enter your contact number",
        "email": "Enter your email address",
        "needType": "Select requirement type",
        "message": "Briefly describe your requirements or questions"
      },
      "needTypes": {
        "aiCurriculum": "AI Curriculum",
        "teacherTraining": "Teacher Training",
        "aiResearchStudy": "AI Research Study",
        "ecosystemAlliance": "Ecosystem Alliance",
        "enterpriseTraining": "Enterprise Training",
        "opc": "OPC Ecosystem",
        "smartServices": "Smart Services",
        "assetRevitalization": "Asset Revitalization",
        "aiPartyBuilding": "AI Party Building",
        "other": "Other"
      },
      "success": {
        "title": "Submitted Successfully",
        "message": "Thank you for your inquiry. We will contact you within 1-2 business days."
      },
      "errors": {
        "networkError": "Network error, please try again later"
      },
      "wechat": {
        "title": "WeChat Service",
        "desc": "Scan to add our WeChat service for instant consultation",
        "workHours": "Weekdays 9:00 - 18:00",
        "responseTime": "Response within 24 hours",
        "qrNotConfigured": "QR Code Not Configured"
      }
    }
  },
  "join": {
    "breadcrumb": {
      "home": "Home",
      "current": "Join Us"
    },
    "title": "Join Us",
    "subtitle": "Looking forward to your joining, creating the future of AI education together"
  },
  "news": {
    "breadcrumb": {
      "home": "Home",
      "current": "News"
    },
    "title": "News",
    "categories": {
      "all": "All",
      "company": "Company News",
      "industry": "Industry Insights",
      "media": "Media Coverage"
    }
  },
  "cases": {
    "title": "Cases & Achievements",
    "schools": "School Cases",
    "honors": "Competition Honors",
    "coverage": "Service Coverage"
  }
}
EOF
```

- [ ] **Step 2: 验证 JSON 格式**

```bash
cat src/locales/en.json | jq empty
```

Expected: 无输出（JSON 有效）

- [ ] **Step 3: 提交**

```bash
git add src/locales/en.json
git commit -m "i18n: add English translation dictionary"
```

---

## Task 4: 创建翻译导入模块

**Files:**
- Create: `src/locales/translations.ts`

- [ ] **Step 1: 创建 translations.ts 文件**

```bash
cat > src/locales/translations.ts << 'EOF'
import zh from './zh.json';
import en from './en.json';

export const translations = {
  zh,
  en,
};

export type Translations = typeof zh;
EOF
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/locales/translations.ts
```

Expected: 无错误输出

- [ ] **Step 3: 提交**

```bash
git add src/locales/translations.ts
git commit -m "i18n: add translations module"
```

---

## Task 5: 创建 i18n 工具函数

**Files:**
- Create: `src/lib/i18n.ts`

- [ ] **Step 1: 创建 i18n.ts 工具文件**

```bash
cat > src/lib/i18n.ts << 'EOF'
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
EOF
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/lib/i18n.ts
```

Expected: 无错误输出

- [ ] **Step 3: 提交**

```bash
git add src/lib/i18n.ts
git commit -m "i18n: add language detection and persistence utilities"
```

---

## Task 6: 创建 LanguageContext

**Files:**
- Create: `src/contexts/LanguageContext.tsx`

- [ ] **Step 1: 创建 LanguageContext.tsx 文件**

```bash
cat > src/contexts/LanguageContext.tsx << 'EOF'
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
EOF
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/contexts/LanguageContext.tsx
```

Expected: 无错误输出

- [ ] **Step 3: 提交**

```bash
git add src/contexts/LanguageContext.tsx
git commit -m "i18n: add LanguageContext and useTranslation hook"
```

---

## Task 7: 创建 useTranslation 导出

**Files:**
- Create: `src/hooks/useTranslation.ts`

- [ ] **Step 1: 创建 useTranslation.ts 导出文件**

```bash
cat > src/hooks/useTranslation.ts << 'EOF'
"use client";

export { useTranslation } from '@/contexts/LanguageContext';
EOF
```

- [ ] **Step 2: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/hooks/useTranslation.ts
```

Expected: 无错误输出

- [ ] **Step 3: 提交**

```bash
git add src/hooks/useTranslation.ts
git commit -m "i18n: add useTranslation hook export"
```

---

## Task 8: 改造 layout.tsx 集成 LanguageProvider

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: 备份并读取当前 layout.tsx**

```bash
cp src/app/layout.tsx src/app/layout.tsx.backup
```

- [ ] **Step 2: 修改 layout.tsx 添加 LanguageProvider**

Read the file first to see current content, then make the specific edit:

需要将:
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

改为:
```tsx
import LanguageProvider from "@/contexts/LanguageContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
```

并在文件顶部添加导入:
```tsx
import LanguageProvider from "@/contexts/LanguageContext";
```

- [ ] **Step 3: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/app/layout.tsx
```

Expected: 无错误输出

- [ ] **Step 4: 验证开发服务器运行**

```bash
npm run dev &
sleep 5
curl -s http://localhost:3000 | head -20
pkill -f "next dev"
```

Expected: 页面正常加载，无 hydration 错误

- [ ] **Step 5: 提交**

```bash
git add src/app/layout.tsx
git commit -m "i18n: integrate LanguageProvider in root layout"
```

---

## Task 9: 改造 Header 组件

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: 备份 Header.tsx**

```bash
cp src/components/Header.tsx src/components/Header.tsx.backup
```

- [ ] **Step 2: 添加 useTranslation 导入和状态**

在文件顶部添加:
```tsx
import { useTranslation } from "@/hooks/useTranslation";
```

删除现有的 lang state:
```tsx
// 删除这一行
const [lang, setLang] = useState<"zh" | "en">("zh");
```

在 Header 函数内添加:
```tsx
const { lang, setLang, t } = useTranslation();
```

- [ ] **Step 3: 更新桌面端语言切换按钮**

将桌面端语言切换部分 (约 564-585 行) 改为使用 context 的 lang 和 setLang:

```tsx
{/* Language toggle */}
<div className="hidden md:flex items-center rounded-lg border border-gray-200 overflow-hidden text-xs">
  <button
    onClick={() => setLang("zh")}
    className={`px-2.5 py-1.5 font-medium transition-colors ${
      lang === "zh"
        ? "bg-[#1A3C8A] text-white"
        : "text-gray-500 hover:text-[#1A3C8A]"
    }`}
  >
    中
  </button>
  <button
    onClick={() => setLang("en")}
    className={`px-2.5 py-1.5 font-medium transition-colors ${
      lang === "en"
        ? "bg-[#1A3C8A] text-white"
        : "text-gray-500 hover:text-[#1A3C8A]"
    }`}
  >
    EN
  </button>
</div>
```

- [ ] **Step 4: 更新移动端语言切换按钮**

将移动端语言切换部分 (约 378-383 行) 改为:

```tsx
<div className="flex items-center justify-center gap-2 text-xs text-gray-400">
  <button onClick={() => setLang("zh")} className={`font-medium ${lang === "zh" ? "text-[#1A3C8A]" : ""}`}>中</button>
  <span>/</span>
  <button onClick={() => setLang("en")} className={`font-medium transition-colors ${lang === "en" ? "text-[#1A3C8A]" : "hover:text-[#1A3C8A]"}`}>EN</button>
</div>
```

- [ ] **Step 5: 更新导航数据结构使用翻译**

将 NAV_ITEMS 常量改为在组件内部使用 t() 函数:

删除顶部的 NAV_ITEMS 常量定义，在 Header 函数内添加:

```tsx
const NAV_ITEMS: NavItem[] = [
  { label: t("header.about"), href: "/about" },
  {
    label: t("header.services"),
    href: "/services",
    children: [
      {
        label: t("header.aiCurriculum"),
        href: "/services/ai-curriculum",
        description: t("header.aiCurriculumDesc"),
      },
      {
        label: t("header.teacherTraining"),
        href: "/services/teacher-training",
        description: t("header.teacherTrainingDesc"),
      },
      {
        label: t("header.aiResearchStudy"),
        href: "/services/ai-research-study",
        description: t("header.aiResearchStudyDesc"),
      },
      {
        label: t("header.ecosystemAlliance"),
        href: "/services/ecosystem-alliance",
        description: t("header.ecosystemAllianceDesc"),
      },
    ],
  },
  {
    label: t("header.ecosystem"),
    href: "/ecosystem",
    children: [
      {
        label: t("header.enterpriseTraining"),
        href: "/ecosystem/enterprise-training",
        description: t("header.enterpriseTrainingDesc"),
      },
      {
        label: t("header.opc"),
        href: "/ecosystem/opc",
        description: t("header.opcDesc"),
      },
      {
        label: t("header.smartServices"),
        href: "/ecosystem/smart-services",
        description: t("header.smartServicesDesc"),
      },
      {
        label: t("header.assetRevitalization"),
        href: "/ecosystem/asset-revitalization",
        description: t("header.assetRevitalizationDesc"),
      },
    ],
  },
  { label: t("header.cases"), href: "/cases" },
  { label: t("header.news"), href: "/news" },
  { label: t("header.onlineConsultation"), href: "/contact" },
];
```

- [ ] **Step 6: 更新 aria-labels 使用翻译**

将硬编码的 aria-label 替换为翻译键:

- "关闭菜单" → `t("common.close")`
- "搜索" → `t("common.search")`
- "打开菜单" → `t("common.openMenu")`
- "返回顶部" → `t("common.backToTop")`
- "在线咨询" → `t("header.onlineConsultation")`

- [ ] **Step 7: 更新其他静态文本**

- "海创元AI教育" (品牌名) → `t("header.brand")`
- "在线咨询" 按钮 → `t("header.onlineConsultation")`
- 搜索框 placeholder "搜索..." → `t("common.searchPlaceholder")`

- [ ] **Step 8: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/Header.tsx
```

Expected: 无错误输出

- [ ] **Step 9: 提交**

```bash
git add src/components/Header.tsx
git commit -m "i18n: add translations to Header component"
```

---

## Task 10: 改造 Footer 组件

**重要说明:** Footer 当前是服务端组件，使用 `loadSite()` 从数据库获取数据。`lib/data.ts` 导入了 `server-only`，因此需要在服务端获取数据，然后传递给客户端组件进行翻译。

**Files:**
- Create: `src/components/FooterInner.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: 备份 Footer.tsx**

```bash
cp src/components/Footer.tsx src/components/Footer.tsx.backup
```

- [ ] **Step 2: 创建 FooterInner 客户端组件**

```bash
cat > src/components/FooterInner.tsx << 'EOF'
"use client";

import Link from "next/link";
import { QrCodeImage } from "./QrCodeImage";
import { useTranslation } from "@/hooks/useTranslation";

// Social media icon components (从 Footer.tsx 复制)
function WeiboIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 11.84c-.247-.636-.887-.936-1.467-.728-.233.084-.42.24-.549.43-.079.12-.126.252-.162.383-.134.505-.604.862-1.133.862-.152 0-.296-.037-.438-.094-.482-.188-.77-.674-.685-1.169.043-.247.17-.461.35-.625.364-.334.58-.816.58-1.337 0-1.005-.818-1.823-1.824-1.823-.357 0-.688.107-.967.285-.559.36-.929.985-.929 1.69 0 .233.045.452.118.663.147.424.038.895-.287 1.192-.196.18-.449.281-.713.3-.082.007-.163.009-.244.009-2.94 0-5.321 2.38-5.321 5.318 0 2.938 2.381 5.318 5.321 5.318 2.938 0 5.317-2.38 5.317-5.318 0-.357-.036-.706-.104-1.045a1.025 1.025 0 01.063-.56c.072-.162.19-.296.34-.383.602-.35.985-1 .985-1.727 0-.247-.048-.483-.131-.703z" />
    </svg>
  );
}

function DouyinIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.3a6.34 6.34 0 0010.86 4.43V13a8.28 8.28 0 005.58 2.17v-3.44a4.85 4.85 0 01-1-.1v-.01a4.83 4.83 0 001-4.93z" />
    </svg>
  );
}

function BilibiliIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 01-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 01.16-.186l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" />
    </svg>
  );
}

function XiaohongshuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 6.678c-2.655.182-5.346.826-5.934 1.774-.144.229-.23.483-.23.743 0 1.774 2.746 3.348 6.147 3.348 3.4 0 6.147-1.574 6.147-3.348 0-.26-.086-.514-.23-.743-.588-.948-3.279-1.592-5.934-1.774h.034zm6.373 1.774c0 .13-.022.258-.055.383-.248 1.573-2.767 2.811-5.844 2.811-3.076 0-5.595-1.238-5.843-2.81a2.146 2.146 0 01-.056-.384c0-1.774 2.747-3.348 6.148-3.348 3.4 0 6.148 1.574 6.148 3.348h-.298zm-1.07 5.724c-.358.244-.775.389-1.22.409-.483.02-.976-.15-1.368-.484-.392-.334-.683-.795-.825-1.314-.142-.52-.128-1.07.04-1.568.168-.497.473-.92.876-1.213.403-.293.877-.44 1.36-.413.483.028.94.226 1.31.568.37.342.633.81.752 1.325.12.514.09 1.053-.085 1.545-.175.492-.483.915-.886 1.208l.346.074zm-2.334-2.08c-.117.088-.266.122-.408.093-.142-.03-.26-.115-.328-.238-.068-.124-.08-.27-.033-.403.047-.133.14-.243.26-.31.12-.066.258-.083.387-.046.13.037.24.118.31.228.07.11.095.24.07.366a.476.476 0 01-.258.31zm4.233 1.003a2.614 2.614 0 01-1.31-.568c-.37-.342-.633-.81-.752-1.325-.12-.514-.09-1.053.085-1.545.175-.492.483-.915.886-1.208l-.346-.074c.358-.244.775-.389 1.22-.409.483-.02.976.15 1.368.484.392.334.683.795.825 1.314.142.52.128 1.07-.04 1.568-.168.497-.483.915-.886 1.208l.31-.495z"/>
    </svg>
  );
}

function ZhihuIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.025 0H6.975C3.123 0 0 3.123 0 6.975v10.05C0 20.877 3.123 24 6.975 24h10.05C20.877 24 24 20.877 24 17.025V6.975C24 3.123 20.877 0 17.025 0zM7.682 19.518l-1.656-3.527H4.2v3.527H2.622v-8.34h3.19c1.6 0 2.586.965 2.586 2.425 0 1.18-.67 2.008-1.653 2.3l1.828 3.615H7.682zm6.585-5.726v-2.614h-1.58v2.614h1.58zm1.614 0v-2.614h1.578v2.614h-1.578zm-4.81 0v-2.614H9.5v2.614h1.572zm-1.572 1.577H9.5v2.453c0 .658.275.873.806.873.298 0 .615-.073.89-.18v1.374c-.34.126-.744.197-1.184.197-1.286 0-2.043-.682-2.043-1.96v-2.757zm3.196 3.656v-5.233h1.578v.733c.325-.535.82-.838 1.47-.838.275 0 .517.037.722.11v1.503c-.22-.09-.476-.127-.775-.127-.65 0-1.11.43-1.11 1.32v2.532h-1.885zm4.528 0v-5.233h1.578v.733c.324-.535.82-.838 1.47-.838.274 0 .516.037.722.11v1.503c-.22-.09-.476-.127-.776-.127-.65 0-1.11.43-1.11 1.32v2.532h-1.884zm-10.48-7.076H5.812c-.695 0-1.13-.41-1.13-1.12 0-.71.435-1.12 1.13-1.12h1.432v2.24zm10.48-1.275v-1.25h-1.578v1.25h1.578z"/>
    </svg>
  );
}

function WeixinIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ReactElement> = {
  weibo: <WeiboIcon />,
  douyin: <DouyinIcon />,
  bilibili: <BilibiliIcon />,
  xiaohongshu: <XiaohongshuIcon />,
  zhihu: <ZhihuIcon />,
  weixin: <WeixinIcon />,
};

interface FooterInnerProps {
  site: any;
  friendlyLinks: Array<{ label: string; href: string }>;
  socialLinks: Array<{ platform: string; url: string }>;
}

export default function FooterInner({ site, friendlyLinks, socialLinks }: FooterInnerProps) {
  const { t } = useTranslation();

  const PLATFORM_NAMES: Record<string, string> = {
    weibo: t("footer.socialPlatforms.weibo"),
    douyin: t("footer.socialPlatforms.douyin"),
    bilibili: t("footer.socialPlatforms.bilibili"),
    xiaohongshu: t("footer.socialPlatforms.xiaohongshu"),
    zhihu: t("footer.socialPlatforms.zhihu"),
    weixin: t("footer.socialPlatforms.weixin"),
  };

  const sitemapColumns = [
    {
      title: t("footer.aboutSection"),
      links: [
        { label: t("footer.companyIntro"), href: "/about#intro" },
        { label: t("footer.timeline"), href: "/about#timeline" },
        { label: t("footer.honors"), href: "/about#honors" },
        { label: t("footer.partners"), href: "/about#partners" },
        { label: t("footer.joinUs"), href: "/join" },
      ],
    },
    {
      title: t("header.services"),
      links: [
        { label: t("header.aiCurriculum"), href: "/services/ai-curriculum" },
        { label: t("header.teacherTraining"), href: "/services/teacher-training" },
        { label: t("header.aiResearchStudy"), href: "/services/ai-research-study" },
        { label: t("header.ecosystemAlliance"), href: "/services/ecosystem-alliance" },
      ],
    },
    {
      title: t("header.ecosystem"),
      links: [
        { label: t("header.enterpriseTraining"), href: "/ecosystem/enterprise-training" },
        { label: t("header.opc"), href: "/ecosystem/opc" },
        { label: t("header.smartServices"), href: "/ecosystem/smart-services" },
        { label: t("header.assetRevitalization"), href: "/ecosystem/asset-revitalization" },
      ],
    },
    {
      title: t("header.cases"),
      links: [
        { label: t("cases.schools"), href: "/cases#schools" },
        { label: t("cases.honors"), href: "/cases#honors" },
        { label: t("cases.coverage"), href: "/cases#coverage" },
      ],
    },
    {
      title: t("header.news"),
      links: [
        { label: t("news.categories.company"), href: "/news?category=company" },
        { label: t("news.categories.industry"), href: "/news?category=industry" },
        { label: t("news.categories.media"), href: "/news?category=media" },
      ],
    },
  ];

  return (
    <footer className="bg-[#0F2557] text-white/80">
      {/* Row 1: Sitemap */}
      <div className="mx-auto max-w-[1200px] px-6 pt-12 pb-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {sitemapColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-4 text-base font-semibold text-white">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Friendly Links */}
        {friendlyLinks.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-x-1 border-t border-white/10 pt-6 text-sm text-white/50">
            <span className="mr-2 text-white/70">{t("footer.friendlyLinks")}：</span>
            {friendlyLinks.map((link, index) => (
              <span key={link.href} className="flex items-center">
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
                {index < friendlyLinks.length - 1 && (
                  <span className="mx-2">|</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Row 2: Company info + Row 3: QR codes & social */}
      <div className="border-t border-white/10 bg-[#0A1B3F]">
        <div className="mx-auto max-w-[1200px] px-6 py-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* Company information */}
            <div className="space-y-2 text-sm text-white/50">
              <p className="text-base font-medium text-white/80">
                {site.companyName}
              </p>
              <p>{t("footer.address")}{site.address}</p>
              <p>
                <a
                  href="https://beian.miit.gov.cn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {site.icp}
                </a>
              </p>
              <p>
                Copyright &copy; {new Date().getFullYear()} {site.copyright}
              </p>
            </div>

            {/* QR codes & social media */}
            <div className="flex flex-shrink-0 items-start gap-8">
              {/* WeChat Official Account QR */}
              {site.wechatOfficialQr && (
                <div className="flex flex-col items-center gap-2">
                  <QrCodeImage url={site.wechatOfficialQr as string | null} label={t("footer.wechatOfficial")} />
                  <span className="text-xs text-white/50">{t("footer.wechatOfficial")}</span>
                </div>
              )}

              {/* WeChat Customer Service QR */}
              {site.wechatServiceQr && (
                <div className="flex flex-col items-center gap-2">
                  <QrCodeImage url={site.wechatServiceQr as string | null} label={t("footer.wechatService")} />
                  <span className="text-xs text-white/50">{t("footer.wechatService")}</span>
                </div>
              )}

              {/* Social media links */}
              {socialLinks.length > 0 && (
                <div className="flex flex-col gap-3 pt-1">
                  <span className="text-xs font-medium text-white/60">
                    {t("footer.followUs")}
                  </span>
                  <div className="flex gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={PLATFORM_NAMES[link.platform] || link.platform}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
                      >
                        {SOCIAL_ICONS[link.platform] || null}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
EOF
```

- [ ] **Step 3: 修改 Footer.tsx 为服务端包装器**

现在需要修改 Footer.tsx，将其改为服务端组件，获取数据后传递给 FooterInner:

```tsx
import Link from "next/link";
import { loadSite } from "@/lib/data";
import FooterInner from "./FooterInner";

// Social media icon components 保持不变（在 FooterInner 中已复制）

const ICON_MAP: Record<string, React.ReactElement> = {
  // ... 保持原有图标映射
};

const PLATFORM_NAMES: Record<string, string> = {
  weibo: "微博",
  douyin: "抖音",
  bilibili: "哔哩哔哩",
  xiaohongshu: "小红书",
  zhihu: "知乎",
  weixin: "微信视频号",
};

const sitemapColumns = [
  // ... 保持原有结构，这些作为默认值
];

export default async function Footer() {
  let site;
  try {
    site = await loadSite();
  } catch (error) {
    console.error('Failed to load site config:', error);
    site = {
      companyName: "北京海创元人工智能教育科技有限公司",
      address: "北京市海淀区中关村大街1号",
      icp: "京ICP备XXXXXXXX号-X",
      copyright: "北京海创元人工智能教育科技有限公司",
      friendlyLinks: [],
      socialLinks: [],
      wechatOfficialQr: null,
      wechatServiceQr: null,
    };
  }

  // Handle both old object format and new array format for friendlyLinks
  let friendlyLinks: Array<{ label: string; href: string }>;
  if (Array.isArray(site.friendlyLinks)) {
    friendlyLinks = site.friendlyLinks as Array<{ label: string; href: string }>;
  } else {
    friendlyLinks = [];
  }

  // Handle both old object format and new array format for socialLinks
  let socialLinks: Array<{ platform: string; url: string }>;
  if (Array.isArray(site.socialLinks)) {
    socialLinks = site.socialLinks as Array<{ platform: string; url: string }>;
  } else if (site.socialLinks && typeof site.socialLinks === 'object' && !Array.isArray(site.socialLinks)) {
    const oldFormat = site.socialLinks as Record<string, string>;
    socialLinks = Object.entries(oldFormat)
      .filter(([_, url]) => url && url.trim() !== '')
      .map(([platform, url]) => ({ platform, url }));
  } else {
    socialLinks = [];
  }

  return <FooterInner site={site} friendlyLinks={friendlyLinks} socialLinks={socialLinks} />;
}
```

注意：需要将 Footer.tsx 中原有的 JSX 代码移除，只保留数据获取逻辑和 FooterInner 渲染。

- [ ] **Step 4: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/Footer.tsx src/components/FooterInner.tsx
```

Expected: 无错误输出

- [ ] **Step 5: 提交**

```bash
git add src/components/Footer.tsx src/components/FooterInner.tsx
git commit -m "i18n: add translations to Footer component via FooterInner client component"
```

---

## Task 11: 改造 HomeClient 组件

**Files:**
- Modify: `src/components/HomeClient.tsx`

- [ ] **Step 1: 添加 useTranslation 导入**

在文件顶部添加:

```tsx
import { useTranslation } from "@/hooks/useTranslation";
```

- [ ] **Step 2: 在组件内添加翻译 hook**

```tsx
const { t } = useTranslation();
```

- [ ] **Step 3: 更新 eduCards 和 ecoCards 数据**

将静态数据改为使用 t():

```tsx
const eduCards = [
  {
    title: t("services.aiCurriculum.title"),
    desc: t("services.aiCurriculum.desc"),
    href: "/services/ai-curriculum",
  },
  {
    title: t("services.teacherTraining.title"),
    desc: t("services.teacherTraining.desc"),
    href: "/services/teacher-training",
  },
  {
    title: t("services.aiResearchStudy.title"),
    desc: t("services.aiResearchStudy.desc"),
    href: "/services/ai-research-study",
  },
  {
    title: t("services.ecosystemAlliance.title"),
    desc: t("services.ecosystemAlliance.desc"),
    href: "/services/ecosystem-alliance",
  },
];

const ecoCards = [
  {
    title: t("ecosystem.enterpriseTraining.title"),
    desc: t("ecosystem.enterpriseTraining.desc"),
    href: "/ecosystem/enterprise-training",
  },
  {
    title: t("ecosystem.opc.title"),
    desc: t("ecosystem.opc.desc"),
    href: "/ecosystem/opc",
  },
  {
    title: t("ecosystem.smartServices.title"),
    desc: t("ecosystem.smartServices.desc"),
    href: "/ecosystem/smart-services",
  },
  {
    title: t("ecosystem.assetRevitalization.title"),
    desc: t("ecosystem.assetRevitalization.desc"),
    href: "/ecosystem/asset-revitalization",
  },
];
```

- [ ] **Step 4: 更新 ctaButtons**

```tsx
const ctaButtons = [
  { label: t("home.cta.eduServices"), href: "/contact?type=智教服务集群" },
  { label: t("home.cta.ecoMatrix"), href: "/contact?type=产融生态矩阵" },
  { label: t("home.cta.enterpriseTraining"), href: "/contact?type=政企AI赋能培训" },
  { label: t("home.cta.opc"), href: "/contact?type=OPC生态" },
  { label: t("home.cta.aiPartyBuilding"), href: "/contact?type=智创专项服务" },
];
```

- [ ] **Step 5: 更新页面内文本**

将硬编码文本替换为 t() 调用:
- "双轮驱动业务全景" → `t("home.businessOverview")`
- "智教服务集群" → `t("home.eduServices")`
- "产融生态矩阵" → `t("home.ecoMatrix")`
- "核心亮点" → `t("home.highlights")`
- "合作伙伴" → `t("home.partners")`
- "新闻动态" → `t("home.news")`
- "查看更多" → `t("home.viewMore")`
- "了解更多 →" → `${t("common.learnMore")} →`
- "AI赋能千行万业" → `t("home.cta.slogan")`
- "国企担当引领未来" → `t("home.cta.tagline")`
- "立即咨询" → `t("common.consultNow")`

- [ ] **Step 6: 更新 iconMap 键名**

需要保持 iconMap 使用中文键名（因为数据条数据从数据库获取），但可以添加映射:

```tsx
const iconMap: Record<string, string> = {
  [t("home.dataStrip.coverage")]: "map",
  [t("home.dataStrip.schools")]: "school",
  [t("home.dataStrip.channels")]: "network",
  [t("home.dataStrip.champions")]: "trophy",
  [t("home.dataStrip.nationalChampions")]: "medal",
  [t("home.dataStrip.hours")]: "clock",
  // 保持中文键名兼容
  "覆盖省市": "map",
  "服务院校": "school",
  "合作渠道": "network",
  "全球总冠军": "trophy",
  "全国总冠军": "medal",
  "累计授课": "clock",
};
```

- [ ] **Step 7: 验证 TypeScript 编译**

```bash
npx tsc --noEmit src/components/HomeClient.tsx
```

Expected: 无错误输出

- [ ] **Step 8: 提交**

```bash
git add src/components/HomeClient.tsx
git commit -m "i18n: add translations to HomeClient component"
```

---

## Task 12: 改造 AboutPageClient 组件

**Files:**
- Modify: `src/components/AboutPageClient.tsx`

- [ ] **Step 1: 添加 useTranslation 导入**

```tsx
import { useTranslation } from "@/hooks/useTranslation";
```

- [ ] **Step 2: 添加翻译 hook**

```tsx
const { t } = useTranslation();
```

- [ ] **Step 3: 更新面包屑**

```tsx
<Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
  {t("about.breadcrumb.home")}
</Link>
// ...
<span className="text-[#1A3C8A] font-semibold">{t("about.breadcrumb.current")}</span>
```

- [ ] **Step 4: 更新 stats 数据**

```tsx
const stats = [
  { value: "30+", label: t("about.stats.coverage") },
  { value: "130+", label: t("about.stats.schools") },
  { value: "70+", label: t("about.stats.channels") },
];
```

注意：需要在翻译字典中添加 `about.stats` 键，或使用 `home.dataStrip` 的键。

- [ ] **Step 5: 更新 valueIcons 和 valueDescs**

保持使用中文键名（因为数据来自数据库），添加英文映射:

```tsx
const valueIcons: Record<string, string> = {
  "国企担当": "🏛",
  "创新驱动": "💡",
  "生态共赢": "🌐",
  "实战为本": "🎯",
  "教育为本": "🎯",
};
```

- [ ] **Step 6: 更新 honorTabs**

```tsx
const honorTabs = [
  t("about.honorTabs.all"),
  t("about.honorTabs.industry"),
  t("about.honorTabs.competition"),
  t("about.honorTabs.certification"),
  t("about.honorTabs.patent"),
] as const;
```

- [ ] **Step 7: 更新页面文本**

- "公司简介" → `t("about.companyIntro")`
- "海淀国投集团全资企业" → `t("about.subsidiary")`
- "企业文化" → `t("about.culture")`
- 等等...

- [ ] **Step 8: 验证并提交**

```bash
npx tsc --noEmit src/components/AboutPageClient.tsx
git add src/components/AboutPageClient.tsx
git commit -m "i18n: add translations to AboutPageClient component"
```

---

## Task 13: 改造 ContactPageClient 组件

**Files:**
- Modify: `src/components/ContactPageClient.tsx`

- [ ] **Step 1: 添加 useTranslation 导入**

```tsx
import { useTranslation } from "@/hooks/useTranslation";
```

- [ ] **Step 2: 添加翻译 hook**

```tsx
const { t } = useTranslation();
```

- [ ] **Step 3: 更新 contactStyles**

保持使用中文键名（因为部门名来自数据库）:

```tsx
const contactStyles: Record<string, { gradient: string; color: string }> = {
  "综合业务": { gradient: "from-[#1A3C8A] to-[#2B6CB0]", color: "#1A3C8A" },
  "智教服务集群": { gradient: "from-[#1565C0] to-[#1A3C8A]", color: "#1565C0" },
  "产融生态矩阵": { gradient: "from-[#00796B] to-[#004D40]", color: "#00796B" },
  "政企AI赋能培训": { gradient: "from-[#00796B] to-[#004D40]", color: "#00796B" },
  "OPC生态 / AI党建": { gradient: "from-[#D4A843] to-[#B8860B]", color: "#D4A843" },
};
```

- [ ] **Step 4: 更新 needTypes**

```tsx
const needTypes = [
  t("contact.form.needTypes.aiCurriculum"),
  t("contact.form.needTypes.teacherTraining"),
  t("contact.form.needTypes.aiResearchStudy"),
  t("contact.form.needTypes.ecosystemAlliance"),
  t("contact.form.needTypes.enterpriseTraining"),
  t("contact.form.needTypes.opc"),
  t("contact.form.needTypes.smartServices"),
  t("contact.form.needTypes.assetRevitalization"),
  t("contact.form.needTypes.aiPartyBuilding"),
  t("contact.form.needTypes.other"),
];
```

- [ ] **Step 5: 更新表单标签和错误消息**

- "姓名" → `t("contact.form.name")`
- "单位" → `t("contact.form.company")`
- "电话" → `t("contact.form.phone")`
- "邮箱" → `t("contact.form.email")`
- "需求类型" → `t("contact.form.needType")`
- "留言" → `t("contact.form.message")`
- placeholder 文本使用 `t("contact.form.placeholder.xxx")`
- 错误消息使用 `t("contact.form.errors.networkError")`

- [ ] **Step 6: 更新成功消息**

```tsx
<h3 className="text-2xl font-bold text-[#1A3C8A] mb-3">{t("contact.form.success.title")}</h3>
<p className="text-[#666666] mb-8">
  {t("contact.form.success.message")}
</p>
```

- [ ] **Step 7: 更新页面其他文本**

- 面包屑导航
- 页面标题和副标题
- 联系方式标签
- 微信客服部分

- [ ] **Step 8: 验证并提交**

```bash
npx tsc --noEmit src/components/ContactPageClient.tsx
git add src/components/ContactPageClient.tsx
git commit -m "i18n: add translations to ContactPageClient component"
```

---

## Task 14: 改造 JoinPageClient 组件

**Files:**
- Modify: `src/components/JoinPageClient.tsx`

- [ ] **Step 1: 添加 useTranslation 导入和 hook**

```tsx
import { useTranslation } from "@/hooks/useTranslation";

const { t } = useTranslation();
```

- [ ] **Step 2: 更新面包屑和页面标题**

```tsx
// 面包屑
{t("join.breadcrumb.home")}
{t("join.breadcrumb.current")}

// 页面标题
{t("join.title")}
{t("join.subtitle")}
```

- [ ] **Step 3: 验证并提交**

```bash
npx tsc --noEmit src/components/JoinPageClient.tsx
git add src/components/JoinPageClient.tsx
git commit -m "i18n: add translations to JoinPageClient component"
```

---

## Task 15: 改造 NewsListClient 组件

**Files:**
- Modify: `src/components/NewsListClient.tsx`

- [ ] **Step 1: 添加 useTranslation 导入和 hook**

```tsx
import { useTranslation } from "@/hooks/useTranslation";

const { t } = useTranslation();
```

- [ ] **Step 2: 更新分类标签**

```tsx
const categories = [
  { value: "all", label: t("news.categories.all") },
  { value: "company", label: t("news.categories.company") },
  { value: "industry", label: t("news.categories.industry") },
  { value: "media", label: t("news.categories.media") },
];
```

- [ ] **Step 3: 更新面包屑和页面标题**

- [ ] **Step 4: 验证并提交**

```bash
npx tsc --noEmit src/components/NewsListClient.tsx
git add src/components/NewsListClient.tsx
git commit -m "i18n: add translations to NewsListClient component"
```

---

## Task 16: 验证和测试

**Files:**
- Test: 所有已修改的组件

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

在后台运行或新终端中执行。

- [ ] **Step 2: 测试语言切换功能**

访问 http://localhost:3000

1. 点击 Header 右侧的 "中/EN" 切换按钮
2. 验证导航项文本切换
3. 验证页面内容切换
4. 刷新页面，验证语言选择被记住

- [ ] **Step 3: 测试所有页面**

依次访问以下页面，验证中英文切换:
- `/` - 首页
- `/about` - 关于我们
- `/contact` - 联系我们
- `/join` - 加入我们
- `/news` - 新闻动态
- `/cases` - 案例与成果
- `/services` - 智教服务集群
- `/ecosystem` - 产融生态矩阵

- [ ] **Step 4: 测试移动端**

1. 使用浏览器开发者工具切换到移动视图
2. 打开移动菜单
3. 点击移动端语言切换按钮
4. 验证语言切换

- [ ] **Step 5: 检查控制台错误**

打开浏览器开发者工具 Console，检查是否有:
- Hydration 警告
- Missing translation 警告
- 其他错误

- [ ] **Step 6: 测试浏览器语言检测**

1. 清除 localStorage: `localStorage.clear()`
2. 将浏览器语言设置为英语
3. 刷新页面
4. 验证页面默认显示英文

- [ ] **Step 7: 创建测试提交**

```bash
git add .
git commit -m "test: complete i18n implementation testing"
```

---

## Task 17: 清理备份文件

**Files:**
- Delete: `src/app/layout.tsx.backup`
- Delete: `src/components/Header.tsx.backup`
- Delete: `src/components/Footer.tsx.backup`

- [ ] **Step 1: 删除备份文件**

```bash
rm -f src/app/layout.tsx.backup
rm -f src/components/Header.tsx.backup
rm -f src/components/Footer.tsx.backup
```

- [ ] **Step 2: 验证所有文件正常**

```bash
npm run build
```

Expected: 构建成功，无错误

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "chore: remove backup files after i18n implementation"
```

---

## 完成检查清单

- [ ] 所有组件已添加翻译
- [ ] 语言切换功能正常
- [ ] localStorage 持久化正常
- [ ] 浏览器语言检测正常
- [ ] 移动端语言切换正常
- [ ] 无控制台错误
- [ ] 无 hydration 警告
- [ ] 备份文件已清理
- [ ] 代码已提交到 git
