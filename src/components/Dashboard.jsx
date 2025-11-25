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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">This Month's Summary</h3>
        <div className="grid grid-cols-2 gap-4">
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-800 font-semibold mb-2">
            <AlertCircle size={20} />
            <span>Low Stock Alert</span>
          </div>
          <div className="space-y-1">
            {lowStockProducts.map(p => (
              <div key={p.id} className="text-sm text-red-700">
                {p.name} - Only {p.stock} units left
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">Recent Sales</h3>
        {sales.length === 0 ? (
          <p className="text-gray-500">No sales recorded yet</p>
        ) : (
          <div className="space-y-2">
            {sales.slice(-5).reverse().map(sale => {
              const product = products.find(p => p.id === sale.productId);
              return (
                <div key={sale.id} className="flex justify-between text-sm border-b pb-2">
                  <span>{product?.name || 'Unknown Product'}</span>
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
      className={`bg-white rounded-lg shadow p-4 ${clickable ? 'cursor-pointer ring-1 ring-transparent hover:ring-green-200 transition' : ''}`}
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
      <div className={`w-12 h-12 ${colors[color]} rounded-lg mb-3 flex items-center justify-center text-white font-bold text-xl`}>
        {typeof value === 'number' && !title.includes('Revenue') ? value : '₹'}
      </div>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
    </div>
  );
}