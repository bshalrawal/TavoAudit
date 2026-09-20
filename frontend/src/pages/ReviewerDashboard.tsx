import React from 'react';
import Layout from '@/components/layout/Layout';
import ReviewStats from '@/components/reviews/ReviewStats';
import WeekSelector from '@/components/reviews/WeekSelector';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewTable from '@/components/reviews/ReviewTable';

export default function ReviewerDashboard() {
  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reviewer Dashboard</h1>
          <WeekSelector />
        </div>
        <ReviewStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ReviewTable />
          </div>
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Review</h2>
            <ReviewForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
