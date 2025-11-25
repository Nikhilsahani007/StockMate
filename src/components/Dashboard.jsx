import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { dbOps } from '../utils/db';

export default function Dashboard({ products, sales, onNavigateToProducts }) {
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreshold();
  }, []);

  const loadThreshold = async () => {
    try {
      const threshold = await dbOps.getSetting('lowStockThreshold');
      if (threshold !== undefined) {
        setLowStockThreshold(threshold);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading threshold:', err);
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(p => p.stock < lowStockThreshold);
  const today = new Date().toISOString().split('T')[0];
  const todaySales = sales.filter(s => s.date === today);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  
  // Monthly revenue
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlySales = sales.filter(s => s.date.startsWith(currentMonth));
  const monthlyRevenue = monthlySales.reduce((sum, s) => sum + s.total, 0);

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500">Full snapshot of inventory, revenue, and alerts</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Products"
          value={products.length}
          color="blue"
          onClick={onNavigateToProducts}
        />
        <StatCard title="Today's Sales" value={todaySales.length} color="green" />
        <StatCard title="Low Stock Items" value={lowStockProducts.length} color="red" />
        <StatCard title="Today's Revenue" value={`₹${todayRevenue.toFixed(2)}`} color="purple" />
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-4 xs:p-5 lg:p-6">
        <h3 className="text-lg font-semibold mb-3">This Month's Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total Sales</div>
            <div className="text-2xl font-bold text-gray-800">{monthlySales.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-2xl font-bold text-green-600">₹{monthlyRevenue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4 xs:p-5">
          <div className="flex flex-wrap gap-2 items-center text-red-800 font-semibold mb-2">
            <AlertCircle size={20} />
            <span>Low Stock Alert</span>
          </div>
          <div className="space-y-2 divide-y divide-red-100">
            {lowStockProducts.map(p => (
              <div key={p.id} className="pt-2 first:pt-0 text-sm text-red-700 flex items-center justify-between gap-3">
                <span className="font-medium">{p.name}</span>
                <span className="text-xs bg-white/60 px-2 py-1 rounded-lg">Only {p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-4 xs:p-5">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
          <p className="text-sm text-gray-500">Latest five transactions</p>
        </div>
        {sales.length === 0 ? (
          <p className="text-gray-500">No sales recorded yet</p>
        ) : (
          <div className="space-y-2">
            {sales.slice(-5).reverse().map(sale => {
              const product = products.find(p => p.id === sale.productId);
              return (
                <div key={sale.id ?? sale.timestamp} className="flex flex-wrap items-center justify-between gap-2 text-sm border-b border-slate-100 pb-2">
                  <span className="font-medium text-gray-800">{product?.name || 'Unknown Product'}</span>
                  <span className="text-gray-600">{sale.quantity} × ₹{sale.price}</span>
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

function StatCard({ title, value, color, onClick }) {
  const colors = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500'
  };

  const clickable = typeof onClick === 'function';

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-4 xs:p-5 flex flex-col gap-2 ${clickable ? 'cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md focus-within:ring-green-300 focus-within:ring-2' : ''}`}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={event => {
        if (!clickable) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className={`w-12 h-12 ${colors[color]} rounded-xl mb-2 flex items-center justify-center text-white font-bold text-xl`}>
        {typeof value === 'number' && !title.includes('Revenue') ? value : '₹'}
      </div>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}