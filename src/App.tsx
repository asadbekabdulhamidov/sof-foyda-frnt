import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { ProductList } from './components/ProductList';
import { POSCashier } from './components/POSCashier';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SalesHistory } from './components/SalesHistory';
import { AddProductModal } from './components/AddProductModal';
import { BarcodeModal } from './components/BarcodeModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsModal } from './components/SettingsModal';

const MainContent: React.FC = () => {
  const { activeTab } = useStore();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {activeTab === 'products' && <ProductList />}
      {activeTab === 'pos' && <POSCashier />}
      {activeTab === 'analytics' && <AnalyticsDashboard />}
      {activeTab === 'sales_history' && <SalesHistory />}
    </main>
  );
};

export function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        
        {/* Modals */}
        <AddProductModal />
        <BarcodeModal />
        <ReceiptModal />
        <SettingsModal />
      </div>
    </StoreProvider>
  );
}

export default App;
