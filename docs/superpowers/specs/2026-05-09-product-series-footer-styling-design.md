# 页脚产品系列区块样式改进设计

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 改进页脚"海创元系列产品"区块的视觉样式，从简陋的横向小卡片升级为有品质感的纵向品牌展示卡片。

**Scope:** 仅修改 `src/components/FooterInner.tsx` 中产品系列区块的 Tailwind 类名和 HTML 结构。不涉及数据结构、API、后台管理或国际化。

---

## 当前问题

- logo 仅 28x28px，太小不醒目
- 文字 `text-sm` 普通字重，视觉权重不足
- 横向布局 logo 和文字挤在一起，品牌辨识度低

## 设计方案：纵向卡片 + 金色辉光悬停

### 布局

- **方向：** 纵向 — logo 居上，名称居下
- **排列：** flex-wrap 居中，自适应换行
- **卡片间距：** 16px (gap-4)

### 卡片样式（普通状态）

| 属性 | 值 |
|------|------|
| 内边距 | 20px 28px (px-7 py-5) |
| 边框 | 1px solid rgba(255,255,255,0.1) (border border-white/10) |
| 背景 | rgba(255,255,255,0.04) (bg-white/[0.04]) |
| 圆角 | 12px (rounded-xl) |
| 最小宽度 | 140px (min-w-[140px]) |

### Logo 区域

| 属性 | 值 |
|------|------|
| 尺寸 | 48x48px (w-12 h-12) |
| 圆角 | 10px (rounded-[10px]) |
| 背景（有 logo） | transparent（无背景，只显示图片） |
| 背景（无 logo） | rgba(255,255,255,0.08) (bg-white/[0.08]) |
| 占位文字 | 首字符，font-bold text-xl，rgba(255,255,255,0.6) |

### 文字

| 属性 | 值 |
|------|------|
| 字号 | 14px (text-sm) |
| 字重 | 600 (font-semibold) |
| 颜色 | rgba(255,255,255,0.85) (text-white/85) |
| 间距 | margin-top 12px (mt-3) |

### 悬停效果（金色辉光）

| 属性 | 值 |
|------|------|
| 边框 | rgba(212,168,67,0.3) (hover:border-[#D4A843]/30) |
| 背景 | rgba(212,168,67,0.08) (hover:bg-[#D4A843]/[0.08]) |
| logo 区域背景 | rgba(212,168,67,0.15) |
| logo 区域文字 | rgba(212,168,67,0.9) |
| box-shadow | 0 0 20px rgba(212,168,67,0.1) (hover:shadow-[0_0_20px_rgba(212,168,67,0.1)]) |
| 文字颜色 | rgba(255,255,255,0.95) |
| 过渡 | all 0.3s ease (transition-all duration-300) |

### 无 logo 占位符（悬停状态）

- 背景：rgba(212,168,67,0.15)
- 文字：rgba(212,168,67,0.9)

## HTML 结构变更

从当前的 `flex items-center`（横向）改为 `flex flex-col items-center`（纵向），logo 和文字分别居中排列。

## 修改文件

- `src/components/FooterInner.tsx` — 产品系列区块（约第 213-252 行）

## 不变的部分

- 标题样式（保持不变：text-base font-semibold + 金色装饰线）
- 数据结构（ProductSeriesItem 接口不变）
- API / 后台管理（无改动）
- i18n 翻译（无改动）
