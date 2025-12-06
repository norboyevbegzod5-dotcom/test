-- Database initialization script
-- Run this script to set up the database schema

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name VARCHAR(255) NOT NULL,
  cabinet_data JSONB NOT NULL,
  cutting_plan JSONB,
  hardware JSONB,
  cost JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  thickness INTEGER NOT NULL,
  price_per_square_meter DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(type, thickness)
);

-- Hardware prices table
CREATE TABLE IF NOT EXISTS hardware_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_materials_type ON materials(type);

-- Insert default material prices
INSERT INTO materials (type, thickness, price_per_square_meter, name)
VALUES
  ('ЛДСП', 16, 1200, 'ЛДСП 16мм'),
  ('ЛДСП', 18, 1400, 'ЛДСП 18мм'),
  ('ЛДСП', 25, 1800, 'ЛДСП 25мм'),
  ('МДФ', 16, 1500, 'МДФ 16мм'),
  ('МДФ', 18, 1700, 'МДФ 18мм'),
  ('МДФ', 25, 2100, 'МДФ 25мм'),
  ('Фанера', 16, 2000, 'Фанера 16мм'),
  ('Фанера', 18, 2200, 'Фанера 18мм'),
  ('Фанера', 25, 2600, 'Фанера 25мм')
ON CONFLICT (type, thickness) DO NOTHING;

-- Insert default hardware prices
INSERT INTO hardware_prices (type, price)
VALUES
  ('hinge', 45),
  ('drawer_slide', 350),
  ('screw', 0.5),
  ('confirmat', 2.5),
  ('dowel', 0.3),
  ('edge_band', 15),
  ('leg', 120),
  ('handle', 150),
  ('back_panel_fastener', 0.8)
ON CONFLICT (type) DO NOTHING;
