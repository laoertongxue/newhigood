-- 扩展 Schema：质检、裁剪计划、入库、对账单、PDA 任务

-- -------------------------------------------------
-- FCS 扩展表
-- -------------------------------------------------

-- 质检记录表
CREATE TABLE IF NOT EXISTS fcs_quality_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_no VARCHAR(100) UNIQUE NOT NULL,
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  factory_id UUID,
  factory_name VARCHAR(255),
  inspector VARCHAR(255) NOT NULL,
  inspect_date DATE NOT NULL,
  batch_qty INTEGER NOT NULL CHECK (batch_qty > 0),
  pass_qty INTEGER NOT NULL CHECK (pass_qty >= 0),
  fail_qty INTEGER NOT NULL CHECK (fail_qty >= 0),
  pass_rate NUMERIC(5, 2) NOT NULL,
  result VARCHAR(50) NOT NULL DEFAULT 'PASS' CHECK (result IN ('PASS', 'FAIL')),
  status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'CLOSED')),
  liability_status VARCHAR(50) CHECK (liability_status IN ('DRAFT', 'CONFIRMED', 'DISPUTED', 'VOID')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 裁剪计划表
CREATE TABLE IF NOT EXISTS fcs_cutting_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_no VARCHAR(100) UNIQUE NOT NULL,
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  factory_id UUID,
  factory_name VARCHAR(255),
  style_name VARCHAR(255),
  planned_date DATE NOT NULL,
  marker_id VARCHAR(100),
  fabric_code VARCHAR(100),
  fabric_name VARCHAR(255),
  layers INTEGER NOT NULL CHECK (layers > 0),
  total_qty INTEGER NOT NULL CHECK (total_qty > 0),
  cut_qty INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 入库记录表
CREATE TABLE IF NOT EXISTS fcs_inbound_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inbound_no VARCHAR(100) UNIQUE NOT NULL,
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  factory_name VARCHAR(255),
  style_name VARCHAR(255),
  inbound_date DATE NOT NULL,
  total_qty INTEGER NOT NULL CHECK (total_qty > 0),
  qualified_qty INTEGER NOT NULL DEFAULT 0,
  rejected_qty INTEGER NOT NULL DEFAULT 0,
  warehouse_id VARCHAR(100),
  warehouse_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
  operator VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 对账单表
CREATE TABLE IF NOT EXISTS fcs_settlement_statements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  statement_no VARCHAR(100) UNIQUE NOT NULL,
  factory_id UUID,
  factory_name VARCHAR(255) NOT NULL,
  statement_month VARCHAR(7) NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  deduction_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  item_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'CONFIRMED', 'CLOSED')),
  confirmed_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 任务进度表
CREATE TABLE IF NOT EXISTS fcs_task_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_no VARCHAR(100) UNIQUE NOT NULL,
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  factory_name VARCHAR(255),
  style_name VARCHAR(255),
  current_process VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'BLOCKED', 'DELAYED', 'COMPLETED')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  planned_qty INTEGER NOT NULL DEFAULT 0,
  completed_qty INTEGER NOT NULL DEFAULT 0,
  planned_end_date DATE,
  blocker_reason TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- -------------------------------------------------
-- PCS 扩展表
-- -------------------------------------------------

-- 商品项目表
CREATE TABLE IF NOT EXISTS pcs_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_no VARCHAR(100) UNIQUE NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  style_code VARCHAR(100),
  style_name VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'IN_PROGRESS', 'APPROVED', 'COMPLETED', 'CANCELLED')),
  priority VARCHAR(50) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  planned_start_date DATE,
  planned_end_date DATE,
  actual_start_date DATE,
  actual_end_date DATE,
  budget NUMERIC(14, 2),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 测款记录表
