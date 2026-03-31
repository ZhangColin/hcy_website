-- Expert 表: 存储专家团队信息
CREATE TABLE IF NOT EXISTS "Expert" (
    id TEXT NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    org TEXT NOT NULL,
    focus TEXT NOT NULL,
    avatar TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Expert_pkey" PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS "Expert_order_idx" ON "Expert"("order");
