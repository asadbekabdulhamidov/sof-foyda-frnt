import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Store, RefreshCw, Check, MapPin, Phone } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, resetToDefaults } = useStore();
  const [storeName, setStoreName] = useState('Sof Foyda');
  const [storeAddress, setStoreAddress] = useState('Toshkent sh., Savdo Markazi');
  const [storePhone, setStorePhone] = useState('+998 (90) 000-00-00');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('sof_foyda_store_name') || 'Sof Foyda';
    const savedAddress = localStorage.getItem('sof_foyda_store_address') || 'Toshkent sh., Savdo Markazi';
    const savedPhone = localStorage.getItem('sof_foyda_store_phone') || '+998 (90) 000-00-00';
    setStoreName(savedName);
    setStoreAddress(savedAddress);
    setStorePhone(savedPhone);
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sof_foyda_store_name', storeName.trim());
    localStorage.setItem('sof_foyda_store_address', storeAddress.trim());
    localStorage.setItem('sof_foyda_store_phone', storePhone.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Do'kon Sozlamalari</h3>
              <p className="text-[11px] text-slate-400">Do'kon ma'lumotlari va kassa cheki rekvizitlari</p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-5 space-y-4 text-xs">
          
          {/* Store Name */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-emerald-400" /> Do'kon Nomi
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Store Address */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Manzil (Chekda chiqadi)
            </label>
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Store Phone */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" /> Telefon raqami
            </label>
            <input
              type="text"
              value={storePhone}
              onChange={(e) => setStorePhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Currency Info */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
            <span>Standart Valyuta:</span>
            <span className="font-bold text-emerald-400">UZS (O'zbek so'mi)</span>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-300 block">Dastlabki holatga qaytarish</span>
              <span className="text-[10px] text-slate-500">Ombor va savdolarni tiklaydi</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Haqiqatan ham barcha tovar va savdolarni dastlabki holatga qaytarmoqchimisiz?")) {
                  resetToDefaults();
                  alert("Ma'lumotlar tiklandi!");
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Qaytarish
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition-colors"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Saqlandi!' : 'Saqlash'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
