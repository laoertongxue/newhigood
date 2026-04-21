# Supabase 环境配置指南

## 1️⃣ 获取 Supabase 凭证

1. 访问 https://app.supabase.com
2. 登录或创建账户
3. 创建一个新项目（如果还没有）
4. 进入项目设置
5. 在 **Settings > API** 下找到：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

## 2️⃣ .env.local 配置

复制你的凭证到 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 3️⃣ 创建数据库表

在 Supabase SQL 编辑器中运行以下 SQL：

### 复制以下完整 SQL 脚本到 Supabase SQL 编辑器：

```sql
-- 生产订单表
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

-- 产线表
CREATE TABLE IF NOT EXISTS production_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_name VARCHAR(255),
  line_code VARCHAR(100) UNIQUE,
  capacity INTEGER,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 生产计划表
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

-- 创建索引（提高查询性能）
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_created_at ON production_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_production_orders_order_no ON production_orders(order_no);
CREATE INDEX IF NOT EXISTS idx_production_lines_status ON production_lines(status);
CREATE INDEX IF NOT EXISTS idx_production_plans_order_id ON production_plans(order_id);
CREATE INDEX IF NOT EXISTS idx_production_plans_status ON production_plans(status);

-- 启用行级安全（RLS）
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "Enable read for authenticated users" ON production_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON production_orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read for production_lines" ON production_lines
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read for production_plans" ON production_plans
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 4️⃣ 导入示例数据

在项目根目录运行：

```bash
npm run seed:fcs
```

**预期输出：**
```
开始导入生产订单数据...
✓ 成功导入 10 条生产订单数据
开始导入产线数据...
✓ 成功导入 5 条产线数据
开始导入生产计划数据...
✓ 成功导入 3 条生产计划数据

✨ 所有 FCS 系统数据导入完成！
```

## 5️⃣ 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000/dashboard/fcs/orders

## 📋 测试功能清单

- [ ] **加载订单列表** - 应该看到 10 条订单
- [ ] **搜索功能** - 搜索 "PO-2026-001" 应该找到订单
- [ ] **状态过滤** - 选择 "进行中" 应该看到 3 条订单
- [ ] **优先级过滤** - 选择 "高" 应该看到相应订单
- [ ] **排序** - 点击列标题应该改变排序方向
- [ ] **分页** - 应该能够翻页浏览
- [ ] **点击行** - 点击订单行应该打开标签页

## 已创建的文件

- `lib/db/supabase.ts` - 服务器端客户端（使用 service role key）
- `lib/db/supabase-client.ts` - 浏览器端客户端（使用 anon key）
- `lib/db/supabase-server.ts` - Server Component 专用客户端
- `lib/db/schema.sql` - 数据库表定义
- `lib/db/seed-fcs.ts` - 数据导入脚本

## 使用示例

### 服务器端（API Routes）
```typescript
import { supabase } from '@/lib/db/supabase';

const { data, error } = await supabase
  .from('users')
  .select('*');
```

### 客户端（React Components）
```typescript
import { supabaseClient } from '@/lib/db/supabase-client';

const { data, error } = await supabaseClient
  .from('public_table')
  .select('*');
```

### Server Components
```typescript
import { createSupabaseServerClient } from '@/lib/db/supabase-server';

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from('users').select('*');
  return <div>{/* ... */}</div>;
}
```