CREATE TABLE IF NOT EXISTS pcs_testing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_no VARCHAR(100) UNIQUE NOT NULL,
  project_id UUID REFERENCES pcs_projects(id) ON DELETE SET NULL,
  testing_type VARCHAR(50) NOT NULL CHECK (testing_type IN ('LIVE', 'VIDEO', 'OTHER')),
  style_code VARCHAR(100),
  style_name VARCHAR(255),
  testing_date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  conversion_rate NUMERIC(5, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 面料档案表
CREATE TABLE IF NOT EXISTS pcs_fabric_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_code VARCHAR(100) UNIQUE NOT NULL,
  fabric_name VARCHAR(255) NOT NULL,
  composition VARCHAR(255),
  weight NUMERIC(8, 2),
  width NUMERIC(8, 2),
  supplier VARCHAR(255),
  unit_price NUMERIC(12, 2) DEFAULT 0,
  stock_qty NUMERIC(12, 2) DEFAULT 0,
  unit VARCHAR(30) DEFAULT '米',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 辅料档案表
CREATE TABLE IF NOT EXISTS pcs_accessory_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessory_code VARCHAR(100) UNIQUE NOT NULL,
  accessory_name VARCHAR(255) NOT NULL,
  category VARCHAR(50) CHECK (category IN ('BUTTON', 'ZIPPER', 'THREAD', 'LABEL', 'OTHER')),
  supplier VARCHAR(255),
  unit_price NUMERIC(12, 2) DEFAULT 0,
  stock_qty NUMERIC(12, 2) DEFAULT 0,
  unit VARCHAR(30) DEFAULT '个',
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- 样衣记录表
CREATE TABLE IF NOT EXISTS pcs_sample_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_no VARCHAR(100) UNIQUE NOT NULL,
  project_id UUID REFERENCES pcs_projects(id) ON DELETE SET NULL,
  style_code VARCHAR(100),
  style_name VARCHAR(255),
  sample_type VARCHAR(50) NOT NULL CHECK (sample_type IN ('FIRST_SAMPLE', 'PREPRODUCTION_SAMPLE', 'PP_SAMPLE')),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
  submitter VARCHAR(255),
  submit_date DATE,
  expected_date DATE,
  actual_date DATE,
  quality_score INTEGER,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- -------------------------------------------------
-- PDA 扩展表
-- -------------------------------------------------

-- PDA 任务表
CREATE TABLE IF NOT EXISTS pda_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_no VARCHAR(100) UNIQUE NOT NULL,
  task_type VARCHAR(50) NOT NULL CHECK (task_type IN ('CUTTING', 'SEWING', 'QC', 'INBOUND', 'PACKING')),
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  description TEXT,
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  deadline DATE,
  estimated_duration VARCHAR(50),
  assigned_to VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PDA 执行记录表
CREATE TABLE IF NOT EXISTS pda_exec_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exec_no VARCHAR(100) UNIQUE NOT NULL,
  task_id UUID REFERENCES pda_tasks(id) ON DELETE SET NULL,
  worker_name VARCHAR(255) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  completed_qty INTEGER NOT NULL DEFAULT 0,
  target_qty INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'CANCELLED')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PDA 采集记录表
CREATE TABLE IF NOT EXISTS pda_collect_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collect_no VARCHAR(100) UNIQUE NOT NULL,
  collect_type VARCHAR(50) NOT NULL CHECK (collect_type IN ('CUTTING_OUTPUT', 'SEWING_OUTPUT', 'QC_OUTPUT', 'MATERIAL_CONSUMPTION', 'DEFECT_RECORD')),
  production_order_id UUID REFERENCES production_orders(id) ON DELETE SET NULL,
  worker_name VARCHAR(255) NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  batch_no VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UPLOADED', 'FAILED')),
  collect_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PDA 通知表
