import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, CheckCircle } from 'lucide-react';
import { formatDate, formatUZS } from '../utils/formatters';

export const ReceiptModal: React.FC = () => {
  const { lastSaleReceipt, setLastSaleReceipt } = useStore();

  if (!lastSaleReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodName = (m: string) => {
    switch (m) {
      case 'click_payme': return 'Click / Payme';
      case 'karta': return 'Plastik Karta';
      case 'naqd': return 'Naqd Pul';
      case 'nasiya': return 'Nasiya / Qarz';
      default: return m;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">Savdo Muvaffaqiyatli!</span>
          </div>
          <button
            onClick={() => setLastSaleReceipt(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Thermal Receipt */}
        <div className="p-4 bg-slate-950/40 flex justify-center">
          <div 
            id="printable-pos-receipt"
            className="w-full bg-white text-slate-950 p-4 rounded-xl shadow-md font-mono text-[11px] leading-tight"
          >
            {/* Store title */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <h3 className="text-sm font-black tracking-wider">"SOF FOYDA" KIYIM DO'KONI</h3>
              <p className="text-[10px] text-slate-600 mt-0.5">Toshkent sh., Savdo Markazi</p>
              <p className="text-[10px] text-slate-600">Tel: +998 (90) 000-00-00</p>
            </div>

            {/* Receipt Info */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-0.5 text-[10px]">
              <div className="flex justify-between">
                <span>Chek №:</span>
                <span className="font-bold">{lastSaleReceipt.receipt_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Sana / Vaqt:</span>
                <span>{formatDate(lastSaleReceipt.created_at)}</span>
              </div>
              {lastSaleReceipt.customer_name && (
                <div className="flex justify-between">
                  <span>Mijoz:</span>
                  <span className="font-bold">{lastSaleReceipt.customer_name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>To'lov usuli:</span>
                <span className="font-bold">{getMethodName(lastSaleReceipt.payment_method)}</span>
              </div>
            </div>

            {/* Items */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-2">
              {lastSaleReceipt.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900 truncate">
                    {item.product.short_title} ({item.selected_size})
                  </div>
                  <div className="flex justify-between text-slate-600 text-[10px]">
                    <span>{item.quantity} × {formatUZS(item.product.selling_price)}</span>
                    <span className="font-bold text-slate-950">
                      {formatUZS(item.product.selling_price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-xs font-black">
                <span>JAMI TO'LOV:</span>
                <span>{formatUZS(lastSaleReceipt.total_amount)}</span>
              </div>
            </div>

            {/* QR or Footer Message */}
            <div className="text-center mt-3 pt-2 border-t border-dashed border-slate-300 text-[9px] text-slate-500">
              <p>Xaridingiz uchun rahmat!</p>
              <p className="font-sans font-bold text-slate-700 mt-0.5">Sof Foyda POS tizimi</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setLastSaleReceipt(null)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Yopish
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Chekni Chop Etish</span>
          </button>
        </div>

      </div>
    </div>
  );
};
