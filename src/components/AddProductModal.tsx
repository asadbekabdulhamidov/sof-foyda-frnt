import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Upload, 
  Check, 
  DollarSign, 
  Layers, 
  Camera, 
  RefreshCw, 
  PlusCircle, 
  PackagePlus 
} from 'lucide-react';
import { formatUZS, generateBarcodeNumber } from '../utils/formatters';
import confetti from 'canvas-confetti';

const SAMPLE_IMAGES = [
  {
    name: 'Klassik Shim',
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Qora Xudi',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ayollar Libosi',
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Oq Futbolka',
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  },
];

export const AddProductModal: React.FC = () => {
  const { isAddModalOpen, setIsAddModalOpen, addProduct, setBarcodeProduct } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>('');

  // Form Fields
  const [category, setCategory] = useState("Erkaklar shimi");
  const [type, setType] = useState('Klassik');
  const [color, setColor] = useState('Qora');
  const [material, setMaterial] = useState('Paxta / Koton');
  const [pattern] = useState('Bir xil rang');
  const [season, setSeason] = useState('Bahor/Kuz');
  const [targetAudience, setTargetAudience] = useState('Erkaklar');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [newSizeInput, setNewSizeInput] = useState('');
  const [shortTitle, setShortTitle] = useState('');
  const [skuCode, setSkuCode] = useState(`SHIM-${Math.floor(100 + Math.random() * 900)}`);
  
  // Pricing and Stock
  const [costPrice, setCostPrice] = useState<number>(100000);
  const [sellingPrice, setSellingPrice] = useState<number>(180000);
  const [stock, setStock] = useState<number>(15);
  const [barcode, setBarcode] = useState<string>(generateBarcodeNumber());

  if (!isAddModalOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSize = () => {
    if (newSizeInput.trim() && !sizes.includes(newSizeInput.trim().toUpperCase())) {
      setSizes([...sizes, newSizeInput.trim().toUpperCase()]);
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (szToRemove: string) => {
    setSizes(sizes.filter((s) => s !== szToRemove));
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortTitle.trim() || !skuCode.trim()) {
      alert("Iltimos, tovar nomi va SKU kodini kiriting!");
      return;
    }

    const saved = addProduct({
      category: category || "Kiyim",
      type: type || "Standart",
      color: color || "Turli rang",
      material_estimated: material || "Paxta",
      pattern: pattern || "Bir xil rang",
      season: season || "Barcha mavsum",
      target_audience: targetAudience || "Uniseks",
      sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
      size_variants: (sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL']).map((sz) => ({
        size: sz,
        quantity: Math.max(1, Math.floor(stock / (sizes.length || 1))),
      })),
      short_title: shortTitle,
      sku_code: skuCode,
      cost_price: Number(costPrice) || 0,
      selling_price: Number(sellingPrice) || 0,
      stock: Number(stock) || 0,
      image_url: imagePreview || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      barcode: barcode || generateBarcodeNumber(),
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsAddModalOpen(false);
    setBarcodeProduct(saved);
  };

  const netProfitPerItem = sellingPrice - costPrice;
  const profitMarginPercent = sellingPrice > 0 ? ((netProfitPerItem / sellingPrice) * 100).toFixed(1) : '0';
  const totalPotentialProfit = netProfitPerItem * stock;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Yangi Tovar Qo'shish
              </h2>
              <p className="text-xs text-slate-400">
                Tovar ma'lumotlarini kiriting va omborga saqlang
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddModalOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          
          {/* Image & Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Image Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all min-h-[160px] ${
                  imagePreview
                    ? 'border-emerald-500/50 bg-slate-950/60'
                    : 'border-slate-700 hover:border-emerald-500/50 bg-slate-950/30'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Kiyim rasmi"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-[10px] text-slate-200 px-2 py-1 rounded-lg border border-slate-700 flex items-center gap-1 group-hover:bg-emerald-600 transition-colors">
                      <Camera className="w-3 h-3" /> O'zgartirish
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-200">
                      Rasm yuklash (ixtiyoriy)
                    </p>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                      Tanlash
                    </span>
                  </div>
                )}
              </div>

              {/* Sample picks */}
              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLE_IMAGES.map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => setImagePreview(sample.url)}
                    className="rounded-lg overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all text-left"
                  >
                    <img
                      src={sample.url}
                      alt={sample.name}
                      className="w-full h-8 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sof Foyda Calculation Box */}
            <div className="md:col-span-7 flex flex-col justify-center bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Sof Foyda Hisobi
                </span>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Marja: {profitMarginPercent}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 text-center mt-2">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">1 donadan foyda</span>
                  <span className="text-xs font-black text-emerald-400">
                    +{formatUZS(netProfitPerItem)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Kirim miqdori</span>
                  <span className="text-xs font-bold text-slate-200">
                    {stock} dona
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300/80 block">Partiya Foydasi</span>
                  <span className="text-xs font-black text-emerald-300">
                    +{formatUZS(totalPotentialProfit)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Form */}
          <form id="add-product-modal-form" onSubmit={handleSaveProduct} className="space-y-4 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              
              {/* Short Title */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kassa uchun qisqa va aniq nom <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={shortTitle}
                  onChange={(e) => setShortTitle(e.target.value)}
                  placeholder="Masalan: Erkaklar qora klassik shimi"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              {/* SKU Code */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  SKU Kodi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  placeholder="SHIM-QOR-001"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 placeholder-slate-500 outline-none transition-colors"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategoriya</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Erkaklar shimi"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Turi</label>
                <input
                  type="text"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  placeholder="Klassik shim"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rangi</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Qora"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Material */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Matosi</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Paxta / Koton"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Season */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mavsumi</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                >
                  <option value="Barcha mavsum">Barcha mavsum</option>
                  <option value="Bahor/Kuz">Bahor/Kuz</option>
                  <option value="Yozgi">Yozgi</option>
                  <option value="Qishki">Qishki</option>
                </select>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kim uchun</label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                >
                  <option value="Erkaklar">Erkaklar</option>
                  <option value="Ayollar">Ayollar</option>
                  <option value="O'g'il bola">O'g'il bola</option>
                  <option value="Qiz bola">Qiz bola</option>
                  <option value="Uniseks">Uniseks</option>
                </select>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Qoldiq soni (Dona) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Cost Price */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kirim Narxi / Tannarx (UZS) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-semibold outline-none"
                />
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Sotuv Narxi (UZS) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  required
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-emerald-400 font-bold outline-none"
                />
              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                  <span>Shtrix-kod</span>
                  <button
                    type="button"
                    onClick={() => setBarcode(generateBarcodeNumber())}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Yangilash
                  </button>
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs font-mono text-white outline-none"
                />
              </div>

            </div>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                Mavjud O'lchamlar (Razmerlar):
              </label>
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {sizes.map((sz) => (
                  <span
                    key={sz}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-white shadow-xs"
                  >
                    {sz}
                    <button
                      type="button"
                      onClick={() => handleRemoveSize(sz)}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                <div className="flex items-center gap-1 ml-2">
                  <input
                    type="text"
                    value={newSizeInput}
                    onChange={(e) => setNewSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSize();
                      }
                    }}
                    placeholder="+ Razmer (38)"
                    className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="p-1 rounded-lg bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/50 border border-emerald-500/30"
                  >
                    <PlusCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </form>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Bekor qilish
          </button>

          <button
            type="submit"
            form="add-product-modal-form"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Omborga Saqlash</span>
          </button>
        </div>

      </div>
    </div>
  );
};
