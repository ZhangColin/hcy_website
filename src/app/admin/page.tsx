"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { ImageButton } from "@/components/ImageButton";

// ─── Types ───────────────────────────────────────────────────────────────────

type CollectionKey = "home" | "news" | "about" | "partners" | "cases" | "contact" | "site" | "join" | "consultations";

interface NavItem {
  key: CollectionKey;
  label: string;
}

interface SocialLink {
  platform: 'weibo' | 'douyin' | 'bilibili' | 'xiaohongshu' | 'zhihu' | 'weixin';
  url: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "首页内容" },
  { key: "news", label: "新闻管理" },
  { key: "about", label: "关于我们" },
  { key: "partners", label: "合作伙伴" },
  { key: "cases", label: "案例管理" },
  { key: "contact", label: "联系方式" },
  { key: "site", label: "站点设置" },
  { key: "join", label: "招聘管理" },
  { key: "consultations", label: "咨询管理" },
];

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}

// ─── Generic Field Editor ────────────────────────────────────────────────────

function FieldEditor({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent min-h-[100px]"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

// ─── Generic List Editor ─────────────────────────────────────────────────────

function ListEditor<T extends Record<string, unknown>>({
  title,
  items,
  onChange,
  renderItem,
  createItem,
}: {
  title: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (field: string, value: unknown) => void) => ReactNode;
  createItem: () => T;
}) {
  const addItem = () => onChange([...items, createItem()]);
  const removeItem = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: string, value: unknown) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: value };
    onChange(next);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="text-sm bg-[#1A3C8A] text-white px-3 py-1 rounded hover:bg-[#15306e] transition-colors"
        >
          + 添加
        </button>
      </div>
      {items.length === 0 && <p className="text-sm text-gray-400">暂无数据，点击添加按钮新增</p>}
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50 relative">
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold"
            title="删除"
          >
            &times;
          </button>
          {renderItem(item, i, (field, value) => updateItem(i, field, value))}
        </div>
      ))}
    </div>
  );
}

// ─── Section Wrapper ─────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      {children}
    </div>
  );
}

// ─── Home Editor ─────────────────────────────────────────────────────────────

function HomeEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const slides = (data.heroSlides as Record<string, string>[]) ?? [];
  const dataStrip = (data.dataStrip as Record<string, string>[]) ?? [];
  const highlights = (data.highlights as Record<string, string>[]) ?? [];
  const partners = (data.partners as Array<{ name: string; logo?: string; category?: string }> | string[]) ?? [];
  // 兼容旧格式：如果是字符串数组，转换为对象数组
  const normalizedPartners = partners.map((p) =>
    typeof p === "string" ? { name: p, logo: "", category: "strategic" } : p
  );

  return (
    <>
      <SectionCard title="Hero 轮播">
        <ListEditor
          title="轮播内容"
          items={slides}
          onChange={(v) => setData({ ...data, heroSlides: v })}
          createItem={() => ({ title: "", subtitle: "", cta: "", href: "", image: "" })}
          renderItem={(item, _i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
                <FieldEditor label="副标题" value={item.subtitle} onChange={(v) => update("subtitle", v)} />
                <FieldEditor label="按钮文字" value={item.cta} onChange={(v) => update("cta", v)} />
                <FieldEditor label="链接" value={item.href} onChange={(v) => update("href", v)} />
              </div>
              <ImageButton
                label="背景图片"
                value={(item.image as string) || ""}
                onChange={(v) => update("image", v)}
                type="hero"
              />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="数据条">
        <ListEditor
          title="数据项"
          items={dataStrip}
          onChange={(v) => setData({ ...data, dataStrip: v })}
          createItem={() => ({ label: "", value: "", suffix: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FieldEditor label="标签" value={item.label} onChange={(v) => update("label", v)} />
              <FieldEditor label="数值" value={item.value} onChange={(v) => update("value", v)} />
              <FieldEditor label="后缀" value={item.suffix} onChange={(v) => update("suffix", v)} />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="亮点">
        <ListEditor
          title="亮点列表"
          items={highlights}
          onChange={(v) => setData({ ...data, highlights: v })}
          createItem={() => ({ title: "", text: "", image: "" })}
          renderItem={(item, _i, update) => (
            <>
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="描述" value={item.text} onChange={(v) => update("text", v)} multiline />
              <ImageButton
                label="图片"
                value={(item.image as string) || ""}
                onChange={(v) => update("image", v)}
                type="highlights"
              />
            </>
          )}
        />
      </SectionCard>
    </>
  );
}

// ─── News Editor ─────────────────────────────────────────────────────────────

function NewsEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const articles = (data.articles as Record<string, string>[]) ?? [];

  return (
    <SectionCard title="新闻文章">
      <ListEditor
        title="文章列表"
        items={articles}
        onChange={(v) => setData({ ...data, articles: v })}
        createItem={() => ({
          title: "",
          excerpt: "",
          content: "",
          category: "company",
          date: new Date().toISOString().slice(0, 10),
          image: "",
        })}
        renderItem={(item, _i, update) => (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                  value={item.category ?? "company"}
                  onChange={(e) => update("category", e.target.value)}
                >
                  <option value="company">公司动态</option>
                  <option value="industry">行业资讯</option>
                  <option value="media">媒体报道</option>
                </select>
              </div>
              <FieldEditor label="日期" value={item.date} onChange={(v) => update("date", v)} placeholder="YYYY-MM-DD" />
              <ImageButton
                label="封面图片"
                value={item.image}
                onChange={(v) => update("image", v)}
                type="news"
              />
            </div>
            <FieldEditor label="摘要" value={item.excerpt} onChange={(v) => update("excerpt", v)} multiline />
            <FieldEditor label="正文内容" value={item.content} onChange={(v) => update("content", v)} multiline />
          </>
        )}
      />
    </SectionCard>
  );
}

// ─── About Editor ────────────────────────────────────────────────────────────

function AboutEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const intro = (data.intro as Record<string, string>) ?? { title: "", subtitle: "", description: "" };
  const culture = (data.culture as Record<string, unknown>) ?? { mission: "", vision: "", values: [] };
  const values = (culture.values as string[]) ?? [];
  const timeline = (data.timeline as Record<string, string>[]) ?? [];
  const honors = (data.honors as Record<string, string>[]) ?? [];

  const setIntro = (field: string, value: string) =>
    setData({ ...data, intro: { ...intro, [field]: value } });
  const setCulture = (field: string, value: unknown) =>
    setData({ ...data, culture: { ...culture, [field]: value } });

  return (
    <>
      <SectionCard title="公司简介">
        <FieldEditor label="标题" value={intro.title} onChange={(v) => setIntro("title", v)} />
        <FieldEditor label="副标题" value={intro.subtitle} onChange={(v) => setIntro("subtitle", v)} />
        <FieldEditor label="描述" value={intro.description} onChange={(v) => setIntro("description", v)} multiline />
      </SectionCard>

      <SectionCard title="企业文化">
        <FieldEditor label="使命" value={(culture.mission as string) ?? ""} onChange={(v) => setCulture("mission", v)} />
        <FieldEditor label="愿景" value={(culture.vision as string) ?? ""} onChange={(v) => setCulture("vision", v)} />
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">价值观</h3>
          <button
            type="button"
            onClick={() => setCulture("values", [...values, ""])}
            className="text-sm bg-[#1A3C8A] text-white px-3 py-1 rounded hover:bg-[#15306e] transition-colors"
          >
            + 添加
          </button>
        </div>
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={v}
              onChange={(e) => {
                const next = [...values];
                next[i] = e.target.value;
                setCulture("values", next);
              }}
            />
            <button
              type="button"
              onClick={() => setCulture("values", values.filter((_, idx) => idx !== i))}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
      </SectionCard>

      <SectionCard title="发展历程">
        <ListEditor
          title="里程碑"
          items={timeline}
          onChange={(v) => setData({ ...data, timeline: v })}
          createItem={() => ({ year: "", title: "", desc: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FieldEditor label="年份" value={item.year} onChange={(v) => update("year", v)} />
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="描述" value={item.desc} onChange={(v) => update("desc", v)} />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="荣誉资质">
        <ListEditor
          title="荣誉列表"
          items={honors}
          onChange={(v) => setData({ ...data, honors: v })}
          createItem={() => ({ title: "", category: "", image: "" })}
          renderItem={(item, _i, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldEditor label="荣誉名称" value={item.title} onChange={(v) => update("title", v)} />
                <FieldEditor label="类别" value={item.category} onChange={(v) => update("category", v)} />
              </div>
              <ImageButton
                label="图片"
                value={(item.image as string) || ""}
                onChange={(v) => update("image", v)}
                type="honors"
              />
            </div>
          )}
        />
      </SectionCard>
    </>
  );
}

// ─── Cases Editor ────────────────────────────────────────────────────────────

function CasesEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const schools = (data.schools as Record<string, string>[]) ?? [];
  const competitions = (data.competitions as Record<string, string>[]) ?? [];

  return (
    <>
      <SectionCard title="学校案例">
        <ListEditor
          title="案例列表"
          items={schools}
          onChange={(v) => setData({ ...data, schools: v })}
          createItem={() => ({ name: "", type: "", region: "", stage: "", summary: "" })}
          renderItem={(item, _i, update) => (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldEditor label="学校名称" value={item.name} onChange={(v) => update("name", v)} />
                <FieldEditor label="类型" value={item.type} onChange={(v) => update("type", v)} />
                <FieldEditor label="地区" value={item.region} onChange={(v) => update("region", v)} />
                <FieldEditor label="阶段" value={item.stage} onChange={(v) => update("stage", v)} />
              </div>
              <FieldEditor label="概要" value={item.summary} onChange={(v) => update("summary", v)} multiline />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="竞赛荣誉">
        <ListEditor
          title="荣誉列表"
          items={competitions}
          onChange={(v) => setData({ ...data, competitions: v })}
          createItem={() => ({ title: "", level: "", year: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <FieldEditor label="荣誉名称" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="级别" value={item.level} onChange={(v) => update("level", v)} />
              <FieldEditor label="年份" value={item.year} onChange={(v) => update("year", v)} />
            </div>
          )}
        />
      </SectionCard>
    </>
  );
}

// ─── Contact Editor ──────────────────────────────────────────────────────────

function ContactEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const contacts = (data.contacts as Record<string, string>[]) ?? [];

  return (
    <SectionCard title="联系人">
      <ListEditor
        title="联系人列表"
        items={contacts}
        onChange={(v) => setData({ ...data, contacts: v })}
        createItem={() => ({ department: "", person: "", phone: "", email: "", avatar: "" })}
        renderItem={(item, _i, update) => (
          <>
            <ImageButton
              label="头像"
              value={(item.avatar as string) || ""}
              onChange={(v) => update("avatar", v)}
              type="contacts"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="部门" value={item.department} onChange={(v) => update("department", v)} />
              <FieldEditor label="联系人" value={item.person} onChange={(v) => update("person", v)} />
              <FieldEditor label="电话" value={item.phone} onChange={(v) => update("phone", v)} />
              <FieldEditor label="邮箱" value={item.email} onChange={(v) => update("email", v)} />
            </div>
          </>
        )}
      />
    </SectionCard>
  );
}

// ─── Site Editor ─────────────────────────────────────────────────────────────

function SiteEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const links = (data.friendlyLinks as Record<string, string>[]) ?? [];
  const socialLinks = (data.socialLinks as SocialLink[]) ?? [];

  return (
    <>
      <SectionCard title="基本信息">
        <FieldEditor label="公司全称" value={(data.companyName as string) ?? ""} onChange={(v) => setData({ ...data, companyName: v })} />
        <FieldEditor label="公司简称" value={(data.shortName as string) ?? ""} onChange={(v) => setData({ ...data, shortName: v })} />
        <FieldEditor label="公司地址" value={(data.address as string) ?? ""} onChange={(v) => setData({ ...data, address: v })} />
        <FieldEditor label="联系电话" value={(data.phone as string) ?? ""} onChange={(v) => setData({ ...data, phone: v })} />
        <FieldEditor label="电子邮箱" value={(data.email as string) ?? ""} onChange={(v) => setData({ ...data, email: v })} />
        <FieldEditor label="地图经度" value={(data.mapLng as string) ?? ""} onChange={(v) => setData({ ...data, mapLng: v })} placeholder="如：116.397428" />
        <FieldEditor label="地图纬度" value={(data.mapLat as string) ?? ""} onChange={(v) => setData({ ...data, mapLat: v })} placeholder="如：39.90923" />
        <FieldEditor label="ICP备案号" value={(data.icp as string) ?? ""} onChange={(v) => setData({ ...data, icp: v })} />
        <FieldEditor label="版权信息" value={(data.copyright as string) ?? ""} onChange={(v) => setData({ ...data, copyright: v })} />
      </SectionCard>

      <SectionCard title="微信二维码">
        <ImageButton
          label="微信公众号二维码"
          value={(data.wechatOfficialQr as string) || ""}
          onChange={(v) => setData({ ...data, wechatOfficialQr: v })}
          type="qrcode"
        />
        <ImageButton
          label="微信客服二维码"
          value={(data.wechatServiceQr as string) || ""}
          onChange={(v) => setData({ ...data, wechatServiceQr: v })}
          type="qrcode"
        />
      </SectionCard>

      <SectionCard title="友情链接">
        <ListEditor
          title="链接列表"
          items={links}
          onChange={(v) => setData({ ...data, friendlyLinks: v })}
          createItem={() => ({ label: "", href: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="名称" value={item.label} onChange={(v) => update("label", v)} />
              <FieldEditor label="链接" value={item.href} onChange={(v) => update("href", v)} />
            </div>
          )}
        />
      </SectionCard>

      <SectionCard title="社交媒体">
        <ListEditor
          title="社交媒体链接"
          items={socialLinks}
          onChange={(v) => setData({ ...data, socialLinks: v })}
          createItem={() => ({ platform: 'weibo' as const, url: '' })}
          renderItem={(item, index, update) => (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">平台</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={item.platform}
                    onChange={(e) => update('platform', e.target.value as SocialLink['platform'])}
                  >
                    <option value="weibo">微博</option>
                    <option value="douyin">抖音</option>
                    <option value="bilibili">哔哩哔哩</option>
                    <option value="xiaohongshu">小红书</option>
                    <option value="zhihu">知乎</option>
                    <option value="weixin">微信视频号</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">链接</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={item.url}
                    onChange={(e) => update('url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...socialLinks];
                    if (index > 0) {
                      [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
                      setData({ ...data, socialLinks: newLinks });
                    }
                  }}
                  disabled={index === 0}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  上移
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newLinks = [...socialLinks];
                    if (index < socialLinks.length - 1) {
                      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
                      setData({ ...data, socialLinks: newLinks });
                    }
                  }}
                  disabled={index === socialLinks.length - 1}
                  className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
                >
                  下移
                </button>
              </div>
            </div>
          )}
        />
      </SectionCard>
    </>
  );
}

// ─── Join Editor ─────────────────────────────────────────────────────────────

function JoinEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const positions = (data.positions as Record<string, unknown>[]) ?? [];

  return (
    <SectionCard title="招聘岗位">
      <ListEditor
        title="岗位列表"
        items={positions as Record<string, unknown>[]}
        onChange={(v) => setData({ ...data, positions: v })}
        createItem={() => ({
          title: "",
          department: "",
          location: "",
          type: "",
          description: "",
          requirements: [] as string[],
        })}
        renderItem={(item, _i, update) => {
          const reqs = (item.requirements as string[]) ?? [];
          return (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FieldEditor label="职位名称" value={(item.title as string) ?? ""} onChange={(v) => update("title", v)} />
                <FieldEditor label="部门" value={(item.department as string) ?? ""} onChange={(v) => update("department", v)} />
                <FieldEditor label="工作地点" value={(item.location as string) ?? ""} onChange={(v) => update("location", v)} />
                <FieldEditor label="类型" value={(item.type as string) ?? ""} onChange={(v) => update("type", v)} placeholder="全职/兼职/实习" />
              </div>
              <FieldEditor label="职位描述" value={(item.description as string) ?? ""} onChange={(v) => update("description", v)} multiline />
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">任职要求</h4>
                <button
                  type="button"
                  onClick={() => update("requirements", [...reqs, ""])}
                  className="text-xs bg-[#1A3C8A] text-white px-2 py-1 rounded hover:bg-[#15306e] transition-colors"
                >
                  + 添加要求
                </button>
              </div>
              {reqs.map((r, ri) => (
                <div key={ri} className="flex items-center gap-2 mb-2">
                  <input
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={r}
                    onChange={(e) => {
                      const next = [...reqs];
                      next[ri] = e.target.value;
                      update("requirements", next);
                    }}
                    placeholder="任职要求"
                  />
                  <button
                    type="button"
                    onClick={() => update("requirements", reqs.filter((_, idx) => idx !== ri))}
                    className="text-red-500 hover:text-red-700 font-bold text-sm"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </>
          );
        }}
      />
    </SectionCard>
  );
}

// ─── Partners Editor ───────────────────────────────────────────────────────────

function PartnersEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const partners = (data.partners as Array<{ name: string; logo?: string; category?: string }> | string[]) ?? [];
  // 兼容旧格式
  const normalizedPartners = partners.map((p) =>
    typeof p === "string" ? { name: p, logo: "", category: "strategic" } : { ...p, category: p.category || "strategic" }
  );

  return (
    <SectionCard title="合作伙伴">
      <ListEditor
        title="合作伙伴列表"
        items={normalizedPartners}
        onChange={(v) => setData({ ...data, partners: v })}
        createItem={() => ({ name: "", logo: "", category: "strategic" })}
        renderItem={(item, _i, update) => (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <FieldEditor label="名称" value={item.name} onChange={(v) => update("name", v)} />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                value={item.category || "strategic"}
                onChange={(e) => update("category", e.target.value)}
              >
                <option value="strategic">战略合作伙伴</option>
                <option value="ecosystem">生态代理品牌</option>
              </select>
            </div>
            <ImageButton
              label="Logo"
              value={(item.logo as string) || ""}
              onChange={(v) => update("logo", v)}
              type="partners"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
            />
          </div>
        )}
      />
    </SectionCard>
  );
}

// ─── Consultations Editor ───────────────────────────────────────────────────────

const NEED_TYPES = [
  "AI课程入校",
  "AI师资培训与认证",
  "AI研学",
  "生态产品联盟",
  "政企AI赋能培训",
  "OPC生态",
  "智创专项服务",
  "不良资产盘活",
  "AI党建业务",
  "其他",
] as const;

interface ConsultationItem {
  id: string;
  createdAt: string;
  name: string;
  company?: string | null;
  phone: string;
  email?: string | null;
  needType: string;
  message: string;
  handled: boolean;
  repliedAt?: string | null;
  replyNotes?: string | null;
}

interface ConsultationsListResponse {
  items: ConsultationItem[];
  total: number;
  page: number;
  limit: number;
}

function ConsultationsEditor() {
  const [items, setItems] = useState<ConsultationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 筛选状态
  const [search, setSearch] = useState("");
  const [needType, setNeedType] = useState("");
  const [handled, setHandled] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 分页状态
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  // 排序状态
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // 详情弹窗
  const [detailItem, setDetailItem] = useState<ConsultationItem | null>(null);
  const [detailNotes, setDetailNotes] = useState("");

  // 获取 token
  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载数据
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) params.append("search", search);
      if (needType) params.append("needType", needType);
      if (handled !== "") params.append("handled", handled);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);

      const res = await fetch(`/api/admin/consultations?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data: ConsultationsListResponse = await res.json();
        setItems(data.items);
        setTotal(data.total);
      }
    } catch {
      console.error("Failed to load consultations");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, needType, handled, startDate, endDate, sortBy, order]);

  // 初始加载和筛选变化时重新加载
  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // 全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(items.map((item) => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // 单选
  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  // 批量操作
  const handleBatchAction = async (action: "markHandled" | "markUnhandled" | "delete") => {
    if (selectedIds.size === 0) return;
    try {
      const res = await fetch("/api/admin/consultations/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ids: Array.from(selectedIds),
          action,
        }),
      });
      if (res.ok) {
        setSelectedIds(new Set());
        loadItems();
      }
    } catch {
      console.error("Batch action failed");
    }
  };

  // 导出 CSV
  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (needType) params.append("needType", needType);
      if (handled !== "") params.append("handled", handled);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/consultations/export?${params}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `consultations_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch {
      console.error("Export failed");
    }
  };

  // 打开详情
  const openDetail = (item: ConsultationItem) => {
    setDetailItem(item);
    setDetailNotes(item.replyNotes ?? "");
  };

  // 保存详情
  const saveDetail = async () => {
    if (!detailItem) return;
    try {
      const res = await fetch(`/api/admin/consultations/${detailItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          handled: detailItem.handled,
          replyNotes: detailNotes,
        }),
      });
      if (res.ok) {
        setDetailItem(null);
        loadItems();
      }
    } catch {
      console.error("Save detail failed");
    }
  };

  // 删除单条
  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这条咨询吗？")) return;
    try {
      const res = await fetch(`/api/admin/consultations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        loadItems();
      }
    } catch {
      console.error("Delete failed");
    }
  };

  // 排序处理
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* 筛选栏 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              placeholder="姓名/电话/邮箱/单位"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">需求类型</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={needType}
              onChange={(e) => {
                setNeedType(e.target.value);
                setPage(1);
              }}
            >
              <option value="">全部</option>
              {NEED_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={handled}
              onChange={(e) => {
                setHandled(e.target.value);
                setPage(1);
              }}
            >
              <option value="">全部</option>
              <option value="false">未回复</option>
              <option value="true">已回复</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">共 {total} 条记录</p>
          <button
            onClick={handleExport}
            className="text-sm bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            导出 CSV
          </button>
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedIds.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-blue-800">已选择 {selectedIds.size} 条</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleBatchAction("markHandled")}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
            >
              标记已回复
            </button>
            <button
              onClick={() => handleBatchAction("markUnhandled")}
              className="text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              标记未回复
            </button>
            <button
              onClick={() => {
                if (confirm(`确定要删除选中的 ${selectedIds.size} 条记录吗？`)) {
                  handleBatchAction("delete");
                }
              }}
              className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      )}

      {/* 数据表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={items.length > 0 && selectedIds.size === items.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  提交时间 {sortBy === "createdAt" && (order === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left">姓名</th>
                <th className="px-4 py-3 text-left">单位</th>
                <th className="px-4 py-3 text-left">电话</th>
                <th className="px-4 py-3 text-left">需求类型</th>
                <th className="px-4 py-3 text-left">留言</th>
                <th className="px-4 py-3 text-left">状态</th>
                <th className="px-4 py-3 text-left">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    加载中...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={(e) => handleSelectOne(item.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleString("zh-CN")}
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.company ?? "-"}</td>
                    <td className="px-4 py-3">{item.phone}</td>
                    <td className="px-4 py-3">{item.needType}</td>
                    <td className="px-4 py-3 max-w-xs truncate" title={item.message}>
                      {item.message}
                    </td>
                    <td className="px-4 py-3">
                      {item.handled ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          已回复
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          未回复
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          查看
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              第 {(page - 1) * limit + 1} - {Math.min(page * limit, total)} 条，共 {total} 条
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                第 {page} / {totalPages} 页
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">咨询详情</h3>
                <button
                  onClick={() => setDetailItem(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">提交时间</label>
                    <p className="text-gray-900">{new Date(detailItem.createdAt).toLocaleString("zh-CN")}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">状态</label>
                    <p className="text-gray-900">
                      {detailItem.handled ? "已回复" : "未回复"}
                      {detailItem.repliedAt && ` (${new Date(detailItem.repliedAt).toLocaleString("zh-CN")})`}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">姓名</label>
                  <p className="text-gray-900">{detailItem.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">单位</label>
                  <p className="text-gray-900">{detailItem.company ?? "-"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">电话</label>
                    <p className="text-gray-900">{detailItem.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">邮箱</label>
                    <p className="text-gray-900">{detailItem.email ?? "-"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">需求类型</label>
                  <p className="text-gray-900">{detailItem.needType}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">留言</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{detailItem.message}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">回复备注</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] min-h-[100px]"
                    value={detailNotes}
                    onChange={(e) => setDetailNotes(e.target.value)}
                    placeholder="添加回复备注..."
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={detailItem.handled}
                      onChange={(e) =>
                        setDetailItem({ ...detailItem, handled: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">标记为已回复</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveDetail}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeSection, setActiveSection] = useState<CollectionKey>("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sectionData, setSectionData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Check session on mount
  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (token) setAuthed(true);
  }, []);

  // Show toast helper
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000);
  }, []);

  // Login
  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const result = await res.json();
        sessionStorage.setItem("admin_token", result.token ?? "authenticated");
        setAuthed(true);
      } else {
        setLoginError("密码错误，请重试");
      }
    } catch {
      setLoginError("登录失败，请检查网络");
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    setAuthed(false);
    setPassword("");
  };

  // Load section data
  const loadData = useCallback(async (section: CollectionKey) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("admin_token") ?? "";
      const res = await fetch(`/api/admin/${section}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const result = await res.json();
        setSectionData(result);
      } else {
        setSectionData({});
        showToast("加载失败", "error");
      }
    } catch {
      setSectionData({});
      showToast("加载失败，请检查网络", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Load on section change
  useEffect(() => {
    if (authed) loadData(activeSection);
  }, [authed, activeSection, loadData]);

  // Save
  const handleSave = async () => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("admin_token") ?? "";
      const res = await fetch(`/api/admin/${activeSection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sectionData),
      });
      if (res.ok) {
        showToast("已保存", "success");
      } else {
        showToast("保存失败", "error");
      }
    } catch {
      showToast("保存失败，请检查网络", "error");
    } finally {
      setSaving(false);
    }
  };

  // Render editor for active section
  const renderEditor = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 text-sm">加载中...</div>
        </div>
      );
    }

    const props = {
      data: sectionData,
      setData: setSectionData,
    };

    switch (activeSection) {
      case "home":
        return <HomeEditor {...props} />;
      case "news":
        return <NewsEditor {...props} />;
      case "about":
        return <AboutEditor {...props} />;
      case "partners":
        return <PartnersEditor {...props} />;
      case "cases":
        return <CasesEditor {...props} />;
      case "contact":
        return <ContactEditor {...props} />;
      case "site":
        return <SiteEditor {...props} />;
      case "join":
        return <JoinEditor {...props} />;
      case "consultations":
        return <ConsultationsEditor />;
      default:
        return null;
    }
  };

  // ── Login Screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#1A3C8A]">海创元后台管理</h1>
            <p className="text-sm text-gray-500 mt-1">请输入管理密码登录</p>
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent"
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>
          {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
          <button
            onClick={handleLogin}
            disabled={loginLoading || !password}
            className="w-full bg-[#1A3C8A] text-white py-3 rounded-lg font-medium hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginLoading ? "登录中..." : "登录"}
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Top Bar */}
      <header className="bg-[#1A3C8A] text-white h-14 flex items-center justify-between px-4 md:px-6 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="菜单"
          >
            &#9776;
          </button>
          <h1 className="text-lg font-bold tracking-wide">海创元后台管理</h1>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded transition-colors"
        >
          退出
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static top-14 left-0 h-[calc(100vh-3.5rem)] w-56 bg-[#1A3C8A] text-white z-20 transition-transform duration-200 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } shrink-0 overflow-y-auto`}
        >
          <nav className="py-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-6 py-3 text-sm transition-colors ${
                  activeSection === item.key
                    ? "bg-white/20 font-semibold border-r-4 border-white"
                    : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {NAV_ITEMS.find((n) => n.key === activeSection)?.label}
              </h2>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="bg-[#1A3C8A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>

            {/* Editor */}
            {renderEditor()}
          </div>
        </main>
      </div>
    </div>
  );
}
