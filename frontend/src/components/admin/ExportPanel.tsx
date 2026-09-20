import React from 'react';
import { Download } from 'lucide-react';

export default function ExportPanel() {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Export Data</h2>
      <p className="text-gray-600 mb-4">Download system reports as CSV or PDF.</p>
      <div className="space-x-3">
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
        <button className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <Download className="w-4 h-4" />
          <span>Export PDF</span>
        </button>
      </div>
    </div>
  );
}
