import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { dbOps } from '../utils/db';

export default function BackupRestore({ loadData }) {
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    try {
      const products = await dbOps.getAllProducts();
      const sales = await dbOps.getAllSales();
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        appName: 'StockMate',
        products,
        sales
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stockmate-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setMessage('Backup downloaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Export failed: ' + err.message);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will replace all existing data. Continue?')) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.products || !data.sales) {
        throw new Error('Invalid backup file format');
      }

      await dbOps.clearStore('products');
      await dbOps.clearStore('sales');

      for (const product of data.products) {
        await dbOps.addProduct(product);
      }
      
      for (const sale of data.sales) {
        await dbOps.addSale(sale);
      }

      await loadData();
      setMessage('Data imported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Import failed: ' + err.message);
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Backup & Restore</h2>

      {message && (
        <div className={`p-3 sm:p-4 rounded-lg text-sm sm:text-base ${
          message.includes('success') || message.includes('downloaded') || message.includes('imported')
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-2 sm:p-3 rounded-lg">
              <Download className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">Export Data</h3>
              <p className="text-xs sm:text-sm text-gray-600">Download backup as JSON</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Download Backup
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Save this file in a safe location like Google Drive or Dropbox
          </p>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-lg">
              <Upload className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg">Import Data</h3>
              <p className="text-xs sm:text-sm text-gray-600">Restore from backup file</p>
            </div>
          </div>
          <label className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center text-sm sm:text-base">
            {importing ? 'Importing...' : 'Choose Backup File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-3">
            ⚠️ Warning: This will replace all current data with backup data
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
          📌 Backup Tips
        </h4>
        <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
          <li>• Export your data regularly to prevent accidental loss</li>
          <li>• Store backup files in cloud storage (Google Drive, Dropbox)</li>
          <li>• Use backups to transfer data between devices</li>
          <li>• Always backup before clearing browser data or uninstalling</li>
          <li>• Keep multiple backup versions for safety</li>
        </ul>
      </div>

      {/* Additional Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">
          ℹ️ Important Information
        </h4>
        <ul className="text-xs sm:text-sm text-yellow-800 space-y-1">
          <li>• Data is stored locally on your device only</li>
          <li>• Clearing browser cache will NOT delete your data</li>
          <li>• Uninstalling the app WILL delete all data</li>
          <li>• Use export/import to switch between devices</li>
        </ul>
      </div>
    </div>
  );
}