-- Add featured column to projects for homepage display control
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Index for quick homepage query
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured) WHERE featured = true;
