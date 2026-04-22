'use client';

import { useState } from 'react';

export default function PcsPatternsCreatePage() {
  const [formData, setFormData] = useState({
    pattern_name: '',
    pattern_type: 'BASIC',
    size_range: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('版单创建功能（演示）');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">新建版单</h1>
        <button 
          onClick={() => history.back()}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          返回
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">版单名称</label>
            <input
              type="text"
              value={formData.pattern_name}
              onChange={(e) => setFormData({ ...formData, pattern_name: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入版单名称"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">版单类型</label>
            <select
              value={formData.pattern_type}
              onChange={(e) => setFormData({ ...formData, pattern_type: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="BASIC">基础版</option>
              <option value="ADVANCED">进阶版</option>
              <option value="CUSTOM">自定义</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">尺码范围</label>
            <input
              type="text"
              value={formData.size_range}
              onChange={(e) => setFormData({ ...formData, size_range: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="如：S-3XL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">版单描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入版单描述"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            创建
          </button>
        </div>
      </form>
    </div>
  );
}
