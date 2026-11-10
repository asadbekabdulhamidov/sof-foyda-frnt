import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  PackagePlus, 
  ShoppingCart, 
  History, 
  Settings, 
  Coins,
  ChevronRight,
  Store
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { 
    activeTab, 
    setActiveTab, 
    products, 
    cart, 
    metrics, 
    setIsSettingsOpen 
  } = useStore();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      sublabel: 'Asosiy Ko\'rsatkichlar',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'ombor',
      label: 'Ombor',
      sublabel: 'Katalog & Tovar Qoldig\'i',
      icon: Package,
      badge: `${products.length}`,
    },
    {
      id: 'kirim',
      label: 'Kirim',
      sublabel: 'Kelgan Tovarlarni Kiritish',
      icon: PackagePlus,
      badge: null,
    },
    {
      id: 'savdo',
      label: 'Savdo',
      sublabel: 'Kassa POS Terminali',
      icon: ShoppingCart,
      badge: cartItemsCount > 0 ? `${cartItemsCount}` : null,
      isCart: true,
    },
    {
      id: 'sales_history',
      label: 'Savdolar Tarixi',
      sublabel: 'Cheklar va Hisobotlar',
      icon: History,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Store Brand */}
        <div>
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-black text-xl">
                SF
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Sof Foyda
                  </span>
                  <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1 rounded">
                    POS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Kiyim Do'koni Tizimi</p>
              </div>
            </div>
          </div>

          {/* Navigation Links in exact requested order:
              1. Dashboard
              2. Ombor
              3. Kirim (Kelgan tovarlarni kiritish)
              4. Savdo (Kassa)
              5. Savdolar tarixi
          */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Asosiy Menyu
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <div className="truncate">
                      <span className="text-xs font-bold block leading-tight">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate">
                        {item.sublabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.isCart
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                    }`} />
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Sof Foyda Mini Card & Settings */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          
          {/* Quick Profit Card */}
          <div className="bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-xl p-3">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3 h-3" /> Bugungi Sof Foyda
              </span>
            </div>
            <div className="text-sm font-black text-emerald-400">
              +{formatUZS(metrics.todayNetProfit)}
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {metrics.todaySalesCount} ta savdo amalga oshirildi
            </span>
          </div>

          {/* Settings button */}
          <button
            onClick={() => {
              setIsSettingsOpen(true);
              onClose();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-800"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Sozlamalar & API Kalit</span>
          </button>

          <div className="px-2 pt-1 flex items-center justify-between text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <Store className="w-3 h-3" /> Toshkent Filiali
            </span>
            <span>v1.2</span>
          </div>

        </div>
      </aside>
    </>
  );
};
