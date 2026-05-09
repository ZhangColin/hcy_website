# 友情链接 Logo 上传

## 目标

为友情链接添加可选的 Logo 图片上传功能，使用现有腾讯 COS 存储基础设施。

## 需求

- Logo 上传可选，未上传时显示纯文字链接
- 有 Logo 时，页脚中 Logo + 文字名称并排显示
- 图片存储到腾讯 COS，与其他模块一致
- Admin 编辑器中每个友情链接项增加 Logo 上传按钮

## 数据结构

```typescript
// Before
{ label: string; href: string }

// After
{ label: string; href: string; logo?: string }
```

`logo` 存储的是 COS 路径（如 `/links/20260509-abc123.jpg`），为可选字段。

## 改动清单

### 1. 上传白名单

**文件**: `src/app/api/upload/route.ts:11`

在 `ALLOWED_TYPES_DIRS` 数组中增加 `'links'`。

### 2. Admin 编辑器

**文件**: `src/app/admin/page.tsx` (友情链接 SectionCard 内的 ListEditor, ~L1014-1025)

- `createItem` 从 `() => ({ label: "", href: "" })` 改为 `() => ({ label: "", href: "", logo: "" })`
- `renderItem` 布局从 `grid-cols-2` 改为 `grid-cols-3`（md 断点），新增一列放置 `ImageButton`
- `ImageButton` 配置参照 Partners 的写法：
  ```tsx
  <ImageButton
    label="Logo"
    value={item.logo || ""}
    onChange={(v) => update("logo", v)}
    type="links"
    accept="image/jpeg,image/png,image/webp,image/svg+xml"
  />
  ```

### 3. 前端页脚显示

**文件**: `src/components/FooterInner.tsx`

- `FriendlyLink` 接口增加 `logo?: string`
- 渲染逻辑：有 `logo` 时显示图片 + 文字，无 `logo` 时只显示文字
- 图片使用 `h-5`（20px）高度，`w-auto` 保持比例，`object-contain`
- 图片路径通过 `NEXT_PUBLIC_IMAGE_BASE_URL` 拼接完整 URL

## 不改动的部分

- `ListEditor` 组件
- `ImageButton` 组件
- COS 上传/删除逻辑 (`src/lib/cos.ts`)
- 无新增组件或文件
