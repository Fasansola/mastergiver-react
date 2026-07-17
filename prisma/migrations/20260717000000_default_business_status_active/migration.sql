-- Change the default status for new Business rows from PENDING to ACTIVE.
-- Free access is now the structural default; PENDING is only assigned
-- explicitly when paymentRequired is true at signup time.
ALTER TABLE "businesses" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
