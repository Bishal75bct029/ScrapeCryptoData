-- CreateTable
CREATE TABLE "Coin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "marketCap" TEXT NOT NULL,
    "change24h" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WatchList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "coinId" INTEGER NOT NULL,
    "min" TEXT NOT NULL,
    "max" TEXT NOT NULL,
    "lastNotifiedAt" DATETIME,
    CONSTRAINT "WatchList_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_code_key" ON "Coin"("code");
