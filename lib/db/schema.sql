-- 全量业务 Schema（Auth + FCS + PCS + PDA）

-- -------------------------------------------------
-- 公共函数与触发器
-- -------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------------------------------
-- 用户画像与权限
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'operator' CHECK (role IN ('admin', 'manager', 'operator')),
  subsystems TEXT[] NOT NULL DEFAULT ARRAY['fcs']::TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

DROP TRIGGER IF EXISTS users_set_updated_at ON users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------
-- FCS（工厂生产协同）
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_name VARCHAR(255) NOT NULL,
  line_code VARCHAR(100) UNIQUE NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 0),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  plan_no VARCHAR(100) UNIQUE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  assigned_worker VARCHAR(255) NOT NULL,
  line_id UUID REFERENCES production_lines(id),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fcs_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_code VARCHAR(100) UNIQUE NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  safety_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'normal' CHECK (status IN ('normal', 'low', 'out_of_stock')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_created_at ON production_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_production_orders_order_no ON production_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_production_orders_created_by ON production_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_production_lines_status ON production_lines(status);
CREATE INDEX IF NOT EXISTS idx_production_plans_order_id ON production_plans(order_id);
CREATE INDEX IF NOT EXISTS idx_production_plans_status ON production_plans(status);
CREATE INDEX IF NOT EXISTS idx_fcs_inventory_item_code ON fcs_inventory(item_code);

DROP TRIGGER IF EXISTS production_orders_set_updated_at ON production_orders;
CREATE TRIGGER production_orders_set_updated_at
  BEFORE UPDATE ON production_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS production_lines_set_updated_at ON production_lines;
CREATE TRIGGER production_lines_set_updated_at
  BEFORE UPDATE ON production_lines
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS production_plans_set_updated_at ON production_plans;
CREATE TRIGGER production_plans_set_updated_at
  BEFORE UPDATE ON production_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS fcs_inventory_set_updated_at ON fcs_inventory;
CREATE TRIGGER fcs_inventory_set_updated_at
  BEFORE UPDATE ON fcs_inventory
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------
-- PCS（商品协调）
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS pcs_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_code VARCHAR(60) UNIQUE NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pcs_goods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goods_code VARCHAR(100) UNIQUE NOT NULL,
  goods_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('fabric', 'accessory', 'component', 'other')),
  supplier VARCHAR(255) NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pcs_coordination_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coordination_no VARCHAR(100) UNIQUE NOT NULL,
  goods_id UUID NOT NULL REFERENCES pcs_goods(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'completed')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pcs_inventory_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goods_id UUID NOT NULL REFERENCES pcs_goods(id) ON DELETE CASCADE,
  coordination_order_id UUID REFERENCES pcs_coordination_orders(id) ON DELETE SET NULL,
  allocated_quantity INTEGER NOT NULL CHECK (allocated_quantity > 0),
  warehouse VARCHAR(120) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'allocated' CHECK (status IN ('allocated', 'released', 'cancelled')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pcs_goods_category ON pcs_goods(category);
CREATE INDEX IF NOT EXISTS idx_pcs_goods_goods_code ON pcs_goods(goods_code);
CREATE INDEX IF NOT EXISTS idx_pcs_coordination_orders_status ON pcs_coordination_orders(status);
CREATE INDEX IF NOT EXISTS idx_pcs_coordination_orders_goods_id ON pcs_coordination_orders(goods_id);
CREATE INDEX IF NOT EXISTS idx_pcs_inventory_allocations_goods_id ON pcs_inventory_allocations(goods_id);

DROP TRIGGER IF EXISTS pcs_categories_set_updated_at ON pcs_categories;
CREATE TRIGGER pcs_categories_set_updated_at
  BEFORE UPDATE ON pcs_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_goods_set_updated_at ON pcs_goods;
CREATE TRIGGER pcs_goods_set_updated_at
  BEFORE UPDATE ON pcs_goods
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_coordination_orders_set_updated_at ON pcs_coordination_orders;
CREATE TRIGGER pcs_coordination_orders_set_updated_at
  BEFORE UPDATE ON pcs_coordination_orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_inventory_allocations_set_updated_at ON pcs_inventory_allocations;
CREATE TRIGGER pcs_inventory_allocations_set_updated_at
  BEFORE UPDATE ON pcs_inventory_allocations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------
-- PDA（生产数据助手）
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS pda_production_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  data_type VARCHAR(50) NOT NULL CHECK (data_type IN ('temperature', 'humidity', 'pressure', 'quantity', 'weight', 'other')),
  value NUMERIC(14, 4) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  recorded_by VARCHAR(255) NOT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT now(),
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pda_data_analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_no VARCHAR(100) UNIQUE NOT NULL,
  analysis_period JSONB NOT NULL,
  summary JSONB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pda_kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(120) NOT NULL,
  metric_value NUMERIC(14, 4) NOT NULL,
  period VARCHAR(100) NOT NULL,
  subsystem_type VARCHAR(20) NOT NULL DEFAULT 'pda',
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pda_production_data_type ON pda_production_data(data_type);
CREATE INDEX IF NOT EXISTS idx_pda_production_data_order_id ON pda_production_data(order_id);
CREATE INDEX IF NOT EXISTS idx_pda_production_data_recorded_at ON pda_production_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_pda_kpi_metrics_period ON pda_kpi_metrics(period);

-- -------------------------------------------------
-- RLS 基线策略
-- -------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcs_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_coordination_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_inventory_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_production_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_data_analysis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_kpi_metrics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_select_self_or_admin ON users;
CREATE POLICY users_select_self_or_admin ON users
  FOR SELECT USING (auth.role() = 'authenticated' AND (auth.uid() = id OR (auth.jwt()->>'role') IN ('admin', 'manager')));

DROP POLICY IF EXISTS users_update_self_or_admin ON users;
CREATE POLICY users_update_self_or_admin ON users
  FOR UPDATE USING (auth.role() = 'authenticated' AND (auth.uid() = id OR (auth.jwt()->>'role') IN ('admin', 'manager')))
  WITH CHECK (auth.role() = 'authenticated' AND (auth.uid() = id OR (auth.jwt()->>'role') IN ('admin', 'manager')));

DROP POLICY IF EXISTS users_insert_authenticated ON users;
CREATE POLICY users_insert_authenticated ON users
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = id);

