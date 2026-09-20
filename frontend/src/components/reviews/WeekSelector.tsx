import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function WeekSelector() {
  return (
    <div className="flex items-center space-x-4 bg-white p-2 rounded shadow inline-flex">
      <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
      <span className="font-medium text-gray-700">Current Week</span>
      <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
    </div>
  );
}
