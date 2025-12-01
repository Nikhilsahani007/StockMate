import React, { useState } from 'react';
import { dbOps } from '../utils/db';

export default function Sales({ products, loadData }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [message, setMessage] = useState('');

  const filteredProducts = searchQuery
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      setMessage('Please select a product');
      return;
    }

    const qty = parseInt(quantity);
    if (qty > selectedProduct.stock) {
      setMessage(`Insufficient stock! Only ${selectedProduct.stock} available`);
      return;
    }

    const finalPrice = customPrice
      ? parseFloat(customPrice)
      : selectedProduct.price;

    try {
      const sale = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: qty,
        price: finalPrice,
        total: finalPrice * qty,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
      };

      await dbOps.addSale(sale);
      await dbOps.updateProduct({
        ...selectedProduct,
        stock: selectedProduct.stock - qty
      });

      await loadData();

      setSearchQuery('');
      setSelectedProduct(null);
      setQuantity('');
      setCustomPrice('');
      setMessage('Sale recorded successfully!');

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Record Sale</h2>

      {message && (
        <div
          className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-5">
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Product Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Product
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProduct(null);
              }}
              placeholder="Type to search..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Search Results */}
          {searchQuery && !selectedProduct && (
            <div className="border rounded-lg max-h-48 overflow-y-auto bg-white shadow">
              {filteredProducts.length === 0 ? (
                <div className="p-3 text-gray-500 text-sm">
                  No matching products
                </div>
              ) : (
                filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      setSearchQuery('');
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">
                      Price: ₹{p.price} • Stock: {p.stock}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Selected Product Card */}
          {selectedProduct && (
            <div className="p-4 rounded-lg border bg-gray-50 space-y-1">
              <div className="text-lg font-semibold">{selectedProduct.name}</div>
              <div className="text-sm text-gray-700">
                Default Price: ₹{selectedProduct.price}
              </div>
              <div className="text-sm text-gray-700">
                Available Stock: {selectedProduct.stock}
              </div>
            </div>
          )}

          {/* Custom Price Input */}
          {selectedProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price
              </label>
              <input
                type="number"
                min="1"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
                placeholder="Enter custom price..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {/* Quantity */}
          {selectedProduct && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          )}

          {/* Total */}
          {selectedProduct && quantity && (
            <div className="bg-gray-50 p-4 rounded-lg font-semibold text-lg flex justify-between">
              <span>Total:</span>
              <span className="text-green-600">
                ₹{
                  (
                    (customPrice
                      ? parseFloat(customPrice)
                      : selectedProduct.price) * quantity
                  ).toFixed(2)
                }
              </span>
            </div>
          )}

          {/* Submit */}
          {selectedProduct && (
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Record Sale
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