DROP POLICY IF EXISTS production_orders_select_authenticated ON production_orders;
CREATE POLICY production_orders_select_authenticated ON production_orders
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS production_orders_insert_authenticated ON production_orders;
CREATE POLICY production_orders_insert_authenticated ON production_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND created_by = auth.uid());

DROP POLICY IF EXISTS production_orders_update_owner_or_manager ON production_orders;
CREATE POLICY production_orders_update_owner_or_manager ON production_orders
  FOR UPDATE USING (auth.uid() = created_by OR (auth.jwt()->>'role') IN ('admin', 'manager'))
  WITH CHECK (auth.uid() = created_by OR (auth.jwt()->>'role') IN ('admin', 'manager'));

DROP POLICY IF EXISTS production_orders_delete_owner_or_manager ON production_orders;
CREATE POLICY production_orders_delete_owner_or_manager ON production_orders
  FOR DELETE USING (auth.uid() = created_by OR (auth.jwt()->>'role') IN ('admin', 'manager'));

DROP POLICY IF EXISTS production_lines_all_authenticated ON production_lines;
CREATE POLICY production_lines_all_authenticated ON production_lines
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS production_plans_all_authenticated ON production_plans;
CREATE POLICY production_plans_all_authenticated ON production_plans
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS fcs_inventory_all_authenticated ON fcs_inventory;
CREATE POLICY fcs_inventory_all_authenticated ON fcs_inventory
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pcs_categories_all_authenticated ON pcs_categories;
CREATE POLICY pcs_categories_all_authenticated ON pcs_categories
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pcs_goods_all_authenticated ON pcs_goods;
CREATE POLICY pcs_goods_all_authenticated ON pcs_goods
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pcs_coordination_orders_all_authenticated ON pcs_coordination_orders;
CREATE POLICY pcs_coordination_orders_all_authenticated ON pcs_coordination_orders
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pcs_inventory_allocations_all_authenticated ON pcs_inventory_allocations;
CREATE POLICY pcs_inventory_allocations_all_authenticated ON pcs_inventory_allocations
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pda_production_data_all_authenticated ON pda_production_data;
CREATE POLICY pda_production_data_all_authenticated ON pda_production_data
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pda_data_analysis_reports_all_authenticated ON pda_data_analysis_reports;
CREATE POLICY pda_data_analysis_reports_all_authenticated ON pda_data_analysis_reports
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS pda_kpi_metrics_all_authenticated ON pda_kpi_metrics;
CREATE POLICY pda_kpi_metrics_all_authenticated ON pda_kpi_metrics
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
