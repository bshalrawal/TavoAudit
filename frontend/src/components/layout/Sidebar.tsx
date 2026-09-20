import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r hidden md:flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg text-blue-600">Tavo Audit</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100">
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link to="/admin" className="flex items-center space-x-3 text-gray-700 p-2 rounded hover:bg-gray-100">
          <Settings className="w-5 h-5" />
          <span>Admin</span>
        </Link>
      </nav>
    </aside>
  );
}
