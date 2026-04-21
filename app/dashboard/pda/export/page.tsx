'use client';

import { useState } from 'react';

export default function PdaExportPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const handleExport = () => {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    const url = `/api/pda/export${params.toString() ? `?${params.toString()}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-full">
      <h1 className="text-2xl font-bold text-gray-900">导出报告</h1>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 max-w-xl">
        <div>
          <label className="block text-sm text-gray-700 mb-1">开始日期</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">结束日期</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          导出 CSV
        </button>
      </div>
    </div>
  );
}
