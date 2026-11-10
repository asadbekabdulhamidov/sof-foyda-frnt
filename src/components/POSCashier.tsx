import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { PaymentMethod } from '../types';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  FileText, 
  Sparkles,
  Barcode,
  CheckCircle2,
  X
} from 'lucide-react';
import { formatUZS } from '../utils/formatters';
import confetti from 'canvas-confetti';

export const POSCashier: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    completeSale 
  } = useStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<string>('all');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('click_payme');

  // Barcode / Fast scanner submit
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const found = products.find(
      (p) =>
        p.barcode.toLowerCase() === barcodeInput.trim().toLowerCase() ||
        p.sku_code.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (found) {
      if (found.stock <= 0) {
        alert(`Diqqat! "${found.short_title}" tovaridan omborda qolmagan.`);
        return;
      }
      addToCart(found);
      setBarcodeInput('');
    } else {
      alert(`"${barcodeInput}" kodi bo'yicha hech qanday tovar topilmadi!`);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (selectedAudience === 'all') return true;
    return p.target_audience.toLowerCase() === selectedAudience.toLowerCase();
  });

  // Calculate cart totals & net profit
  let cartTotal = 0;
  let cartCost = 0;
  cart.forEach((item) => {
    cartTotal += item.product.selling_price * item.quantity;
    cartCost += item.product.cost_price * item.quantity;
  });
  const cartNetProfit = cartTotal - cartCost;
  const profitMarginPercent = cartTotal > 0 ? ((cartNetProfit / cartTotal) * 100).toFixed(1) : '0';

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const sale = completeSale(paymentMethod, customerName, customerPhone);
    if (sale) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      
      {/* Left: Products Catalog & Quick Select (Col 7) */}
      <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
        
        {/* Barcode scanner input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleBarcodeSubmit} className="relative flex-1 w-full">
            <Barcode className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400" />
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="Shtrix-kod skaneri yoki SKU kiriting..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-20 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Qo'shish
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['all', 'Erkaklar', 'Ayollar', 'Uniseks'].map((aud) => (
              <button
                key={aud}
                type="button"
                onClick={() => setSelectedAudience(aud)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedAudience === aud
                    ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-950'
                }`}
              >
                {aud === 'all' ? 'Barchasi' : aud}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredProducts.map((p) => {
              const netProfit = p.selling_price - p.cost_price;

              return (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-xs"
                >
                  <div className="relative h-28 rounded-lg overflow-hidden bg-slate-950 mb-2">
                    <img
                      src={p.image_url}
                      alt={p.short_title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-mono bg-slate-950/80 backdrop-blur-xs text-emerald-300 px-1.5 py-0.5 rounded">
                      {p.sku_code}
                    </span>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-bold bg-emerald-600/90 text-slate-950 px-1.5 py-0.5 rounded">
                      +{formatUZS(netProfit)}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-white line-clamp-1 mb-1">
                      {p.short_title}
                    </h5>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-extrabold text-emerald-400">
                        {formatUZS(p.selling_price)}
                      </span>
                      <span className={`text-[10px] ${p.stock <= 2 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                        Qoldiq: {p.stock}
                      </span>
                    </div>

                    {/* Sizes selection buttons */}
                    <div className="flex flex-wrap gap-1">
                      {p.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => addToCart(p, sz)}
                          disabled={p.stock <= 0}
                          className="flex-1 min-w-[28px] py-1 text-[10px] font-bold rounded bg-slate-950 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-800 transition-colors disabled:opacity-40"
                          title={`${sz} o'lchamini savatga qo'shish`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right: Cart, Sof Foyda Breakdown & Checkout (Col 5) */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-xl">
        
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Xarid Savatchasi</h3>
            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} tovar
            </span>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Tozalash
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 gap-2">
              <ShoppingCart className="w-12 h-12 stroke-[1.2] text-slate-600" />
              <p className="text-xs font-medium text-slate-400">Savatcha bo'sh</p>
              <p className="text-[11px] max-w-xs">
                Katalogdagi kiyim o'lchamini bosing yoki shtrix-kod skaneri orqali mahsulot qo'shing.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const lineTotal = item.product.selling_price * item.quantity;
              const lineProfit = (item.product.selling_price - item.product.cost_price) * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.selected_size}`}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3 shadow-xs"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.short_title}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h6 className="text-xs font-bold text-white truncate">
                      {item.product.short_title}
                    </h6>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                      <span className="font-semibold bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">
                        Razmer: {item.selected_size}
                      </span>
                      <span className="text-slate-400">
                        {formatUZS(item.product.selling_price)}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 block mt-0.5">
                      Foyda: +{formatUZS(lineProfit)}
                    </span>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-extrabold text-white">
                      {formatUZS(lineTotal)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selected_size, -1)}
                          className="p-1 hover:text-rose-400 text-slate-400 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1.5 text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.selected_size, 1)}
                          className="p-1 hover:text-emerald-400 text-slate-400 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selected_size)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="O'chirish"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Cart Checkout Section */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
            
            {/* Customer Inputs (Optional) */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Mijoz ismi (ixtiyoriy)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
              />
              <input
                type="text"
                placeholder="Telefon (90 123 45 67)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'click_payme', label: 'Click/Payme', icon: Smartphone },
                { id: 'karta', label: 'Karta', icon: CreditCard },
                { id: 'naqd', label: 'Naqd', icon: Banknote },
                { id: 'nasiya', label: 'Nasiya', icon: FileText },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl text-[10px] font-semibold border transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-xs'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mb-1" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Financial Summary & Sof Foyda */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Tovarlar tannarxi (Xarajat):</span>
                <span>{formatUZS(cartCost)}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ushbu chekdan Sof Foyda:
                </span>
                <span>+{formatUZS(cartNetProfit)} ({profitMarginPercent}%)</span>
              </div>
              <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Jami To'lov:</span>
                <span className="text-base font-black text-white">{formatUZS(cartTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-98 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>To'lovni Qabul Qilish & Chek Chiqarish</span>
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
