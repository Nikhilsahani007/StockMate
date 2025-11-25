import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { exportData, importData } from '../utils/backup';

export default function BackupRestore({ loadData }) {
  const [message, setMessage] = useState('');
  const [importing, setImporting] = useState(false);

  const handleExport = async () => {
    const result = await exportData();
    setMessage(result.message);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will replace all existing data. Continue?')) {
      e.target.value = '';
      return;
    }

    setImporting(true);
    const result = await importData(file);
    setMessage(result.message);
    
    if (result.success) {
      await loadData();
    }
    
    setImporting(false);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Backup & Restore</h2>

      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Export Data</h3>
              <p className="text-sm text-gray-600">Download backup as JSON</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Download Backup
          </button>
          <p className="text-xs text-gray-500 mt-3">
            Save this file in a safe location. You can use it to restore your data on any device.
          </p>
        </div>

        {/* Import Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Import Data</h3>
              <p className="text-sm text-gray-600">Restore from backup file</p>
            </div>
          </div>
          <label className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer flex items-center justify-center">
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
            ⚠️ Warning: This will replace all current data with the backup data.
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📌 Backup Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Export your data regularly to prevent loss</li>
          <li>• Store backup files in cloud storage (Google Drive, Dropbox)</li>
          <li>• Use backups to transfer data between devices</li>
          <li>• Backup before clearing browser data or uninstalling</li>
        </ul>
      </div>
    </div>
  );
}