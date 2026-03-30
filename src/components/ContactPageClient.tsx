"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AMap } from "@/components/AMap";
import { validateConsultationForm } from "@/lib/validators";
import { useTranslation } from "@/hooks/useTranslation";

/* ───────── types ───────── */
interface ContactData {
  address: string;
  contacts: { department: string; person: string; phone: string; email: string; avatar?: string }[];
}

interface SiteData {
  companyName: string;
  shortName: string;
  address: string;
  phone?: string | null;
  email?: string | null;
  mapLng?: string | null;
  mapLat?: string | null;
  icp: string;
  copyright: string;
  wechatServiceQr?: string | null;
}

/* ───────── scroll reveal hook ───────── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, visible };
}

/* ───────── section wrapper ───────── */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* ───────── contact card gradients/icons ───────── */
const contactStyles: Record<string, { gradient: string; color: string }> = {
  "综合业务": { gradient: "from-[#1A3C8A] to-[#2B6CB0]", color: "#1A3C8A" },
  "智教服务集群": { gradient: "from-[#1565C0] to-[#1A3C8A]", color: "#1565C0" },
  "产融生态矩阵": { gradient: "from-[#00796B] to-[#004D40]", color: "#00796B" },
  "政企AI赋能培训": { gradient: "from-[#00796B] to-[#004D40]", color: "#00796B" },
  "OPC生态 / AI党建": { gradient: "from-[#D4A843] to-[#B8860B]", color: "#D4A843" },
};

const defaultStyle = { gradient: "from-[#1A3C8A] to-[#2B6CB0]", color: "#1A3C8A" };

/* ───────── need type options ───────── */
const needTypes = [
  "aiCurriculum",
  "teacherTraining",
  "aiResearchStudy",
  "ecosystemAlliance",
  "enterpriseTraining",
  "opc",
  "smartServices",
  "assetRevitalization",
  "aiPartyBuilding",
  "other",
];

/* ───────── form state type ───────── */
interface FormData {
  name: string;
  company: string;
  phone: string;
  email: string;
  needType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  needType?: string;
  message?: string;
  general?: string;
}

/* ═══════════════════════════════════════════════════════════
   CONTACT PAGE CLIENT
   ═══════════════════════════════════════════════════════════ */
