import React from 'react';
import Layout from '@/components/layout/Layout';
import OverviewPanel from '@/components/admin/OverviewPanel';
import AllReviewsTable from '@/components/admin/AllReviewsTable';
import UserManagement from '@/components/admin/UserManagement';
import ExportPanel from '@/components/admin/ExportPanel';

export default function AdminDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <OverviewPanel />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <AllReviewsTable />
            <ExportPanel />
          </div>
          <div>
            <UserManagement />
          </div>
        </div>
      </div>
    </Layout>
  );
}
