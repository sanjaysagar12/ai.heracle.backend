-- CreateTable
CREATE TABLE "diet_suggestions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "suggestion" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diet_suggestions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diet_suggestions" ADD CONSTRAINT "diet_suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
