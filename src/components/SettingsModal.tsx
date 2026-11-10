import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Key, Store, RefreshCw, Check, Code } from 'lucide-react';
import { CLOTHING_SYSTEM_PROMPT } from '../services/geminiService';

export const SettingsModal: React.FC = () => {
  const { isSettingsOpen, setIsSettingsOpen, resetToDefaults } = useStore();
  const [apiKey, setApiKey] = useState('');
  const [storeName, setStoreName] = useState('Sof Foyda');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('sof_foyda_gemini_api_key') || '';
    setApiKey(savedKey);
    const savedName = localStorage.getItem('sof_foyda_store_name') || 'Sof Foyda';
    setStoreName(savedName);
  }, [isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sof_foyda_gemini_api_key', apiKey.trim());
    localStorage.setItem('sof_foyda_store_name', storeName.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tizim Sozlamalari</h3>
              <p className="text-[11px] text-slate-400">Do'kon va AI Vision API konfiguratsiyasi</p>
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
            <label className="block font-medium text-slate-300 mb-1">Do'kon Nomi</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white outline-none"
            />
          </div>

          {/* Gemini API Key */}
          <div>
            <label className="block font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                Google Gemini API Kaliti
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-400 hover:underline"
              >
                API kalit olish (bepul) &rarr;
              </a>
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Kalit kiritilmasa, tizim avtomatik aqlli simulyatsiya rejimida ishlaydi.
            </p>
          </div>

          {/* View System Prompt Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowPrompt(!showPrompt)}
              className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Code className="w-3 h-3" />
              <span>{showPrompt ? "AI Tizim Promptini yashirish" : "AI Kiyim tahlili promptini ko'rish"}</span>
            </button>

            {showPrompt && (
              <pre className="mt-2 text-[10px] font-mono bg-slate-950 text-slate-300 p-3 rounded-xl border border-slate-800 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {CLOTHING_SYSTEM_PROMPT}
              </pre>
            )}
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-300 block">Namunaviy Ma'lumotlarni Qaytarish</span>
              <span className="text-[10px] text-slate-500">Ombor va savdolarni dastlabki holatga qaytaradi</span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm("Haqiqatan ham barcha tovar va savdolarni standart holatga qaytarmoqchimisiz?")) {
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
