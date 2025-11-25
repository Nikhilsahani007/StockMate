import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle } from 'lucide-react';
import { dbOps } from '../utils/db';

export default function Settings({ loadData }) {
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const threshold = await dbOps.getSetting('lowStockThreshold');
      if (threshold !== undefined) {
        setLowStockThreshold(threshold);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading settings:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const threshold = parseInt(lowStockThreshold);
      if (isNaN(threshold) || threshold < 0) {
        setMessage('Please enter a valid number (0 or greater)');
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      await dbOps.setSetting('lowStockThreshold', threshold);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
      if (loadData) {
        await loadData();
      }
    } catch (err) {
      setMessage('Error saving settings: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 p-3 rounded-lg">
          <SettingsIcon className="text-blue-600" size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('success') 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Low Stock Threshold */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-start space-x-4">
          <div className="bg-orange-100 p-3 rounded-lg">
            <AlertCircle className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Low Stock Threshold</h3>
            <p className="text-sm text-gray-600 mb-4">
              Set the minimum stock level at which products will be marked as low stock. 
              Products with stock below this threshold will appear in alerts.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Threshold Value
                </label>
                <input
                  type="number"
                  min="0"
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="pt-8">
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
                >
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Current setting:</strong> Products with stock less than <strong>{lowStockThreshold}</strong> will be marked as low stock.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* App Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">About StockMate</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Version:</strong> 1.0.0</p>
          <p><strong>Description:</strong> Offline-first inventory and sales management for retail shops</p>
          <p><strong>Storage:</strong> All data is stored locally using IndexedDB</p>
          <p><strong>Offline Support:</strong> Full offline functionality after first load</p>
        </div>
      </div>

      {/* Data Management Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">📌 Data Management</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• All your data is stored locally on your device</li>
          <li>• Use the Backup & Restore feature to export your data</li>
          <li>• Clearing browser data will delete all stored information</li>
          <li>• Regular backups are recommended</li>
        </ul>
      </div>
    </div>
  );
}

