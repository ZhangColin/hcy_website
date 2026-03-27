"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CollectionKey = "home" | "news" | "about" | "cases" | "contact" | "site" | "join";

interface NavItem {
  key: CollectionKey;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: "home", label: "首页内容" },
  { key: "news", label: "新闻管理" },
  { key: "about", label: "关于我们" },
  { key: "cases", label: "案例管理" },
  { key: "contact", label: "联系方式" },
  { key: "site", label: "站点设置" },
  { key: "join", label: "招聘管理" },
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
  const partners = (data.partners as string[]) ?? [];

  return (
    <>
      <SectionCard title="Hero 轮播">
        <ListEditor
          title="轮播内容"
          items={slides}
          onChange={(v) => setData({ ...data, heroSlides: v })}
          createItem={() => ({ title: "", subtitle: "", cta: "", href: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="副标题" value={item.subtitle} onChange={(v) => update("subtitle", v)} />
              <FieldEditor label="按钮文字" value={item.cta} onChange={(v) => update("cta", v)} />
              <FieldEditor label="链接" value={item.href} onChange={(v) => update("href", v)} />
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
          createItem={() => ({ title: "", text: "" })}
          renderItem={(item, _i, update) => (
            <>
              <FieldEditor label="标题" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="描述" value={item.text} onChange={(v) => update("text", v)} multiline />
            </>
          )}
        />
      </SectionCard>

      <SectionCard title="合作伙伴">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-800">合作伙伴列表</h3>
          <button
            type="button"
            onClick={() => setData({ ...data, partners: [...partners, ""] })}
            className="text-sm bg-[#1A3C8A] text-white px-3 py-1 rounded hover:bg-[#15306e] transition-colors"
          >
            + 添加
          </button>
        </div>
        {partners.map((p, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3C8A]"
              value={p}
              onChange={(e) => {
                const next = [...partners];
                next[i] = e.target.value;
                setData({ ...data, partners: next });
              }}
              placeholder="合作伙伴名称"
            />
            <button
              type="button"
              onClick={() => setData({ ...data, partners: partners.filter((_, idx) => idx !== i) })}
              className="text-red-500 hover:text-red-700 font-bold"
            >
              &times;
            </button>
          </div>
        ))}
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
              <FieldEditor label="图片URL" value={item.image} onChange={(v) => update("image", v)} />
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
          createItem={() => ({ title: "", category: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="荣誉名称" value={item.title} onChange={(v) => update("title", v)} />
              <FieldEditor label="类别" value={item.category} onChange={(v) => update("category", v)} />
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
    <>
      <SectionCard title="地址信息">
        <FieldEditor
          label="公司地址"
          value={(data.address as string) ?? ""}
          onChange={(v) => setData({ ...data, address: v })}
        />
      </SectionCard>

      <SectionCard title="联系人">
        <ListEditor
          title="联系人列表"
          items={contacts}
          onChange={(v) => setData({ ...data, contacts: v })}
          createItem={() => ({ department: "", person: "", phone: "", email: "" })}
          renderItem={(item, _i, update) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FieldEditor label="部门" value={item.department} onChange={(v) => update("department", v)} />
              <FieldEditor label="联系人" value={item.person} onChange={(v) => update("person", v)} />
              <FieldEditor label="电话" value={item.phone} onChange={(v) => update("phone", v)} />
              <FieldEditor label="邮箱" value={item.email} onChange={(v) => update("email", v)} />
            </div>
          )}
        />
      </SectionCard>
    </>
  );
}

// ─── Site Editor ─────────────────────────────────────────────────────────────

function SiteEditor({ data, setData }: { data: Record<string, unknown>; setData: (d: Record<string, unknown>) => void }) {
  const links = (data.friendlyLinks as Record<string, string>[]) ?? [];
  const social = (data.social as Record<string, string>) ?? { weibo: "", douyin: "", bilibili: "" };

  const setSocial = (field: string, value: string) =>
    setData({ ...data, social: { ...social, [field]: value } });

  return (
    <>
      <SectionCard title="基本信息">
        <FieldEditor label="公司全称" value={(data.companyName as string) ?? ""} onChange={(v) => setData({ ...data, companyName: v })} />
        <FieldEditor label="公司简称" value={(data.shortName as string) ?? ""} onChange={(v) => setData({ ...data, shortName: v })} />
        <FieldEditor label="公司地址" value={(data.address as string) ?? ""} onChange={(v) => setData({ ...data, address: v })} />
        <FieldEditor label="ICP备案号" value={(data.icp as string) ?? ""} onChange={(v) => setData({ ...data, icp: v })} />
        <FieldEditor label="版权信息" value={(data.copyright as string) ?? ""} onChange={(v) => setData({ ...data, copyright: v })} />
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
        <FieldEditor label="微博" value={social.weibo ?? ""} onChange={(v) => setSocial("weibo", v)} placeholder="微博链接" />
        <FieldEditor label="抖音" value={social.douyin ?? ""} onChange={(v) => setSocial("douyin", v)} placeholder="抖音链接" />
        <FieldEditor label="哔哩哔哩" value={social.bilibili ?? ""} onChange={(v) => setSocial("bilibili", v)} placeholder="B站链接" />
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
      case "cases":
        return <CasesEditor {...props} />;
      case "contact":
        return <ContactEditor {...props} />;
      case "site":
        return <SiteEditor {...props} />;
      case "join":
        return <JoinEditor {...props} />;
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
