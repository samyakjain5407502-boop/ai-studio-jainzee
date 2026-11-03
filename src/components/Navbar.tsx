import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  Truck,
  Share2,
  Lock,
  Home,
  Package,
  Info,
  Mail,
  Sparkles,
  Tag,
} from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAdmin: () => void;
  onOpenDiwaliSpecial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  cartCount,
  onOpenCart,
  onOpenTracker,
  onOpenAdmin,
  onOpenDiwaliSpecial,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out Jainzee Food Processing Industries - Premium Dry Fruits!\n\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#121212]/95 backdrop-blur-md border-b border-white/10 text-white">
        {/* Top Offer & Shipping Announcement Bar */}
        <div className="bg-emerald-900/95 border-b border-white/10 text-stone-100 text-[11px] sm:text-xs font-medium py-1.5 px-3">
          <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-center sm:justify-between gap-2 text-center">
            <div className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {lang === 'hi'
                  ? '10% छूट कूपन: JAINZEE10 / DIWALI10 • ₹999+ पर फ्री डिलीवरी (नीचे KM के हिसाब से)'
                  : '10% OFF Code: JAINZEE10 / DIWALI10 • FREE Delivery on ₹999+ (Below ₹999: KM-based)'}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenDiwaliSpecial}
              className="hidden sm:inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === 'hi'
                  ? 'दिवाली स्पेशल गिफ्ट बॉक्स @ ₹1,350 देखें'
                  : 'Watch Diwali Special Gift Box @ ₹1,350'}
              </span>
            </button>
          </div>
        </div>

        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: Hamburger (Mobile) + Perfectly Aligned Logo & Site Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Menu"
              className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 bg-white/5 text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#home"
              className="flex items-center gap-3 min-w-0 group focus-visible:outline-none"
            >
              <img
                src={imgError ? '/static/images/logo.svg' : STORE_INFO.logoUrl}
                alt="Jainzee Logo"
                onError={() => setImgError(true)}
                className="h-10 w-10 rounded-full object-cover ring-1 ring-amber-400/30 shrink-0 block"
              />
              <span className="font-sans text-sm sm:text-base md:text-lg font-semibold tracking-tight text-white truncate leading-none flex items-baseline">
                {lang === 'hi' ? (
                  <>
                    जैनज़ी<sup className="text-[10px] ml-0.5 mr-1">™</sup> फूड प्रोसेसिंग इंडस्ट्रीज़
                  </>
                ) : (
                  <>
                    Jainzee<sup className="text-[10px] ml-0.5 mr-1">™</sup> Food Processing Industries
                  </>
                )}
              </span>
            </a>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-stone-300">
            <a href="#home" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              {lang === 'hi' ? 'होम' : 'Home'}
            </a>
            <a href="#products" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              {lang === 'hi' ? 'उत्पाद' : 'Products'}
            </a>
            <button
              type="button"
              onClick={onOpenDiwaliSpecial}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-300 hover:bg-amber-400/25 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'दिवाली स्पेशल ₹1,350' : 'Diwali Special ₹1,350'}</span>
            </button>
            <a href="#about" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
            </a>
            <a href="#contact" className="hover:text-amber-400 transition-colors whitespace-nowrap">
              {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
            </a>
          </nav>

          {/* Right: Action Buttons with Consistent 8px (rounded-lg) Radius & Clean Hierarchy */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Diwali Button on Mobile/Tablet */}
            <button
              type="button"
              onClick={onOpenDiwaliSpecial}
              className="xl:hidden inline-flex items-center gap-1 px-2.5 py-2 rounded-lg border border-amber-400/40 bg-amber-400/15 hover:bg-amber-400/25 text-xs font-semibold text-amber-300 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'दिवाली ₹1,350' : 'Diwali ₹1,350'}
              </span>
            </button>

            {/* Language Toggle */}
            <div className="hidden md:flex items-center bg-white/10 p-0.5 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  lang === 'hi'
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Share Button (Desktop) */}
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-stone-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'hi' ? 'शेयर करें' : 'Share'}</span>
            </button>

            {/* Track Order Button */}
            <button
              type="button"
              onClick={onOpenTracker}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-stone-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Order'}
              </span>
              <span className="sm:hidden">{lang === 'hi' ? 'ऑर्डर' : 'Orders'}</span>
            </button>


            {/* Primary Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs sm:text-sm font-semibold gpu-transition cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{lang === 'hi' ? 'कार्ट' : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-md bg-stone-950 text-amber-300 font-mono text-xs font-semibold tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Hamburger Sidebar Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/65 backdrop-blur-xs"
          />

          <div className="relative w-72 max-w-[85vw] bg-[#121212] text-white h-full border-r border-white/10 flex flex-col justify-between z-10 shadow-2xl">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={imgError ? '/static/images/logo.svg' : STORE_INFO.logoUrl}
                  alt="Jainzee Logo"
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-amber-400/30 shrink-0"
                />
                <span className="text-xs font-semibold text-amber-300 truncate">
                  {lang === 'hi' ? STORE_INFO.brandFull_hi : STORE_INFO.brandFull_en}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Links */}
            <nav className="p-3 flex-1 overflow-y-auto space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDiwaliSpecial();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 cursor-pointer mb-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'दिवाली स्पेशल बॉक्स @ ₹1,350' : 'Diwali Special Box @ ₹1,350'}</span>
              </button>

              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/10"
              >
                <Home className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'होम' : 'Home'}</span>
              </a>
              <a
                href="#products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/10"
              >
                <Package className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'उत्पाद' : 'Products'}</span>
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/10"
              >
                <Info className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'हमारे बारे में' : 'About Us'}</span>
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/10"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracker();
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-stone-200 hover:bg-white/10 cursor-pointer"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>{lang === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Order'}</span>
              </button>
            </nav>

            {/* Sidebar Footer Extras */}
            <div className="p-4 border-t border-white/10 space-y-2.5">
              <div className="flex bg-white/10 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                    lang === 'en' ? 'bg-amber-400 text-stone-950 font-semibold' : 'text-stone-300'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                    lang === 'hi' ? 'bg-amber-400 text-stone-950 font-semibold' : 'text-stone-300'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 px-4 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-medium text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'hi' ? 'शेयर करें' : 'Share on WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
