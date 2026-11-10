import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Upload, 
  Check, 
  DollarSign, 
  Tag, 
  Layers, 
  Camera, 
  RefreshCw,
  PlusCircle,
  X,
  PackagePlus,
  Barcode,
  History,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { formatUZS, generateBarcodeNumber } from '../utils/formatters';
import confetti from 'canvas-confetti';

const SAMPLE_CLOTHES = [
  {
    name: 'Klassik Shim',
    title: 'Erkaklar qora klassik shimi',
    category: 'Erkaklar shimi',
    type: 'Klassik shim',
    color: 'Qora',
    material: 'Jun va viskoza',
    season: 'Barcha mavsum',
    audience: 'Erkaklar',
    sizes: ['30', '32', '34', '36'],
    cost: 130000,
    price: 240000,
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Qora Xudi',
    title: 'Erkaklar qora kapyushonli xudisi',
    category: 'Erkaklar ustki kiyimi',
    type: 'Xudi',
    color: 'Qora',
    material: 'Paxta / Koton',
    season: 'Bahor/Kuz',
    audience: 'Erkaklar',
    sizes: ['S', 'M', 'L', 'XL'],
    cost: 110000,
    price: 210000,
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Ayollar Libosi',
    title: 'Ayollar bej trikotaj libosi',
    category: 'Ayollar libosi',
    type: 'Trikotaj ko\'ylak',
    color: 'Bej',
    material: 'Trikotaj va paxta',
    season: 'Bahor/Kuz',
    audience: 'Ayollar',
    sizes: ['S', 'M', 'L'],
    cost: 140000,
    price: 280000,
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Oq Futbolka',
    title: 'Uniseks oq premium futbolka',
    category: 'Yozgi kiyim',
    type: 'T-shirt',
    color: 'Oq',
    material: '100% Organik Paxta',
    season: 'Yozgi',
    audience: 'Uniseks',
    sizes: ['S', 'M', 'L', 'XL'],
    cost: 45000,
    price: 95000,
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  },
];

