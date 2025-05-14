/*
  Warnings:
  - Added the required column `orderNumber` to the `Sale` table without a default value. This is not possible if the table is not empty.
*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Criar tabela temporária com orderNumber preenchido
CREATE TABLE "temp_Sale" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "saleDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderNumber" TEXT NOT NULL,
    CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Copiar dados da tabela Sale, preenchendo orderNumber
INSERT INTO "temp_Sale" ("id", "productId", "quantity", "saleDate", "orderNumber")
SELECT "id", "productId", "quantity", "saleDate", printf('%03d', "id") AS "orderNumber"
FROM "Sale";

-- Remover a tabela Sale original
DROP TABLE "Sale";

-- Renomear temp_Sale para Sale
ALTER TABLE "temp_Sale" RENAME TO "Sale";

-- Adicionar constraint UNIQUE para orderNumber
CREATE UNIQUE INDEX "Sale_orderNumber_key" ON "Sale"("orderNumber");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;