import { NextRequest, NextResponse } from 'next/server';
import type { ListResponse, ProductionOrder } from '@/lib/types';
import { buildPagination, jsonError, parsePagination, requireAuth } from '@/lib/api/route-utils';

/**
 * GET /api/fcs/orders
 * 获取生产订单列表
 * 支持分页、过滤、搜索、排序
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const { page, limit, offset, searchParams } = parsePagination(request);

    // 过滤参数
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // 排序参数
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    // 构建查询
    let query = auth.supabase
      .from('production_orders')
      .select('*', { count: 'exact' });

    // 应用过滤条件
    if (status && status.trim()) {
      query = query.eq('status', status);
    }

    if (priority && priority.trim()) {
      query = query.eq('priority', priority);
    }

    // 应用搜索条件（order_no, customer_name, product_name）
    if (search && search.trim()) {
      const searchTerm = `%${search.trim()}%`;
      query = query.or(
        `order_no.ilike.${searchTerm},customer_name.ilike.${searchTerm},product_name.ilike.${searchTerm}`
      );
    }

    // 应用排序
    const allowedSortFields = [
      'order_no',
      'customer_name',
      'product_name',
      'quantity',
      'status',
      'priority',
      'start_date',
      'end_date',
      'created_at',
      'updated_at',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    query = query.order(sortField, { ascending: order === 'asc' });

    // 应用分页
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to fetch orders',
        },
        { status: 400 }
      );
    }

    // 构造分页响应
    const response: ListResponse<ProductionOrder> = {
      items: (data || []) as ProductionOrder[],
      pagination: {
        ...buildPagination(page, limit, count || 0),
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}

/**
 * POST /api/fcs/orders
 * 创建新的生产订单
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth('fcs');
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();

    // 验证必填字段
    const requiredFields = ['order_no', 'customer_name', 'product_name', 'quantity', 'start_date', 'end_date'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return jsonError(`Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    // 验证数据类型和范围
    if (typeof body.quantity !== 'number' || body.quantity < 0) {
      return jsonError('Quantity must be a non-negative number', 400);
    }

    // 验证日期
    const startDate = new Date(body.start_date);
    const endDate = new Date(body.end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return jsonError('Invalid date format', 400);
    }

    if (startDate > endDate) {
      return jsonError('Start date must be before end date', 400);
    }

    // 验证 status 和 priority（如果提供）
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    const validPriorities = ['low', 'normal', 'high', 'urgent'];

    if (body.status && !validStatuses.includes(body.status)) {
      return jsonError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    if (body.priority && !validPriorities.includes(body.priority)) {
      return jsonError(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`, 400);
    }

    // 准备插入数据
    const orderData = {
      order_no: body.order_no.trim(),
      customer_name: body.customer_name.trim(),
      product_name: body.product_name.trim(),
      quantity: body.quantity,
      start_date: body.start_date,
      end_date: body.end_date,
      status: body.status || 'pending',
      priority: body.priority || 'normal',
      created_by: auth.userId,
    };

    // 插入数据
    const { data, error } = await auth.supabase
      .from('production_orders')
      .insert([orderData])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return jsonError(error.message || 'Failed to create order', 400);
    }

    const createdOrder = data?.[0] as ProductionOrder;

    return NextResponse.json(
      {
        success: true,
        data: createdOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API error:', error);
    return jsonError(error instanceof Error ? error.message : 'Internal server error', 500);
  }
}
