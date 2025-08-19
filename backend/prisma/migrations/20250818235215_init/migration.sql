-- CreateTable
CREATE TABLE "Truck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "plate" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "docExpiry" DATETIME NOT NULL,
    "renavam" TEXT NOT NULL,
    "image" TEXT
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "service" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "value" REAL NOT NULL,
    "notes" TEXT,
    "truckId" INTEGER NOT NULL,
    CONSTRAINT "Maintenance_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "destination" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "freightValue" REAL NOT NULL,
    "truckId" INTEGER NOT NULL,
    CONSTRAINT "Trip_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TripExpense" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    CONSTRAINT "TripExpense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Truck_plate_key" ON "Truck"("plate");
