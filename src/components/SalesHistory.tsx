import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Receipt, 
  Printer, 
  Calendar, 
  User, 
  Smartphone, 
  CreditCard, 
  Banknote, 
  FileText,
  TrendingUp,
  Package
} from 'lucide-react';
import { formatDate, formatUZS } from '../utils/formatters';

export const SalesHistory: React.FC = () => {
  const { sales, setLastSaleReceipt } = useStore();

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'click_payme':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Smartphone className="w-3 h-3" /> Click/Payme
          </span>
        );
      case 'karta':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
            <CreditCard className="w-3 h-3" /> Plastik Karta
          </span>
        );
      case 'naqd':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-full">
            <Banknote className="w-3 h-3" /> Naqd Pul
          </span>
        );
      case 'nasiya':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full">
            <FileText className="w-3 h-3" /> Nasiya
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" /> Savdolar va Cheklar Tarixi
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Barcha amalga oshirilgan savdolar va ulardan olingan sof foyda ro'yxati
          </p>
        </div>
        <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
          Jami {sales.length} ta chek
        </span>
      </div>

      {/* Receipts Table / List */}
      {sales.length === 0 ? (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-500">
          <Receipt className="w-12 h-12 stroke-[1.2] mx-auto mb-2 text-slate-600" />
          <p className="text-xs font-semibold text-slate-400">Hozircha savdolar mavjud emas</p>
          <p className="text-[11px] mt-1">Kassa bo'limiga o'tib birinchi savdoni amalga oshiring.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-colors"
            >
              {/* Left Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-black text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {sale.receipt_number}
                  </span>
                  {getPaymentBadge(sale.payment_method)}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {formatDate(sale.created_at)}
                  </span>
                </div>

                {sale.customer_name && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <User className="w-3 h-3 text-emerald-400" />
                    <span className="font-medium">{sale.customer_name}</span>
                    {sale.customer_phone && (
                      <span className="text-slate-500 font-mono">({sale.customer_phone})</span>
                    )}
                  </div>
                )}

                {/* Items preview pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {sale.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800/80 flex items-center gap-1"
                    >
                      <Package className="w-2.5 h-2.5 text-slate-500" />
                      <span className="font-medium text-white">{item.product.short_title}</span>
                      <span className="text-emerald-400 font-bold">({item.selected_size})</span>
                      <span className="text-slate-400">×{item.quantity}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Amounts & Print button */}
              <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Jami Summa</div>
                  <div className="text-base font-black text-white">
                    {formatUZS(sale.total_amount)}
                  </div>
                  <div className="text-[11px] font-bold text-emerald-400 flex items-center justify-end gap-0.5 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    Sof Foyda: +{formatUZS(sale.net_profit)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLastSaleReceipt(sale)}
                  className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
                  title="Chekni ko'rish va chop etish"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline">Chek</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
