/*
  Warnings:

  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
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
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Employee" ("baseSalary", "id", "name", "role", "status", "hireDate", "createdAt", "updatedAt") 
SELECT "baseSalary", "id", "name", "role", "status", CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP FROM "Employee";
DROP TABLE "Employee";
ALTER TABLE "new_Employee" RENAME TO "Employee";
CREATE UNIQUE INDEX "Employee_cpf_key" ON "Employee"("cpf");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
