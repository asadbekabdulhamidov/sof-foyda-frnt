export interface SizeVariant {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  category: string;
  type: string;
  color: string;
  material_estimated: string;
  pattern: string;
  season: string;
  target_audience: string;
  sizes: string[]; // O'lchamlar ro'yxati (masalan: ['S', 'M', 'L', 'XL'])
  size_variants: SizeVariant[]; // Har bir razmerda nechtadan borligi
  short_title: string;
  sku_code: string;
  cost_price: number; // Kirim narxi / Tannarx (UZS)
  selling_price: number; // Sotuv narxi (UZS)
  stock: number; // Jami qoldiq soni (barcha razmerlar yig'indisi)
  image_url: string;
  created_at: string;
  barcode: string;
}

export interface CartItem {
  product: Product;
  selected_size: string;
  quantity: number;
}

export type PaymentMethod = 'naqd' | 'karta' | 'click_payme' | 'nasiya';

export interface Sale {
  id: string;
  receipt_number: string;
  items: CartItem[];
  total_amount: number;
  total_cost: number;
  net_profit: number;
  payment_method: PaymentMethod;
  customer_name?: string;
  customer_phone?: string;
  created_at: string;
}

export type ActiveTab = 'dashboard' | 'ombor' | 'kirim' | 'savdo' | 'sales_history';