CREATE TABLE IF NOT EXISTS pda_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notify_no VARCHAR(100) UNIQUE NOT NULL,
  notify_type VARCHAR(50) NOT NULL CHECK (notify_type IN ('TASK_ASSIGNMENT', 'DEADLINE_REMINDER', 'QC_RESULT', 'SYSTEM_ALERT')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
  recipient VARCHAR(255),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PDA 导出记录表
CREATE TABLE IF NOT EXISTS pda_export_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  export_no VARCHAR(100) UNIQUE NOT NULL,
  export_type VARCHAR(50) NOT NULL CHECK (export_type IN ('PRODUCTION_DATA', 'QC_RECORDS', 'WORKER_PERFORMANCE', 'MATERIAL_USAGE')),
  export_format VARCHAR(20) NOT NULL CHECK (export_format IN ('EXCEL', 'PDF', 'CSV')),
  date_range VARCHAR(100),
  record_count INTEGER DEFAULT 0,
  file_size VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  created_by VARCHAR(255),
  download_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- -------------------------------------------------
-- 索引
-- -------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_fcs_quality_records_status ON fcs_quality_records(status);
CREATE INDEX IF NOT EXISTS idx_fcs_quality_records_inspect_date ON fcs_quality_records(inspect_date DESC);
CREATE INDEX IF NOT EXISTS idx_fcs_cutting_plans_status ON fcs_cutting_plans(status);
CREATE INDEX IF NOT EXISTS idx_fcs_cutting_plans_planned_date ON fcs_cutting_plans(planned_date);
CREATE INDEX IF NOT EXISTS idx_fcs_inbound_records_status ON fcs_inbound_records(status);
CREATE INDEX IF NOT EXISTS idx_fcs_inbound_records_inbound_date ON fcs_inbound_records(inbound_date DESC);
CREATE INDEX IF NOT EXISTS idx_fcs_settlement_statements_status ON fcs_settlement_statements(status);
CREATE INDEX IF NOT EXISTS idx_fcs_settlement_statements_factory ON fcs_settlement_statements(factory_id);
CREATE INDEX IF NOT EXISTS idx_fcs_task_progress_status ON fcs_task_progress(status);
CREATE INDEX IF NOT EXISTS idx_pcs_projects_status ON pcs_projects(status);
CREATE INDEX IF NOT EXISTS idx_pcs_testing_records_type ON pcs_testing_records(testing_type);
CREATE INDEX IF NOT EXISTS idx_pcs_sample_records_status ON pcs_sample_records(status);
CREATE INDEX IF NOT EXISTS idx_pda_tasks_status ON pda_tasks(status);
CREATE INDEX IF NOT EXISTS idx_pda_exec_records_status ON pda_exec_records(status);
CREATE INDEX IF NOT EXISTS idx_pda_collect_records_type ON pda_collect_records(collect_type);
CREATE INDEX IF NOT EXISTS idx_pda_notifications_is_read ON pda_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_pda_export_records_status ON pda_export_records(status);

-- -------------------------------------------------
-- 触发器
-- -------------------------------------------------
DROP TRIGGER IF EXISTS fcs_quality_records_set_updated_at ON fcs_quality_records;
CREATE TRIGGER fcs_quality_records_set_updated_at
  BEFORE UPDATE ON fcs_quality_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS fcs_cutting_plans_set_updated_at ON fcs_cutting_plans;
CREATE TRIGGER fcs_cutting_plans_set_updated_at
  BEFORE UPDATE ON fcs_cutting_plans
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS fcs_inbound_records_set_updated_at ON fcs_inbound_records;
CREATE TRIGGER fcs_inbound_records_set_updated_at
  BEFORE UPDATE ON fcs_inbound_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS fcs_settlement_statements_set_updated_at ON fcs_settlement_statements;
CREATE TRIGGER fcs_settlement_statements_set_updated_at
  BEFORE UPDATE ON fcs_settlement_statements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS fcs_task_progress_set_updated_at ON fcs_task_progress;
CREATE TRIGGER fcs_task_progress_set_updated_at
  BEFORE UPDATE ON fcs_task_progress
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_projects_set_updated_at ON pcs_projects;
CREATE TRIGGER pcs_projects_set_updated_at
  BEFORE UPDATE ON pcs_projects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_testing_records_set_updated_at ON pcs_testing_records;
CREATE TRIGGER pcs_testing_records_set_updated_at
  BEFORE UPDATE ON pcs_testing_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_sample_records_set_updated_at ON pcs_sample_records;
CREATE TRIGGER pcs_sample_records_set_updated_at
  BEFORE UPDATE ON pcs_sample_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pda_tasks_set_updated_at ON pda_tasks;
CREATE TRIGGER pda_tasks_set_updated_at
  BEFORE UPDATE ON pda_tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pda_exec_records_set_updated_at ON pda_exec_records;
CREATE TRIGGER pda_exec_records_set_updated_at
  BEFORE UPDATE ON pda_exec_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pda_collect_records_set_updated_at ON pda_collect_records;
CREATE TRIGGER pda_collect_records_set_updated_at
  BEFORE UPDATE ON pda_collect_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pda_notifications_set_updated_at ON pda_notifications;
CREATE TRIGGER pda_notifications_set_updated_at
  BEFORE UPDATE ON pda_notifications
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pda_export_records_set_updated_at ON pda_export_records;
CREATE TRIGGER pda_export_records_set_updated_at
  BEFORE UPDATE ON pda_export_records
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------
-- RLS 策略
-- -------------------------------------------------
ALTER TABLE fcs_quality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcs_cutting_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcs_inbound_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcs_settlement_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE fcs_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_testing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_fabric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_accessory_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_sample_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_exec_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_collect_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pda_export_records ENABLE ROW LEVEL SECURITY;



-- -------------------------------------------------
-- PCS 补充表（与 Hook 对应）
-- -------------------------------------------------

-- PCS 待办事项表
CREATE TABLE IF NOT EXISTS pcs_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  todo_no VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assignee VARCHAR(255),
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status VARCHAR(50) NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED')),
  due_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 告警表
CREATE TABLE IF NOT EXISTS pcs_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_no VARCHAR(100) UNIQUE NOT NULL,
  alert_type VARCHAR(50) NOT NULL CHECK (alert_type IN ('QUALITY', 'DELIVERY', 'STOCK', 'COST', 'SYSTEM')),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  severity VARCHAR(50) NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status VARCHAR(50) NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ACKNOWLEDGED', 'RESOLVED', 'CLOSED')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 门店表
CREATE TABLE IF NOT EXISTS pcs_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_no VARCHAR(100) UNIQUE NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  channel VARCHAR(100),
  region VARCHAR(100),
  contact VARCHAR(255),
  phone VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'CLOSED')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 版单修订表
