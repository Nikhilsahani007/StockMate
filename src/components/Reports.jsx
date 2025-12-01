import React, { useState } from 'react';

export default function Reports({ sales, products }) {
  const [filterDate, setFilterDate] = useState('');
  
  const filteredSales = filterDate 
    ? sales.filter(s => s.date === filterDate) 
    : sales;

  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalItems = filteredSales.reduce((sum, s) => sum + s.quantity, 0);

  const productSales = {};
  filteredSales.forEach(sale => {
    if (!productSales[sale.productId]) {
      productSales[sale.productId] = { 
        name: sale.productName, 
        quantity: 0, 
        revenue: 0 
      };
    }
    productSales[sale.productId].quantity += sale.quantity;
    productSales[sale.productId].revenue += sale.total;
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Reports</h2>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-gray-600 text-xs sm:text-sm">Total Sales</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800">{filteredSales.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-gray-600 text-xs sm:text-sm">Items Sold</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-800">{totalItems}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="text-gray-600 text-xs sm:text-sm">Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">₹{totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Top Products</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500">No sales data</p>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex justify-between items-center border-b pb-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm sm:text-base truncate">{product.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{product.quantity} units</div>
                </div>
                <div className="text-green-600 font-semibold text-sm sm:text-base ml-2">
                  ₹{product.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Transactions</h3>
{filteredSales.length === 0 ? (
<p className="text-sm text-gray-500">No transactions</p>
) : (
<div className="overflow-x-auto -mx-4 sm:mx-0">
<table className="w-full text-xs sm:text-sm">
<thead className="bg-gray-50">
<tr>
<th className="px-2 sm:px-4 py-2 text-left font-semibold">Date</th>
<th className="px-2 sm:px-4 py-2 text-left font-semibold">Product</th>
<th className="px-2 sm:px-4 py-2 text-left font-semibold">Qty</th>
<th className="px-2 sm:px-4 py-2 text-left font-semibold">Total</th>
</tr>
</thead>
<tbody className="divide-y">
{filteredSales.slice(-10).reverse().map((sale, idx) => (
<tr key={idx}>
<td className="px-2 sm:px-4 py-2 whitespace-nowrap">{sale.date}</td>
<td className="px-2 sm:px-4 py-2 truncate max-w-[120px] sm:max-w-none">
{sale.productName}
</td>
<td className="px-2 sm:px-4 py-2">{sale.quantity}</td>
<td className="px-2 sm:px-4 py-2 font-semibold text-green-600 whitespace-nowrap">
₹{sale.total.toFixed(2)}
</td>
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