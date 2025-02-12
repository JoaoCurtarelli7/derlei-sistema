-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Load" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "loadingNumber" TEXT NOT NULL,
    "deliveries" INTEGER NOT NULL,
    "cargoWeight" REAL NOT NULL,
    "totalValue" REAL NOT NULL,
    "freight4" REAL NOT NULL,
    "totalFreight" REAL NOT NULL,
    "closings" REAL NOT NULL,
    "observations" TEXT,
    "companyId" INTEGER NOT NULL,
    CONSTRAINT "Load_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Load" ("cargoWeight", "closings", "companyId", "date", "deliveries", "freight4", "id", "loadingNumber", "observations", "totalFreight", "totalValue") SELECT "cargoWeight", "closings", "companyId", "date", "deliveries", "freight4", "id", "loadingNumber", "observations", "totalFreight", "totalValue" FROM "Load";
DROP TABLE "Load";
ALTER TABLE "new_Load" RENAME TO "Load";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
