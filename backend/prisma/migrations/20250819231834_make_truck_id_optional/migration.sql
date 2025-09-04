-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destination" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "freightValue" REAL NOT NULL,
    "truckId" INTEGER,
    CONSTRAINT "Trip_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Trip" ("date", "destination", "driver", "freightValue", "id", "truckId") SELECT "date", "destination", "driver", "freightValue", "id", "truckId" FROM "Trip";
DROP TABLE "Trip";
ALTER TABLE "new_Trip" RENAME TO "Trip";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
