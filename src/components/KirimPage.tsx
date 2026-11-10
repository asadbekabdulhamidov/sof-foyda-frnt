import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import type { SizeVariant } from '../types';
import { 
  Upload, 
  Check, 
  DollarSign, 
  Tag, 
  Layers, 
  Camera, 
  RefreshCw,
  X,
  PackagePlus, 
  Barcode, 
  History, 
  TrendingUp, 
  ArrowRight, 
  Plus, 
  Minus 
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
    cost: 130000,
    price: 240000,
    variants: [
      { size: '30', quantity: 5 },
      { size: '32', quantity: 8 },
      { size: '34', quantity: 6 },
      { size: '36', quantity: 4 },
    ],
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
    cost: 110000,
    price: 210000,
    variants: [
      { size: 'S', quantity: 4 },
      { size: 'M', quantity: 8 },
      { size: 'L', quantity: 7 },
      { size: 'XL', quantity: 3 },
    ],
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
    cost: 140000,
    price: 280000,
    variants: [
      { size: 'S', quantity: 3 },
      { size: 'M', quantity: 6 },
      { size: 'L', quantity: 4 },
    ],
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
    cost: 45000,
    price: 95000,
    variants: [
      { size: 'S', quantity: 8 },
      { size: 'M', quantity: 15 },
      { size: 'L', quantity: 12 },
      { size: 'XL', quantity: 5 },
    ],
    url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  },
];

