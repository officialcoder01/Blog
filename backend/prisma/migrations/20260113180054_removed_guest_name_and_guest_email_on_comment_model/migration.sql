/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "guestEmail",
DROP COLUMN "guestName";
