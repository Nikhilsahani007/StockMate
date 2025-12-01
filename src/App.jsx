import React, { useState, useEffect } from 'react';
import { Package, ShoppingCart, BarChart3, Download, Menu, X } from 'lucide-react';
import { initDB, dbOps } from './utils/db';
import { NavButton, MobileNavButton, BottomNavButton } from './components/NavButton';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Sales from './components/Sales';
import Reports from './components/Reports';
import BackupRestore from './components/BackupRestore';

export default function StockMate() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        return <Dashboard products={products} sales={sales} />;
      case 'products':
        return <Products products={products} loadData={loadData} />;
      case 'sales':
        return <Sales products={products} loadData={loadData} />;
      case 'reports':
        return <Reports sales={sales} products={products} />;
      case 'backup':
        return <BackupRestore loadData={loadData} />;
      default:
        return <Dashboard products={products} sales={sales} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Loading StockMate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">📦 StockMate</h1>
              <p className="text-green-100 text-xs sm:text-sm hidden sm:block">
                Offline Inventory & Sales Management
              </p>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-green-700"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="bg-white w-64 h-full shadow-lg p-4" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              <MobileNavButton 
                icon={<BarChart3 size={20} />} 
                label="Dashboard" 
                active={currentPage === 'dashboard'} 
                onClick={() => { setCurrentPage('dashboard'); setMobileMenuOpen(false); }} 
              />
              <MobileNavButton 
                icon={<Package size={20} />} 
                label="Products" 
                active={currentPage === 'products'} 
                onClick={() => { setCurrentPage('products'); setMobileMenuOpen(false); }} 
              />
              <MobileNavButton 
                icon={<ShoppingCart size={20} />} 
                label="Sales" 
                active={currentPage === 'sales'} 
                onClick={() => { setCurrentPage('sales'); setMobileMenuOpen(false); }} 
              />
              <MobileNavButton 
                icon={<BarChart3 size={20} />} 
                label="Reports" 
                active={currentPage === 'reports'} 
                onClick={() => { setCurrentPage('reports'); setMobileMenuOpen(false); }} 
              />
              <MobileNavButton 
                icon={<Download size={20} />} 
                label="Backup" 
                active={currentPage === 'backup'} 
                onClick={() => { setCurrentPage('backup'); setMobileMenuOpen(false); }} 
              />
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="bg-white shadow hidden lg:block sticky top-16 z-30">
        <div className="px-4">
          <div className="flex space-x-1 overflow-x-auto">
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
          </div>
        </div>
      </nav>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around">
          <BottomNavButton 
            icon={<BarChart3 size={20} />} 
            label="Dashboard" 
            active={currentPage === 'dashboard'} 
            onClick={() => setCurrentPage('dashboard')} 
          />
          <BottomNavButton 
            icon={<Package size={20} />} 
            label="Products" 
            active={currentPage === 'products'} 
            onClick={() => setCurrentPage('products')} 
          />
          <BottomNavButton 
            icon={<ShoppingCart size={20} />} 
            label="Sales" 
            active={currentPage === 'sales'} 
            onClick={() => setCurrentPage('sales')} 
          />
          <BottomNavButton 
            icon={<BarChart3 size={20} />} 
            label="Reports" 
            active={currentPage === 'reports'} 
            onClick={() => setCurrentPage('reports')} 
          />
          <BottomNavButton 
            icon={<Download size={20} />} 
            label="More" 
            active={currentPage === 'backup'} 
            onClick={() => setCurrentPage('backup')} 
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-3 sm:px-4 lg:px-6 py-4 pb-20 lg:pb-6 max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  );
}