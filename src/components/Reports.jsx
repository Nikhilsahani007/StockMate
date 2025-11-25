import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

export default function Reports({ sales, products }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'daily', 'monthly'
  const [filterDate, setFilterDate] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);
  
  // Filter sales based on selected filter
  const filteredSales = useMemo(() => {
    if (filterType === 'daily' && filterDate) {
      return sales.filter(s => s.date === filterDate);
    } else if (filterType === 'monthly') {
      const monthToFilter = filterMonth || currentMonth;
      return sales.filter(s => s.date.startsWith(monthToFilter));
    }
    return sales;
  }, [sales, filterType, filterDate, filterMonth, currentMonth]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
    const totalItems = filteredSales.reduce((sum, s) => sum + s.quantity, 0);
    const avgOrderValue = filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0;

    return { totalRevenue, totalItems, avgOrderValue };
  }, [filteredSales]);

  // Group by product
  const productSales = useMemo(() => {
    const grouped = {};
    filteredSales.forEach(sale => {
      if (!grouped[sale.productId]) {
        grouped[sale.productId] = {
          name: sale.productName,
          quantity: 0,
          revenue: 0
        };
      }
      grouped[sale.productId].quantity += sale.quantity;
      grouped[sale.productId].revenue += sale.total;
    });
    return grouped;
  }, [filteredSales]);

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Monthly revenue data for chart
  const monthlyData = useMemo(() => {
    const monthly = {};
    sales.forEach(sale => {
      const month = sale.date.slice(0, 7); // YYYY-MM
      if (!monthly[month]) {
        monthly[month] = { revenue: 0, count: 0 };
      }
      monthly[month].revenue += sale.total;
      monthly[month].count += 1;
    });
    return Object.entries(monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6); // Last 6 months
  }, [sales]);

  // Daily revenue for current month
  const dailyData = useMemo(() => {
    const daily = {};
    const monthToFilter = filterMonth || currentMonth;
    sales
      .filter(s => s.date.startsWith(monthToFilter))
      .forEach(sale => {
        if (!daily[sale.date]) {
          daily[sale.date] = { revenue: 0, count: 0 };
        }
        daily[sale.date].revenue += sale.total;
        daily[sale.date].count += 1;
      });
    return Object.entries(daily).sort((a, b) => a[0].localeCompare(b[0]));
  }, [sales, filterMonth, currentMonth]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setFilterType('all');
              setFilterDate('');
              setFilterMonth('');
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setFilterType('daily')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'daily'
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setFilterType('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filterType === 'monthly'
                ? 'bg-white text-green-600 shadow'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Filter Inputs */}
      {filterType === 'daily' && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      {filterType === 'monthly' && (
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <input
            type="month"
            value={filterMonth || currentMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">Total Sales</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{filteredSales.length}</div>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">Items Sold</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{stats.totalItems}</div>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600 mt-1">₹{stats.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-600 text-sm">Avg Order Value</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">₹{stats.avgOrderValue.toFixed(2)}</div>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      {filterType === 'all' && monthlyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Revenue (Last 6 Months)</h3>
          <div className="space-y-3">
            {monthlyData.map(([month, data]) => {
              const maxRevenue = Math.max(...monthlyData.map(([, d]) => d.revenue));
              const percentage = (data.revenue / maxRevenue) * 100;
              return (
                <div key={month} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <span className="text-green-600 font-semibold">₹{data.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{data.count} transactions</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Revenue for Selected Month */}
      {filterType === 'monthly' && dailyData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Daily Revenue - {new Date((filterMonth || currentMonth) + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="space-y-3">
            {dailyData.map(([date, data]) => {
              const maxRevenue = Math.max(...dailyData.map(([, d]) => d.revenue));
              const percentage = maxRevenue > 0 ? (data.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={date} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-green-600 font-semibold">₹{data.revenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        {topProducts.length === 0 ? (
          <p className="text-gray-500">No sales data available</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">{product.quantity} units sold</div>
                  </div>
                </div>
                <div className="text-green-600 font-semibold text-lg">₹{product.revenue.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        {filteredSales.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSales.slice(-20).reverse().map((sale) => (
                  <tr key={sale.id || sale.timestamp} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{new Date(sale.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-medium">{sale.productName}</td>
                    <td className="px-4 py-3">{sale.quantity}</td>
                    <td className="px-4 py-3">₹{sale.price.toFixed(2)}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{sale.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
