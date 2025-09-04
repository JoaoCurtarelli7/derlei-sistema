/*
  Warnings:

  - You are about to drop the `FinancialPeriod` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FinancialPeriod";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Month" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Closing" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "monthId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aberto',
    "totalEntries" REAL NOT NULL DEFAULT 0,
    "totalExpenses" REAL NOT NULL DEFAULT 0,
    "totalTaxes" REAL NOT NULL DEFAULT 0,
    "balance" REAL NOT NULL DEFAULT 0,
    "profitMargin" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Closing_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Closing_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "observations" TEXT,
    "closingId" INTEGER,
    "companyId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialEntry_closingId_fkey" FOREIGN KEY ("closingId") REFERENCES "Closing" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FinancialEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FinancialEntry" ("amount", "category", "companyId", "createdAt", "date", "description", "id", "observations", "type", "updatedAt") SELECT "amount", "category", "companyId", "createdAt", "date", "description", "id", "observations", "type", "updatedAt" FROM "FinancialEntry";
DROP TABLE "FinancialEntry";
ALTER TABLE "new_FinancialEntry" RENAME TO "FinancialEntry";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Month_year_month_key" ON "Month"("year", "month");
