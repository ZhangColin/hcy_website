import Link from "next/link";

const services = [
  {
    title: "政企AI赋能培训",
    subtitle: "跨界复制",
    desc: "AI赋能千行百业，数智人才实战锻造。公文效率提升60%，外包成本降低50%，内容产出提速3-5倍。",
    href: "/ecosystem/enterprise-training",
    color: "#00796B",
  },
  {
    title: "OPC生态",
    subtitle: "规模化交付",
    desc: "以真实订单激活超级个体网络，六大订单类型，L1/L2/L3三级养成计划，培训即就业。",
    href: "/ecosystem/opc",
    color: "#00796B",
  },
  {
    title: "智创专项服务",
    subtitle: "专项赋能",
    desc: "数智平台工坊（AI党建/教育/政务/企管）+ 卓识战略智库，国企信用背书，全链条协同。",
    href: "/ecosystem/smart-services",
    color: "#00695C",
  },
  {
    title: "不良资产盘活",
    subtitle: "空间载体",
    desc: "三角稳定架构模式：资产持有端+投资建设端+运营管理端，AI轻资产运营赋能模式。",
    href: "/ecosystem/asset-revitalization",
    color: "#004D40",
  },
];

export default function EcosystemPage() {
  return (
    <main>
      {/* Hero */}
      <section className="text-white pt-32 pb-20" style={{ background: "linear-gradient(135deg, #004D40 0%, #00796B 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <nav className="text-sm text-green-200 mb-6">
            <Link href="/" className="hover:text-white">首页</Link>
            <span className="mx-2">/</span>
            <span className="text-white">产融生态矩阵</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">产融生态矩阵</h1>
          <p className="text-xl text-green-100 max-w-2xl">
            以政企AI赋能培训、OPC生态、智创专项服务、不良资产盘活四大业务线，构建产业融合生态，实现规模化交付。
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 hover:-translate-y-1"
                style={{ borderColor: s.color }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full text-white mb-3 inline-block"
                      style={{ backgroundColor: s.color }}
                    >
                      {s.subtitle}
                    </span>
                    <h2 className="text-2xl font-bold mt-2" style={{ color: s.color }}>{s.title}</h2>
                  </div>
                  <svg
                    className="w-6 h-6 text-gray-300 group-hover:text-[#00796B] transition-colors mt-1 shrink-0"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-[#666] leading-relaxed">{s.desc}</p>
                <span className="mt-4 inline-block text-sm font-medium" style={{ color: s.color }}>
                  了解更多 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
