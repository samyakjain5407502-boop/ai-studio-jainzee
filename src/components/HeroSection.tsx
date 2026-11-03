import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { Language } from '../types';
import { STORE_INFO } from '../data/storeData';

interface HeroSectionProps {
  lang: Language;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const [logoErr, setLogoErr] = useState(false);
  const [fssaiErr, setFssaiErr] = useState(false);

  return (
    <section
      id="home"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#121212] px-4 py-20"
    >
      {/* Original Banner Video from https://jainzeefoods-jainzee.vercel.app/static/uploads/main_banner_video.mp4 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src={STORE_INFO.bannerVideoUrl} type="video/mp4" />
          <source
            src="https://jainzeefoods-jainzee.vercel.app/static/uploads/main_banner_video.mp4"
            type="video/mp4"
          />
        </video>
        {/* Single balanced gradient scrim so the video is clearly visible while keeping text crisp */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/60 pointer-events-none"
        />
      </div>

      {/* Centered Hero Content (Matching exact text & elements of jainzeefoods-jainzee.vercel.app) */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Centered Circular Hero Logo (No white box or outer rectangle) */}
        <img
          src={logoErr ? '/static/images/logo.svg' : STORE_INFO.logoUrl}
          alt="Jainzee Logo"
          onError={() => setLogoErr(true)}
          className="mb-5 h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover shadow-2xl ring-1 ring-amber-400/40 block"
        />

        {/* Main Shop Name (Refined weight 600 instead of over-bold 800) */}
        <h1 className="font-display text-3xl sm:text-5xl md:text-[52px] font-semibold text-white tracking-tight leading-[1.15] mb-3 drop-shadow-md">
          {lang === 'hi' ? (
            <>
              जैनज़ी<sup className="text-lg sm:text-2xl align-super ml-0.5">™</sup> फूड प्रोसेसिंग
              इंडस्ट्रीज़
            </>
          ) : (
            <>
              Jainzee<sup className="text-lg sm:text-2xl align-super ml-0.5">™</sup> Food Processing
              Industries
            </>
          )}
        </h1>

        {/* Tagline */}
        <p className="text-base sm:text-xl text-amber-300 font-medium tracking-wide mb-6 drop-shadow-xs">
          {lang === 'hi' ? STORE_INFO.tagline_hi : STORE_INFO.tagline_en}
        </p>

        {/* Official FSSAI & Quality Trust Badge */}
        <div className="mb-8 inline-flex items-center gap-3.5 bg-white/95 backdrop-blur-xs px-5 py-2.5 rounded-xl shadow-lg border border-amber-400/80">
          {!fssaiErr ? (
            <img
              src={STORE_INFO.fssaiLogoUrl}
              alt="FSSAI"
              onError={() => setFssaiErr(true)}
              className="h-7 w-auto object-contain block shrink-0"
            />
          ) : (
            <span className="font-mono font-semibold text-xs text-stone-900">FSSAI</span>
          )}
          <span className="h-6 w-px bg-stone-300 inline-block" aria-hidden="true" />
          <div className="text-left leading-tight">
            <div className="text-emerald-700 font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Certified Food Unit</span>
            </div>
            <div className="text-stone-900 text-xs sm:text-sm font-mono font-semibold tabular-nums mt-0.5">
              Lic. No: {STORE_INFO.fssaiLicense}
            </div>
          </div>
        </div>

        {/* Hero Buttons (Consistent rounded-lg radius, distinct Primary vs Outline style) */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
          <a
            href="#products"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm sm:text-base gpu-transition text-center shadow-md"
          >
            {lang === 'hi' ? 'उत्पाद देखें' : 'Explore Products'}
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-lg bg-black/45 hover:bg-black/65 text-white border border-amber-400/80 font-medium text-sm sm:text-base transition-colors text-center backdrop-blur-xs"
          >
            {lang === 'hi' ? 'संपर्क करें' : 'Contact Us'}
          </a>
        </div>
      </div>
    </section>
  );
};
