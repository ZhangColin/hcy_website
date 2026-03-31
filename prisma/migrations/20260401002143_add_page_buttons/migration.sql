-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "page_buttons_pageKey_positionKey_order_key" ON "page_buttons"("pageKey", "positionKey", "order");

-- CreateIndex
CREATE INDEX "page_buttons_pageKey_positionKey_idx" ON "page_buttons"("pageKey", "positionKey");
