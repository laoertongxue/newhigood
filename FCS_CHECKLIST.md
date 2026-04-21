# Week 3 FCS 系统实现检查清单

## ✅ 已完成任务

### 代码文件
- [x] `app/api/fcs/orders/route.ts` - GET/POST API 端点
- [x] `lib/hooks/useFcsOrders.ts` - SWR 数据获取 Hook
- [x] `app/dashboard/fcs/orders/page.tsx` - 完整的订单列表页面（搜索、过滤、排序、分页）
- [x] `app/dashboard/fcs/layout.tsx` - FCS 模块布局
- [x] `app/dashboard/fcs/orders/layout.tsx` - 订单页面布局
- [x] `lib/db/schema.sql` - 数据库表定义脚本
- [x] `package.json` - 添加 `seed:fcs` 脚本

### 文档
- [x] `SUPABASE_SETUP.md` - 完整的配置指南

## 🚀 接下来需要执行的步骤

### 第 1 步：创建数据库表（需要手动操作）

1. 打开 Supabase 仪表板: https://app.supabase.com
2. 进入你的项目
3. 打开 **SQL Editor**
4. 复制 `lib/db/schema.sql` 中的所有 SQL 代码
5. 粘贴到 SQL Editor 并执行

**或直接复制以下 SQL：**
```sql
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255),
  product_name VARCHAR(255),
  quantity INTEGER,
  start_date DATE,
  end_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'normal',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_name VARCHAR(255),
  line_code VARCHAR(100) UNIQUE,
  capacity INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS production_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES production_orders(id) ON DELETE CASCADE,
  plan_no VARCHAR(100) UNIQUE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  assigned_worker VARCHAR(255),
  line_id UUID REFERENCES production_lines(id),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_created_at ON production_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_production_orders_order_no ON production_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_production_lines_status ON production_lines(status);
CREATE INDEX IF NOT EXISTS idx_production_plans_order_id ON production_plans(order_id);
CREATE INDEX IF NOT EXISTS idx_production_plans_status ON production_plans(status);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for authenticated users" ON production_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON production_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for production_lines" ON production_lines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read for production_plans" ON production_plans
  FOR SELECT USING (auth.role() = 'authenticated');
```

### 第 2 步：导入示例数据

```bash
npm run seed:fcs
```

### 第 3 步：启动开发服务器并测试

```bash
npm run dev
```

访问: http://localhost:3000/dashboard/fcs/orders

## 🧪 测试功能

- [ ] 列表页面正常加载（显示 10 条订单）
- [ ] 搜索功能正常（搜索订单号、客户或产品）
- [ ] 状态过滤正常（过滤为"进行中"应显示 3 条）
- [ ] 优先级过滤正常
- [ ] 排序正常（点击列标题改变排序）
- [ ] 分页正常（翻页功能）
- [ ] 点击订单行能打开标签页

## 📊 API 端点说明

### GET /api/fcs/orders
列表订单，支持参数：
- `page` (default: 1) - 页码
- `limit` (default: 20) - 每页数量
- `status` - 过滤状态（pending, in_progress, completed, cancelled）
- `priority` - 过滤优先级（low, normal, high, urgent）
- `search` - 搜索关键词
- `sortBy` - 排序字段（默认: created_at）
- `order` - 排序顺序（asc 或 desc）

**响应格式：**
```json
{
  "items": [
    {
      "id": "uuid",
      "order_no": "PO-2026-001",
      "customer_name": "客户A",
      "product_name": "产品名称",
      "quantity": 100,
      "start_date": "2026-04-20",
      "end_date": "2026-04-30",
      "status": "pending",
      "priority": "high",
      "created_at": "2026-04-20T...",
      "updated_at": "2026-04-20T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10,
    "totalPages": 1
  }
}
```

### POST /api/fcs/orders
创建新订单

**请求体：**
```json
{
  "order_no": "PO-2026-011",
  "customer_name": "新客户",
  "product_name": "新产品",
  "quantity": 150,
  "start_date": "2026-04-25",
  "end_date": "2026-05-05",
  "priority": "high"
}
```

## 🗂️ 创建的文件结构

```
newhigood/
├── app/
│   ├── api/
│   │   └── fcs/
│   │       └── orders/
│   │           └── route.ts (NEW)
│   └── dashboard/
│       └── fcs/
│           ├── layout.tsx (NEW)
│           └── orders/
│               ├── layout.tsx (NEW)
│               └── page.tsx (NEW) - 列表页面
├── lib/
│   ├── db/
│   │   ├── schema.sql (NEW)
│   │   └── seed-fcs.ts (existing)
│   ├── hooks/
│   │   └── useFcsOrders.ts (NEW)
│   ├── types/
│   │   └── fcs.ts (existing)
│   └── config/
│       └── navigation.ts (existing)
├── SUPABASE_SETUP.md (UPDATED)
├── FCS_CHECKLIST.md (THIS FILE)
└── package.json (UPDATED - added seed:fcs script)
```

## ⚠️ 常见问题排查

### 问题 1：API 返回 401 Unauthorized
**原因：** 用户未登录或会话过期
**解决：** 确保已登录，刷新页面或重新登录

### 问题 2：API 返回 400 Bad Request
**原因：** 查询参数格式错误或数据库连接失败
**解决：** 检查浏览器控制台的错误信息，确认环境变量正确

### 问题 3：Seed 脚本失败
**原因：** 缺少环境变量或表不存在
**解决：** 确保 `.env.local` 中有正确的 `SUPABASE_SERVICE_ROLE_KEY`，并先创建数据库表

### 问题 4：RLS 策略导致数据不可见
**原因：** RLS 策略过于严格
**解决：** 检查 Supabase 中的 RLS 策略是否正确（应该允许认证用户读取）

## 🎯 下一个任务（Week 4）

当 Week 3 完成后，继续：
- [ ] 订单详情页面 (`/app/dashboard/fcs/orders/[id]/page.tsx`)
- [ ] 订单编辑表单
- [ ] 订单创建表单
- [ ] 批量操作（删除、状态更新）
- [ ] 操作日志（audit_logs）
