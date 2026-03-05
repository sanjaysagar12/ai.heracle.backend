-- AlterTable
ALTER TABLE "user_profiles" ADD COLUMN     "goal_weight_kg" DOUBLE PRECISION,
ADD COLUMN     "goal_weight_lbs" DOUBLE PRECISION,
ADD COLUMN     "target_calories" INTEGER,
ADD COLUMN     "target_carbs" DOUBLE PRECISION,
ADD COLUMN     "target_fat" DOUBLE PRECISION,
ADD COLUMN     "target_fiber" DOUBLE PRECISION,
ADD COLUMN     "target_protein" DOUBLE PRECISION;