export const KirimPage: React.FC = () => {
  const { addProduct, setBarcodeProduct, products, setActiveTab } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>('');

  // Form Fields
  const [shortTitle, setShortTitle] = useState('');
  const [skuCode, setSkuCode] = useState(`TOV-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState("Erkaklar ko'ylagi");
  const [type, setType] = useState('Klassik');
  const [color, setColor] = useState('Qora');
  const [material, setMaterial] = useState('Paxta / Koton');
  const [pattern, setPattern] = useState('Bir xil rang');
  const [season, setSeason] = useState('Bahor/Kuz');
  const [targetAudience, setTargetAudience] = useState('Erkaklar');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [newSizeInput, setNewSizeInput] = useState('');
  
  // Pricing and Stock
  const [costPrice, setCostPrice] = useState<number>(100000);
  const [sellingPrice, setSellingPrice] = useState<number>(180000);
  const [stock, setStock] = useState<number>(20);
  const [barcode, setBarcode] = useState<string>(generateBarcodeNumber());

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

  const selectSample = (sample: typeof SAMPLE_CLOTHES[0]) => {
    setImagePreview(sample.url);
    setShortTitle(sample.title);
    setCategory(sample.category);
    setType(sample.type);
    setColor(sample.color);
    setMaterial(sample.material);
    setSeason(sample.season);
    setTargetAudience(sample.audience);
    setSizes(sample.sizes);
    setCostPrice(sample.cost);
    setSellingPrice(sample.price);
    setSkuCode(`TOV-${Math.floor(100 + Math.random() * 900)}`);
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

    // Reset form for next intake
    setShortTitle('');
    setSkuCode(`TOV-${Math.floor(100 + Math.random() * 900)}`);
    setImagePreview('');
    setBarcode(generateBarcodeNumber());
    setBarcodeProduct(saved);
  };

  const netProfitPerItem = sellingPrice - costPrice;
  const profitMarginPercent = sellingPrice > 0 ? ((netProfitPerItem / sellingPrice) * 100).toFixed(1) : '0';
  const totalPotentialProfit = netProfitPerItem * stock;

  const recentProducts = products.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <PackagePlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white">
              Kirim — Kelgan Tovarlarni Kiritish
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Yangi kelgan tovarlar parametrlarini to'ldiring, tannarx va sotuv narxini belgilab omborga qabul qiling
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ombor')}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-colors self-start md:self-auto"
        >
          <span>Ombor Qoldiqlarini Ko'rish</span>
          <ArrowRight className="w-4 h-4 text-emerald-400" />
        </button>
      </div>

      {/* Main Intake Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form Area (Col 8) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Image & Quick Presets Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Upload Box */}
            <div className="md:col-span-5 flex flex-col gap-2">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all min-h-[170px] ${
                  imagePreview
                    ? 'border-emerald-500/50 bg-slate-950/60'
                    : 'border-slate-700 hover:border-emerald-500/50 bg-slate-950/30 hover:bg-slate-950/50'
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
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Rasm yuklash (ixtiyoriy)
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        JPEG, PNG, WEBP
                      </p>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                      Rasm tanlash
                    </span>
                  </div>
                )}
              </div>

              {/* Sample Quick test buttons */}
              <div>
                <p className="text-[10px] font-medium text-slate-400 mb-1">
                  Tezkor to'ldirish uchun namunalar:
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {SAMPLE_CLOTHES.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={() => selectSample(sample)}
                      className="group relative rounded-lg overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all text-left"
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-10 object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-slate-200 font-medium px-1 py-0.5 truncate text-center">
                        {sample.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sof Foyda Calculation Box */}
            <div className="md:col-span-7 flex flex-col justify-center bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Sof Foyda Hisobi (Avtomatik)
                </span>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Rentabellik: {profitMarginPercent}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 text-center mt-2">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">1 dona sotuvdan foyda</span>
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
                  <span className="text-[10px] text-emerald-300/80 block">Partiya Sof Foydasi</span>
                  <span className="text-xs font-black text-emerald-300">
                    +{formatUZS(totalPotentialProfit)}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Jami partiya kirim summasi:</span>
                <span className="font-bold text-amber-300">{formatUZS(costPrice * stock)}</span>
              </div>
            </div>

          </div>

          {/* Intake Form */}
          <form id="kirim-page-form" onSubmit={handleSaveProduct} className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tovar Parametrlari va Narxlari
            </h3>

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
                  placeholder="Klassik kostyum shimi"
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Taxminiy Matosi</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Paxta / Koton"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white outline-none"
                />
              </div>

              {/* Pattern */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rasmi / Printi</label>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Bir xil rang"
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

              {/* Stock (Kirim miqdori) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kirim miqdori (Dona) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="number"
                  min="1"
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

            {/* Sizes Manager */}
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

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black px-6 py-3 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Tovar Kirimini Tasdiqlash & Omborga Qo'shish</span>
              </button>
            </div>

          </form>

        </div>

        {/* Right: Recent Intakes & Quick Metrics (Col 4) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Metrics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Kirim Ko'rsatkichlari
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Jami Tovar Turlari</span>
                <span className="text-base font-bold text-white">{products.length} xil</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Jami Qoldiq</span>
                <span className="text-base font-bold text-emerald-400">
                  {products.reduce((s, p) => s + p.stock, 0)} dona
                </span>
              </div>
            </div>
          </div>

          {/* Recent Intake History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                Oxirgi Kirim Qilinganlar
              </h3>
              <span className="text-[10px] text-slate-500">Ombor</span>
            </div>

            <div className="space-y-2.5">
              {recentProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
                >
                  <img
                    src={p.image_url}
                    alt={p.short_title}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <h6 className="font-bold text-white truncate">{p.short_title}</h6>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-mono text-emerald-400">{p.sku_code}</span>
                      <span>•</span>
                      <span className="text-emerald-300">+{p.stock} dona</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBarcodeProduct(p)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Birka & Shtrix-kod chop etish"
                  >
                    <Barcode className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