export const KirimPage: React.FC = () => {
  const { addProduct, setBarcodeProduct, products, setActiveTab } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string>('');

  // Form Fields
  const [shortTitle, setShortTitle] = useState('');
  const [skuCode, setSkuCode] = useState(`SHIM-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState("Erkaklar shimi");
  const [type, setType] = useState('Klassik shim');
  const [color, setColor] = useState('Qora');
  const [material, setMaterial] = useState('Jun va viskoza');
  const [pattern] = useState('Bir xil rang');
  const [season, setSeason] = useState('Barcha mavsum');
  const [targetAudience, setTargetAudience] = useState('Erkaklar');
  
  // Size Variants Matrix: Har bir razmer va undan nechtadan kelgani
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([
    { size: '30', quantity: 5 },
    { size: '32', quantity: 8 },
    { size: '34', quantity: 6 },
    { size: '36', quantity: 4 },
  ]);
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeQty, setNewSizeQty] = useState<number>(5);

  // Pricing
  const [costPrice, setCostPrice] = useState<number>(130000);
  const [sellingPrice, setSellingPrice] = useState<number>(240000);
  const [barcode, setBarcode] = useState<string>(generateBarcodeNumber());

  // Total stock is sum of all size quantities
  const totalStock = sizeVariants.reduce((sum, v) => sum + v.quantity, 0);

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
    setSizeVariants(sample.variants.map((v) => ({ ...v })));
    setCostPrice(sample.cost);
    setSellingPrice(sample.price);
    setSkuCode(`TOV-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Add a new size variant
  const handleAddSizeVariant = () => {
    const formatted = newSizeName.trim().toUpperCase();
    if (!formatted) return;

    const existingIndex = sizeVariants.findIndex((v) => v.size === formatted);
    if (existingIndex >= 0) {
      // Increase qty of existing
      setSizeVariants((prev) =>
        prev.map((v, idx) => (idx === existingIndex ? { ...v, quantity: v.quantity + (newSizeQty || 1) } : v))
      );
    } else {
      setSizeVariants((prev) => [...prev, { size: formatted, quantity: Math.max(1, newSizeQty || 1) }]);
    }
    setNewSizeName('');
    setNewSizeQty(5);
  };

  // Update quantity for a specific size
  const handleUpdateVariantQty = (sizeName: string, deltaOrValue: number, isAbsolute: boolean = false) => {
    setSizeVariants((prev) =>
      prev.map((v) => {
        if (v.size === sizeName) {
          const newQty = isAbsolute ? Math.max(0, deltaOrValue) : Math.max(0, v.quantity + deltaOrValue);
          return { ...v, quantity: newQty };
        }
        return v;
      })
    );
  };

  // Remove a size
  const handleRemoveSizeVariant = (sizeName: string) => {
    if (sizeVariants.length <= 1) {
      alert("Kamida bitta razmer bo'lishi kerak!");
      return;
    }
    setSizeVariants((prev) => prev.filter((v) => v.size !== sizeName));
  };

  // Quick preset sizes
  const applyPresetSizes = (type: 'shim' | 'harfli' | 'bolalar') => {
    if (type === 'shim') {
      setSizeVariants([
        { size: '30', quantity: 5 },
        { size: '31', quantity: 5 },
        { size: '32', quantity: 8 },
        { size: '33', quantity: 6 },
        { size: '34', quantity: 6 },
        { size: '36', quantity: 4 },
      ]);
    } else if (type === 'harfli') {
      setSizeVariants([
        { size: 'S', quantity: 4 },
        { size: 'M', quantity: 8 },
        { size: 'L', quantity: 10 },
        { size: 'XL', quantity: 6 },
        { size: '2XL', quantity: 3 },
      ]);
    } else if (type === 'bolalar') {
      setSizeVariants([
        { size: '116', quantity: 4 },
        { size: '122', quantity: 6 },
        { size: '128', quantity: 6 },
        { size: '134', quantity: 4 },
      ]);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortTitle.trim() || !skuCode.trim()) {
      alert("Iltimos, tovar nomi va SKU kodini kiriting!");
      return;
    }

    if (totalStock <= 0) {
      alert("Razmerlar miqdori 0 dan katta bo'lishi kerak!");
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
      sizes: sizeVariants.map((v) => v.size),
      size_variants: sizeVariants,
      short_title: shortTitle,
      sku_code: skuCode,
      cost_price: Number(costPrice) || 0,
      selling_price: Number(sellingPrice) || 0,
      stock: totalStock,
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
  const totalPotentialProfit = netProfitPerItem * totalStock;
  const totalCostAmount = costPrice * totalStock;
  const totalRetailAmount = sellingPrice * totalStock;

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
              Har bir razmer (o'lcham) bo'yicha nechtadan kelganini alohida kiriting va sof foydani avtomatik hisoblang
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
          
          {/* Top Section: Photo + Live Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Upload Box */}
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
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Kiyim rasmi (ixtiyoriy)
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Yuklash uchun bosing
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sample picks */}
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
                      className="w-full h-8 object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-[8px] text-slate-200 font-medium px-1 py-0.5 truncate text-center">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sof Foyda Calculation Box */}
            <div className="md:col-span-7 flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-950 p-4 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Partiya Bo'yicha Sof Foyda Hisobi
                </span>
                <span className="text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Rentabellik: {profitMarginPercent}%
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2.5 text-center my-auto">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">1 donadan sof foyda</span>
                  <span className="text-xs font-black text-emerald-400">
                    +{formatUZS(netProfitPerItem)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Jami kelgan kiyim</span>
                  <span className="text-xs font-bold text-white">
                    {totalStock} dona
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-300/80 block">Kutilayotgan Sof Foyda</span>
                  <span className="text-xs font-black text-emerald-300">
                    +{formatUZS(totalPotentialProfit)}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">
                  Jami xarajat (Tannarx): <strong className="text-amber-300">{formatUZS(totalCostAmount)}</strong>
                </span>
                <span className="text-slate-400">
                  Kutilayotgan sotuv: <strong className="text-blue-300">{formatUZS(totalRetailAmount)}</strong>
                </span>
              </div>
            </div>

          </div>

          {/* Form */}
          <form id="kirim-page-form" onSubmit={handleSaveProduct} className="space-y-5 pt-4 border-t border-slate-800">
            
            {/* General Info */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Tovar Asosiy Ma'lumotlari
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                
                {/* Short Title */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tovar nomi (Kassa va chek uchun) <span className="text-rose-400">*</span>
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
                    placeholder="Jun va viskoza"
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

                {/* Cost Price */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kirim Narxi / Tannarx (1 dona) <span className="text-rose-400">*</span>
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
                    Sotuv Narxi (1 dona) <span className="text-rose-400">*</span>
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

              </div>
            </div>

            {/* 🔥 SIZE & QUANTITY MATRIX (Har bir razmerda nechtadan kelgani) */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Razmerlar va Har Bir Razmer Miqdori (Dona)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Masalan: 30 razmerdan 5 ta, 32 razmerdan 8 ta va h.k.
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-slate-500">Shablonlar:</span>
                  <button
                    type="button"
                    onClick={() => applyPresetSizes('shim')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    👖 Shim (30-36)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetSizes('harfli')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    👕 Harfli (S-2XL)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPresetSizes('bolalar')}
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-lg border border-slate-700"
                  >
                    👶 Bolalar
                  </button>
                </div>
              </div>

              {/* Sizes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {sizeVariants.map((item) => (
                  <div
                    key={item.size}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3 flex flex-col justify-between shadow-xs transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-black text-white bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-lg">
                        {item.size}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeVariant(item.size)}
                        className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                        title="Ushbu razmerni o'chirish"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateVariantQty(item.size, -1)}
                        className="w-7 h-7 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <div className="flex-1 text-center">
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => handleUpdateVariantQty(item.size, Number(e.target.value), true)}
                          className="w-full text-center bg-transparent text-sm font-extrabold text-emerald-400 outline-none"
                        />
                        <span className="text-[9px] text-slate-500 block leading-none">dona</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUpdateVariantQty(item.size, 1)}
                        className="w-7 h-7 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Custom Size Block */}
                <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    + Yangi Razmer
                  </span>
                  
                  <div className="space-y-1.5 my-1">
                    <input
                      type="text"
                      placeholder="Razmer (38, XL)"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSizeVariant();
                        }
                      }}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        placeholder="Miqdor"
                        value={newSizeQty}
                        onChange={(e) => setNewSizeQty(Number(e.target.value))}
                        className="w-16 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-lg px-2 py-1 text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddSizeVariant}
                        className="flex-1 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold py-1 rounded-lg text-xs transition-colors border border-emerald-500/30"
                      >
                        Qo'shish
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Total Summary Row */}
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Tanlangan razmerlar soni: <strong className="text-white">{sizeVariants.length} xil</strong>
                </span>
                <span className="text-slate-300 font-semibold">
                  Jami partiya miqdori: <strong className="text-emerald-400 text-sm font-black">{totalStock} dona</strong>
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Barcha razmerlar va narxlar tekshirildimi?
              </span>

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
              Ombor Qoldiqlari
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
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 group hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={p.image_url}
                        alt={p.short_title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-900 shrink-0"
                      />
                      <div className="min-w-0">
                        <h6 className="text-xs font-bold text-white truncate">{p.short_title}</h6>
                        <span className="text-[10px] font-mono text-emerald-400">{p.sku_code}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setBarcodeProduct(p)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                      title="Birka & Shtrix-kod chop etish"
                    >
                      <Barcode className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Size variants breakdown pills */}
                  <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-800/60">
                    {(p.size_variants || []).map((v) => (
                      <span
                        key={v.size}
                        className="text-[9px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800"
                      >
                        <strong>{v.size}:</strong> {v.quantity} ta
                      </span>
                    ))}
                    <span className="text-[9px] text-emerald-400 font-bold ml-auto">
                      Jami: {p.stock} ta
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
