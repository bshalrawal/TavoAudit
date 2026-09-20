import React from 'react';
import { useReviews } from '@/hooks/useReviews';

export default function ReviewTable() {
  const { reviewsQuery } = useReviews();

  if (reviewsQuery.isLoading) return <div>Loading...</div>;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reviewsQuery.data?.map((review: any) => (
            <tr key={review.id}>
              <td className="px-6 py-4 whitespace-nowrap">{review.title}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(review.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {review.status || 'Active'}
                </span>
              </td>
            </tr>
          ))}
          {(!reviewsQuery.data || reviewsQuery.data.length === 0) && (
            <tr>
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No reviews found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
