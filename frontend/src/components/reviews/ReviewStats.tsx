import React from 'react';
import { useReviews } from '@/hooks/useReviews';
import { BarChart, Activity, CheckCircle } from 'lucide-react';

export default function ReviewStats() {
  const { reviewsQuery } = useReviews();
  const count = reviewsQuery.data?.length || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><BarChart className="w-6 h-6" /></div>
        <div>
          <p className="text-gray-500 text-sm">Total Reviews</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-green-100 text-green-600 rounded-full"><CheckCircle className="w-6 h-6" /></div>
        <div>
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Activity className="w-6 h-6" /></div>
        <div>
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
}
