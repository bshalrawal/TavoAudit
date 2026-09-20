import React from 'react';
import { useReviews } from '@/hooks/useReviews';

export default function AllReviewsTable() {
  const { reviewsQuery } = useReviews();

  if (reviewsQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold">All System Reviews</h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reviewsQuery.data?.map((review: any) => (
            <tr key={review.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{review.title}</td>
            </tr>
          ))}
          {(!reviewsQuery.data || reviewsQuery.data.length === 0) && (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
