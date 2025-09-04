/*
  Warnings:

  - Added the required column `updatedAt` to the `Trip` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `TripExpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TripExpense` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destination" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "freightValue" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'em_andamento',
    "notes" TEXT,
    "truckId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trip_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("date", "destination", "driver", "freightValue", "id", "truckId") SELECT "date", "destination", "driver", "freightValue", "id", "truckId" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
CREATE TABLE "new_Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "service" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "notes" TEXT,
    "truckId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Maintenance_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Maintenance" ("date", "id", "km", "notes", "service", "truckId", "value") SELECT "date", "id", "km", "notes", "service", "truckId", "value" FROM "Maintenance";
DROP TABLE "Maintenance";
ALTER TABLE "new_Maintenance" RENAME TO "Maintenance";
CREATE TABLE "new_TripExpense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "category" TEXT NOT NULL,
    "notes" TEXT,
    "tripId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TripExpense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TripExpense" ("amount", "date", "description", "id", "tripId") SELECT "amount", "date", "description", "id", "tripId" FROM "TripExpense";
DROP TABLE "TripExpense";
ALTER TABLE "new_TripExpense" RENAME TO "TripExpense";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
