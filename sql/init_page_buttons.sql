-- =====================================================
-- 页面按钮管理表 - 完整初始化脚本
-- 包含：删除表、建表、插入数据
-- =====================================================

-- 删除表（如果存在）
DROP TABLE IF EXISTS "page_buttons" CASCADE;

-- 创建表
CREATE TABLE "page_buttons" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "pageName" TEXT NOT NULL,
    "positionKey" TEXT NOT NULL,
    "positionName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "openNewTab" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_buttons_pkey" PRIMARY KEY ("id")
);

-- 创建索引
CREATE UNIQUE INDEX "page_buttons_pageKey_positionKey_order_key" ON "page_buttons"("pageKey", "positionKey", "order");
CREATE INDEX "page_buttons_pageKey_positionKey_idx" ON "page_buttons"("pageKey", "positionKey");

-- =====================================================
-- 初始化数据 - AI课程入校页面
-- =====================================================

-- Hero 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_001_ai_curriculum_hero_1', 'ai-curriculum', 'AI课程入校', 'hero', '顶部横幅区域', '了解1+N模式', '#model', FALSE, 0),
('btn_002_ai_curriculum_hero_2', 'ai-curriculum', 'AI课程入校', 'hero', '顶部横幅区域', '预约课程演示', '#contact', FALSE, 1);

-- CTA 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_003_ai_curriculum_cta_1', 'ai-curriculum', 'AI课程入校', 'cta', '底部行动号召区域', '预约课程演示', '#contact', FALSE, 0),
('btn_004_ai_curriculum_cta_2', 'ai-curriculum', 'AI课程入校', 'cta', '底部行动号召区域', '下载方案白皮书', '/download/whitepaper', TRUE, 1),
('btn_005_ai_curriculum_cta_3', 'ai-curriculum', 'AI课程入校', 'cta', '底部行动号召区域', '联系我们', '/contact', FALSE, 2);

-- =====================================================
-- 初始化数据 - 生态产品联盟页面
-- =====================================================

-- Hero 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_006_ecosystem_hero_1', 'ecosystem-alliance', '生态产品联盟', 'hero', '顶部横幅区域', '成为生态合作伙伴', '#cta', FALSE, 0),
('btn_007_ecosystem_hero_2', 'ecosystem-alliance', '生态产品联盟', 'hero', '顶部横幅区域', '了解生态品牌', '#partners', FALSE, 1);

-- CTA 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_008_ecosystem_cta_1', 'ecosystem-alliance', '生态产品联盟', 'cta', '底部行动号召区域', '成为生态合作伙伴', '#cta', FALSE, 0),
('btn_009_ecosystem_cta_2', 'ecosystem-alliance', '生态产品联盟', 'cta', '底部行动号召区域', '了解合作详情', '/contact', FALSE, 1);

-- =====================================================
-- 初始化数据 - AI研学页面
-- =====================================================

-- Hero 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_010_research_hero_1', 'ai-research-study', 'AI研学', 'hero', '顶部横幅区域', '预约课程演示', '#contact', FALSE, 0),
('btn_011_research_hero_2', 'ai-research-study', 'AI研学', 'hero', '顶部横幅区域', '了解研学方案', '#intro', FALSE, 1);

-- CTA 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_012_research_cta_1', 'ai-research-study', 'AI研学', 'cta', '底部行动号召区域', '预约课程演示', '#contact', FALSE, 0),
('btn_013_research_cta_2', 'ai-research-study', 'AI研学', 'cta', '底部行动号召区域', '下载方案白皮书', '/download/whitepaper', TRUE, 1),
('btn_014_research_cta_3', 'ai-research-study', 'AI研学', 'cta', '底部行动号召区域', '联系我们', '/contact', FALSE, 2);

-- =====================================================
-- 初始化数据 - 师资培训页面
-- =====================================================

-- Hero 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_015_teacher_hero_1', 'teacher-training', '师资培训', 'hero', '顶部横幅区域', '预约师资培训', '#contact', FALSE, 0),
('btn_016_teacher_hero_2', 'teacher-training', '师资培训', 'hero', '顶部横幅区域', '了解认证体系', '#intro', FALSE, 1);

-- CTA 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_017_teacher_cta_1', 'teacher-training', '师资培训', 'cta', '底部行动号召区域', '预约师资培训', '#contact', FALSE, 0),
('btn_018_teacher_cta_2', 'teacher-training', '师资培训', 'cta', '底部行动号召区域', '联系我们', '/contact', FALSE, 1);

-- =====================================================
-- 初始化数据 - 服务首页
-- =====================================================

-- CTA 区域按钮
INSERT INTO "page_buttons" ("id", "pageKey", "pageName", "positionKey", "positionName", "label", "href", "openNewTab", "order") VALUES
('btn_019_services_cta_1', 'services', '智教服务集群', 'cta', '底部行动号召区域', '了解服务详情', '/services/ai-curriculum', FALSE, 0),
('btn_020_services_cta_2', 'services', '智教服务集群', 'cta', '底部行动号召区域', '联系我们', '/contact', FALSE, 1);

-- =====================================================
-- 查询验证
-- =====================================================

SELECT "pageName" AS "页面名称", "positionName" AS "位置区域", label AS "按钮文字", href AS "跳转链接",
       CASE WHEN "openNewTab" THEN '是' ELSE '否' END AS "新窗口", "order" AS "顺序"
FROM "page_buttons"
ORDER BY "pageKey", "positionKey", "order";
