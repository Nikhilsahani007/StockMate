import React, { useState, useEffect } from 'react';
import { Save, Trash2, RefreshCw, Shield, Bell, Palette, Info } from 'lucide-react';
import { dbOps } from '../utils/db';

export default function Settings({ loadData }) {
  const [settings, setSettings] = useState({
    shopName: 'My Shop',
    currency: '₹',
    lowStockThreshold: 10,
    theme: 'light',
    notifications: true,
    autoBackup: false,
    language: 'en'
  });
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load settings from IndexedDB on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Try to load saved settings from IndexedDB
      const savedSettings = localStorage.getItem('stockmate-settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const handleSave = async () => {
    try {
      // Save settings to localStorage (since we're using IndexedDB for data)
      localStorage.setItem('stockmate-settings', JSON.stringify(settings));
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error saving settings: ' + err.message);
    }
  };

  const handleClearAllData = async () => {
    try {
      await dbOps.clearStore('products');
      await dbOps.clearStore('sales');
      await loadData();
      setShowDeleteConfirm(false);
      setMessage('All data cleared successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Error clearing data: ' + err.message);
    }
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      shopName: 'My Shop',
      currency: '₹',
      lowStockThreshold: 10,
      theme: 'light',
      notifications: true,
      autoBackup: false,
      language: 'en'
    };
    setSettings(defaultSettings);
    localStorage.setItem('stockmate-settings', JSON.stringify(defaultSettings));
    setMessage('Settings reset to defaults!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Settings</h2>

      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.includes('success') || message.includes('saved') || message.includes('cleared') || message.includes('reset')
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Shop Information */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Info className="text-blue-600" size={20} />
          <h3 className="text-base sm:text-lg font-semibold">Shop Information</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Shop Name
            </label>
            <input
              type="text"
              value={settings.shopName}
              onChange={(e) => setSettings({...settings, shopName: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
              placeholder="Enter shop name"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
            >
              <option value="₹">₹ - Indian Rupee</option>
              <option value="$">$ - US Dollar</option>
              <option value="€">€ - Euro</option>
              <option value="£">£ - British Pound</option>
              <option value="¥">¥ - Japanese Yen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Settings */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="text-purple-600" size={20} />
          <h3 className="text-base sm:text-lg font-semibold">Inventory Settings</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Low Stock Alert Threshold
            </label>
            <input
              type="number"
              min="1"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({...settings, lowStockThreshold: parseInt(e.target.value)})}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Alert when stock falls below this number
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="text-orange-600" size={20} />
          <h3 className="text-base sm:text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm sm:text-base">Enable Notifications</div>
              <div className="text-xs sm:text-sm text-gray-600">Get alerts for low stock items</div>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm sm:text-base">Auto Backup Reminder</div>
              <div className="text-xs sm:text-sm text-gray-600">Weekly backup reminders</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => setSettings({...settings, autoBackup: e.target.checked})}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
          </label>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="text-pink-600" size={20} />
          <h3 className="text-base sm:text-lg font-semibold">Appearance</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({...settings, theme: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
            >
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode (Coming Soon)</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Save size={18} />
          <span>Save Settings</span>
        </button>
        <button
          onClick={handleResetSettings}
          className="bg-gray-600 text-white px-4 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-700 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <RefreshCw size={18} />
          <span>Reset to Default</span>
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 sm:py-3 rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <Trash2 size={18} />
          <span>Clear All Data</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Clear All Data?</h3>
              <p className="text-sm sm:text-base text-gray-600">
                This will permanently delete all products and sales records. This action cannot be undone!
              </p>
              <p className="text-xs sm:text-sm text-red-600 font-semibold mt-2">
                ⚠️ Make sure you have a backup before proceeding!
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm sm:text-base font-semibold"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Information */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
          📱 App Information
        </h4>
        <div className="space-y-2 text-xs sm:text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Version:</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="font-semibold">IndexedDB (Local)</span>
          </div>
          <div className="flex justify-between">
            <span>Offline Mode:</span>
            <span className="font-semibold text-green-600">✓ Enabled</span>
          </div>
          <div className="flex justify-between">
            <span>PWA Status:</span>
            <span className="font-semibold text-green-600">✓ Installable</span>
          </div>
        </div>
      </div>
    </div>
  );
}