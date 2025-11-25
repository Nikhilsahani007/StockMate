import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, BarChart3, Download, Settings } from 'lucide-react';
import { initDB, dbOps } from './utils/db';
import NavButton from './components/NavButton';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Sales from './components/Sales';
import Reports from './components/Reports';
import BackupRestore from './components/BackupRestore';
import SettingsPage from './components/Settings';

export default function StockMate() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initDB().then(() => {
      loadData();
    }).catch(err => {
      console.error('DB initialization failed:', err);
      setLoading(false);
    });
  }, []);

  const loadData = async () => {
    try {
      const prods = await dbOps.getAllProducts();
      const sls = await dbOps.getAllSales();
      setProducts(prods);
      setSales(sls);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            products={products}
            sales={sales}
            onNavigateToProducts={() => setCurrentPage('products')}
          />
        );
      case 'products':
        return <Products products={products} loadData={loadData} />;
      case 'sales':
        return <Sales products={products} sales={sales} loadData={loadData} />;
      case 'reports':
        return <Reports sales={sales} products={products} />;
      case 'backup':
        return <BackupRestore loadData={loadData} />;
      case 'settings':
        return <SettingsPage loadData={loadData} />;
      default:
        return (
          <Dashboard
            products={products}
            sales={sales}
            onNavigateToProducts={() => setCurrentPage('products')}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading StockMate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="mx-auto w-full max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold">📦 StockMate</h1>
          <p className="text-green-100 text-sm">Offline Inventory & Sales Management</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto w-full max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto pb-1">
            <NavButton 
              icon={<BarChart3 size={18} />} 
              label="Dashboard" 
              active={currentPage === 'dashboard'} 
              onClick={() => setCurrentPage('dashboard')} 
            />
            <NavButton 
              icon={<Package size={18} />} 
              label="Products" 
              active={currentPage === 'products'} 
              onClick={() => setCurrentPage('products')} 
            />
            <NavButton 
              icon={<ShoppingCart size={18} />} 
              label="Sales" 
              active={currentPage === 'sales'} 
              onClick={() => setCurrentPage('sales')} 
            />
            <NavButton 
              icon={<BarChart3 size={18} />} 
              label="Reports" 
              active={currentPage === 'reports'} 
              onClick={() => setCurrentPage('reports')} 
            />
            <NavButton 
              icon={<Download size={18} />} 
              label="Backup" 
              active={currentPage === 'backup'} 
              onClick={() => setCurrentPage('backup')} 
            />
            <NavButton 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={currentPage === 'settings'} 
              onClick={() => setCurrentPage('settings')} 
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-screen-2xl px-4 xs:px-5 sm:px-6 lg:px-8 py-6 lg:py-8">
        {renderPage()}
      </main>
    </div>
  );
}
