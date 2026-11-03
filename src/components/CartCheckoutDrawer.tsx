import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  Tag,
  Truck,
  ArrowLeft,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { CartItem, Coupon, Language, Order, Product, StoreSettings } from '../types';
import { calculateKmDeliveryCharge, STORE_INFO } from '../data/storeData';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  cart: CartItem[];
  products: Product[];
  coupons: Coupon[];
  settings: StoreSettings;
  onUpdateQty: (productId: number, gradeIndex: number, delta: number) => void;
  onRemoveItem: (productId: number, gradeIndex: number) => void;
  onClearCart: () => void;
  onPlaceOrder: (order: Order) => void;
}

const KM_PRESETS = [
  { label_en: 'Siyaganj / Central Indore (2 km)', label_hi: 'सियागंज / मध्य इंदौर (2 km)', km: 2 },
  { label_en: 'Vijay Nagar / Palasia / Bhawarkuan (6 km)', label_hi: 'विजय नगर / पलासिया (6 km)', km: 6 },
  { label_en: 'Rau / Rajendra Nagar / Super Corridor (12 km)', label_hi: 'राऊ / राजेंद्र नगर (12 km)', km: 12 },
  { label_en: 'Mhow / Pithampur / Dewas (30 km)', label_hi: 'महू / पीथमपुर / देवास (30 km)', km: 30 },
  { label_en: 'Ujjain / Outside Indore (55 km)', label_hi: 'उज्जैन / इंदौर के बाहर (55 km)', km: 55 },
];

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  cart,
  products,
  coupons,
  settings,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  // Distance in KM from Siyaganj, Indore
  const [distanceKm, setDistanceKm] = useState<number>(4);

  // Guest checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('Indore, MP');
  const [customerPincode, setCustomerPincode] = useState('452001');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Razorpay'>('COD');

  if (!isOpen) return null;

  const activeCoupons = coupons.filter((c) => c.isActive !== false);

  // Build itemized rows
  const detailedItems = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;
      const grade = product.grades[item.gradeIndex] || product.grades[0];
      return {
        ...item,
        product,
        grade,
        lineTotal: grade.price * item.quantity,
      };
    })
    .filter(Boolean) as Array<{
    productId: number;
    gradeIndex: number;
    quantity: number;
    product: Product;
    grade: Product['grades'][0];
    lineTotal: number;
  }>;

  const subtotal = detailedItems.reduce((sum, i) => sum + i.lineTotal, 0);

  // Calculate coupon discount while enforcing that Diwali Special Box (DIW-001) never goes below ₹1,300/box
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percent') {
      discount = detailedItems.reduce((acc, item) => {
        const rawItemDiscount = Math.round(
          (item.lineTotal * appliedCoupon.discountValue) / 100
        );
        if (item.product.sku === 'DIW-001') {
          const minPricePerBox = settings.minDiwaliBoxPriceAfterDiscount || 1300;
          const maxAllowedDiscountPerBox = Math.max(0, item.grade.price - minPricePerBox);
          return acc + Math.min(rawItemDiscount, maxAllowedDiscountPerBox * item.quantity);
        }
        return acc + rawItemDiscount;
      }, 0);

      if (appliedCoupon.maxDiscount) {
        discount = Math.min(discount, appliedCoupon.maxDiscount);
      }
    } else {
      // Flat discount: still ensure any Diwali Box item does not drop below ₹1,300
      const maxTotalAllowedDiscount = detailedItems.reduce((acc, item) => {
        if (item.product.sku === 'DIW-001') {
          const minPricePerBox = settings.minDiwaliBoxPriceAfterDiscount || 1300;
          return acc + Math.max(0, item.grade.price - minPricePerBox) * item.quantity;
        }
        return acc + item.lineTotal;
      }, 0);
      discount = Math.min(appliedCoupon.discountValue, maxTotalAllowedDiscount);
    }
  }

  const freeShippingMin = settings.freeShippingThreshold || STORE_INFO.freeShippingThreshold || 999;
  const isFreeShippingUnlocked = subtotal >= freeShippingMin;
  const amountForFreeShipping = Math.max(0, freeShippingMin - subtotal);

  const kmShippingCharge = calculateKmDeliveryCharge(
    distanceKm,
    settings.perKmRate || STORE_INFO.perKmRate,
    settings.baseDeliveryCharge || STORE_INFO.baseDeliveryCharge
  );

  const shipping = subtotal === 0 ? 0 : isFreeShippingUnlocked ? 0 : kmShippingCharge;

  const total = Math.max(0, subtotal - discount + shipping);

  const handlePincodeChange = (pin: string) => {
    setCustomerPincode(pin);
    const clean = pin.trim();
    if (clean === '452001' || clean === '452002' || clean === '452007') {
      setDistanceKm(2);
    } else if (clean.startsWith('4520')) {
      setDistanceKm(6);
    } else if (clean.startsWith('453')) {
      setDistanceKm(22);
    } else if (clean.startsWith('45') || clean.startsWith('46')) {
      setDistanceKm(55);
    } else if (clean.length === 6) {
      setDistanceKm(120);
    }
  };

  const handleApplyCouponCode = (codeToApply: string) => {
    setCouponError('');
    const normalized = codeToApply.trim().toUpperCase();
    const match = activeCoupons.find((c) => c.code === normalized);
    if (!match) {
      setCouponError(lang === 'hi' ? 'अमान्य कूपन कोड' : 'Invalid coupon code');
      return;
    }
    if (subtotal < match.minOrderAmount) {
      setCouponError(
        lang === 'hi'
          ? `इस कूपन के लिए न्यूनतम ऑर्डर ₹${match.minOrderAmount} होना चाहिए`
          : `Minimum order of ₹${match.minOrderAmount} required for ${match.code}`
      );
      return;
    }
    setAppliedCoupon(match);
    setCouponInput('');
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;

    const newOrder: Order = {
      id: `JZ-${Math.floor(1050 + Math.random() * 8900)}`,
      createdAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Confirmed',
      customer: {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        email: customerEmail.trim(),
        address: customerAddress.trim(),
        city: customerCity.trim(),
        pincode: customerPincode.trim(),
        distanceKm,
      },
      paymentMethod,
      items: detailedItems.map((i) => ({
        productId: i.productId,
        name_en: i.product.name_en,
        name_hi: i.product.name_hi,
        gradeLabel: i.grade.label,
        quantity: i.quantity,
        unitPrice: i.grade.price,
        lineTotal: i.lineTotal,
      })),
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      shipping,
      distanceKm,
      total,
    };

    onPlaceOrder(newOrder);
    onClearCart();
    setStep('cart');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/65 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-lg bg-[#FAF7F2] h-full border-l border-stone-300 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-xl font-semibold text-stone-900">
              {step === 'cart'
                ? lang === 'hi'
                  ? 'आपका शॉपिंग बैग'
                  : 'Your Shopping Bag'
                : lang === 'hi'
                ? 'सीधा गेस्ट चेकआउट (लॉगिन आवश्यक नहीं)'
                : 'Direct Guest Checkout'}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              setStep('cart');
              onClose();
            }}
            aria-label="Close drawer"
            className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Delivery on ₹999+ / KM-Based Delivery Info Bar */}
        {detailedItems.length > 0 && (
          <div className="px-6 py-2.5 bg-stone-900 text-stone-100 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400 shrink-0" />
              {isFreeShippingUnlocked ? (
                <span className="text-emerald-300 font-semibold">
                  {lang === 'hi'
                    ? 'बधाई हो! ₹999+ ऑर्डर पर फ्री डिलीवरी लागू है!'
                    : 'Unlocked: FREE Delivery on orders ₹999 & above!'}
                </span>
              ) : (
                <span>
                  {lang === 'hi'
                    ? `फ्री डिलीवरी के लिए ₹${amountForFreeShipping} और जोड़ें (अभी ${distanceKm} km: ₹${shipping})`
                    : `Add ₹${amountForFreeShipping} more for FREE Delivery (Below ₹999: ${distanceKm} km → ₹${shipping})`}
                </span>
              )}
            </div>
            <span className="font-mono text-xs font-semibold text-amber-300 tabular-nums shrink-0">
              {shipping === 0 ? 'FREE' : `₹${shipping}`}
            </span>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'cart' && (
            <>
              {detailedItems.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="font-display text-2xl font-semibold text-stone-800">
                    {lang === 'hi' ? 'आपका बैग खाली है' : 'Your bag is currently empty'}
                  </p>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    {lang === 'hi'
                      ? 'सियागंज, इंदौर के ताज़ा काजू, बादाम, मखाना, पिस्ता और अखरोट चुनें।'
                      : 'Explore our 8-grade cashews, jumbo makhana, Iranian pistachios, and California almonds.'}
                  </p>
                </div>
              ) : (
                <>
                  {/* Itemized List */}
                  <div className="space-y-3">
                    {detailedItems.map((item) => (
                      <div
                        key={`${item.productId}-${item.gradeIndex}`}
                        className="p-4 rounded-xl bg-white border border-stone-200 flex items-center gap-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name_en}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-stone-900 truncate">
                            {lang === 'hi' ? item.product.name_hi : item.product.name_en}
                          </h3>
                          <p className="text-xs text-stone-500 mt-0.5">{item.grade.label}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <div className="inline-flex items-center border border-stone-300 rounded-md bg-[#FAF7F2] h-7">
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.productId, item.gradeIndex, -1)}
                                className="w-6 h-full flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => onUpdateQty(item.productId, item.gradeIndex, 1)}
                                className="w-6 h-full flex items-center justify-center text-stone-700 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                                ₹{item.lineTotal.toLocaleString('en-IN')}
                              </span>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.productId, item.gradeIndex)}
                                aria-label="Remove item"
                                className="text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Distance (KM) Delivery Calculator Card (Free on ₹999+, KM-based below ₹999) */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                        <MapPin className="w-3.5 h-3.5 text-[#B45309]" />
                        <span>
                          {lang === 'hi'
                            ? 'डिलीवरी दूरी (₹999+ पर FREE, नीचे KM के हिसाब से)'
                            : 'Delivery Distance (FREE on ₹999+, KM-based below ₹999)'}
                        </span>
                      </div>
                      {isFreeShippingUnlocked ? (
                        <span className="font-mono text-xs font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                          FREE (₹999+ Order)
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                          {distanceKm} km → ₹{shipping}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">
                          {lang === 'hi' ? 'एरिया / ज़ोन चुनें' : 'Quick Area Select'}
                        </label>
                        <select
                          value={
                            KM_PRESETS.some((p) => p.km === distanceKm) ? distanceKm : 'custom'
                          }
                          onChange={(e) => {
                            if (e.target.value !== 'custom') {
                              setDistanceKm(Number(e.target.value));
                            }
                          }}
                          className="w-full px-2.5 py-2 text-xs rounded-lg border border-stone-300 bg-[#FAF7F2] text-stone-900 cursor-pointer"
                        >
                          {KM_PRESETS.map((p) => (
                            <option key={p.km} value={p.km}>
                              {lang === 'hi' ? p.label_hi : p.label_en}
                            </option>
                          ))}
                          <option value="custom">
                            {lang === 'hi' ? 'कस्टम दूरी (KM दर्ज करें)' : 'Custom Distance (KM)'}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">
                          {lang === 'hi' ? 'सटीक दूरी (KM में)' : 'Exact Distance (km)'}
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={2000}
                            value={distanceKm}
                            onChange={(e) =>
                              setDistanceKm(Math.max(1, Number(e.target.value) || 1))
                            }
                            className="w-full px-3 py-2 text-xs font-mono font-semibold rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                          />
                          <span className="text-xs font-mono text-stone-500 shrink-0">km</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Module */}
                  <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                      <Tag className="w-3.5 h-3.5 text-[#B45309]" />
                      <span>
                        {lang === 'hi'
                          ? 'डिस्काउंट कूपन कोड लागू करें'
                          : 'Apply Discount Coupon (Diwali Box min ₹1,300)'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={
                          lang === 'hi'
                            ? 'कोड दर्ज करें (JAINZEE10 / DIWALI10)'
                            : 'Enter code (JAINZEE10 or DIWALI10)'
                        }
                        className="flex-1 px-3 py-2 text-xs font-mono uppercase rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCouponCode(couponInput)}
                        className="px-4 py-2 rounded-lg bg-[#1C1917] text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer"
                      >
                        {lang === 'hi' ? 'लागू करें' : 'Apply'}
                      </button>
                    </div>

                    {couponError && <p className="text-xs text-red-600">{couponError}</p>}

                    {/* Quick-Select Coupon Chips */}
                    <div className="space-y-1.5 pt-1">
                      {activeCoupons.map((c) => {
                        const isApplied = appliedCoupon?.code === c.code;
                        return (
                          <div
                            key={c.code}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF7F2] border border-stone-200/80 text-xs"
                          >
                            <div>
                              <span className="font-mono font-semibold text-[#B45309]">
                                {c.code}
                              </span>
                              <p className="text-[11px] text-stone-600 mt-0.5">
                                {lang === 'hi' ? c.title_hi : c.title_en}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                isApplied ? setAppliedCoupon(null) : handleApplyCouponCode(c.code)
                              }
                              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                                isApplied
                                  ? 'bg-emerald-950 text-emerald-200'
                                  : 'bg-white border border-stone-300 text-stone-800 hover:border-[#B45309]'
                              }`}
                            >
                              {isApplied
                                ? lang === 'hi'
                                  ? 'लागू'
                                  : 'Applied'
                                : lang === 'hi'
                                ? 'चुनें'
                                : 'Use'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {step === 'checkout' && (
            <form id="guestCheckoutForm" onSubmit={handleCompleteOrder} className="space-y-4">
              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
                  {lang === 'hi' ? 'डिलीवरी का पता' : '1. Delivery Details (No Account Needed)'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {lang === 'hi' ? 'पूरा नाम *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Samyak Jain"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {lang === 'hi' ? 'मोबाइल नंबर (WhatsApp) *' : 'Phone / WhatsApp *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {lang === 'hi'
                      ? 'पूरा पता (मकान नंबर, कॉलोनी, लैंडमार्क) *'
                      : 'Street Address & Landmark *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="House No, Street, Area"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {lang === 'hi' ? 'शहर *' : 'City *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {lang === 'hi' ? 'पिनकोड *' : 'Pincode *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {lang === 'hi' ? 'दूरी (KM) *' : 'Distance (KM) *'}
                    </label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={distanceKm}
                      onChange={(e) =>
                        setDistanceKm(Math.max(1, Number(e.target.value) || 1))
                      }
                      className="w-full px-3 py-2 text-sm font-mono font-semibold rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {lang === 'hi'
                      ? 'ईमेल (इनवॉइस के लिए वैकल्पिक)'
                      : 'Email (Optional for GST Invoice)'}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                  />
                </div>
              </div>

              {/* Payment Terms Selection */}
              <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
                  {lang === 'hi' ? 'भुगतान का तरीका चुनें' : '2. Select Payment Method'}
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {(
                    [
                      {
                        id: 'COD',
                        title_en: 'Cash on Delivery (COD)',
                        title_hi: 'कैश ऑन डिलीवरी (पार्सल मिलने पर भुगतान)',
                        desc_en:
                          'Pay in cash or UPI at your doorstep upon receiving your sealed pack.',
                      },
                      {
                        id: 'UPI',
                        title_en: 'Instant UPI (GPay / PhonePe / Paytm)',
                        title_hi: 'तुरंत UPI भुगतान (GPay / PhonePe / Paytm)',
                        desc_en: `Direct transfer to ${settings.upiId || STORE_INFO.upiId} · Zero gateway fee.`,
                      },
                      {
                        id: 'Razorpay',
                        title_en: 'Cards & NetBanking (Razorpay Verified)',
                        title_hi: 'कार्ड और नेटबैंकिंग (Razorpay सुरक्षित)',
                        desc_en: 'All credit/debit cards & EMI options supported.',
                      },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                        paymentMethod === opt.id
                          ? 'bg-[#FAF7F2] border-[#B45309] ring-1 ring-[#B45309]'
                          : 'bg-white border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="mt-1 accent-[#B45309]"
                      />
                      <div>
                        <p className="text-xs font-semibold text-stone-900">
                          {lang === 'hi' ? opt.title_hi : opt.title_en}
                        </p>
                        <p className="text-[11px] text-stone-500 mt-0.5">{opt.desc_en}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Drawer Footer: Order Totals & Primary Action */}
        {detailedItems.length > 0 && (
          <div className="p-6 bg-white border-t border-stone-200 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>{lang === 'hi' ? 'उप-योग (Subtotal)' : 'Subtotal'}</span>
                <span className="font-mono tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>
                    {lang === 'hi' ? 'कूपन छूट' : 'Coupon Discount'} ({appliedCoupon?.code})
                  </span>
                  <span className="font-mono tabular-nums">
                    -₹{discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>
                  {shipping === 0
                    ? lang === 'hi'
                      ? 'डिलीवरी चार्ज (₹999+ ऑर्डर पर मुफ्त)'
                      : 'Delivery Charge (Free on ₹999+)'
                    : lang === 'hi'
                    ? `डिलीवरी चार्ज (${distanceKm} km के हिसाब से)`
                    : `Delivery Charge (${distanceKm} km from Siyaganj)`}
                </span>
                <span className="font-mono tabular-nums font-semibold text-emerald-700">
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-base font-semibold text-stone-900">
                <span>{lang === 'hi' ? 'कुल राशि' : 'Total Amount'}</span>
                <span className="font-mono tabular-nums">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-6 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-stone-950 font-semibold text-sm gpu-transition cursor-pointer"
              >
                {lang === 'hi'
                  ? `गेस्ट चेकआउट पर जाएं · ₹${total.toLocaleString('en-IN')}`
                  : `Proceed to Guest Checkout · ₹${total.toLocaleString('en-IN')}`}
              </button>
            ) : (
              <button
                type="submit"
                form="guestCheckoutForm"
                className="w-full py-3.5 px-6 rounded-lg bg-[#1C1917] hover:bg-stone-800 text-amber-300 font-semibold text-sm gpu-transition cursor-pointer"
              >
                {lang === 'hi'
                  ? `ऑर्डर कन्फर्म करें (${paymentMethod}) · ₹${total.toLocaleString('en-IN')}`
                  : `Place Order (${paymentMethod}) · ₹${total.toLocaleString('en-IN')}`}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>FSSAI Lic. {STORE_INFO.fssaiLicense} · Direct Siyaganj Processor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
