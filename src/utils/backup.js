import { dbOps } from './db';

// Export all data as JSON
export async function exportData() {
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

    return { success: true, message: 'Data imported successfully!' };
  } catch (error) {
    return { success: false, message: 'Import failed: ' + error.message };
  }
}