import React, { useState } from 'react';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  Package,
  ShoppingCart,
  Trash2,
  LogOut,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  Plus,
  Edit3,
  Tag,
  Settings,
  LayoutDashboard,
  Power,
  ExternalLink,
  Upload,
  Video,
  Image as ImageIcon,
  CreditCard,
  Key,
  Archive,
  RotateCcw,
  Boxes,
  Clock,
  Truck,
  Bell,
  Download,
} from 'lucide-react';
import { Coupon, Order, Product, ProductGrade, StoreSettings } from '../types';
import { STORE_INFO } from '../data/storeData';

interface AuditAndDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onToggleArchiveOrder: (orderId: string) => void;
  onDeleteOrder: (orderId: string) => void;
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onUpdateProductStock: (productId: number, newStock: number, newBasePrice?: number) => void;
  coupons: Coupon[];
  onAddCoupon: (coupon: Coupon) => void;
  onToggleCoupon: (code: string) => void;
  onDeleteCoupon: (code: string) => void;
  settings: StoreSettings;
  onSaveSettings: (newSettings: StoreSettings) => void;
  onOpenDiwaliSpecial: () => void;
}

export const AuditAndDeployModal: React.FC<AuditAndDeployModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  onToggleArchiveOrder,
  onDeleteOrder,
  products,
  onSaveProduct,
  onDeleteProduct,
  onUpdateProductStock,
  coupons,
  onAddCoupon,
  onToggleCoupon,
  onDeleteCoupon,
  settings,
  onSaveSettings,
  onOpenDiwaliSpecial,
}) => {
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('jainzee_admin_pass') || 'Samyak@jn11';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'products' | 'coupons' | 'settings'
  >('dashboard');

  // Orders Tab Filters
  const [orderArchiveFilter, setOrderArchiveFilter] = useState<'active' | 'archived'>('active');
  const [orderStatusTab, setOrderStatusTab] = useState<
    'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered'
  >('all');

  // Quick Stock Modal State
  const [quickStockProduct, setQuickStockProduct] = useState<Product | null>(null);
  const [stockDelta, setStockDelta] = useState<string>('');
  const [stockDirect, setStockDirect] = useState<string>('');
  const [stockNewRate, setStockNewRate] = useState<string>('');

  // Add / Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [pNameEn, setPNameEn] = useState('');
  const [pNameHi, setPNameHi] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pOldPrice, setPOldPrice] = useState('');
  const [pWeight, setPWeight] = useState('');
  const [pSku, setPSku] = useState('');
  const [pStock, setPStock] = useState('100');
  const [pDescEn, setPDescEn] = useState('');
  const [pDescHi, setPDescHi] = useState('');
  const [pImageUrl, setPImageUrl] = useState('');
  const [pVideoUrl, setPVideoUrl] = useState('');
  const [pGrades, setPGrades] = useState<ProductGrade[]>([]);

  // Create Coupon State
  const [cpCode, setCpCode] = useState('');
  const [cpType, setCpType] = useState<'percent' | 'flat'>('percent');
  const [cpValue, setCpValue] = useState('10');
  const [cpMin, setCpMin] = useState('0');
  const [cpExpiry, setCpExpiry] = useState('');
  const [cpLimit, setCpLimit] = useState('0');

  // Settings Form State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passwordInput.trim() === adminPassword ||
      passwordInput.trim() === 'Samyak@jn11'
    ) {
      setIsAuthenticated(true);
      setError('');
      setPasswordInput('');
    } else {
      setError('Invalid Admin Password! Please enter the correct password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setError('');
  };

  // KPIs
  const activeOrders = orders.filter((o) => !o.archived);
  const totalSales = activeOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrdersCount = activeOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing'
  ).length;
  const deliveredOrdersCount = activeOrders.filter((o) => o.status === 'Delivered').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const isArch = Boolean(o.archived);
    if (orderArchiveFilter === 'active' && isArch) return false;
    if (orderArchiveFilter === 'archived' && !isArch) return false;

    const st = o.status.toLowerCase();
    if (orderStatusTab === 'pending') return st === 'pending' || st === 'processing';
    if (orderStatusTab === 'confirmed') return st === 'confirmed';
    if (orderStatusTab === 'shipped') return st === 'shipped' || st === 'dispatched';
    if (orderStatusTab === 'delivered') return st === 'delivered';
    return true;
  });

  // Open Add/Edit Product Modal
  const openEditProductModal = (prod?: Product) => {
    if (prod) {
      setEditingProduct(prod);
      setPNameEn(prod.name_en);
      setPNameHi(prod.name_hi);
      setPPrice(String(prod.grades[0]?.price || 0));
      setPOldPrice(String(prod.grades[0]?.oldPrice || 0));
      setPWeight(prod.subtitle_en);
      setPSku(prod.sku);
      setPStock(String(prod.stock));
      setPDescEn(prod.description_en);
      setPDescHi(prod.description_hi);
      setPImageUrl(prod.image);
      setPVideoUrl(prod.video || '');
      setPGrades(prod.grades.map((g) => ({ ...g })));
    } else {
      setEditingProduct(null);
      setPNameEn('');
      setPNameHi('');
      setPPrice('999');
      setPOldPrice('1199');
      setPWeight('1kg Pack');
      setPSku(`JZ-${Math.floor(100 + Math.random() * 900)}`);
      setPStock('100');
      setPDescEn('');
      setPDescHi('');
      setPImageUrl('/images/cashew.jpeg');
      setPVideoUrl('');
      setPGrades([{ label: '1kg Pack', weightGrams: 1000, price: 999, oldPrice: 1199 }]);
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNameEn.trim()) return;

    const basePriceNum = Number(pPrice) || 999;
    const oldPriceNum = Number(pOldPrice) || Math.round(basePriceNum * 1.2);
    const cleanedGrades: ProductGrade[] =
      pGrades.length > 0
        ? pGrades.map((g) => ({
            label: g.label || '1kg Pack',
            weightGrams: g.weightGrams || 1000,
            price: Number(g.price) || basePriceNum,
            oldPrice: Number(g.oldPrice) || Math.round((Number(g.price) || basePriceNum) * 1.2),
          }))
        : [{ label: pWeight || '1kg Pack', weightGrams: 1000, price: basePriceNum, oldPrice: oldPriceNum }];

    const saved: Product = {
      id: editingProduct ? editingProduct.id : Date.now(),
      sku: pSku.trim() || `JZ-${Date.now()}`,
      category: editingProduct ? editingProduct.category : 'cashews',
      categoryLabel_en: pWeight || '1kg',
      categoryLabel_hi: pWeight || '1kg',
      name_en: pNameEn.trim(),
      name_hi: pNameHi.trim() || pNameEn.trim(),
      subtitle_en: pWeight || '1kg Pack',
      subtitle_hi: pWeight || '1kg पैक',
      description_en: pDescEn.trim() || 'Pure & hygienic Siyaganj dry fruits.',
      description_hi: pDescHi.trim() || pDescEn.trim() || 'शुद्ध और प्रीमियम ड्राई फ्रूट्स।',
      origin_en: 'Siyaganj, Indore',
      origin_hi: 'सियागंज, इंदौर',
      image: pImageUrl.trim() || '/images/cashew.jpeg',
      video: pVideoUrl.trim() || undefined,
      fallbackColor: editingProduct?.fallbackColor || '#F5EFE6',
      stock: Math.max(0, Number(pStock) || 0),
      featuredTag_en: editingProduct?.featuredTag_en || 'Premium',
      featuredTag_hi: editingProduct?.featuredTag_hi || 'प्रीमियम',
      grades: cleanedGrades,
      nutritionPer100g: editingProduct?.nutritionPer100g || {
        energyKcal: 550,
        proteinG: 18,
        healthyFatsG: 44,
        fiberG: 5,
      },
      reviews: editingProduct?.reviews || [],
    };

    onSaveProduct(saved);
    setIsProductModalOpen(false);
  };

  const handleSaveQuickStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickStockProduct) return;
    let nextStock = quickStockProduct.stock;
    if (stockDirect.trim() !== '') {
      nextStock = Math.max(0, Number(stockDirect));
    } else if (stockDelta.trim() !== '') {
      nextStock = Math.max(0, quickStockProduct.stock + Number(stockDelta));
    }
    const nextRate =
      stockNewRate.trim() !== ''
        ? Number(stockNewRate.replace(/[₹,\s]/g, ''))
        : undefined;
    onUpdateProductStock(quickStockProduct.id, nextStock, nextRate);
    setQuickStockProduct(null);
    setStockDelta('');
    setStockDirect('');
    setStockNewRate('');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpCode.trim()) return;
    const code = cpCode.trim().toUpperCase();
    const val = Number(cpValue) || 10;
    const newCp: Coupon = {
      id: Date.now(),
      code,
      title_en:
        cpType === 'percent'
          ? `${val}% OFF Discount Coupon (Diwali Box min ₹1,300)`
          : `Flat ₹${val} OFF Discount Coupon`,
      title_hi:
        cpType === 'percent'
          ? `${val}% छूट कूपन (दिवाली बॉक्स न्यूनतम ₹1,300)`
          : `सीधा ₹${val} की छूट`,
      discountType: cpType,
      discountValue: val,
      minOrderAmount: Number(cpMin) || 0,
      expiryDate: cpExpiry || 'No Expiry',
      usageLimit: Number(cpLimit) || 0,
      usedCount: 0,
      isActive: true,
    };
    onAddCoupon(newCp);
    setCpCode('');
  };

  const handleSaveAllSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(localSettings);
    if (newPasswordInput.trim()) {
      setAdminPassword(newPasswordInput.trim());
      localStorage.setItem('jainzee_admin_pass', newPasswordInput.trim());
      setNewPasswordInput('');
    }
    setSettingsSavedMsg('All Admin Settings & Configurations Saved Successfully!');
    setTimeout(() => setSettingsSavedMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-xs"
        aria-hidden="true"
      />

      {!isAuthenticated ? (
        /* ===== ORIGINAL JAINZEE ADMIN LOGIN CARD (PASSWORD ONLY: Samyak@jn11) ===== */
        <div className="relative z-10 w-full max-w-md bg-[#161311] text-white border border-amber-400/35 rounded-2xl shadow-2xl p-7 sm:p-8 text-center space-y-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-1.5 rounded-full bg-gradient-to-tr from-amber-500/40 via-amber-300/60 to-amber-500/40 shadow-md">
              <img
                src={STORE_INFO.logoUrl}
                alt="Jainzee Admin Logo"
                className="w-20 h-20 rounded-full object-cover block"
              />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-amber-300">
                Jainzee Admin
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">Food Processing Industries</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            {error && (
              <div className="text-xs text-red-300 bg-red-950/70 border border-red-500/40 rounded-lg px-3.5 py-2.5">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="adminPassInput"
                className="block text-xs font-medium text-stone-300 mb-1.5"
              >
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="adminPassInput"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-3 text-sm rounded-xl border border-white/15 bg-white/5 text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm gpu-transition cursor-pointer shadow-md"
            >
              Login
            </button>
          </form>

          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <a
              href="/jainzeefoods-complete.zip"
              download="jainzeefoods-complete.zip"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Project ZIP (VS Code Ready)</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <span>← Back to Website</span>
            </button>
          </div>
        </div>
      ) : (
        /* ===== FULL ORIGINAL JAINZEE ADMIN PANEL (DASHBOARD, ORDERS, PRODUCTS & STOCK, COUPONS, SETTINGS) ===== */
        <div className="relative z-10 w-full max-w-6xl bg-[#FAF7F2] border border-stone-300 rounded-2xl shadow-2xl overflow-hidden h-[92vh] flex flex-col">
          {/* Top Admin Header (Exact Navigation from jainzeefoods-jainzee.vercel.app/admin) */}
          <header className="px-4 sm:px-6 py-3.5 bg-[#141210] text-white border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={STORE_INFO.logoUrl}
                alt="Jainzee Logo"
                className="w-9 h-9 rounded-full object-cover ring-1 ring-amber-400/40"
              />
              <div>
                <span className="font-display text-lg font-semibold text-amber-300 block leading-none">
                  Jainzee Admin Panel
                </span>
                <span className="text-[11px] text-stone-400">
                  Siyaganj, Indore • Full Store Control
                </span>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:bg-white/10'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:bg-white/10'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Orders</span>
                {activeOrders.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold">
                    {activeOrders.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'products'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:bg-white/10'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products &amp; Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('coupons')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'coupons'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:bg-white/10'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Coupons</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:bg-white/10'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>

              <a
                href="/jainzeefoods-complete.zip"
                download="jainzeefoods-complete.zip"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/30 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-300 hover:bg-white/10 inline-flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">View Site</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 hover:bg-white/10 inline-flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </nav>
          </header>

          {/* Main Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* ==================== TAB 1: DASHBOARD ==================== */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                    Dashboard
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDiwaliSpecial();
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#161311] text-amber-300 border border-amber-400/30 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Preview Diwali Special Popup (₹1,350)</span>
                  </button>
                </div>

                {/* LOW STOCK ALERT BANNER */}
                {lowStockProducts.length > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-6 h-6 text-amber-200 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-sm font-semibold block">
                          Critical Low Stock Alert!
                        </strong>
                        <ul className="text-xs text-red-100 list-disc list-inside mt-1">
                          {lowStockProducts.map((lp) => (
                            <li key={lp.id}>
                              {lp.name_en} ({lp.sku}) — Only {lp.stock} packs left
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="px-4 py-2 rounded-lg bg-white text-red-700 font-semibold text-xs shrink-0 cursor-pointer hover:bg-red-50"
                    >
                      + Restock Now
                    </button>
                  </div>
                )}

                {/* 7 KPI STAT CARDS (Matching original site) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Total Sales</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        ₹{totalSales.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-blue-500/15 text-blue-700 flex items-center justify-center shrink-0">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Total Orders</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {activeOrders.length}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-red-500/15 text-red-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Pending Orders</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {pendingOrdersCount}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Delivered Orders</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {deliveredOrdersCount}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Total Products</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {products.length}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs">
                    <div className="w-11 h-11 rounded-lg bg-orange-500/15 text-orange-700 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-500">Low Stock Items</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {lowStockProducts.length}
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab('orders')}
                    className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-3.5 shadow-2xs cursor-pointer hover:border-amber-400 sm:col-span-2"
                  >
                    <div className="w-11 h-11 rounded-lg bg-red-500/15 text-red-700 flex items-center justify-center shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-stone-500">New / Pending Orders</p>
                      <p className="font-mono text-xl font-bold text-stone-900 tabular-nums">
                        {pendingOrdersCount}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-amber-700">View Orders →</span>
                  </div>
                </div>

                {/* Recent Orders & Low Stock Warning Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                    <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
                      <h2 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Recent Orders</span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="p-4">
                      {activeOrders.length === 0 ? (
                        <p className="text-xs text-stone-500 py-6 text-center">
                          No orders placed yet.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {activeOrders.slice(0, 5).map((o) => (
                            <div
                              key={o.id}
                              className="p-3 rounded-lg bg-[#FAF7F2] border border-stone-200/80 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-mono font-bold text-stone-900">#{o.id}</span>{' '}
                                <span className="text-stone-600">• {o.customer.name}</span>
                                <p className="text-[11px] text-stone-500">{o.createdAt}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-semibold text-amber-800 block">
                                  ₹{o.total.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                                  {o.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                    <div className="px-5 py-3.5 border-b border-stone-200 flex items-center justify-between">
                      <h2 className="font-semibold text-sm text-stone-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span>Low Stock Warning (≤ 10)</span>
                      </h2>
                      <button
                        type="button"
                        onClick={() => setActiveTab('products')}
                        className="text-xs font-semibold text-amber-700 hover:underline cursor-pointer"
                      >
                        Manage Stock →
                      </button>
                    </div>
                    <div className="p-4">
                      {lowStockProducts.length === 0 ? (
                        <p className="text-xs text-emerald-700 py-6 text-center">
                          All products are well stocked!
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {lowStockProducts.map((p) => (
                            <div
                              key={p.id}
                              className="p-3 rounded-lg bg-red-50/70 border border-red-200 flex items-center justify-between text-xs"
                            >
                              <div>
                                <p className="font-semibold text-stone-900">{p.name_en}</p>
                                <p className="text-[11px] text-stone-500 font-mono">{p.sku}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-red-700">
                                  {p.stock} left
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuickStockProduct(p);
                                    setStockDirect(String(p.stock));
                                  }}
                                  className="px-2.5 py-1 rounded bg-stone-900 text-white text-[11px] font-medium cursor-pointer"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dashboard Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-left space-y-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ShoppingCart className="w-6 h-6 text-amber-600" />
                    <h3 className="font-semibold text-base text-stone-900">View Orders</h3>
                    <p className="text-xs text-stone-500">
                      Review, confirm and update customer orders
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('products')}
                    className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-left space-y-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Package className="w-6 h-6 text-amber-600" />
                    <h3 className="font-semibold text-base text-stone-900">Manage Products</h3>
                    <p className="text-xs text-stone-500">
                      Add, edit, delete products, update stock &amp; rates
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('settings')}
                    className="p-5 rounded-xl bg-white border border-stone-200 hover:border-amber-400 text-left space-y-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Settings className="w-6 h-6 text-amber-600" />
                    <h3 className="font-semibold text-base text-stone-900">Site Settings</h3>
                    <p className="text-xs text-stone-500">
                      Configure contact info, media, KM delivery, UPI &amp; gateways
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* ==================== TAB 2: CUSTOMER ORDERS ==================== */}
            {activeTab === 'orders' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                    Customer Orders
                  </h1>

                  <div className="flex items-center gap-2">
                    <div className="inline-flex rounded-lg border border-stone-300 bg-white p-0.5">
                      <button
                        type="button"
                        onClick={() => setOrderArchiveFilter('active')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          orderArchiveFilter === 'active'
                            ? 'bg-amber-400 text-stone-950'
                            : 'text-stone-600'
                        }`}
                      >
                        Active Orders ({orders.filter((o) => !o.archived).length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderArchiveFilter('archived')}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer ${
                          orderArchiveFilter === 'archived'
                            ? 'bg-amber-400 text-stone-950'
                            : 'text-stone-600'
                        }`}
                      >
                        Archived ({orders.filter((o) => o.archived).length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: 'all', label: 'All Orders' },
                      { id: 'pending', label: 'New / Pending' },
                      { id: 'confirmed', label: 'Confirmed' },
                      { id: 'shipped', label: 'Shipped' },
                      { id: 'delivered', label: 'Delivered' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOrderStatusTab(t.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                        orderStatusTab === t.id
                          ? 'bg-[#141210] text-amber-300 border-[#141210]'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-2xs">
                  {filteredOrders.length === 0 ? (
                    <div className="p-12 text-center text-stone-500 text-sm">
                      No orders found in this category.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 bg-[#FAF7F2] text-stone-600 uppercase font-mono text-[11px]">
                          <th className="py-3 px-4">Order #</th>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Phone</th>
                          <th className="py-3 px-4">Address &amp; KM</th>
                          <th className="py-3 px-4">Items</th>
                          <th className="py-3 px-4">Total</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-stone-50/80">
                            <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                              #{order.id}
                              <span className="block text-[10px] text-amber-700 font-normal">
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-stone-900">
                              {order.customer.name}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-stone-700">
                              {order.customer.phone}
                            </td>
                            <td className="py-3.5 px-4 text-stone-600 max-w-[200px]">
                              {order.customer.address}, {order.customer.city} -{' '}
                              {order.customer.pincode}
                              {order.distanceKm && (
                                <span className="block font-mono text-[10px] text-amber-800 mt-0.5">
                                  Distance: {order.distanceKm} km (Shipping: ₹{order.shipping})
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-stone-700">
                              {order.items.map((item, idx) => (
                                <div key={idx}>
                                  • {item.name_en} ({item.gradeLabel}) × {item.quantity}
                                </div>
                              ))}
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-800">
                              ₹{order.total.toLocaleString('en-IN')}
                            </td>
                            <td className="py-3.5 px-4 text-stone-500">{order.createdAt}</td>
                            <td className="py-3.5 px-4">
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  onUpdateOrderStatus(
                                    order.id,
                                    e.target.value as Order['status']
                                  )
                                }
                                className="px-2 py-1 rounded border border-stone-300 bg-[#FAF7F2] text-xs font-semibold text-stone-900 cursor-pointer"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onToggleArchiveOrder(order.id)}
                                  title={order.archived ? 'Restore Order' : 'Archive Order'}
                                  className="p-1.5 rounded border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                                >
                                  {order.archived ? (
                                    <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                                  ) : (
                                    <Archive className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteOrder(order.id)}
                                  title="Delete Order"
                                  className="p-1.5 rounded border border-stone-200 hover:bg-red-50 text-red-600 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB 3: PRODUCTS & STOCK ==================== */}
            {activeTab === 'products' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                    Products &amp; Stock Management
                  </h1>
                  <button
                    type="button"
                    onClick={() => openEditProductModal()}
                    className="px-4 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>

                <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-[#FAF7F2] text-stone-600 uppercase font-mono text-[11px]">
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">SKU</th>
                        <th className="py-3 px-4">Grades &amp; Rates (₹)</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-50/80">
                          <td className="py-3 px-4">
                            <img
                              src={prod.image}
                              alt={prod.name_en}
                              className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-sm text-stone-900">{prod.name_en}</p>
                            <p className="text-stone-500">{prod.name_hi}</p>
                          </td>
                          <td className="py-3 px-4 font-mono text-stone-600">{prod.sku}</td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-md">
                              {prod.grades.map((g) => (
                                <span
                                  key={g.label}
                                  className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-stone-200 font-mono text-[11px] text-stone-800"
                                >
                                  {g.label}: <strong>₹{g.price}</strong>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-stone-900">
                            {prod.stock}
                          </td>
                          <td className="py-3 px-4">
                            {prod.stock <= 0 ? (
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold">
                                Out of Stock
                              </span>
                            ) : prod.stock <= 10 ? (
                              <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-semibold">
                                Low Stock
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                In Stock
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setQuickStockProduct(prod);
                                  setStockDirect(String(prod.stock));
                                  setStockNewRate(String(prod.grades[0]?.price || ''));
                                }}
                                className="px-2.5 py-1.5 rounded border border-stone-300 bg-[#FAF7F2] hover:bg-amber-50 text-stone-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Boxes className="w-3.5 h-3.5 text-amber-700" />
                                <span>Stock/Rate</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => openEditProductModal(prod)}
                                className="p-1.5 rounded border border-stone-200 hover:bg-stone-100 text-stone-700 cursor-pointer"
                                title="Edit Product & Grades"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteProduct(prod.id)}
                                className="p-1.5 rounded border border-stone-200 hover:bg-red-50 text-red-600 cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: COUPON MANAGEMENT ==================== */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                  Coupon Management
                </h1>

                {/* Create Coupon Card */}
                <form
                  onSubmit={handleCreateCoupon}
                  className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs"
                >
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-amber-600" />
                    <span>Create Coupon</span>
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        value={cpCode}
                        onChange={(e) => setCpCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SAVE10"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Discount Type</label>
                      <select
                        value={cpType}
                        onChange={(e) => setCpType(e.target.value as 'percent' | 'flat')}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      >
                        <option value="percent">Percentage (%)</option>
                        <option value="flat">Flat Amount (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={cpValue}
                        onChange={(e) => setCpValue(e.target.value)}
                        placeholder="e.g. 10"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Minimum Order Amount (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={cpMin}
                        onChange={(e) => setCpMin(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Expiry Date (optional)
                      </label>
                      <input
                        type="date"
                        value={cpExpiry}
                        onChange={(e) => setCpExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Usage Limit (0 = unlimited)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={cpLimit}
                        onChange={(e) => setCpLimit(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs cursor-pointer"
                  >
                    + Create Coupon
                  </button>
                </form>

                {/* Existing Coupons Table */}
                <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto shadow-2xs">
                  <div className="px-5 py-3.5 border-b border-stone-200">
                    <h2 className="font-semibold text-sm text-stone-900">Existing Coupons</h2>
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-[#FAF7F2] text-stone-600 uppercase font-mono text-[11px]">
                        <th className="py-3 px-4">Code</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Value</th>
                        <th className="py-3 px-4">Min Order</th>
                        <th className="py-3 px-4">Expiry</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {coupons.map((c) => (
                        <tr key={c.code} className="hover:bg-stone-50">
                          <td className="py-3 px-4 font-mono font-bold text-amber-800">{c.code}</td>
                          <td className="py-3 px-4 capitalize">{c.discountType}</td>
                          <td className="py-3 px-4 font-mono font-semibold">
                            {c.discountType === 'percent'
                              ? `${c.discountValue}%`
                              : `₹${c.discountValue}`}
                          </td>
                          <td className="py-3 px-4 font-mono">₹{c.minOrderAmount}</td>
                          <td className="py-3 px-4 text-stone-500">
                            {c.expiryDate || 'No Expiry'}
                          </td>
                          <td className="py-3 px-4">
                            {c.isActive !== false ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-600 font-semibold">
                                Inactive
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onToggleCoupon(c.code)}
                                title="Toggle Active"
                                className="p-1.5 rounded border border-stone-200 hover:bg-amber-50 text-amber-700 cursor-pointer"
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteCoupon(c.code)}
                                title="Delete Coupon"
                                className="p-1.5 rounded border border-stone-200 hover:bg-red-50 text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ==================== TAB 5: SITE SETTINGS (ALL ORIGINAL CARDS) ==================== */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveAllSettings} className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h1 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                    Site Settings
                  </h1>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs cursor-pointer shadow-xs"
                  >
                    Save All Settings
                  </button>
                </div>

                {settingsSavedMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-900 text-emerald-100 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{settingsSavedMsg}</span>
                  </div>
                )}

                {/* 1. Contact Information */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Contact Information</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Address (English)
                      </label>
                      <input
                        type="text"
                        value={localSettings.address_en}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, address_en: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Address (Hindi)
                      </label>
                      <input
                        type="text"
                        value={localSettings.address_hi}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, address_hi: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={localSettings.phone}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={localSettings.whatsappNumber}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={localSettings.email}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, email: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Opening Hours (English)
                      </label>
                      <input
                        type="text"
                        value={localSettings.hours_en}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, hours_en: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Logo, Main Video Banner & Factory Media Upload */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <Video className="w-4 h-4 text-amber-600" />
                    <span>Logo, Main Page Video Banner &amp; Factory Media</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-stone-200 space-y-2">
                      <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
                        <span>Circular Brand Logo</span>
                      </label>
                      <input type="file" accept="image/*" className="text-[11px] w-full" />
                      <p className="text-[11px] text-stone-500">
                        Active: <code>/images/brand-logo-circle.png</code>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-stone-200 space-y-2">
                      <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-amber-700" />
                        <span>Main Page Video Banner</span>
                      </label>
                      <input type="file" accept="video/*" className="text-[11px] w-full" />
                      <p className="text-[11px] text-stone-500">
                        Active: <code>main_banner_video.mp4</code>
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#FAF7F2] border border-stone-200 space-y-2">
                      <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-amber-700" />
                        <span>Diwali Special Video</span>
                      </label>
                      <input type="file" accept="video/*" className="text-[11px] w-full" />
                      <p className="text-[11px] text-stone-500">
                        Active: <code>diwali_special_edited.mp4</code>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Discount, KM-Based Delivery & Payment Settings */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    <span>Discount, KM-Based Delivery &amp; UPI Payment Settings</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Delivery Rate Per KM (₹/km)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={localSettings.perKmRate}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            perKmRate: Number(e.target.value) || 5,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Base Delivery Charge (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={localSettings.baseDeliveryCharge}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            baseDeliveryCharge: Number(e.target.value) || 15,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Diwali Box Min Price After Discount (₹)
                      </label>
                      <input
                        type="number"
                        min={1300}
                        value={localSettings.minDiwaliBoxPriceAfterDiscount}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            minDiwaliBoxPriceAfterDiscount: Math.max(
                              1300,
                              Number(e.target.value) || 1300
                            ),
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        UPI ID (merchant@upi)
                      </label>
                      <input
                        type="text"
                        value={localSettings.upiId}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, upiId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        GSTIN (optional)
                      </label>
                      <input
                        type="text"
                        value={localSettings.gstin}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, gstin: e.target.value })
                        }
                        placeholder="e.g. 23ABCDE1234F1Z5"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">GST Rate (%)</label>
                      <input
                        type="number"
                        min={0}
                        max={28}
                        value={localSettings.gstRatePercent}
                        onChange={(e) =>
                          setLocalSettings({
                            ...localSettings,
                            gstRatePercent: Number(e.target.value) || 5,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Payment Gateway & OTP / SMTP Configuration */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <span>Payment Gateway &amp; OTP Configuration (Razorpay, Twilio, SMTP)</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Razorpay Key ID
                      </label>
                      <input
                        type="text"
                        value={localSettings.razorpayKeyId}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, razorpayKeyId: e.target.value })
                        }
                        placeholder="rzp_live_..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Twilio Account SID
                      </label>
                      <input
                        type="text"
                        value={localSettings.twilioAccountSid}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, twilioAccountSid: e.target.value })
                        }
                        placeholder="ACxxxxxxxx..."
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        SMTP Host &amp; Port
                      </label>
                      <input
                        type="text"
                        value={`${localSettings.smtpHost}:${localSettings.smtpPort}`}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, smtpHost: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Change Admin Password */}
                <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs">
                  <h2 className="font-semibold text-base text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <Key className="w-4 h-4 text-amber-600" />
                    <span>Change Admin Password</span>
                  </h2>
                  <div className="max-w-sm text-xs space-y-2">
                    <label className="block font-medium text-stone-700">
                      New Admin Password (leave blank to keep Samyak@jn11)
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="Enter new password..."
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                    />
                  </div>
                </div>
              </form>
            )}
          </main>

          {/* ===== QUICK STOCK & RATE MODAL ===== */}
          {quickStockProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
              <div className="w-full max-w-sm bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
                  <h3 className="font-semibold text-base text-stone-900">
                    Update Stock &amp; Rate — {quickStockProduct.name_en}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setQuickStockProduct(null)}
                    className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveQuickStock} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-500 mb-1">
                      Current Stock: <strong>{quickStockProduct.stock}</strong>
                    </label>
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Add / Remove Stock (+/-)
                    </label>
                    <input
                      type="number"
                      value={stockDelta}
                      onChange={(e) => {
                        setStockDelta(e.target.value);
                        setStockDirect('');
                      }}
                      placeholder="e.g. 50 to add, -10 to remove"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Or Set New Stock Directly
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={stockDirect}
                      onChange={(e) => {
                        setStockDirect(e.target.value);
                        setStockDelta('');
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Update Base Grade Rate (₹)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={stockNewRate}
                      onChange={(e) => setStockNewRate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold cursor-pointer"
                    >
                      Save Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuickStockProduct(null)}
                      className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ===== ADD / EDIT PRODUCT & GRADES MODAL ===== */}
          {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65">
              <div className="w-full max-w-2xl bg-white rounded-xl border border-stone-200 p-6 space-y-4 shadow-2xl max-h-[88vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <h3 className="font-display text-xl font-semibold text-stone-900">
                    {editingProduct ? `Edit Product — ${editingProduct.name_en}` : 'Add New Product'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Product Name (English) *
                      </label>
                      <input
                        type="text"
                        required
                        value={pNameEn}
                        onChange={(e) => setPNameEn(e.target.value)}
                        placeholder="e.g. Premium Cashew"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Product Name (Hindi) *
                      </label>
                      <input
                        type="text"
                        value={pNameHi}
                        onChange={(e) => setPNameHi(e.target.value)}
                        placeholder="e.g. प्रीमियम काजू"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Base Rate / Price (₹)
                      </label>
                      <input
                        type="number"
                        value={pPrice}
                        onChange={(e) => setPPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Old Price / MRP (₹)
                      </label>
                      <input
                        type="number"
                        value={pOldPrice}
                        onChange={(e) => setPOldPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Weight / Pack Subtitle
                      </label>
                      <input
                        type="text"
                        value={pWeight}
                        onChange={(e) => setPWeight(e.target.value)}
                        placeholder="e.g. 500g / 1kg"
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={pSku}
                        onChange={(e) => setPSku(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={pStock}
                        onChange={(e) => setPStock(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">
                        Image URL
                      </label>
                      <input
                        type="text"
                        value={pImageUrl}
                        onChange={(e) => setPImageUrl(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">
                      Description (English)
                    </label>
                    <textarea
                      rows={2}
                      value={pDescEn}
                      onChange={(e) => setPDescEn(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-[#FAF7F2]"
                    />
                  </div>

                  {/* Grading Options (W400, Wmix, W320, etc.) */}
                  <div className="space-y-2 pt-2 border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-stone-800">
                        Grading Options &amp; Grade Prices (₹)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setPGrades([
                            ...pGrades,
                            { label: 'New Grade (1kg)', weightGrams: 1000, price: 999, oldPrice: 1199 },
                          ])
                        }
                        className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-semibold cursor-pointer"
                      >
                        + Add Grade Row
                      </button>
                    </div>

                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {pGrades.map((g, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={g.label}
                            onChange={(e) => {
                              const next = [...pGrades];
                              next[idx] = { ...next[idx], label: e.target.value };
                              setPGrades(next);
                            }}
                            placeholder="Grade name (e.g. W320 Grade)"
                            className="flex-1 px-2.5 py-1.5 rounded border border-stone-300 bg-[#FAF7F2]"
                          />
                          <input
                            type="number"
                            value={g.price}
                            onChange={(e) => {
                              const next = [...pGrades];
                              next[idx] = { ...next[idx], price: Number(e.target.value) || 0 };
                              setPGrades(next);
                            }}
                            placeholder="Price ₹"
                            className="w-28 px-2.5 py-1.5 rounded border border-stone-300 bg-[#FAF7F2] font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setPGrades(pGrades.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded border border-stone-200 text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-stone-200">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold cursor-pointer"
                    >
                      Save Product
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-5 py-2.5 rounded-lg border border-stone-300 text-stone-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
