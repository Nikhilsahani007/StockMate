// IndexedDB Setup using native API
const DB_NAME = 'StockMateDB';
const DB_VERSION = 1;

let db;

// Initialize database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = () => {
      db = request.result;
      
      // Initialize default settings if not present
      initDefaultSettings().then(() => {
        resolve(db);
      }).catch(err => {
        console.error('Error initializing settings:', err);
        resolve(db); // Still resolve even if settings fail
      });
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create Products store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        productStore.createIndex('category', 'category', { unique: false });
        productStore.createIndex('name', 'name', { unique: false });
      }
      
      // Create Sales store
      if (!db.objectStoreNames.contains('sales')) {
        const salesStore = db.createObjectStore('sales', { 
          keyPath: 'id', 
          autoIncrement: true 
        });
        salesStore.createIndex('date', 'date', { unique: false });
        salesStore.createIndex('productId', 'productId', { unique: false });
      }
      
      // Create Settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
};

// Initialize default settings
const initDefaultSettings = async () => {
  try {
    const lowStockThreshold = await dbOps.getSetting('lowStockThreshold');
    if (lowStockThreshold === undefined) {
      await dbOps.setSetting('lowStockThreshold', 10);
    }
  } catch (err) {
    console.error('Error initializing default settings:', err);
  }
};

// Database CRUD operations
export const dbOps = {
  // Add new product
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      // Validate product data
      if (!product.name || product.price === undefined || product.stock === undefined) {
        reject(new Error('Invalid product data'));
        return;
      }
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.add(product);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Update existing product
  updateProduct: (product) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      if (!product.id) {
        reject(new Error('Product ID is required for update'));
        return;
      }
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.put(product);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Delete product
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  // Get all products
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = db.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Add new sale
  addSale: (sale) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sales'], 'readwrite');
      const store = transaction.objectStore('sales');
      const request = store.add(sale);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Get all sales
  getAllSales: () => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = db.transaction(['sales'], 'readonly');
      const store = transaction.objectStore('sales');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },
  
  // Clear entire store (for backup restore)
  clearStore: (storeName) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Settings operations
  getSetting: (key) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = db.transaction(['settings'], 'readonly');
      const store = transaction.objectStore('settings');
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : undefined);
      };
      request.onerror = () => reject(request.error);
    });
  },

  setSetting: (key, value) => {
    return new Promise((resolve, reject) => {
      if (!db) {
        reject(new Error('Database not initialized'));
        return;
      }
      const transaction = db.transaction(['settings'], 'readwrite');
      const store = transaction.objectStore('settings');
      const request = store.put({ key, value });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};