import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Check, Plus, Minus, Truck } from 'lucide-react';
import { Language, Product } from '../types';

interface ProductDetailModalProps {
  lang: Language;
  product: Product | null;
  initialGradeIndex: number;
  onClose: () => void;
  onAddToCart: (productId: number, gradeIndex: number, quantity: number) => void;
  onAddReview: (
    productId: number,
    author: string,
    city: string,
    rating: number,
    comment: string
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  lang,
  product,
  initialGradeIndex,
  onClose,
  onAddToCart,
  onAddReview,
}) => {
  const [gradeIndex, setGradeIndex] = useState(initialGradeIndex);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  // Review form state
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('Indore, MP');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setGradeIndex(initialGradeIndex);
    setQuantity(1);
    setActiveTab('overview');
    setReviewSubmitted(false);
  }, [product, initialGradeIndex]);

  if (!product) return null;

  const activeGrade = product.grades[gradeIndex] || product.grades[0];
  const linePrice = activeGrade.price * quantity;
  const isFreeShipping = linePrice >= 999;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;
    onAddReview(product.id, authorName.trim(), authorCity.trim() || 'India', rating, reviewText.trim());
    setAuthorName('');
    setReviewText('');
    setReviewSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Modal Container (rounded-xl = 12px outer radius) */}
      <div className="relative z-10 w-full max-w-4xl bg-[#FAF7F2] border border-stone-300 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="font-mono text-stone-800 font-medium">{product.sku}</span>
            <span aria-hidden="true">·</span>
            <span>{lang === 'hi' ? product.origin_hi : product.origin_en}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close product details"
            className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Grid (Sticky Gallery Left, Contiguous Purchase Module Right) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Product Imagery / Video & Nutrition Facts */}
          <div className="md:col-span-5 space-y-4">
            <div
              className="aspect-4/3 w-full rounded-xl overflow-hidden border border-stone-200"
              style={{ backgroundColor: product.fallbackColor }}
            >
              {product.video ? (
                <video
                  src={product.video}
                  poster={product.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={product.image}
                  alt={lang === 'hi' ? product.name_hi : product.name_en}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Tabular Nutrition Facts Per 100g */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 space-y-2.5">
              <p className="text-xs font-mono uppercase tracking-wider text-stone-500">
                {lang === 'hi' ? 'पोषण मूल्य (प्रति 100 ग्राम)' : 'Nutrition Profile (Per 100g)'}
              </p>
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2 rounded-lg bg-[#FAF7F2]">
                  <p className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    {product.nutritionPer100g.energyKcal}
                  </p>
                  <p className="text-[11px] text-stone-500">kcal</p>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF7F2]">
                  <p className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    {product.nutritionPer100g.proteinG}g
                  </p>
                  <p className="text-[11px] text-stone-500">Protein</p>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF7F2]">
                  <p className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    {product.nutritionPer100g.healthyFatsG}g
                  </p>
                  <p className="text-[11px] text-stone-500">Good Fats</p>
                </div>
                <div className="p-2 rounded-lg bg-[#FAF7F2]">
                  <p className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                    {product.nutritionPer100g.fiberG}g
                  </p>
                  <p className="text-[11px] text-stone-500">Fiber</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Reviews */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-stone-900">
                  {lang === 'hi' ? product.name_hi : product.name_en}
                </h2>
                <p className="text-sm text-stone-600 mt-1">
                  {lang === 'hi' ? product.subtitle_hi : product.subtitle_en}
                </p>
              </div>

              {/* Price & Availability Row */}
              <div className="flex flex-wrap items-baseline justify-between gap-2 pt-2 pb-4 border-b border-stone-200">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-2xl font-semibold text-stone-900 tabular-nums">
                    ₹{linePrice.toLocaleString('en-IN')}
                  </span>
                  {activeGrade.oldPrice > activeGrade.price && (
                    <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                      ₹{(activeGrade.oldPrice * quantity).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs text-stone-500">({activeGrade.label})</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-700 font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  {isFreeShipping
                    ? lang === 'hi'
                      ? 'फ्री डिलीवरी उपलब्ध'
                      : 'Free Delivery Included'
                    : lang === 'hi'
                    ? 'डिलीवरी चार्ज: ₹30 (₹999+ पर फ्री)'
                    : 'Delivery: ₹30 (Free on ₹999+)'}
                </span>
              </div>

              {/* Segmented View Switcher: Overview vs Customer Reviews */}
              <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'overview'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lang === 'hi' ? 'विवरण और ग्रेड' : 'Pack Selection & Details'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    activeTab === 'reviews'
                      ? 'bg-white text-stone-900 font-semibold shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {lang === 'hi'
                    ? `ग्राहक समीक्षाएं (${product.reviews.length})`
                    : `Verified Reviews (${product.reviews.length})`}
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="space-y-5 pt-1">
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {lang === 'hi' ? product.description_hi : product.description_en}
                  </p>

                  {/* Grade Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
                      {lang === 'hi' ? 'वजन और ग्रेड चुनें' : 'Select Weight / Grade'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.grades.map((grade, idx) => {
                        const selected = idx === gradeIndex;
                        return (
                          <button
                            key={grade.label}
                            type="button"
                            onClick={() => setGradeIndex(idx)}
                            className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                              selected
                                ? 'bg-white border-[#B45309] ring-1 ring-[#B45309]'
                                : 'bg-white/60 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <p className="text-xs font-semibold text-stone-900">{grade.label}</p>
                            <p className="font-mono text-sm font-semibold text-[#B45309] mt-0.5 tabular-nums">
                              ₹{grade.price.toLocaleString('en-IN')}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity & Primary Purchase CTA */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center border border-stone-300 rounded-lg bg-white h-11">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-full flex items-center justify-center text-stone-700 hover:text-stone-950 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                        className="w-10 h-full flex items-center justify-center text-stone-700 hover:text-stone-950 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onAddToCart(product.id, gradeIndex, quantity);
                        onClose();
                      }}
                      className="flex-1 h-11 px-6 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-stone-950 font-semibold text-sm inline-flex items-center justify-center gap-2 gpu-transition cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {lang === 'hi'
                          ? `बैग में जोड़ें · ₹${linePrice.toLocaleString('en-IN')}`
                          : `Add to Bag · ₹${linePrice.toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center gap-2 text-xs text-stone-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      {lang === 'hi'
                        ? 'FSSAI प्रमाणित (11423850001080) · 10% छूट कोड: JAINZEE10 / DIWALI10'
                        : 'FSSAI Certified (11423850001080) · Use code JAINZEE10 for 10% OFF'}
                    </span>
                  </div>
                </div>
              ) : (
                /* Customer Reviews & Submit Review Tab */
                <div className="space-y-5 pt-1">
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-lg bg-white border border-stone-200 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-stone-900">{rev.author}</span>
                            <span aria-hidden="true" className="text-stone-400">·</span>
                            <span className="text-stone-500">{rev.city}</span>
                          </div>
                          <span className="font-mono text-[11px] text-stone-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {lang === 'hi' ? rev.comment_hi : rev.comment_en}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Write a Review Form */}
                  <form
                    onSubmit={handleSubmitReview}
                    className="p-4 rounded-xl bg-white border border-stone-200 space-y-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                      {lang === 'hi' ? 'अपनी समीक्षा लिखें' : 'Add Your Experience'}
                    </p>
                    {reviewSubmitted && (
                      <p className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        {lang === 'hi'
                          ? 'आपकी समीक्षा सफलतापूर्वक जोड़ दी गई है!'
                          : 'Thank you! Your review has been published.'}
                      </p>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder={lang === 'hi' ? 'आपका नाम' : 'Your Name'}
                        className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                      />
                      <input
                        type="text"
                        value={authorCity}
                        onChange={(e) => setAuthorCity(e.target.value)}
                        placeholder={lang === 'hi' ? 'शहर (जैसे इंदौर)' : 'City (e.g. Indore)'}
                        className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                      />
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="px-3 py-2 text-xs rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                      >
                        <option value={5}>5 Stars — Excellent</option>
                        <option value={4}>4 Stars — Very Good</option>
                        <option value={3}>3 Stars — Good</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder={
                          lang === 'hi'
                            ? 'स्वाद और पैकिंग के बारे में लिखें...'
                            : 'Share your feedback on freshness, kernel size & packaging...'
                        }
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-stone-300 bg-[#FAF7F2] focus:outline-none focus:border-[#B45309]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[#1C1917] text-stone-100 text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                      >
                        {lang === 'hi' ? 'सबमिट करें' : 'Post Review'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
