import React from 'react';
import {
  Leaf,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  Store,
  Phone,
  Clock,
  Mail,
  Award,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface RoasteryAndStorySectionProps {
  lang: Language;
}

export const RoasteryAndStorySection: React.FC<RoasteryAndStorySectionProps> = ({ lang }) => {
  return (
    <>
      {/* ===== WHY CHOOSE US (Exact text from jainzeefoods-jainzee.vercel.app) ===== */}
      <section className="py-16 sm:py-20 bg-[#121212] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white inline-block relative pb-3">
              {lang === 'hi' ? 'जैनज़ी को क्यों चुनें?' : 'Why Choose Jainzee?'}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-amber-400 rounded-full" />
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-7 text-center hover:bg-white/10 gpu-transition">
              <div className="w-12 h-12 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {lang === 'hi' ? '100% शुद्ध' : '100% Pure'}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {lang === 'hi'
                  ? 'कोई मिलावट नहीं, सिर्फ शुद्ध और प्राकृतिक सूखे मेवे'
                  : 'No adulteration, only pure & natural dry fruits'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-7 text-center hover:bg-white/10 gpu-transition">
              <div className="w-12 h-12 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {lang === 'hi' ? 'स्वच्छ प्रसंस्करण' : 'Hygienic Processing'}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {lang === 'hi'
                  ? 'आधुनिक खाद्य-ग्रेड प्रसंस्करण सुविधा'
                  : 'Modern food-grade processing facility'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-7 text-center hover:bg-white/10 gpu-transition">
              <div className="w-12 h-12 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {lang === 'hi' ? 'सर्वोत्तम मूल्य' : 'Best Prices'}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {lang === 'hi'
                  ? 'सीधे प्रोसेसर से, कोई बिचौलिया नहीं'
                  : 'Direct from processor, no middlemen'}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-7 text-center hover:bg-white/10 gpu-transition">
              <div className="w-12 h-12 rounded-lg bg-amber-400/15 text-amber-300 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {lang === 'hi' ? 'थोक एवं खुदरा' : 'Bulk & Retail'}
              </h3>
              <p className="text-sm text-stone-300 leading-relaxed">
                {lang === 'hi'
                  ? 'घर, व्यवसाय और थोक ऑर्डर के लिए उपलब्ध'
                  : 'Available for home, business & bulk orders'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION (Aesthetic Circular Brand Logo Card + Original About Copy) ===== */}
      <section id="about" className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Aesthetic Heritage Medallion Card with Circular Jainzee Logo */}
            <div className="rounded-2xl bg-gradient-to-br from-[#181512] via-[#211C17] to-[#12100E] border border-amber-400/30 min-h-[300px] flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden p-8">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 50% 40%, rgba(251, 191, 36, 0.35), transparent 65%)',
                }}
              />

              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-amber-500/40 via-amber-300/60 to-amber-500/40 shadow-lg">
                  <img
                    src={STORE_INFO.logoUrl}
                    alt="Jainzee Circular Brand Emblem"
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover block"
                  />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-medium">
                    <Leaf className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {lang === 'hi'
                        ? 'सियागंज, इंदौर की शुद्धता की पहचान'
                        : 'Siyaganj, Indore • Pure & Premium'}
                    </span>
                  </div>
                  <p className="font-display text-lg sm:text-xl font-semibold text-white pt-1">
                    {lang === 'hi' ? STORE_INFO.brandFull_hi : STORE_INFO.brandFull_en}
                  </p>
                  <p className="font-mono text-xs text-stone-400">
                    FSSAI Certified Unit • Lic. No. {STORE_INFO.fssaiLicense}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900">
                {lang === 'hi' ? 'जैनज़ी के बारे में' : 'About Jainzee'}
              </h2>
              <p className="text-stone-700 text-base leading-relaxed">
                {lang === 'hi' ? STORE_INFO.about_hi : STORE_INFO.about_en}
              </p>
              <ul className="space-y-3 pt-1">
                <li className="flex items-center gap-3 text-stone-800 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'hi'
                      ? 'प्रीमियम गुणवत्ता वाले सूखे मेवे'
                      : 'Premium quality dry fruits'}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'hi' ? 'स्वच्छ खाद्य प्रसंस्करण' : 'Hygienic food processing'}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'hi'
                      ? 'हजारों ग्राहकों का भरोसा'
                      : 'Trusted by thousands of customers'}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-stone-800 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    {lang === 'hi' ? 'थोक एवं खुदरा उपलब्ध' : 'Wholesale & retail available'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION (Exact 5 cards from jainzeefoods-jainzee.vercel.app) ===== */}
      <section id="contact" className="py-16 sm:py-20 bg-[#F3EFE6] border-t border-stone-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 inline-block relative pb-3">
              {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-amber-400 rounded-full" />
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-3">
              {lang === 'hi'
                ? 'हमारे स्टोर पर आएं या हमसे संपर्क करें'
                : 'Visit our store or get in touch with us'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {/* 1. Our Address */}
            <div className="bg-white rounded-xl p-6 text-center border border-stone-200/90 shadow-2xs flex flex-col items-center justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-400/15 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <Store className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-stone-900">
                  {lang === 'hi' ? 'हमारा पता' : 'Our Address'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600">
                  {lang === 'hi' ? STORE_INFO.address_hi : STORE_INFO.address_en}
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Siyaganj,Indore"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'मानचित्र पर देखें' : 'View on Map'}</span>
              </a>
            </div>

            {/* 2. Call Us */}
            <div className="bg-white rounded-xl p-6 text-center border border-stone-200/90 shadow-2xs flex flex-col items-center justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-lg bg-amber-400/15 text-amber-700 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base text-stone-900">
                  {lang === 'hi' ? 'कॉल करें' : 'Call Us'}
                </h3>
                <p className="font-mono text-sm font-semibold text-stone-800 tabular-nums">
                  {STORE_INFO.phone}
                </p>
              </div>
              <a
                href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors w-full"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'व्हाट्सएप करें' : 'WhatsApp Us'}</span>
              </a>
            </div>

            {/* 3. Opening Hours */}
            <div className="bg-white rounded-xl p-6 text-center border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 text-amber-700 flex items-center justify-center mx-auto mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-stone-900">
                {lang === 'hi' ? 'खुलने का समय' : 'Opening Hours'}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                {lang === 'hi' ? STORE_INFO.hours_hi : STORE_INFO.hours_en}
              </p>
            </div>

            {/* 4. Email Us */}
            <div className="bg-white rounded-xl p-6 text-center border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 text-amber-700 flex items-center justify-center mx-auto mb-1">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-stone-900">
                {lang === 'hi' ? 'ईमेल करें' : 'Email Us'}
              </h3>
              <p className="font-mono text-xs sm:text-sm text-stone-600">{STORE_INFO.email}</p>
            </div>

            {/* 5. FSSAI Certified */}
            <div className="bg-white rounded-xl p-6 text-center border border-stone-200/90 shadow-2xs flex flex-col items-center justify-center space-y-1.5">
              <div className="w-10 h-10 rounded-lg bg-amber-400/15 text-amber-700 flex items-center justify-center mx-auto mb-1">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base text-stone-900">FSSAI Certified</h3>
              <p className="font-mono text-xs font-semibold text-stone-800">
                Lic. No: {STORE_INFO.fssaiLicense}
              </p>
              <p className="text-xs text-stone-500">100% Pure, Hygienic &amp; Chemical-Free</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
