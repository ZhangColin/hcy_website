-- CreateTable
CREATE TABLE "PageButton" (
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

    CONSTRAINT "PageButton_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PageButton_pageKey_positionKey_order_key" ON "PageButton"("pageKey", "positionKey", "order");

-- CreateIndex
CREATE INDEX "PageButton_pageKey_positionKey_idx" ON "PageButton"("pageKey", "positionKey");
