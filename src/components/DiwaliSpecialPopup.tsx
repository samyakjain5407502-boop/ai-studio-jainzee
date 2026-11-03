import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShoppingCart,
  Truck,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Gift,
  Copy,
  Check,
} from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface DiwaliSpecialPopupProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onAddGiftBoxToCart: (quantity: number) => void;
}

export const DiwaliSpecialPopup: React.FC<DiwaliSpecialPopupProps> = ({
  isOpen,
  onClose,
  lang,
  onAddGiftBoxToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeMedia, setActiveMedia] = useState<'video' | 'inside' | 'lid'>('video');

  if (!isOpen) return null;

  const unitPrice = 1350;
  const oldUnitPrice = 1699;
  const totalPrice = unitPrice * quantity;
  // Discounted Diwali Box is capped at ₹1,300 per box (never below ₹1,300)
  const afterCouponUnit = STORE_INFO.minDiwaliBoxPriceAfterDiscount;
  const afterCouponPrice = afterCouponUnit * quantity;

  const handleCopyCoupon = () => {
    try {
      navigator.clipboard.writeText('DIWALI10');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Festive Modal Container */}
      <div className="relative z-10 w-full max-w-3xl bg-[#161311] text-stone-100 border border-amber-400/40 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Festive Gold Ribbon Bar */}
        <div className="px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm tracking-wide">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>
              {lang === 'hi'
                ? 'दिवाली स्पेशल पेशकश • रॉयल मयूर 4-जार ड्राई फ्रूट गिफ्ट बॉक्स'
                : 'DIWALI SPECIAL EDITION • ROYAL PEACOCK 4-JAR GIFT BOX'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Diwali Special Popup"
            className="w-7 h-7 rounded-lg bg-stone-950/15 hover:bg-stone-950/25 flex items-center justify-center text-stone-950 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: Studio-Edited Video Showcase & Gallery Switcher */}
          <div className="md:col-span-6 space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-amber-400/30 bg-stone-900 shadow-lg">
              {activeMedia === 'video' ? (
                <video
                  src={STORE_INFO.diwaliVideoUrl}
                  poster="/images/diwali-gift-box.jpg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : activeMedia === 'inside' ? (
                <img
                  src="/images/diwali-gift-box.jpg"
                  alt="Diwali Special 4-Jar Gift Box Interior"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="/images/diwali-peacock-lid.jpg"
                  alt="Diwali Special Royal Peacock Artwork Lid"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Floating Price Badge */}
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-stone-950/85 backdrop-blur-xs border border-amber-400/40 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs font-semibold text-amber-300">
                  {lang === 'hi' ? 'स्पेशल रेट: ₹1,350' : 'Special Price: ₹1,350'}
                </span>
              </div>

              {/* Free Shipping Badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium flex items-center gap-1">
                <Truck className="w-3 h-3" />
                <span>{lang === 'hi' ? 'फ्री डिलीवरी' : 'Free Delivery'}</span>
              </div>
            </div>

            {/* Media View Switcher */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveMedia('video')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  activeMedia === 'video'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                {lang === 'hi' ? 'वीडियो देखें' : 'Video Showcase'}
              </button>
              <button
                type="button"
                onClick={() => setActiveMedia('inside')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  activeMedia === 'inside'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                {lang === 'hi' ? '4 गोल्ड जार' : '4 Gold Jars'}
              </button>
              <button
                type="button"
                onClick={() => setActiveMedia('lid')}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  activeMedia === 'lid'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-white/5 border-white/10 text-stone-400 hover:text-stone-200'
                }`}
              >
                {lang === 'hi' ? 'मयूर आर्ट बॉक्स' : 'Peacock Lid'}
              </button>
            </div>
          </div>

          {/* Right Column: Details, Pricing, Discount Coupon (Net Rs 1300) & Instant Order CTA */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'सीमित दिवाली स्टॉक' : 'Limited Festive Edition'}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mt-1 leading-tight">
                {lang === 'hi'
                  ? 'रॉयल मयूर 4-जार ड्राई फ्रूट गिफ्ट बॉक्स'
                  : 'Royal Peacock 4-Jar Dry Fruit Gift Box'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
                {lang === 'hi'
                  ? 'सुनहरे साटन लाइनिंग और ब्रास लॉक के साथ प्रीमियम मयूर पैलेस बॉक्स — जिसमें 4 एयरटाइट गोल्ड ग्लास जार (काजू, बादाम, पिस्ता और किशमिश) शामिल हैं।'
                  : 'Handcrafted Peacock Palace keepsake box with brass clasp and golden satin interior, housing 4 airtight gold-lid glass jars of premium Cashews, Almonds, Pistachios & Kishmish.'}
              </p>
            </div>

            {/* Pricing Block */}
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-stone-400 uppercase font-mono">
                  {lang === 'hi' ? 'दिवाली बॉक्स मूल्य' : 'Festive Box Price'}
                </p>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="font-mono text-2xl sm:text-3xl font-semibold text-amber-400 tabular-nums">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-mono text-sm text-stone-500 line-through tabular-nums">
                    ₹{(oldUnitPrice * quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-1.5 bg-stone-900 border border-white/15 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-stone-200 flex items-center justify-center font-mono text-sm cursor-pointer"
                >
                  -
                </button>
                <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(50, q + 1))}
                  className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-stone-200 flex items-center justify-center font-mono text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Coupon Callout (Capped so Diwali Box stays at ₹1,300) */}
            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-300">
                    {lang === 'hi'
                      ? 'फेस्टिव डिस्काउंट कूपन: DIWALI10 / JAINZEE10'
                      : 'Festive Coupon Code: DIWALI10 / JAINZEE10'}
                  </p>
                  <p className="text-stone-300 text-[11px] mt-0.5">
                    {lang === 'hi'
                      ? `कूपन डिस्काउंट के बाद दिवाली बॉक्स: ₹${afterCouponPrice.toLocaleString('en-IN')} (न्यूनतम ₹1,300/बॉक्स)`
                      : `Discounted Festive Box Price: ₹${afterCouponPrice.toLocaleString('en-IN')} (Net ₹1,300/box)`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-2.5 py-1.5 rounded-lg bg-amber-400 text-stone-950 font-mono text-xs font-semibold inline-flex items-center gap-1 hover:bg-amber-300 transition-colors cursor-pointer shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'DIWALI10'}</span>
              </button>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{lang === 'hi' ? '4 एयरटाइट गोल्ड ग्लास जार' : '4 Airtight Gold Glass Jars'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{lang === 'hi' ? 'FSSAI प्रमाणित शुद्धता' : '100% Pure Siyaganj Grade'}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onAddGiftBoxToCart(quantity);
                  onClose();
                }}
                className="w-full py-3 px-5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm inline-flex items-center justify-center gap-2 gpu-transition cursor-pointer shadow-md"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {lang === 'hi'
                    ? `दिवाली गिफ्ट बॉक्स कार्ट में जोड़ें · ₹${totalPrice.toLocaleString('en-IN')}`
                    : `Add Diwali Gift Box to Cart · ₹${totalPrice.toLocaleString('en-IN')}`}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
              >
                {lang === 'hi'
                  ? 'सभी ड्राई फ्रूट्स और नए रेट देखें (काजू 8 ग्रेड, मखाना, बादाम, अखरोट)'
                  : 'Explore All Products & Updated Rates (Cashew 8 Grades, Makhana, Badam)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
