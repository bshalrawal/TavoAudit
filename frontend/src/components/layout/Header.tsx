import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button className="p-2 mr-4 text-gray-500 hover:text-gray-700">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Tavo Review Tracker</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
