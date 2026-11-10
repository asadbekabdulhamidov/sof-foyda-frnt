import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Menu, 
  Plus, 
  Coins, 
  Settings, 
  ShoppingCart
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';

interface TopBarProps {
  onOpenSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSidebar }) => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsSettingsOpen, 
    cart, 
    metrics 
  } = useStore();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getPageInfo = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Boshqaruv Paneli (Dashboard)',
          subtitle: 'Kiyim do\'koni daromadlari, sof foyda va umumiy ko\'rsatkichlar',
        };
      case 'ombor':
        return {
          title: 'Ombor & Tovar Qoldig\'i',
          subtitle: 'Mavjud kiyimlar katalogi, narxlar va qoldiqlar nazorati',
        };
      case 'kirim':
        return {
          title: 'Kirim (Kelgan Tovarlarni Kiritish)',
          subtitle: 'Yangi tovarlar parametrlarini to\'ldirib omborga qabul qilish',
        };
      case 'savdo':
        return {
          title: 'Kassa POS — Tezkor Savdo',
          subtitle: 'Shtrix-kod skaneri, savatcha va chek chiqarish',
        };
      case 'sales_history':
        return {
          title: 'Savdolar Tarixi & Cheklar',
          subtitle: 'Amalga oshirilgan barcha xaridlar va cheklar arxivi',
        };
      default:
        return { title: 'Sof Foyda', subtitle: '' };
    }
  };

  const page = getPageInfo();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Hamburger (mobile) + Page Titles */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenSidebar}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl md:hidden transition-colors"
              title="Menyuni ochish"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                {page.title}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {page.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Quick actions & KPI pill */}
          <div className="flex items-center gap-3">
            
            {/* Quick Profit Pill */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <Coins className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[9px] text-slate-400 block leading-none">Bugungi Sof Foyda</span>
                <span className="text-xs font-bold text-emerald-400 leading-tight">
                  +{formatUZS(metrics.todayNetProfit)}
                </span>
              </div>
            </div>

            {/* Quick Kirim Button */}
            <button
              onClick={() => setActiveTab('kirim')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yangi Kirim</span>
              <span className="sm:hidden">Kirim</span>
            </button>

            {/* Cart Button if on mobile or outside POS */}
            {activeTab !== 'savdo' && cartItemsCount > 0 && (
              <button
                onClick={() => setActiveTab('savdo')}
                className="relative p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors border border-slate-700"
                title="Kassaga o'tish"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center">
                  {cartItemsCount}
                </span>
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors border border-slate-800"
              title="Sozlamalar"
            >
              <Settings className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
