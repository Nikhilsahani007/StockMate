import React, { useState } from 'react';
import { Plus, Search, X, Edit2, Trash2 } from 'lucide-react';
import { dbOps } from '../utils/db';

export default function Products({ products, loadData }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '', 
    price: '', 
    stock: '' 
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (editingProduct) {
        await dbOps.updateProduct({ ...productData, id: editingProduct.id });
      } else {
        await dbOps.addProduct(productData);
      }

      await loadData();
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: '', stock: '' });
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await dbOps.deleteProduct(id);
        await loadData();
      } catch (err) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 text-sm sm:text-base"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-2.5 sm:top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
                setFormData({ name: '', category: '', price: '', stock: '' });
              }}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <input 
                type="text" 
                placeholder="Product Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" 
                required 
              />
              <input 
                type="text" 
                placeholder="Category" 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" 
                required 
              />
              <input 
                type="number" 
                step="0.01" 
                placeholder="Price" 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" 
                required 
              />
              <input 
                type="number" 
                placeholder="Stock" 
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base" 
                required 
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 text-sm sm:text-base font-semibold"
              >
                {editingProduct ? 'Update' : 'Add'} Product
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">Category</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Stock</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className={product.stock < 10 ? 'bg-red-50' : ''}>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="font-medium text-xs sm:text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{product.category}</div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                      {product.category}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      ₹{product.price.toFixed(2)}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className={`font-semibold text-xs sm:text-sm ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(product)} 
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)} 
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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