export default function ContactPageClient({ contactData, siteData }: { contactData: ContactData; siteData: SiteData }) {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    phone: "",
    email: "",
    needType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  /* ── validation ── */
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name]) {
      const result = validateConsultationForm(next);
      const errs: FormErrors = {};
      Object.keys(result.errors).forEach((key) => {
        errs[key as keyof FormErrors] = result.errors[key];
      });
      setErrors(errs);
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const result = validateConsultationForm(form);
    const errs: FormErrors = {};
    Object.keys(result.errors).forEach((key) => {
      errs[key as keyof FormErrors] = result.errors[key];
    });
    setErrors(errs);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    Object.keys(form).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    // 客户端验证
    const result = validateConsultationForm(form);
    const errs: FormErrors = {};
    Object.keys(result.errors).forEach((key) => {
      errs[key as keyof FormErrors] = result.errors[key];
    });
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      // 提交到服务器
      try {
        const res = await fetch("/api/contact/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        const data = await res.json();

        if (data.success) {
          setSubmitted(true);
        } else {
          // 显示服务器返回的错误
          const serverErrors: FormErrors = {};
          if (data.errors) {
            Object.keys(data.errors).forEach((key) => {
              serverErrors[key as keyof FormErrors] = data.errors[key];
            });
          }
          setErrors(serverErrors);
        }
      } catch (error) {
        console.error("Submit error:", error);
        setErrors({ general: "网络错误，请稍后重试" });
      }
    }
  }

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-800">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#1A3C8A] transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t("common.home")}
            </Link>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-[#1A3C8A] font-semibold">{t("contact.breadcrumb.current")}</span>
          </nav>
        </div>
      </nav>

      {/* ====== Hero Banner ====== */}
      <div className="relative w-full bg-gradient-to-br from-[#1A3C8A] via-[#1e4a9e] to-[#2B6CB0] text-white overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="relative mx-auto max-w-[1200px] px-6 py-20 md:py-28">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{t("contact.title")}</h1>
          <p className="mt-4 text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </div>
      </div>

      {/* ====== Company Address + Map ====== */}
      <Section className="py-20 md:py-28" id="address">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("contact.address")}</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {t("contact.addressDesc")}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Address info */}
            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#1A3C8A]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1A3C8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#333333] text-lg mb-1">{t("contact.officeAddress")}</h3>
                  <p className="text-[#666666] leading-relaxed">
                    {siteData.address || contactData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#1A3C8A]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1A3C8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#333333] text-lg mb-1">{t("contact.phone")}</h3>
                  <p className="text-[#666666]">{siteData.phone || "010-XXXX-XXXX"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#1A3C8A]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#1A3C8A]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-[#333333] text-lg mb-1">{t("contact.email")}</h3>
                  <p className="text-[#666666]">{siteData.email || "contact@haichuangyuan.com"}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            {(siteData.mapLng && siteData.mapLat) ? (
              <AMap
                lng={siteData.mapLng}
                lat={siteData.mapLat}
                address={siteData.address}
                className="min-h-[320px]"
              />
            ) : (
              <div className="rounded-2xl bg-gradient-to-br from-[#1A3C8A]/5 to-[#2B6CB0]/10 border-2 border-dashed border-[#1A3C8A]/20 flex flex-col items-center justify-center min-h-[320px]">
                <svg className="w-16 h-16 text-[#1A3C8A]/30 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                  <path d="M9 2L3 5v17l6-3 6 3 6-3V2l-6 3-6-3z" />
                  <path d="M9 2v17" />
                  <path d="M15 5v17" />
                </svg>
                <span className="text-[#1A3C8A]/50 font-medium text-lg">{t("contact.mapNotConfigured")}</span>
                <span className="text-[#666666]/50 text-sm mt-1">{t("contact.mapNotConfiguredDesc")}</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ====== Business Line Contacts ====== */}
      <Section className="py-20 md:py-28 bg-white" id="contacts">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("contact.contacts")}</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {t("contact.contactsDesc")}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactData.contacts.map((c) => {
              const style = contactStyles[c.department] || defaultStyle;
              const hasAvatar = c.avatar && c.avatar.length > 0;

              return (
                <div
                  key={c.department}
                  className="group rounded-2xl bg-[#F5F7FA] hover:bg-white hover:shadow-lg transition-all duration-300 p-6 border border-transparent hover:border-gray-100 text-center"
                >
                  {/* 头像 */}
                  <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-br from-[#1A3C8A]/10 to-[#2B6CB0]/10 flex items-center justify-center">
                    {hasAvatar ? (
                      <img
                        src={c.avatar!.startsWith('http') ? c.avatar! : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${c.avatar!}`}
                        alt={c.person}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} flex items-center justify-center`}>
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 部门名称 */}
                  <h3 className="font-bold text-[#333333] text-lg mb-2 leading-snug">
                    {c.department}
                  </h3>

                  {/* 联系人姓名 */}
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-[#1A3C8A] font-semibold">{c.person}</span>
                  </div>

                  {/* 电话 */}
                  {c.phone && c.phone.length > 0 && (
                    <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600 mb-1">
                      <svg className="w-3.5 h-3.5 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <span>{c.phone}</span>
                    </div>
                  )}

                  {/* 邮箱 */}
                  {c.email && c.email.length > 0 && (
                    <a
                      href={`mailto:${c.email}`}
                      className="flex items-center justify-center gap-1.5 text-sm text-gray-600 hover:text-[#1A3C8A] transition-colors"
                    >
                      <svg className="w-3.5 h-3.5 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                      <span>邮件联系</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ====== Online Consultation Form ====== */}
      <Section className="py-20 md:py-28" id="form">
        <div className="mx-auto max-w-[1200px] px-6">
          <h2 className="text-3xl font-bold text-center text-[#1A3C8A] mb-4">{t("contact.onlineConsultation")}</h2>
          <p className="text-center text-gray-500 mb-14 max-w-xl mx-auto">
            {t("contact.onlineConsultationDesc")}
          </p>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A3C8A] mb-3">{t("contact.form.success.title")}</h3>
                  <p className="text-[#666666] mb-8">
                    {t("contact.form.success.message")}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", company: "", phone: "", email: "", needType: "", message: "" });
                      setTouched({});
                      setErrors({});
                    }}
                    className="px-8 py-3 rounded-full bg-[#1A3C8A] text-white font-medium hover:bg-[#2B6CB0] transition-colors duration-300"
                  >
                    {t("contact.form.continue")}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 md:p-10"
                  noValidate
                >
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        {t("contact.form.name")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("contact.form.placeholder.name")}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 ${
                          touched.name && errors.name
                            ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200"
                        }`}
                      />
                      {touched.name && errors.name && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4m0 4h.01" />
                          </svg>
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        {t("contact.form.company")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={form.company}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("contact.form.placeholder.company")}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 ${
                          touched.company && errors.company
                            ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200"
                        }`}
                      />
                      {touched.company && errors.company && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4m0 4h.01" />
                          </svg>
                          {errors.company}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        {t("contact.form.phone")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("contact.form.placeholder.phone")}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 ${
                          touched.phone && errors.phone
                            ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200"
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4m0 4h.01" />
                          </svg>
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-[#333333] mb-2">
                        {t("contact.form.email")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("contact.form.placeholder.email")}
                        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 ${
                          touched.email && errors.email
                            ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-200"
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4m0 4h.01" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Need Type */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      {t("contact.form.needType")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="needType"
                      value={form.needType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 appearance-none ${
                        touched.needType && errors.needType
                          ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200"
                      } ${!form.needType ? "text-gray-400" : "text-[#333333]"}`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23999'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 12px center",
                        backgroundSize: "20px",
                      }}
                    >
                      <option value="">{t("contact.form.placeholder.needType")}</option>
                      {needTypes.map((nt) => {
                        const key = `contact.form.needTypes.${nt}`;
                        const translated = t(key);
                        return (
                          <option key={nt} value={nt}>
                            {translated}
                          </option>
                        );
                      })}
                    </select>
                    {touched.needType && errors.needType && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4m0 4h.01" />
                        </svg>
                        {errors.needType}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-[#333333] mb-2">
                      {t("contact.form.message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("contact.form.placeholder.message")}
                      rows={5}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors duration-200 bg-[#F5F7FA] focus:bg-white focus:border-[#1A3C8A] focus:ring-2 focus:ring-[#1A3C8A]/10 resize-none ${
                        touched.message && errors.message
                          ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
                          : "border-gray-200"
                      }`}
                    />
                    {touched.message && errors.message && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4m0 4h.01" />
                        </svg>
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* General Error */}
                  {errors.general && (
                    <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
                      <p className="text-sm text-red-600 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 8v4m0 4h.01" />
                        </svg>
                        {errors.general}
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-10 py-3.5 rounded-full bg-[#1A3C8A] text-white font-bold text-base hover:bg-[#2B6CB0] transition-colors duration-300 shadow-lg shadow-[#1A3C8A]/20"
                  >
                    {t("contact.form.submit")}
                  </button>
                </form>
              )}
            </div>

            {/* WeChat QR Code placeholder */}
            <div className="lg:col-span-1">
              <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-8 text-center sticky top-28">
                <h3 className="font-bold text-[#333333] text-lg mb-2">{t("contact.form.wechat.title")}</h3>
                <p className="text-sm text-[#666666] mb-6">{t("contact.form.wechat.desc")}</p>

                {/* WeChat QR Code */}
                {siteData.wechatServiceQr ? (
                  <div className="w-48 h-48 mx-auto mb-6">
                    <img
                      src={
                        siteData.wechatServiceQr.startsWith('http')
                          ? siteData.wechatServiceQr
                          : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${siteData.wechatServiceQr}`
                      }
                      alt="微信客服"
                      className="w-full h-full object-cover rounded-2xl"
                      onError={(e) => {
                        // 图片加载失败时显示占位符
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 mx-auto rounded-2xl bg-gradient-to-br from-[#F5F7FA] to-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center mb-6">
                    <svg className="w-12 h-12 text-gray-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1}>
                      <rect x="2" y="2" width="8" height="8" rx="1" />
                      <rect x="14" y="2" width="8" height="8" rx="1" />
                      <rect x="2" y="14" width="8" height="8" rx="1" />
                      <rect x="14" y="14" width="4" height="4" rx="0.5" />
                      <rect x="20" y="14" width="2" height="2" rx="0.25" />
                      <rect x="14" y="20" width="2" height="2" rx="0.25" />
                      <rect x="18" y="18" width="4" height="4" rx="0.5" />
                      <rect x="5" y="5" width="2" height="2" fill="currentColor" />
                      <rect x="17" y="5" width="2" height="2" fill="currentColor" />
                      <rect x="5" y="17" width="2" height="2" fill="currentColor" />
                    </svg>
                    <span className="text-xs text-gray-400">{t("contact.form.wechat.qrNotConfigured")}</span>
                  </div>
                )}

                <div className="w-full h-px bg-gray-100 mb-6" />

                <div className="text-sm text-[#666666] space-y-2">
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {t("contact.form.wechat.workHours")}
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 text-[#D4A843]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                    {t("contact.form.wechat.responseTime")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