CREATE TABLE IF NOT EXISTS pcs_pattern_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  revision_no VARCHAR(100) UNIQUE NOT NULL,
  pattern_name VARCHAR(255) NOT NULL,
  version VARCHAR(20) NOT NULL,
  revision_reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'REVIEWING', 'APPROVED', 'REJECTED')),
  revised_by VARCHAR(255),
  revised_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 面料表
CREATE TABLE IF NOT EXISTS pcs_fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fabric_no VARCHAR(100) UNIQUE NOT NULL,
  fabric_name VARCHAR(255) NOT NULL,
  fabric_type VARCHAR(100),
  composition VARCHAR(255),
  width VARCHAR(50),
  weight VARCHAR(50),
  supplier VARCHAR(255),
  unit_price NUMERIC(12, 2) DEFAULT 0,
  unit VARCHAR(30) DEFAULT '米',
  stock_qty NUMERIC(12, 2) DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOW_STOCK')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 辅料表
CREATE TABLE IF NOT EXISTS pcs_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessory_no VARCHAR(100) UNIQUE NOT NULL,
  accessory_name VARCHAR(255) NOT NULL,
  accessory_type VARCHAR(100),
  supplier VARCHAR(255),
  unit_price NUMERIC(12, 2) DEFAULT 0,
  unit VARCHAR(30) DEFAULT '个',
  stock_qty NUMERIC(12, 2) DEFAULT 0,
  min_stock NUMERIC(12, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOW_STOCK')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 样衣表
CREATE TABLE IF NOT EXISTS pcs_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sample_no VARCHAR(100) UNIQUE NOT NULL,
  sample_type VARCHAR(50) NOT NULL CHECK (sample_type IN ('FIRST_SAMPLE', 'SIZE_SAMPLE', 'SALES_SAMPLE', 'PRODUCTION_SAMPLE')),
  project_id UUID REFERENCES pcs_projects(id) ON DELETE SET NULL,
  sample_name VARCHAR(255) NOT NULL,
  style_no VARCHAR(100),
  size VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'RECEIVED', 'IN_REVIEW', 'APPROVED', 'REJECTED')),
  received_date DATE,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 测试表
