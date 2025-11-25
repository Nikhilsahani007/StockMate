import { dbOps } from './db';

// Export all data as JSON
export async function exportData() {
  try {
    const products = await dbOps.getAllProducts();
    const sales = await dbOps.getAllSales();
    
    // Export settings
    const settings = {};
    try {
      const lowStockThreshold = await dbOps.getSetting('lowStockThreshold');
      if (lowStockThreshold !== undefined) {
        settings.lowStockThreshold = lowStockThreshold;
      }
    } catch (err) {
      console.warn('Could not export settings:', err);
    }
    
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      appName: 'StockMate',
      products,
      sales,
      settings
    };

    // Create downloadable JSON file
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
    
    return { success: true, message: 'Backup downloaded successfully!' };
  } catch (error) {
    return { success: false, message: 'Export failed: ' + error.message };
  }
}

// Import data from JSON file
export async function importData(file) {
  try {
    const text = await file.text();
    const data = JSON.parse(text);

    // Validate backup structure
    if (!data.products || !data.sales) {
      throw new Error('Invalid backup file format');
    }

    // Clear existing data
    await dbOps.clearStore('products');
    await dbOps.clearStore('sales');

    // Import products
    for (const product of data.products) {
      try {
        await dbOps.addProduct(product);
      } catch (err) {
        console.warn('Error importing product:', product, err);
      }
    }

    // Import sales
    for (const sale of data.sales) {
      try {
        await dbOps.addSale(sale);
      } catch (err) {
        console.warn('Error importing sale:', sale, err);
      }
    }

    // Import settings if available
    if (data.settings) {
      try {
        if (data.settings.lowStockThreshold !== undefined) {
          await dbOps.setSetting('lowStockThreshold', data.settings.lowStockThreshold);
        }
      } catch (err) {
        console.warn('Error importing settings:', err);
      }
    }

    return { success: true, message: 'Data imported successfully!' };
  } catch (error) {
    return { success: false, message: 'Import failed: ' + error.message };
  }
}