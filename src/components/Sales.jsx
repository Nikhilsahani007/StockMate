import React, { useState } from 'react';
import { dbOps } from '../utils/db';

export default function Sales({ products, loadData }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const product = products.find(p => p.id === parseInt(selectedProduct));
    if (!product) {
      setMessage('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    if (qty > product.stock) {
      setMessage(`Insufficient stock! Only ${product.stock} available`);
      return;
    }

    try {
      const sale = {
        productId: product.id,
        productName: product.name,
        quantity: qty,
        price: product.price,
        total: product.price * qty,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      await dbOps.addSale(sale);
      await dbOps.updateProduct({ ...product, stock: product.stock - qty });
      await loadData();
      
      setSelectedProduct('');
      setQuantity('');
      setMessage('Sale recorded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Record Sale</h2>

      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.includes('success') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Select Product
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Choose...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} - ₹{p.price} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {selectedProduct && quantity && (
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <div className="flex justify-between text-base sm:text-lg font-semibold">
                <span>Total:</span>
                <span className="text-green-600">
                  ₹{(products.find(p => p.id === parseInt(selectedProduct))?.price * parseInt(quantity) || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-base"
          >
            Record Sale
          </button>
        </form>
      </div>
    </div>
  );
}