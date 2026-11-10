import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Grid, 
  List, 
  Barcode, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  DollarSign, 
  TrendingUp,
  Package
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';

export const ProductList: React.FC = () => {
  const { 
    products, 
    updateProduct, 
    deleteProduct, 
    addToCart, 
    setBarcodeProduct, 
    setActiveTab,
    metrics 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredProducts = products.filter((prod) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      prod.short_title.toLowerCase().includes(query) ||
      prod.sku_code.toLowerCase().includes(query) ||
      prod.category.toLowerCase().includes(query) ||
      prod.color.toLowerCase().includes(query) ||
      prod.barcode.toLowerCase().includes(query);

    const matchesAudience =
      selectedAudience === 'all' || prod.target_audience.toLowerCase() === selectedAudience.toLowerCase();

    const matchesSeason =
      selectedSeason === 'all' || prod.season.toLowerCase() === selectedSeason.toLowerCase();

    return matchesSearch && matchesAudience && matchesSeason;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Inventory KPI summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Jami Tovar Turlari</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{products.length} xil</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Jami {metrics.totalItemsInStock} dona kiyim omborda</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Ombor Tannarxi</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-300">{formatUZS(metrics.totalInventoryCost)}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tovar sotib olishga sarflangan</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Kutilayotgan Sotuv</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-300">{formatUZS(metrics.totalInventoryRetail)}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Toliq sotilgandagi umumiy summa</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 mb-1">
            <span className="text-xs font-bold">Kutilayotgan Sof Foyda</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">+{formatUZS(metrics.potentialInventoryProfit)}</div>
          <p className="text-[11px] text-emerald-300/70 mt-0.5">Ombordagi sof marjali daromad</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Nomi, SKU, Shtrix-kod yoki rangi bo'yicha qidirish..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={selectedAudience}
            onChange={(e) => setSelectedAudience(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
          >
            <option value="all">Barcha auditoriya</option>
            <option value="Erkaklar">Erkaklar</option>
            <option value="Ayollar">Ayollar</option>
            <option value="O'g'il bola">O'g'il bola</option>
            <option value="Qiz bola">Qiz bola</option>
            <option value="Uniseks">Uniseks</option>
          </select>

          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none focus:border-emerald-500"
          >
            <option value="all">Barcha mavsum</option>
            <option value="Bahor/Kuz">Bahor/Kuz</option>
            <option value="Yozgi">Yozgi</option>
            <option value="Qishki">Qishki</option>
            <option value="Barcha mavsum">Har mavsumiy</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Katak ko'rinishi"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Jadval ko'rinishi"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Add product button */}
          <button
            onClick={() => setActiveTab('kirim')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Yangi Kirim Qilish (AI)</span>
          </button>
        </div>

      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Hech qanday mahsulot topilmadi</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Qidiruv so'zini o'zgartiring yoki sun'iy intellekt orqali yangi kiyim rasmini yuklab tizimga kiriting.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('kirim')}
            className="mt-2 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4" /> Yangi tovar kiritish (Kirim)
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const netProfit = product.selling_price - product.cost_price;
            const margin = product.selling_price > 0 ? ((netProfit / product.selling_price) * 100).toFixed(0) : '0';

            return (
              <div
                key={product.id}
                className="group bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-all hover:shadow-lg hover:shadow-slate-950/50"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.short_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold bg-slate-950/80 backdrop-blur-md text-emerald-300 border border-slate-700/80 px-2 py-0.5 rounded-md">
                      {product.sku_code}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-900/80 backdrop-blur-md text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60">
                      {product.target_audience}
                    </span>
                  </div>

                  {/* Profit Pill Badge */}
                  <div className="absolute bottom-2.5 right-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg shadow-md shadow-emerald-950 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-slate-950" />
                    +{formatUZS(netProfit)} ({margin}%)
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{product.category}</span>
                      <span>{product.season}</span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">
                      {product.short_title}
                    </h4>

                    {/* Sizes list */}
                    <div className="flex flex-wrap items-center gap-1 mt-2">
                      {product.sizes.map((sz) => (
                        <span
                          key={sz}
                          className="text-[10px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded-md"
                        >
                          {sz}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Financials & Stock Controls */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Sotuv Narxi</span>
                        <span className="font-extrabold text-emerald-400">
                          {formatUZS(product.selling_price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Tannarx</span>
                        <span className="font-semibold text-amber-300/80">
                          {formatUZS(product.cost_price)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Row & Quick Actions */}
                    <div className="flex items-center justify-between pt-1">
                      
                      {/* Stock counter */}
                      <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => updateProduct(product.id, { stock: Math.max(0, product.stock - 1) })}
                          className="text-slate-400 hover:text-white p-0.5"
                          title="Kamaytirish"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`text-xs font-bold px-1 ${product.stock <= 3 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {product.stock} dona
                        </span>
                        <button
                          type="button"
                          onClick={() => updateProduct(product.id, { stock: product.stock + 1 })}
                          className="text-slate-400 hover:text-white p-0.5"
                          title="Ko'paytirish"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setBarcodeProduct(product)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Birka & Shtrix-kod chop etish"
                        >
                          <Barcode className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product);
                            setActiveTab('savdo');
                          }}
                          className="flex items-center gap-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold px-2 py-1.5 rounded-lg text-xs transition-all border border-emerald-500/30"
                          title="Kassaga qo'shish"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Kassa</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`"${product.short_title}" tovarini ombordan o'chirmoqchimisiz?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && filteredProducts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Kiyim</th>
                  <th className="py-3 px-3">SKU / Kod</th>
                  <th className="py-3 px-3">Toifasi</th>
                  <th className="py-3 px-3">O'lchamlar</th>
                  <th className="py-3 px-3">Qoldiq</th>
                  <th className="py-3 px-3 text-right">Tannarx</th>
                  <th className="py-3 px-3 text-right">Sotuv Narxi</th>
                  <th className="py-3 px-3 text-right">Sof Foyda (1 dona)</th>
                  <th className="py-3 px-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const netProfit = p.selling_price - p.cost_price;
                  const margin = p.selling_price > 0 ? ((netProfit / p.selling_price) * 100).toFixed(0) : '0';

                  return (
                    <tr key={p.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.short_title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-white line-clamp-1">{p.short_title}</div>
                          <span className="text-[10px] text-slate-400">{p.color} • {p.season}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-semibold">{p.sku_code}</td>
                      <td className="py-3 px-3">{p.category}</td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map((s) => (
                            <span key={s} className="bg-slate-950 border border-slate-800 text-[10px] px-1 rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${p.stock <= 3 ? 'text-rose-400' : 'text-slate-200'}`}>
                          {p.stock} dona
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-amber-300">
                        {formatUZS(p.cost_price)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400">
                        {formatUZS(p.selling_price)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-emerald-300 block">+{formatUZS(netProfit)}</span>
                        <span className="text-[10px] text-emerald-400/80">{margin}% marja</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setBarcodeProduct(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Birka & Shtrix-kod"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              addToCart(p);
                              setActiveTab('savdo');
                            }}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-colors font-bold"
                            title="Kassaga qo'shish"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${p.short_title}" tovarini o'chirmoqchimisiz?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
