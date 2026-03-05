/*
  Warnings:

  - A unique constraint covering the columns `[user_id,date]` on the table `diet_suggestions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `diet_suggestions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "diet_suggestions" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "diet_suggestions_user_id_date_key" ON "diet_suggestions"("user_id", "date");