CREATE TABLE IF NOT EXISTS pcs_testing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  testing_no VARCHAR(100) UNIQUE NOT NULL,
  testing_type VARCHAR(50) NOT NULL CHECK (testing_type IN ('LIVE', 'VIDEO')),
  project_id UUID REFERENCES pcs_projects(id) ON DELETE SET NULL,
  sample_name VARCHAR(255) NOT NULL,
  tester VARCHAR(255),
  test_date DATE NOT NULL,
  result VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 商品表
CREATE TABLE IF NOT EXISTS pcs_goods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goods_no VARCHAR(100) UNIQUE NOT NULL,
  goods_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  channel VARCHAR(100),
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'INACTIVE', 'PENDING')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 分类表
CREATE TABLE IF NOT EXISTS pcs_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_no VARCHAR(100) UNIQUE NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES pcs_categories(id) ON DELETE SET NULL,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 3),
  sort_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 协同表
CREATE TABLE IF NOT EXISTS pcs_coordination (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_no VARCHAR(100) UNIQUE NOT NULL,
  task_name VARCHAR(255) NOT NULL,
  assignee VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  due_date DATE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- PCS 分配表
CREATE TABLE IF NOT EXISTS pcs_allocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_no VARCHAR(100) UNIQUE NOT NULL,
  resource_type VARCHAR(100),
  resource_name VARCHAR(255) NOT NULL,
  target VARCHAR(255),
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ALLOCATED', 'IN_USE', 'RETURNED')),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- -------------------------------------------------
-- 补充索引
-- -------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_pcs_todos_status ON pcs_todos(status);
CREATE INDEX IF NOT EXISTS idx_pcs_alerts_status ON pcs_alerts(status);
CREATE INDEX IF NOT EXISTS idx_pcs_stores_status ON pcs_stores(status);
CREATE INDEX IF NOT EXISTS idx_pcs_pattern_revisions_status ON pcs_pattern_revisions(status);
CREATE INDEX IF NOT EXISTS idx_pcs_fabrics_status ON pcs_fabrics(status);
CREATE INDEX IF NOT EXISTS idx_pcs_accessories_status ON pcs_accessories(status);
CREATE INDEX IF NOT EXISTS idx_pcs_samples_status ON pcs_samples(status);
CREATE INDEX IF NOT EXISTS idx_pcs_testing_type ON pcs_testing(testing_type);
CREATE INDEX IF NOT EXISTS idx_pcs_goods_status ON pcs_goods(status);
CREATE INDEX IF NOT EXISTS idx_pcs_categories_level ON pcs_categories(level);
CREATE INDEX IF NOT EXISTS idx_pcs_coordination_status ON pcs_coordination(status);
CREATE INDEX IF NOT EXISTS idx_pcs_allocation_status ON pcs_allocation(status);

-- -------------------------------------------------
-- 补充触发器
-- -------------------------------------------------
DROP TRIGGER IF EXISTS pcs_todos_set_updated_at ON pcs_todos;
CREATE TRIGGER pcs_todos_set_updated_at BEFORE UPDATE ON pcs_todos FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_alerts_set_updated_at ON pcs_alerts;
CREATE TRIGGER pcs_alerts_set_updated_at BEFORE UPDATE ON pcs_alerts FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_stores_set_updated_at ON pcs_stores;
CREATE TRIGGER pcs_stores_set_updated_at BEFORE UPDATE ON pcs_stores FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_pattern_revisions_set_updated_at ON pcs_pattern_revisions;
CREATE TRIGGER pcs_pattern_revisions_set_updated_at BEFORE UPDATE ON pcs_pattern_revisions FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_fabrics_set_updated_at ON pcs_fabrics;
CREATE TRIGGER pcs_fabrics_set_updated_at BEFORE UPDATE ON pcs_fabrics FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_accessories_set_updated_at ON pcs_accessories;
CREATE TRIGGER pcs_accessories_set_updated_at BEFORE UPDATE ON pcs_accessories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_samples_set_updated_at ON pcs_samples;
CREATE TRIGGER pcs_samples_set_updated_at BEFORE UPDATE ON pcs_samples FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_testing_set_updated_at ON pcs_testing;
CREATE TRIGGER pcs_testing_set_updated_at BEFORE UPDATE ON pcs_testing FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_goods_set_updated_at ON pcs_goods;
CREATE TRIGGER pcs_goods_set_updated_at BEFORE UPDATE ON pcs_goods FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_categories_set_updated_at ON pcs_categories;
CREATE TRIGGER pcs_categories_set_updated_at BEFORE UPDATE ON pcs_categories FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_coordination_set_updated_at ON pcs_coordination;
CREATE TRIGGER pcs_coordination_set_updated_at BEFORE UPDATE ON pcs_coordination FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS pcs_allocation_set_updated_at ON pcs_allocation;
CREATE TRIGGER pcs_allocation_set_updated_at BEFORE UPDATE ON pcs_allocation FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- -------------------------------------------------
-- 补充 RLS 策略
-- -------------------------------------------------
ALTER TABLE pcs_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_pattern_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_testing ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_goods ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE pcs_allocation ENABLE ROW LEVEL SECURITY;

CREATE POLICY pcs_todos_all_authenticated ON pcs_todos FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_alerts_all_authenticated ON pcs_alerts FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_stores_all_authenticated ON pcs_stores FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_pattern_revisions_all_authenticated ON pcs_pattern_revisions FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_fabrics_all_authenticated ON pcs_fabrics FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_accessories_all_authenticated ON pcs_accessories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_samples_all_authenticated ON pcs_samples FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_testing_all_authenticated ON pcs_testing FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_goods_all_authenticated ON pcs_goods FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_categories_all_authenticated ON pcs_categories FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_coordination_all_authenticated ON pcs_coordination FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_allocation_all_authenticated ON pcs_allocation FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- 所有扩展表允许认证用户读写
CREATE POLICY fcs_quality_records_all_authenticated ON fcs_quality_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY fcs_cutting_plans_all_authenticated ON fcs_cutting_plans FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY fcs_inbound_records_all_authenticated ON fcs_inbound_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY fcs_settlement_statements_all_authenticated ON fcs_settlement_statements FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY fcs_task_progress_all_authenticated ON fcs_task_progress FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_projects_all_authenticated ON pcs_projects FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_testing_records_all_authenticated ON pcs_testing_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_fabric_records_all_authenticated ON pcs_fabric_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_accessory_records_all_authenticated ON pcs_accessory_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pcs_sample_records_all_authenticated ON pcs_sample_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pda_tasks_all_authenticated ON pda_tasks FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pda_exec_records_all_authenticated ON pda_exec_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pda_collect_records_all_authenticated ON pda_collect_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pda_notifications_all_authenticated ON pda_notifications FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY pda_export_records_all_authenticated ON pda_export_records FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
