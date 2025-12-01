import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Dashboard({ products, sales }) {
  const lowStockProducts = products.filter(p => p.stock < 10);
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <StatCard title="Products" value={products.length} color="blue" />
        <StatCard title="Low Stock" value={lowStockProducts.length} color="red" />
        <StatCard title="Today Sales" value={todaySales.length} color="green" />
        <StatCard title="Revenue" value={`₹${todayRevenue.toFixed(0)}`} color="purple" />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center space-x-2 text-red-800 font-semibold mb-2">
            <AlertCircle size={18} />
            <span className="text-sm sm:text-base">Low Stock Alert</span>
          </div>
          <div className="space-y-1">
            {lowStockProducts.slice(0, 5).map(p => (
              <div key={p.id} className="text-xs sm:text-sm text-red-700">
                {p.name} - Only {p.stock} left
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-3">Recent Sales</h3>
        {sales.length === 0 ? (
          <p className="text-sm text-gray-500">No sales recorded yet</p>
        ) : (
          <div className="space-y-2">
            {sales.slice(-5).reverse().map(sale => {
              const product = products.find(p => p.id === sale.productId);
              return (
                <div key={sale.id} className="flex justify-between items-center text-xs sm:text-sm border-b pb-2">
                  <span className="truncate flex-1">{product?.name || 'Unknown'}</span>
                  <span className="text-gray-600 mx-2">{sale.quantity}x</span>
                  <span className="font-semibold text-green-600">₹{sale.total}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = { 
    blue: 'bg-blue-500', 
    red: 'bg-red-500', 
    green: 'bg-green-500', 
    purple: 'bg-purple-500' 
  };

  return (
    <div className="bg-white rounded-lg shadow p-3 sm:p-4">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors[color]} rounded-lg mb-2 flex items-center justify-center text-white font-bold text-sm sm:text-lg`}>
        {typeof value === 'number' && !title.includes('Revenue') ? value : '₹'}
      </div>
      <div className="text-gray-600 text-xs sm:text-sm">{title}</div>
      <div className="text-lg sm:text-2xl font-bold text-gray-800 truncate">{value}</div>
    </div>
  );
}