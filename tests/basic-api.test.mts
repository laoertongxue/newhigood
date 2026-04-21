import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());

test('core API route files should exist', () => {
  const requiredFiles = [
    'app/api/auth/signin/route.ts',
    'app/api/auth/signup/route.ts',
    'app/api/auth/user/route.ts',
    'app/api/fcs/orders/route.ts',
    'app/api/fcs/plans/route.ts',
    'app/api/fcs/lines/route.ts',
    'app/api/pcs/goods/route.ts',
    'app/api/pcs/categories/route.ts',
    'app/api/pcs/coordination/route.ts',
    'app/api/pcs/allocation/route.ts',
    'app/api/pda/data/route.ts',
    'app/api/pda/analysis/route.ts',
    'app/api/pda/kpi/route.ts',
    'app/api/pda/export/route.ts',
  ];

  for (const file of requiredFiles) {
    const absolutePath = path.join(projectRoot, file);
    assert.equal(fs.existsSync(absolutePath), true, `missing required file: ${file}`);
  }
});

test('schema should contain required subsystem tables', () => {
  const schemaPath = path.join(projectRoot, 'lib/db/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');

  const requiredTables = [
    'CREATE TABLE IF NOT EXISTS users',
    'CREATE TABLE IF NOT EXISTS production_orders',
    'CREATE TABLE IF NOT EXISTS pcs_goods',
    'CREATE TABLE IF NOT EXISTS pda_production_data',
  ];

  for (const marker of requiredTables) {
    assert.equal(schema.includes(marker), true, `schema marker not found: ${marker}`);
  }
});

test('navigation should include PCS and PDA routes', () => {
  const navPath = path.join(projectRoot, 'lib/config/navigation.ts');
  const nav = fs.readFileSync(navPath, 'utf-8');

  assert.equal(nav.includes("href: '/dashboard/pcs/goods'"), true);
  assert.equal(nav.includes("href: '/dashboard/pda/collect'"), true);
});

test('dashboard pages should exist for all subsystems', () => {
  const requiredPages = [
    'app/dashboard/fcs/page.tsx',
    'app/dashboard/fcs/plans/page.tsx',
    'app/dashboard/fcs/lines/page.tsx',
    'app/dashboard/fcs/progress/page.tsx',
    'app/dashboard/fcs/inventory/page.tsx',
    'app/dashboard/pcs/page.tsx',
    'app/dashboard/pcs/goods/page.tsx',
    'app/dashboard/pcs/categories/page.tsx',
    'app/dashboard/pcs/coordination/page.tsx',
    'app/dashboard/pcs/allocation/page.tsx',
    'app/dashboard/pda/page.tsx',
    'app/dashboard/pda/collect/page.tsx',
    'app/dashboard/pda/analysis/page.tsx',
    'app/dashboard/pda/export/page.tsx',
  ];

  for (const file of requiredPages) {
    assert.equal(fs.existsSync(path.join(projectRoot, file)), true, `missing page: ${file}`);
  }
});

