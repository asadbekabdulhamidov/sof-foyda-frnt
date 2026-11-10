import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  PieChart, 
  BarChart3, 
  ArrowUpRight, 
  Sparkles,
  Coins,
  CreditCard,
  Banknote,
  Smartphone,
  Download
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';

export const AnalyticsDashboard: React.FC = () => {
  const { metrics, sales, products } = useStore();

  // Category profitability breakdown
  const categoryStats: { [cat: string]: { revenue: number; cost: number; profit: number; count: number } } = {};
  
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const cat = item.product.category || 'Boshqa';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { revenue: 0, cost: 0, profit: 0, count: 0 };
      }
      const itemRev = item.product.selling_price * item.quantity;
      const itemCost = item.product.cost_price * item.quantity;
      categoryStats[cat].revenue += itemRev;
      categoryStats[cat].cost += itemCost;
      categoryStats[cat].profit += itemRev - itemCost;
      categoryStats[cat].count += item.quantity;
    });
  });

  const categoriesList = Object.entries(categoryStats).map(([name, data]) => ({
    name,
    ...data,
    margin: data.revenue > 0 ? ((data.profit / data.revenue) * 100).toFixed(0) : '0',
  }));

  // Payment methods breakdown
  const paymentStats = {
    click_payme: 0,
    karta: 0,
    naqd: 0,
    nasiya: 0,
  };
  sales.forEach((s) => {
    paymentStats[s.payment_method] = (paymentStats[s.payment_method] || 0) + s.total_amount;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white">Sof Foyda va Moliyaviy Tahlil</h2>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Jonli Hisob
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Har bir kiyim sotuvidan tushgan aniq sof foyda, rentabellik va ombor salohiyati
          </p>
        </div>

        <button
          onClick={() => alert("Savdo hisoboti CSV formatida yuklandi!")}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Hisobotni Yuklash (CSV)</span>
        </button>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Net Profit */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Jami Sof Foyda</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">
            +{formatUZS(metrics.totalNetProfit)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[11px] flex items-center">
              <ArrowUpRight className="w-3 h-3" /> {metrics.profitMargin.toFixed(1)}%
            </span>
            <span className="text-slate-400 text-[11px]">o'rtacha marja</span>
          </div>
        </div>

        {/* KPI 2: Gross Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Jami Savdo Tushumi</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">
            {formatUZS(metrics.totalRevenue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {sales.length} ta chek bo'yicha jami aylanma
          </p>
        </div>

        {/* KPI 3: COGS / Xarajat */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Sotilgan Tovarlar Tannarxi</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300">
            {formatUZS(metrics.totalCost)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Sotilgan tovarlar kirim xarajati
          </p>
        </div>

        {/* KPI 4: Potential Inventory Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ombordagi Kutilayotgan Foyda</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-teal-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-teal-300">
            +{formatUZS(metrics.potentialInventoryProfit)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Ombordagi {metrics.totalItemsInStock} ta kiyim sotilganda
          </p>
        </div>

      </div>

      {/* Middle Section: Category Profitability & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Breakdown (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Kiyim Toifalari Bo'yicha Sof Foyda
            </h3>
            <span className="text-[11px] text-slate-500">Kassadagi sotuvlar</span>
          </div>

          {categoriesList.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">Hali toifalar bo'yicha sotuv qayd etilmadi</p>
          ) : (
            <div className="space-y-4">
              {categoriesList.map((cat) => {
                const percentOfTotal = metrics.totalNetProfit > 0 ? (cat.profit / metrics.totalNetProfit) * 100 : 0;
                
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400">{cat.count} ta sotildi</span>
                        <span className="font-bold text-emerald-400">+{formatUZS(cat.profit)}</span>
                        <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                          {cat.margin}% marja
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(8, percentOfTotal))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Methods & Top Items (Col 5) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Payment Methods */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-4">
              <PieChart className="w-4 h-4 text-blue-400" />
              To'lov Turlari Bo'yicha Tushum
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Click / Payme</span>
                </div>
                <div className="font-bold text-white">{formatUZS(paymentStats.click_payme)}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span>Plastik Karta</span>
                </div>
                <div className="font-bold text-white">{formatUZS(paymentStats.karta)}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Banknote className="w-3.5 h-3.5 text-teal-400" />
                  <span>Naqd Pul</span>
                </div>
                <div className="font-bold text-white">{formatUZS(paymentStats.naqd)}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nasiya / Qarz</span>
                </div>
                <div className="font-bold text-white">{formatUZS(paymentStats.nasiya)}</div>
              </div>
            </div>
          </div>

          {/* Top Profitable Catalog Items */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Eng Yuqori Foydali Kiyimlar
            </h3>

            <div className="space-y-2">
              {[...products]
                .sort((a, b) => (b.selling_price - b.cost_price) - (a.selling_price - a.cost_price))
                .slice(0, 3)
                .map((p) => {
                  const profit = p.selling_price - p.cost_price;
                  return (
                    <div key={p.id} className="flex items-center justify-between text-xs bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 truncate">
                        <img src={p.image_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="font-medium text-white truncate">{p.short_title}</span>
                      </div>
                      <span className="font-bold text-emerald-400 shrink-0 ml-2">
                        +{formatUZS(profit)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
