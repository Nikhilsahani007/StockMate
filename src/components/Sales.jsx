import React, { useState, useEffect, useMemo } from 'react';
import { dbOps } from '../utils/db';

export default function Sales({ products, sales = [], loadData }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');
  const [customPrice, setCustomPrice] = useState('');

  const selectedProductData = useMemo(
    () => products.find(p => p.id === parseInt(selectedProduct)),
    [products, selectedProduct]
  );

  useEffect(() => {
    if (selectedProductData) {
      setCustomPrice(selectedProductData.price.toString());
    } else {
      setCustomPrice('');
    }
  }, [selectedProductData]);

  const today = new Date().toISOString().split('T')[0];
  const todaysSales = useMemo(
    () =>
      (sales || [])
        .filter(sale => sale.date === today)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
    [sales, today]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const product = selectedProductData;
    if (!product) {
      setMessage('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      setMessage('Please enter a valid quantity (greater than 0)');
      return;
    }
    if (qty > product.stock) {
      setMessage(`Insufficient stock! Only ${product.stock} units available`);
      return;
    }

    const sellingPrice = parseFloat(customPrice);
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      setMessage('Please enter a valid selling price');
      return;
    }

    try {
      const sale = {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: sellingPrice,
        total: sellingPrice * qty,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      await dbOps.addSale(sale);
      
      const updatedProduct = {
        ...product,
        stock: product.stock - qty
      };
      await dbOps.updateProduct(updatedProduct);
      
      await loadData();
      setSelectedProduct('');
      setQuantity('');
      setCustomPrice('');
      setMessage('Sale recorded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error recording sale: ' + err.message);
    }
  };

  const computedTotal = (() => {
    if (!selectedProductData || !quantity) return 0;
    const price = parseFloat(customPrice);
    if (isNaN(price)) return 0;
    return price * parseInt(quantity);
  })();

  return (
    <div className="space-y-6 lg:space-y-8 max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Record Sale</h2>
          <p className="text-sm text-gray-500">Capture transactions with flexible pricing and instant stock updates</p>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-4 xs:p-5 lg:p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-200"
              required
            >
              <option value="">Choose a product...</option>
              {products
                .filter(p => p.stock > 0)
                .map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.price.toFixed(2)} (Stock: {p.stock})
                  </option>
                ))}
            </select>
            {products.filter(p => p.stock > 0).length === 0 && (
              <p className="text-sm text-red-600 mt-2">No products with available stock. Please add products first.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max={selectedProduct ? products.find(p => p.id === parseInt(selectedProduct))?.stock : undefined}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-200"
              required
              placeholder="Enter quantity"
            />
            {selectedProduct && (
              <p className="text-xs text-gray-500 mt-1">
                Available stock: {products.find(p => p.id === parseInt(selectedProduct))?.stock || 0} units
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price (per unit)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-200 disabled:bg-gray-100"
              placeholder="Enter selling price"
              required
              disabled={!selectedProductData}
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedProductData
                ? 'Adjust if you offered a discount or custom rate for this sale.'
                : 'Select a product to set the selling price.'}
            </p>
          </div>

          {selectedProduct && quantity && customPrice && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">
                  ₹{computedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Record Sale
            </button>
          </div>
        </form>
      </div>

      {/* Today's Sales Summary */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-4 xs:p-5 lg:p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-semibold">Today's Sold Products</h3>
            <p className="text-sm text-gray-500">
              Showing sales for {new Date(today).toLocaleDateString()} (resets daily)
            </p>
          </div>
        </div>
        {todaysSales.length === 0 ? (
          <p className="text-gray-500 mt-4">No sales recorded today yet.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Qty</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Selling Price</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {todaysSales.map(sale => (
                  <tr key={sale.id ?? sale.timestamp}>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 py-2 font-medium">{sale.productName}</td>
                    <td className="px-4 py-2">{sale.quantity}</td>
                    <td className="px-4 py-2">₹{sale.price.toFixed(2)}</td>
                    <td className="px-4 py-2 font-semibold text-green-600">₹{sale.total.toFixed(2)}</td>
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