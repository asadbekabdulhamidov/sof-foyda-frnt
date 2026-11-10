import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Printer, Tag } from 'lucide-react';
import { formatUZS } from '../utils/formatters';

export const BarcodeModal: React.FC = () => {
  const { barcodeProduct, setBarcodeProduct } = useStore();

  if (!barcodeProduct) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Tovar Birkasi va Shtrix-kod</h3>
          </div>
          <button
            onClick={() => setBarcodeProduct(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Label Container */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950/60">
          <div 
            id="printable-price-tag"
            className="w-72 bg-white text-slate-950 p-4 rounded-xl shadow-lg border border-slate-200 flex flex-col items-center text-center font-sans"
          >
            {/* Store title */}
            <div className="text-[11px] font-black tracking-widest uppercase border-b-2 border-slate-950 pb-1 w-full flex items-center justify-between">
              <span>SOF FOYDA</span>
              <span className="text-[9px] font-normal text-slate-600">KIYIM DO'KONI</span>
            </div>

            {/* Product Title */}
            <h4 className="text-xs font-black mt-2 leading-tight">
              {barcodeProduct.short_title}
            </h4>

            {/* Product Meta */}
            <div className="text-[10px] text-slate-600 mt-1 flex flex-wrap justify-center gap-x-2">
              <span>SKU: <strong>{barcodeProduct.sku_code}</strong></span>
              <span>Rang: {barcodeProduct.color}</span>
              <span>Mato: {barcodeProduct.material_estimated}</span>
            </div>

            {/* Sizes */}
            <div className="flex items-center gap-1 mt-2">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Razmer:</span>
              <div className="flex gap-1">
                {barcodeProduct.sizes.map((s) => (
                  <span key={s} className="border border-slate-950 text-[10px] font-bold px-1.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Barcode Visual Stripes (Realistic CSS Barcode) */}
            <div className="mt-3 w-full flex flex-col items-center">
              <div className="h-12 w-56 flex items-stretch justify-center gap-[2px] px-2 bg-white">
                {barcodeProduct.barcode.split('').map((char, index) => {
                  const num = parseInt(char, 10) || 1;
                  const isFat = (num + index) % 3 === 0;
                  const isMedium = (num + index) % 2 === 0;
                  return (
                    <div
                      key={index}
                      className={`bg-black ${isFat ? 'w-[3px]' : isMedium ? 'w-[2px]' : 'w-[1px]'}`}
                    />
                  );
                })}
              </div>
              <span className="font-mono text-xs font-black tracking-widest mt-1">
                {barcodeProduct.barcode}
              </span>
            </div>

            {/* Price */}
            <div className="mt-3 w-full pt-2 border-t border-dashed border-slate-400">
              <div className="text-[9px] uppercase font-bold text-slate-500">Narxi:</div>
              <div className="text-base font-black text-slate-950">
                {formatUZS(barcodeProduct.selling_price)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setBarcodeProduct(null)}
            className="text-xs text-slate-400 hover:text-white"
          >
            Yopish
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors shadow-md shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Birka Chop Etish</span>
          </button>
        </div>

      </div>
    </div>
  );
};
