import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  History, 
  Plus, 
  Settings, 
  Coins
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsAddModalOpen, 
    setIsSettingsOpen, 
    cart, 
    metrics 
  } = useStore();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('products')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black text-xl">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Sof Foyda
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI POS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Kiyim do'koni aqlli boshqaruv tizimi</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Ombor & Katalog</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-300 border border-emerald-500/30 hover:from-emerald-600/40 hover:to-teal-600/40 transition-all shadow-sm shadow-emerald-950"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Tovar Kiritish</span>
            </button>

            <button
              onClick={() => setActiveTab('pos')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium relative transition-all ${
                activeTab === 'pos'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Kassa POS</span>
              {cartItemsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Sof Foyda</span>
            </button>

            <button
              onClick={() => setActiveTab('sales_history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'sales_history'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Savdolar</span>
            </button>
          </nav>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Profit Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <Coins className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-slate-400 block leading-none">Bugungi Sof Foyda</span>
                <span className="text-xs font-bold text-emerald-400 leading-tight">
                  {formatUZS(metrics.todayNetProfit)}
                </span>
              </div>
            </div>

            {/* Quick Add Product Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Tovar Qo'shish</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
              title="Sozlamalar & API Kalit"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'products' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Katalog</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-col items-center gap-1 text-[11px] font-medium text-emerald-400"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tovar</span>
          </button>
          <button
            onClick={() => setActiveTab('pos')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium relative ${
              activeTab === 'pos' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Kassa</span>
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Analitika</span>
          </button>
          <button
            onClick={() => setActiveTab('sales_history')}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium ${
              activeTab === 'sales_history' ? 'text-emerald-400' : 'text-slate-400'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Tarix</span>
          </button>
        </div>
      </div>
    </header>
  );
};
