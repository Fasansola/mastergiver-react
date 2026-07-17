-- Add optional name field to users table (business owner's full name collected at signup)
ALTER TABLE "users" ADD COLUMN "name" TEXT;
