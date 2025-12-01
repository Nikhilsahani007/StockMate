// IndexedDB Setup using native API
const DB_NAME = 'StockMateDB';
const DB_VERSION = 1;

let db;

// Initialize database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
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

// Database CRUD operations
export const dbOps = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.add(product);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  updateProduct: (product) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.put(product);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readwrite');
      const store = transaction.objectStore('products');
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },
  
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['products'], 'readonly');
      const store = transaction.objectStore('products');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  addSale: (sale) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sales'], 'readwrite');
      const store = transaction.objectStore('sales');
      const request = store.add(sale);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  getAllSales: () => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['sales'], 'readonly');
      const store = transaction.objectStore('sales');
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  clearStore: (storeName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
};