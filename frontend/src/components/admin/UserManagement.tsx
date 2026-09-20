import React from 'react';
import { useUsers } from '@/hooks/useUsers';

export default function UserManagement() {
  const { data: users, isLoading } = useUsers();

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-4">User Management</h2>
      <ul className="divide-y divide-gray-200 border rounded">
        {users?.map((user: any) => (
          <li key={user.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <span className="px-2 py-1 bg-gray-100 text-xs rounded">{user.role}</span>
          </li>
        ))}
        {(!users || users.length === 0) && (
          <li className="p-4 text-center text-gray-500">No users found</li>
        )}
      </ul>
    </div>
  );
}
