import React from 'react';

export default function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
        active 
          ? 'border-green-600 text-green-600 font-semibold' 
          : 'border-transparent text-gray-600 hover:text-green-600 hover:border-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}