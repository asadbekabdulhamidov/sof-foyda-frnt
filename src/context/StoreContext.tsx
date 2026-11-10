import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, CartItem, Sale, PaymentMethod, ActiveTab } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';

interface StoreContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, delta: number) => void;
  clearCart: () => void;
  
  sales: Sale[];
  completeSale: (paymentMethod: PaymentMethod, customerName?: string, customerPhone?: string) => Sale | null;
  
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Modals state
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  barcodeProduct: Product | null;
  setBarcodeProduct: (product: Product | null) => void;
  lastSaleReceipt: Sale | null;
  setLastSaleReceipt: (sale: Sale | null) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;

  // Financial Metrics
  metrics: {
    totalRevenue: number;
    totalCost: number;
    totalNetProfit: number;
    profitMargin: number;
    totalInventoryCost: number;
    totalInventoryRetail: number;
    potentialInventoryProfit: number;
    totalItemsInStock: number;
    todaySalesCount: number;
    todayNetProfit: number;
  };

  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('sof_foyda_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PRODUCTS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const saved = localStorage.getItem('sof_foyda_sales');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'sale-1',
        receipt_number: 'SF-1001',
        items: [
          {
            product: INITIAL_PRODUCTS[0],
            selected_size: '32',
            quantity: 1,
          },
          {
            product: INITIAL_PRODUCTS[1],
            selected_size: 'L',
            quantity: 1,
          },
        ],
        total_amount: 450000,
        total_cost: 240000,
        net_profit: 210000,
        payment_method: 'click_payme',
        customer_name: 'Alisher Qodirov',
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [barcodeProduct, setBarcodeProduct] = useState<Product | null>(null);
  const [lastSaleReceipt, setLastSaleReceipt] = useState<Sale | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sof_foyda_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sof_foyda_sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (newProdData: Omit<Product, 'id' | 'created_at'>): Product => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...newProdData,
      id,
      created_at: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addToCart = (product: Product, size?: string) => {
    const chosenSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Standart');
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id && item.selected_size === chosenSize
      );
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.selected_size === chosenSize
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, selected_size: chosenSize, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selected_size === size)
      )
    );
  };

  const updateCartQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selected_size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const completeSale = (
    paymentMethod: PaymentMethod,
    customerName?: string,
    customerPhone?: string
  ): Sale | null => {
    if (cart.length === 0) return null;

    let totalAmount = 0;
    let totalCost = 0;

    cart.forEach((item) => {
      totalAmount += item.product.selling_price * item.quantity;
      totalCost += item.product.cost_price * item.quantity;
    });

    const netProfit = totalAmount - totalCost;
    const receiptNumber = `SF-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      receipt_number: receiptNumber,
      items: [...cart],
      total_amount: totalAmount,
      total_cost: totalCost,
      net_profit: netProfit,
      payment_method: paymentMethod,
      customer_name: customerName,
      customer_phone: customerPhone,
      created_at: new Date().toISOString(),
    };

    // Decrease product stock
    setProducts((prev) =>
      prev.map((prod) => {
        const cartQty = cart
          .filter((item) => item.product.id === prod.id)
          .reduce((sum, item) => sum + item.quantity, 0);
        if (cartQty > 0) {
          return { ...prod, stock: Math.max(0, prod.stock - cartQty) };
        }
        return prod;
      })
    );

    setSales((prev) => [newSale, ...prev]);
    setCart([]);
    setLastSaleReceipt(newSale);
    return newSale;
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSales([]);
    setCart([]);
    localStorage.removeItem('sof_foyda_products');
    localStorage.removeItem('sof_foyda_sales');
  };

  // Metrics computation
  const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0);
  const totalCost = sales.reduce((sum, s) => sum + s.total_cost, 0);
  const totalNetProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (totalNetProfit / totalRevenue) * 100 : 0;

  const totalInventoryCost = products.reduce((sum, p) => sum + p.cost_price * p.stock, 0);
  const totalInventoryRetail = products.reduce((sum, p) => sum + p.selling_price * p.stock, 0);
  const potentialInventoryProfit = totalInventoryRetail - totalInventoryCost;
  const totalItemsInStock = products.reduce((sum, p) => sum + p.stock, 0);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter((s) => s.created_at.slice(0, 10) === todayStr);
  const todaySalesCount = todaySales.length;
  const todayNetProfit = todaySales.reduce((sum, s) => sum + s.net_profit, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        sales,
        completeSale,
        activeTab,
        setActiveTab,
        isAddModalOpen,
        setIsAddModalOpen,
        barcodeProduct,
        setBarcodeProduct,
        lastSaleReceipt,
        setLastSaleReceipt,
        isSettingsOpen,
        setIsSettingsOpen,
        metrics: {
          totalRevenue,
          totalCost,
          totalNetProfit,
          profitMargin,
          totalInventoryCost,
          totalInventoryRetail,
          potentialInventoryProfit,
          totalItemsInStock,
          todaySalesCount,
          todayNetProfit,
        },
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
