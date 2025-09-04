-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Employee" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "baseSalary" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "cpf" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "hireDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Employee" ("address", "baseSalary", "cpf", "createdAt", "email", "hireDate", "id", "name", "phone", "role", "status", "updatedAt") SELECT "address", "baseSalary", "cpf", "createdAt", "email", "hireDate", "id", "name", "phone", "role", "status", "updatedAt" FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
