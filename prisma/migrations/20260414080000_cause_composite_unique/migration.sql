-- Drop the old single-column unique constraints
DROP INDEX IF EXISTS "causes_name_key";
DROP INDEX IF EXISTS "causes_slug_key";

-- Add composite unique constraints (name+panel, slug+panel)
-- This allows the same name/slug to exist in different panels (INDIVIDUAL vs BUSINESS)
CREATE UNIQUE INDEX "causes_name_panel_key" ON "causes"("name", "panel");
CREATE UNIQUE INDEX "causes_slug_panel_key" ON "causes"("slug", "panel");
