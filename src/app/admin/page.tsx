"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { ImageButton } from "@/components/ImageButton";

// ─── Types ───────────────────────────────────────────────────────────────────

type CollectionKey = "home" | "news" | "about" | "partners" | "cases" | "contact" | "site" | "join" | "consultations" | "users" | "experts" | "buttons";

interface NavItem {
  key: CollectionKey;
  label: string;
}

interface SocialLink {
  platform: 'weibo' | 'douyin' | 'bilibili' | 'xiaohongshu' | 'zhihu' | 'weixin';
  url: string;
}

interface AdminUser {
  id: string;
  username: string;
  name: string | null;
  role: string;
  createdAt: string;
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
  { key: "users", label: "账号管理" },
  { key: "experts", label: "专家团队" },
  { key: "buttons", label: "按钮管理" },
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

function ListEditor<T extends object>({
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

// Modal component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// School Case Form
function SchoolCaseForm({
  item,
  onChange,
}: {
  item: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  const colorOptions = [
    { value: "from-[#1A3C8A] to-[#2B6CB0]", label: "蓝色渐变" },
    { value: "from-[#2B6CB0] to-blue-500", label: "浅蓝渐变" },
    { value: "from-[#D4A843] to-amber-500", label: "金色渐变" },
    { value: "from-purple-600 to-indigo-600", label: "紫色渐变" },
    { value: "from-teal-600 to-cyan-600", label: "青色渐变" },
    { value: "from-rose-500 to-pink-600", label: "粉色渐变" },
  ];

  const gradeOptions = [
    { value: "小学", label: "小学" },
    { value: "初中", label: "初中" },
    { value: "高中", label: "高中" },
  ];

  const currentGrades = (item.grade as string[]) ?? [];
  const toggleGrade = (gradeValue: string) => {
    const updated = currentGrades.includes(gradeValue)
      ? currentGrades.filter((g) => g !== gradeValue)
      : [...currentGrades, gradeValue];
    onChange("grade", updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">学校名称 *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.name as string) || ""}
            onChange={(e) => onChange("name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地区 *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.region as string) || ""}
            onChange={(e) => onChange("region", e.target.value)}
          >
            <option value="">请选择</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="浙江">浙江</option>
            <option value="其他">其他</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">学段</label>
        <div className="flex gap-4">
          {gradeOptions.map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={currentGrades.includes(option.value)}
                onChange={() => toggleGrade(option.value)}
                className="rounded border-gray-300 text-[#1A3C8A] focus:ring-[#1A3C8A]"
              />
              <span className="text-sm text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">缩写</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.abbr as string) || ""}
            onChange={(e) => onChange("abbr", e.target.value)}
            placeholder="如：BZ"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.color as string) || "from-[#1A3C8A] to-[#2B6CB0]"}
            onChange={(e) => onChange("color", e.target.value)}
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">合作内容</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] min-h-[80px]"
          value={(item.partnership as string) || ""}
          onChange={(e) => onChange("partnership", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">成果</label>
        <textarea
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] min-h-[80px]"
          value={(item.results as string) || ""}
          onChange={(e) => onChange("results", e.target.value)}
        />
      </div>

      <ImageButton
        label="封面图"
        value={(item.coverImage as string) || ""}
        onChange={(v) => onChange("coverImage", v)}
        type="cases"
      />

      <ImageButton
        label="学校 Logo (可选)"
        value={(item.schoolLogo as string) || ""}
        onChange={(v) => onChange("schoolLogo", v)}
        type="cases/logo"
      />
    </div>
  );
}

// Competition Honor Form
function CompetitionForm({
  item,
  onChange,
}: {
  item: Record<string, unknown>;
  onChange: (field: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">赛事名称 *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.title as string) || ""}
            onChange={(e) => onChange("title", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">级别 *</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.level as string) || ""}
            onChange={(e) => onChange("level", e.target.value)}
          >
            <option value="">请选择</option>
            <option value="国际">国际</option>
            <option value="全国">全国</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年份 *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.year as string) || ""}
            onChange={(e) => onChange("year", e.target.value)}
            placeholder="如：2024"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">获奖成果 *</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
            value={(item.achievements as string) || ""}
            onChange={(e) => onChange("achievements", e.target.value)}
          />
        </div>
      </div>

      <ImageButton
        label="奖杯图片 (可选)"
        value={(item.image as string) || ""}
        onChange={(v) => onChange("image", v)}
        type="cases/trophy"
      />
    </div>
  );
}

function CasesEditor({ data, setData, showToast }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void; showToast: (message: string, type: "success" | "error") => void }) {
  const schools = (data.schoolCases as Record<string, unknown>[]) ?? [];
  const competitions = (data.competitionHonors as Record<string, string>[]) ?? [];
  const [saving, setSaving] = useState(false);

  // Immediate save to API
  const saveToApi = async (updatedData: Record<string, unknown>) => {
    setSaving(true);
    try {
      const token = sessionStorage.getItem("admin_token") ?? "";
      const res = await fetch("/api/admin/cases", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) {
        setData(updatedData);
        showToast("保存成功", "success");
      } else {
        const errorData = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`保存失败: ${errorData.error || "未知错误"}`, "error");
      }
    } catch (err) {
      console.error("保存异常:", err);
      showToast("保存失败，请检查网络", "error");
    } finally {
      setSaving(false);
    }
  };

  // School case modal state
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<Record<string, unknown> | null>(null);
  const [schoolFormData, setSchoolFormData] = useState<Record<string, unknown>>({});

  // Competition modal state
  const [competitionModalOpen, setCompetitionModalOpen] = useState(false);
  const [editingCompetition, setEditingCompetition] = useState<Record<string, unknown> | null>(null);
  const [competitionFormData, setCompetitionFormData] = useState<Record<string, unknown>>({});

  // Open school modal for add/edit
  const openSchoolModal = (school?: Record<string, unknown>) => {
    if (school) {
      setEditingSchool(school);
      setSchoolFormData({ ...school });
    } else {
      setEditingSchool(null);
      setSchoolFormData({
        name: "",
        region: "",
        grade: [] as string[],
        abbr: "",
        color: "from-[#1A3C8A] to-[#2B6CB0]",
        partnership: "",
        results: "",
        coverImage: "",
        schoolLogo: "",
      });
    }
    setSchoolModalOpen(true);
  };

  // Save school
  const saveSchool = async () => {
    if (!schoolFormData.name || !schoolFormData.region) {
      showToast("请填写学校名称和地区", "error");
      return;
    }
    let updated;
    if (editingSchool) {
      updated = schools.map((s) => (s === editingSchool ? schoolFormData : s));
    } else {
      updated = [...schools, schoolFormData];
    }
    const updatedData = { ...data, schoolCases: updated };
    await saveToApi(updatedData);
    setSchoolModalOpen(false);
  };

  // Delete school
  const deleteSchool = (school: Record<string, unknown>) => {
    if (confirm("确定删除此案例吗？")) {
      setData({ ...data, schoolCases: schools.filter((s) => s !== school) });
    }
  };

  // Open competition modal for add/edit
  const openCompetitionModal = (competition?: Record<string, unknown>) => {
    if (competition) {
      setEditingCompetition(competition);
      setCompetitionFormData({ ...competition });
    } else {
      setEditingCompetition(null);
      setCompetitionFormData({ title: "", level: "", year: "", achievements: "", image: "" });
    }
    setCompetitionModalOpen(true);
  };

  // Save competition
  const saveCompetition = async () => {
    if (!competitionFormData.title || !competitionFormData.level || !competitionFormData.year || !competitionFormData.achievements) {
      showToast("请填写所有必填项", "error");
      return;
    }
    let updated;
    if (editingCompetition) {
      updated = competitions.map((c) => (c === editingCompetition ? competitionFormData : c));
    } else {
      updated = [...competitions, competitionFormData];
    }
    const updatedData = { ...data, competitionHonors: updated };
    await saveToApi(updatedData);
    setCompetitionModalOpen(false);
  };

  // Delete competition
  const deleteCompetition = (competition: Record<string, unknown>) => {
    if (confirm("确定删除此荣誉吗？")) {
      setData({ ...data, competitionHonors: competitions.filter((c) => c !== competition) });
    }
  };

  return (
    <>
      {/* School Cases Section */}
      <SectionCard title="学校案例">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => openSchoolModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加案例
          </button>
        </div>

        {schools.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">暂无案例，点击上方按钮添加</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">学校名称</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">地区</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">学段</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">缩写</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {schools.map((school, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">{school.name as string}</td>
                    <td className="py-2 px-3">{school.region as string}</td>
                    <td className="py-2 px-3">{((school.grade as string[]) ?? []).join(", ")}</td>
                    <td className="py-2 px-3">{school.abbr as string}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => openSchoolModal(school)}
                        className="text-[#1A3C8A] hover:underline mr-3"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSchool(school)}
                        className="text-red-500 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={schoolModalOpen} onClose={() => setSchoolModalOpen(false)} title={editingSchool ? "编辑案例" : "添加案例"}>
          <SchoolCaseForm item={schoolFormData} onChange={(field, value) => setSchoolFormData({ ...schoolFormData, [field]: value })} />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setSchoolModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => saveSchool()}
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded-md hover:bg-[#15306e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </Modal>
      </SectionCard>

      {/* Competition Honors Section */}
      <SectionCard title="竞赛荣誉">
        <div className="mb-4">
          <button
            type="button"
            onClick={() => openCompetitionModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加荣誉
          </button>
        </div>

        {competitions.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">暂无荣誉，点击上方按钮添加</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-700">赛事名称</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">级别</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">年份</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">获奖成果</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {competitions.map((competition, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">{competition.title as string}</td>
                    <td className="py-2 px-3">{competition.level as string}</td>
                    <td className="py-2 px-3">{competition.year as string}</td>
                    <td className="py-2 px-3">{competition.achievements as string}</td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => openCompetitionModal(competition)}
                        className="text-[#1A3C8A] hover:underline mr-3"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCompetition(competition)}
                        className="text-red-500 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal isOpen={competitionModalOpen} onClose={() => setCompetitionModalOpen(false)} title={editingCompetition ? "编辑荣誉" : "添加荣誉"}>
          <CompetitionForm item={competitionFormData} onChange={(field, value) => setCompetitionFormData({ ...competitionFormData, [field]: value })} />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setCompetitionModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => saveCompetition()}
              disabled={saving}
              className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded-md hover:bg-[#15306e] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </Modal>
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
        <FieldEditor label="电子邮箱" value={(data.email as string) ?? ""} onChange={(v) => setData({ ...data, email: v })} placeholder="通用联系邮箱" />
        <FieldEditor label="HR简历邮箱" value={(data.hrEmail as string) ?? ""} onChange={(v) => setData({ ...data, hrEmail: v })} placeholder="接收简历的邮箱地址" />
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
  const positions = (data.jobPositions as Record<string, unknown>[]) ?? [];

  return (
    <SectionCard title="招聘岗位">
      <ListEditor
        title="岗位列表"
        items={positions as Record<string, unknown>[]}
        onChange={(v) => setData({ ...data, jobPositions: v })}
        createItem={() => ({
          title: "",
          department: "",
          location: "",
          type: "",
          description: "",
          requirements: [] as string[],
          order: positions.length,
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

function ConsultationsEditor({ showToast }: { showToast: (message: string, type: "success" | "error") => void }) {
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

// ─── Users Editor ────────────────────────────────────────────────────────────

function UsersEditor({ showToast }: { showToast: (message: string, type: "success" | "error") => void }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUser | null>(null);

  // 表单数据
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载用户列表
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  // 打开添加/编辑弹窗
  const openModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: "",
        name: user.name || "",
      });
    } else {
      setEditingUser(null);
      setFormData({ username: "", password: "", name: "" });
    }
    setModalOpen(true);
  };

  // 保存用户
  const saveUser = async () => {
    if (!formData.username || (editingUser ? false : !formData.password)) {
      showToast("请填写必填项", "error");
      return;
    }

    try {
      const token = getToken();
      let res;

      if (editingUser) {
        // 更新用户（只允许修改 name）
        res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: formData.name }),
        });
      } else {
        // 创建新用户
        res = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            name: formData.name || formData.username,
          }),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadUsers();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`操作失败: ${error.error}`, "error");
      }
    } catch {
      showToast("操作失败，请检查网络", "error");
    }
  };

  // 删除用户
  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`确定要删除用户 "${user.name || user.username}" 吗？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
        loadUsers();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`删除失败: ${error.error}`, "error");
      }
    } catch {
      showToast("删除失败，请检查网络", "error");
    }
  };

  // 打开密码重置弹窗
  const openPasswordModal = (user: AdminUser) => {
    setPasswordUser(user);
    setPasswordForm({ password: "", confirmPassword: "" });
    setPasswordModalOpen(true);
  };

  // 重置密码
  const resetPassword = async () => {
    if (!passwordForm.password || !passwordForm.confirmPassword) {
      showToast("请填写密码和确认密码", "error");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      showToast("两次输入的密码不一致", "error");
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${passwordUser!.id}/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ password: passwordForm.password }),
      });

      if (res.ok) {
        setPasswordModalOpen(false);
        showToast("密码已重置", "success");
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`重置失败: ${error.error}`, "error");
      }
    } catch {
      showToast("重置失败，请检查网络", "error");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">管理员账号</h3>
          <button
            onClick={() => openModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加账号
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">用户名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">显示名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">创建时间</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4">{user.name || "-"}</td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openModal(user)}
                      className="text-[#1A3C8A] hover:underline mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => openPasswordModal(user)}
                      className="text-amber-600 hover:underline mr-3"
                    >
                      重置密码
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
                      className="text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingUser ? "编辑账号" : "添加账号"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    用户名 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    disabled={!!editingUser}
                    placeholder="请输入用户名"
                  />
                  {editingUser && (
                    <p className="text-xs text-gray-400 mt-1">用户名不可修改</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    显示名称
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入显示名称"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      初始密码 *
                    </label>
                    <input
                      type="password"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="请输入初始密码"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveUser}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 密码重置弹窗 */}
      {passwordModalOpen && passwordUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">重置密码</h3>
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                正在重置用户 <strong>{passwordUser.name || passwordUser.username}</strong> 的密码
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={passwordForm.password}
                    onChange={(e) => setPasswordForm({ ...passwordForm, password: e.target.value })}
                    placeholder="请输入新密码"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    确认新密码 *
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="请再次输入新密码"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={resetPassword}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors"
                >
                  确认重置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Experts Editor ────────────────────────────────────────────────────────────

interface Expert {
  id: string;
  name: string;
  title: string;
  org: string;
  focus: string;
  avatar: string | null;
  order: number;
}

function ExpertsEditor({ showToast }: { showToast: (message: string, type: "success" | "error") => void }) {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    org: "",
    focus: "",
    avatar: "",
  });

  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载专家列表
  const loadExperts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/experts", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExperts(data);
      }
    } catch {
      console.error("Failed to load experts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  // 打开添加/编辑弹窗
  const openModal = (expert?: Expert) => {
    if (expert) {
      setEditingExpert(expert);
      setFormData({
        name: expert.name,
        title: expert.title,
        org: expert.org,
        focus: expert.focus,
        avatar: expert.avatar || "",
      });
    } else {
      setEditingExpert(null);
      setFormData({ name: "", title: "", org: "", focus: "", avatar: "" });
    }
    setModalOpen(true);
  };

  // 保存专家
  const saveExpert = async () => {
    if (!formData.name || !formData.title || !formData.org || !formData.focus) {
      showToast("请填写所有必填项", "error");
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      let res;

      if (editingExpert) {
        // 更新
        res = await fetch(`/api/admin/experts/${editingExpert.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // 创建
        res = await fetch("/api/admin/experts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        setModalOpen(false);
        loadExperts();
      } else {
        const error = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`操作失败: ${error.error}`, "error");
      }
    } catch {
      showToast("操作失败，请检查网络", "error");
    } finally {
      setSaving(false);
    }
  };

  // 删除专家
  const deleteExpert = async (expert: Expert) => {
    if (!confirm(`确定要删除专家 "${expert.name}" 吗？`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/experts/${expert.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      if (res.ok) {
        loadExperts();
      } else {
        showToast("删除失败", "error");
      }
    } catch {
      showToast("删除失败，请检查网络", "error");
    }
  };

  // 上移
  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newExperts = [...experts];
    [newExperts[index - 1], newExperts[index]] = [newExperts[index], newExperts[index - 1]];

    // 更新 order 值
    try {
      const token = getToken();
      await Promise.all([
        fetch(`/api/admin/experts/${newExperts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index }),
        }),
        fetch(`/api/admin/experts/${newExperts[index - 1].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index - 1 }),
        }),
      ]);
      loadExperts();
    } catch {
      showToast("排序失败", "error");
    }
  };

  // 下移
  const moveDown = async (index: number) => {
    if (index === experts.length - 1) return;
    const newExperts = [...experts];
    [newExperts[index], newExperts[index + 1]] = [newExperts[index + 1], newExperts[index]];

    // 更新 order 值
    try {
      const token = getToken();
      await Promise.all([
        fetch(`/api/admin/experts/${newExperts[index].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index }),
        }),
        fetch(`/api/admin/experts/${newExperts[index + 1].id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ order: index + 1 }),
        }),
      ]);
      loadExperts();
    } catch {
      showToast("排序失败", "error");
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">专家团队</h3>
          <button
            onClick={() => openModal()}
            className="bg-[#1A3C8A] text-white px-4 py-2 rounded-md text-sm hover:bg-[#15306e] transition-colors"
          >
            + 添加专家
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">头像</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">姓名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">职称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">机构</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">研究方向</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {experts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    暂无专家，点击上方按钮添加
                  </td>
                </tr>
              ) : (
                experts.map((expert, index) => (
                  <tr key={expert.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {expert.avatar ? (
                        <img
                          src={expert.avatar}
                          alt={expert.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">无</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{expert.name}</td>
                    <td className="py-3 px-4">{expert.title}</td>
                    <td className="py-3 px-4">{expert.org}</td>
                    <td className="py-3 px-4">{expert.focus}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 mr-2"
                        title="上移"
                      >
                        ?
                      </button>
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === experts.length - 1}
                        className="text-gray-500 hover:text-gray-700 disabled:opacity-30 mr-3"
                        title="下移"
                      >
                        ?
                      </button>
                      <button
                        onClick={() => openModal(expert)}
                        className="text-[#1A3C8A] hover:underline mr-3"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => deleteExpert(expert)}
                        className="text-red-500 hover:underline"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 添加/编辑弹窗 */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingExpert ? "编辑专家" : "添加专家"}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="请输入姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    职称 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="请输入职称"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    机构 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.org}
                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                    placeholder="请输入机构"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    研究方向 *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                    value={formData.focus}
                    onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
                    placeholder="请输入研究方向"
                  />
                </div>

                <div>
                  <ImageButton
                    label="头像"
                    value={formData.avatar}
                    onChange={(v) => setFormData({ ...formData, avatar: v })}
                    type="experts"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={saveExpert}
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-[#1A3C8A] text-white rounded hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Buttons Editor ────────────────────────────────────────────────────────────

interface PageButton {
  id: string;
  pageKey: string;
  pageName: string;
  positionKey: string;
  positionName: string;
  label: string;
  href: string;
  openNewTab: boolean;
  order: number;
}

interface ButtonGroup {
  pageKey: string;
  pageName: string;
  positions: {
    key: string;
    name: string;
    buttons: PageButton[];
  }[];
}

interface ButtonsEditorProps {
  showToast: (message: string, type: "success" | "error") => void;
}

function ButtonsEditor({ showToast }: ButtonsEditorProps) {
  const [groups, setGroups] = useState<ButtonGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const getToken = () => sessionStorage.getItem("admin_token") ?? "";

  // 加载按钮配置
  const loadButtons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/buttons", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) {
        const data = await res.json();
        // 按页面和位置分组
        const grouped: Record<string, ButtonGroup> = {};

        for (const btn of data.buttons) {
          if (!grouped[btn.pageKey]) {
            grouped[btn.pageKey] = {
              pageKey: btn.pageKey,
              pageName: btn.pageName,
              positions: [],
            };
          }

          let position = grouped[btn.pageKey].positions.find(p => p.key === btn.positionKey);
          if (!position) {
            position = { key: btn.positionKey, name: btn.positionName, buttons: [] };
            grouped[btn.pageKey].positions.push(position);
          }

          position.buttons.push(btn);
        }

        // 定义位置显示顺序：hero 在上，cta 在下
        const positionOrder: Record<string, number> = { hero: 0, cta: 1 };

        // 对每个位置的按钮按 order 排序，并按 positionKey 顺序排列 positions
        for (const group of Object.values(grouped)) {
          // 先对 positions 按 hero -> cta 排序
          group.positions.sort((a, b) => {
            const orderA = positionOrder[a.key] ?? 999;
            const orderB = positionOrder[b.key] ?? 999;
            return orderA - orderB;
          });

          // 再对每个位置内的按钮按 order 排序
          for (const pos of group.positions) {
            pos.buttons.sort((a, b) => a.order - b.order);
          }
        }

        setGroups(Object.values(grouped));
      } else {
        const errorData = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`加载失败: ${errorData.error || "未知错误"}`, "error");
      }
    } catch {
      console.error("Failed to load buttons");
      showToast("加载失败，请检查网络连接", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadButtons();
  }, [loadButtons]);

  // 更新按钮字段
  const updateButton = (groupIndex: number, posIndex: number, btnIndex: number, field: string, value: unknown) => {
    const newGroups = [...groups];
    newGroups[groupIndex].positions[posIndex].buttons[btnIndex] = {
      ...newGroups[groupIndex].positions[posIndex].buttons[btnIndex],
      [field]: value,
    };
    setGroups(newGroups);
  };

  // 保存所有更改
  const saveButtons = async () => {
    setSaving(true);
    try {
      const allButtons = groups.flatMap(g =>
        g.positions.flatMap(p => p.buttons)
      );

      const res = await fetch("/api/admin/buttons", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ buttons: allButtons }),
      });

      if (res.ok) {
        showToast("保存成功", "success");
        loadButtons();
      } else {
        const errorData = await res.json().catch(() => ({ error: "未知错误" }));
        showToast(`保存失败: ${errorData.error || "未知错误"}`, "error");
      }
    } catch {
      showToast("保存失败，请检查网络", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">加载中...</div>;
  }

  if (groups.length === 0) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">页面按钮配置</h3>
        </div>
        <div className="text-center py-12 text-gray-400">
          暂无按钮配置，请先执行数据库初始化脚本
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">页面按钮配置</h3>
        <button
          onClick={saveButtons}
          disabled={saving}
          className="bg-[#1A3C8A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </div>

      {groups.map((group, gi) => (
        <div key={group.pageKey} className="mb-8">
          <h4 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#D4A843] rounded-full"></span>
            {group.pageName}
          </h4>

          {group.positions.map((pos, pi) => (
            <div key={pos.key} className="mb-6 ml-4">
              <h5 className="text-sm font-semibold text-gray-700 mb-3">{pos.name}</h5>
              <div className="space-y-3">
                {pos.buttons.map((btn, bi) => (
                  <div key={btn.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">按钮文字</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                          value={btn.label}
                          onChange={(e) => updateButton(gi, pi, bi, "label", e.target.value)}
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">跳转链接</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
                          value={btn.href}
                          onChange={(e) => updateButton(gi, pi, bi, "href", e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={btn.openNewTab}
                            onChange={(e) => updateButton(gi, pi, bi, "openNewTab", e.target.checked)}
                            className="rounded border-gray-300 text-[#1A3C8A] focus:ring-[#1A3C8A]"
                          />
                          <span className="text-sm text-gray-700">新窗口打开</span>
                        </label>
                      </div>
                      <div className="text-xs text-gray-400">
                        顺序: {btn.order}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("admin");
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
        body: JSON.stringify({ username, password }),
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
    setUsername("admin");
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
        // 获取详细错误信息
        const errorData = await res.json().catch(() => ({ error: "未知错误" }));
        console.error("保存失败:", errorData);
        showToast(`保存失败: ${errorData.error || "未知错误"}`, "error");
      }
    } catch (err) {
      console.error("保存异常:", err);
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
      showToast,
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
        return <ConsultationsEditor showToast={showToast} />;
      case "users":
        return <UsersEditor showToast={showToast} />;
      case "experts":
        return <ExpertsEditor showToast={showToast} />;
      case "buttons":
        return <ButtonsEditor showToast={showToast} />;
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
            <p className="text-sm text-gray-500 mt-1">请输入用户名和密码登录</p>
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A] focus:border-transparent mb-3"
              placeholder="请输入用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
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
            disabled={loginLoading || !username || !password}
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
              item.key === "news" ? (
                <a
                  key={item.key}
                  href="/admin/news"
                  className="block w-full text-left px-6 py-3 text-sm transition-colors hover:bg-white/10"
                >
                  {item.label}
                </a>
              ) : (
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
              )
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
              {activeSection !== "cases" && activeSection !== "users" && activeSection !== "experts" && activeSection !== "buttons" && (
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="bg-[#1A3C8A] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#15306e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {saving ? "保存中..." : "保存"}
                </button>
              )}
            </div>

            {/* Editor */}
            {renderEditor()}
          </div>
        </main>
      </div>
    </div>
  );
}
