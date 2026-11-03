import React, { useState } from 'react';
import { Leaf, Award, Lock, X } from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface FooterProps {
  lang: Language;
  onOpenAdmin: () => void;
}

type PolicyKey = 'privacy' | 'terms' | 'shipping' | 'replacement' | null;

const POLICIES: Record<Exclude<PolicyKey, null>, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Jainzee™ Food Processing Industries (Siyaganj, Indore) collects only essential delivery and contact information required to process and deliver your dry fruit orders safely.',
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'All products are hygienically processed and packed at our FSSAI Certified facility (Lic. No. 11423850001080) in Siyaganj, Indore.',
    ],
  },
  shipping: {
    title: 'Shipping & Delivery Policy',
    body: [
      'Orders are dispatched from our Siyaganj, Indore facility within 24–48 hours.',
      'Free Delivery is provided on all orders of ₹999 and above. For orders below ₹999, delivery charges are calculated fairly based on the distance in kilometers (km) from Siyaganj, Indore.',
    ],
  },
  replacement: {
    title: 'Replacement & Cancellation Policy (No Refund)',
    body: [
      'Strict No-Refund Policy: Due to food safety and hygiene standards, no monetary refunds are issued once an order is delivered.',
      'Replacement Only With Valid Proof: Product replacement is strictly provided ONLY if you share valid proof — an unedited 360° parcel unboxing video along with clear photos of the damaged or wrong item — on our WhatsApp (+91 97529 37733) within 24 hours of delivery.',
      'Order Cancellation: Orders can only be cancelled prior to dispatch from Siyaganj, Indore.',
    ],
  },
};

export const Footer: React.FC<FooterProps> = ({ lang, onOpenAdmin }) => {
  const [activePolicy, setActivePolicy] = useState<PolicyKey>(null);

  return (
    <>
      <footer className="bg-[#121212] text-stone-300 pt-14 pb-8 border-t border-white/10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
            {/* About Column */}
            <div className="md:col-span-6 space-y-3">
              <h3 className="font-display text-2xl font-semibold text-amber-300">
                {lang === 'hi' ? (
                  <>
                    जैनज़ी<sup className="text-sm">™</sup> फूड प्रोसेसिंग इंडस्ट्रीज़
                  </>
                ) : (
                  <>
                    Jainzee<sup className="text-sm">™</sup> Food Processing Industries
                  </>
                )}
              </h3>
              <p className="text-sm text-stone-400">
                {lang === 'hi'
                  ? 'शुद्ध और प्रीमियम ड्राई फ्रूट्स - सियागंज, इंदौर'
                  : 'Pure & Premium Dry Fruits - Siyaganj, Indore'}
              </p>

              {/* FSSAI Badge */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-3 bg-white/95 px-4 py-2 rounded-lg shadow-sm">
                  <img
                    src={STORE_INFO.fssaiLogoUrl}
                    alt="FSSAI Logo"
                    className="h-7 w-auto block object-contain"
                  />
                  <span className="h-5 w-px bg-stone-300 inline-block" />
                  <div className="text-left leading-tight">
                    <div className="text-[11px] text-emerald-800 font-semibold uppercase">
                      Certified Unit
                    </div>
                    <div className="text-xs font-mono font-semibold text-stone-900">
                      Lic. No. {STORE_INFO.fssaiLicense}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-1 text-xs text-stone-400">
                <p className="flex items-center gap-2">
                  <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>100% Pure, Hygienic &amp; Chemical-Free Siyaganj Dry Fruits</span>
                </p>
                <p className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>A Govt. Registered Trademark Brand | Siyaganj, Indore</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 space-y-2 text-sm">
              <h4 className="font-semibold text-amber-300 mb-3">
                {lang === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
              </h4>
              <ul className="space-y-2 text-stone-400 text-xs sm:text-sm">
                <li>
                  <a href="#home" className="hover:text-amber-300 transition-colors">
                    {lang === 'hi' ? 'होम' : 'Home'}
                  </a>
                </li>
                <li>
                  <a href="#products" className="hover:text-amber-300 transition-colors">
                    {lang === 'hi' ? 'उत्पाद' : 'Products'}
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-amber-300 transition-colors">
                    {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-amber-300 transition-colors">
                    {lang === 'hi' ? 'संपर्क करें' : 'Contact'}
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('privacy')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('terms')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'नियम और शर्तें' : 'Terms & Conditions'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('shipping')}
                    className="hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    {lang === 'hi' ? 'शिपिंग और डिलीवरी नीति' : 'Shipping & Delivery Policy'}
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActivePolicy('replacement')}
                    className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                  >
                    {lang === 'hi'
                      ? 'रिप्लेसमेंट और रद्दीकरण नीति'
                      : 'Replacement & Cancellation Policy'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-3 space-y-2 text-sm">
              <h4 className="font-semibold text-amber-300 mb-3">
                {lang === 'hi' ? 'संपर्क जानकारी' : 'Contact Info'}
              </h4>
              <p className="text-stone-400 text-xs sm:text-sm">
                {lang === 'hi' ? STORE_INFO.address_hi : STORE_INFO.address_en}
              </p>
              <p className="font-mono text-stone-300 text-xs sm:text-sm">{STORE_INFO.phone}</p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
            <p>
              © {new Date().getFullYear()}{' '}
              {lang === 'hi' ? STORE_INFO.brandFull_hi : STORE_INFO.brandFull_en}.{' '}
              {lang === 'hi' ? 'सर्वाधिकार सुरक्षित।' : 'All Rights Reserved.'}
            </p>
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </footer>

      {activePolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setActivePolicy(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-md bg-white border border-stone-200 rounded-xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3">
              <h3 className="font-display text-xl font-semibold text-stone-900">
                {POLICIES[activePolicy].title}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2.5 text-sm text-stone-700 leading-relaxed">
              {POLICIES[activePolicy].body.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
