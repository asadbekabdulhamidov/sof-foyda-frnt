import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ProductList } from './components/ProductList';
import { KirimPage } from './components/KirimPage';
import { POSCashier } from './components/POSCashier';
import { SalesHistory } from './components/SalesHistory';
import { AddProductModal } from './components/AddProductModal';
import { BarcodeModal } from './components/BarcodeModal';
import { ReceiptModal } from './components/ReceiptModal';
import { SettingsModal } from './components/SettingsModal';

const AppLayout: React.FC = () => {
  const { activeTab } = useStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 2. Main Content Area (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 min-h-screen">
        
        {/* Top Header */}
        <TopBar onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic Page Views:
            1. Dashboard (Eng birinchi)
            2. Ombor
            3. Kirim (Kelgan tovarlarni kiritish)
            4. Savdo (Kassa POS)
            5. Savdolar tarixi
        */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && <AnalyticsDashboard />}
          {activeTab === 'ombor' && <ProductList />}
          {activeTab === 'kirim' && <KirimPage />}
          {activeTab === 'savdo' && <POSCashier />}
          {activeTab === 'sales_history' && <SalesHistory />}
        </main>
      </div>

      {/* Global Modals */}
      <AddProductModal />
      <BarcodeModal />
      <ReceiptModal />
      <SettingsModal />
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppLayout />
    </StoreProvider>
  );
}

export default App;
