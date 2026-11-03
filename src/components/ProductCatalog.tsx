import React, { useState, useMemo } from 'react';
import {
  Search,
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  MessageSquare,
  CheckCircle2,
  Flame,
  Scale,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react';
import { Language, Product } from '../types';

interface ProductCatalogProps {
  lang: Language;
  products: Product[];
  wishlistIds: number[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (productId: number, gradeIndex: number, quantity: number) => void;
  onSelectProduct: (product: Product, initialGradeIndex: number) => void;
  onOpenDiwaliSpecial: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  lang,
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onOpenDiwaliSpecial,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [wishlistOnly, setWishlistOnly] = useState<boolean>(false);

  const [selectedGrades, setSelectedGrades] = useState<Record<number, number>>({});
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const getGradeIndex = (product: Product) => selectedGrades[product.id] ?? 0;
  const getQty = (productId: number) => quantities[productId] || 1;

  const handleGradeChange = (productId: number, idx: number) => {
    setSelectedGrades((prev) => ({ ...prev, [productId]: idx }));
  };

  const handleQtyChange = (productId: number, delta: number, maxStock: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, Math.min(maxStock || 999, current + delta));
      return { ...prev, [productId]: next };
    });
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const minVal = parseFloat(minPrice);
    const maxVal = parseFloat(maxPrice);

    return products.filter((p) => {
      if (q) {
        const haystack = `${p.name_en} ${p.name_hi} ${p.subtitle_en}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      const activeIdx = selectedGrades[p.id] ?? 0;
      const basePrice = p.grades[activeIdx]?.price || p.grades[0]?.price || 0;
      if (!isNaN(minVal) && basePrice < minVal) return false;
      if (!isNaN(maxVal) && basePrice > maxVal) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (wishlistOnly && !wishlistIds.includes(p.id)) return false;
      return true;
    });
  }, [products, searchQuery, minPrice, maxPrice, inStockOnly, wishlistOnly, wishlistIds, selectedGrades]);

  return (
    <section id="products" className="py-16 sm:py-20 bg-[#FAF7F2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Header (Exact text from jainzeefoods-jainzee.vercel.app) */}
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 inline-block relative pb-3">
            {lang === 'hi' ? 'हमारे प्रीमियम उत्पाद' : 'Our Premium Products'}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-amber-400 rounded-full" />
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-3">
            {lang === 'hi'
              ? 'हाथ से चुने, स्वच्छ प्रसंस्कृत एवं प्रीमियम गुणवत्ता वाले सूखे मेवे'
              : 'Handpicked, hygienically processed & premium quality dry fruits'}
          </p>
        </div>

        {/* Festive Offer & KM-Delivery Highlight Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#161311] text-stone-100 border border-amber-400/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 text-amber-300 font-semibold">
              <Tag className="w-4 h-4 text-amber-400 shrink-0" />
              {lang === 'hi'
                ? '10% छूट कूपन: JAINZEE10 / DIWALI10 (दिवाली बॉक्स नेट ₹1,300)'
                : '10% OFF Coupon: JAINZEE10 / DIWALI10 (Diwali Box Net ₹1,300)'}
            </span>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              {lang === 'hi'
                ? '₹999+ के ऑर्डर पर फ्री डिलीवरी (₹999 से कम पर KM के हिसाब से डिलीवरी चार्ज)'
                : 'FREE Delivery on ₹999 & above (KM-based delivery below ₹999)'}
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenDiwaliSpecial}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs inline-flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'hi'
                ? 'दिवाली स्पेशल बॉक्स ₹1,350 वीडियो देखें'
                : 'Diwali Special Box @ ₹1,350 (Watch Video)'}
            </span>
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 mb-10 shadow-2xs flex flex-wrap items-center justify-center gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-xs">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'उत्पाद खोजें...' : 'Search products...'}
              className="w-full pl-9 pr-3.5 py-2.5 text-sm rounded-lg border border-stone-300 bg-[#FAF7F2] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder={lang === 'hi' ? 'न्यूनतम ₹' : 'Min ₹'}
            className="w-28 px-3 py-2.5 text-sm font-mono rounded-lg border border-stone-300 bg-[#FAF7F2] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
          />

          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder={lang === 'hi' ? 'अधिकतम ₹' : 'Max ₹'}
            className="w-28 px-3 py-2.5 text-sm font-mono rounded-lg border border-stone-300 bg-[#FAF7F2] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500"
          />

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-200 bg-[#FAF7F2] text-sm text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <span>{lang === 'hi' ? 'केवल स्टॉक में' : 'In stock only'}</span>
          </label>

          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-200 bg-[#FAF7F2] text-sm text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wishlistOnly}
              onChange={(e) => setWishlistOnly(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
            <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{lang === 'hi' ? 'विशलिस्ट' : 'Wishlist'}</span>
          </label>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-10 text-center text-stone-600">
            {lang === 'hi'
              ? 'कोई उत्पाद फ़िल्टर से मेल नहीं खाता'
              : 'No products match your search or filters'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredProducts.map((product) => {
              const gradeIdx = getGradeIndex(product);
              const activeGrade = product.grades[gradeIdx] || product.grades[0];
              const qty = getQty(product.id);
              const inWishlist = wishlistIds.includes(product.id);
              const discountPct =
                activeGrade.oldPrice > activeGrade.price
                  ? Math.round(
                      ((activeGrade.oldPrice - activeGrade.price) / activeGrade.oldPrice) * 100
                    )
                  : 0;

              const avgRating =
                product.reviews.length > 0
                  ? (
                      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      product.reviews.length
                    ).toFixed(1)
                  : null;

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md gpu-transition hover:-translate-y-0.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Product Image or Video */}
                    <div
                      onClick={() => onSelectProduct(product, gradeIdx)}
                      className="relative h-60 w-full overflow-hidden bg-[#FDF8EE] cursor-pointer group"
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
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      <span className="absolute top-3 left-3 px-3 py-1 rounded-md bg-amber-400 text-stone-950 text-xs font-semibold tracking-wide shadow-xs">
                        {lang === 'hi'
                          ? product.featuredTag_hi || 'प्रीमियम'
                          : product.featuredTag_en || 'Premium'}
                      </span>

                      <span
                        className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-semibold shadow-xs ${
                          activeGrade.price * qty >= 999
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/30'
                            : 'bg-stone-900/85 text-amber-200 border border-white/10'
                        }`}
                      >
                        {activeGrade.price * qty >= 999
                          ? lang === 'hi'
                            ? 'फ्री डिलीवरी'
                            : 'Free Delivery'
                          : lang === 'hi'
                          ? 'KM आधारित डिलीवरी'
                          : 'KM-Based Delivery'}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          onClick={() => onSelectProduct(product, gradeIdx)}
                          className="font-display text-2xl font-semibold text-stone-900 hover:text-amber-700 transition-colors cursor-pointer"
                        >
                          {lang === 'hi' ? product.name_hi : product.name_en}
                        </h3>
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(product.id)}
                          aria-label="Toggle Wishlist"
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              inWishlist ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <span className="font-mono text-xl font-semibold text-amber-700 tabular-nums">
                          ₹{activeGrade.price.toLocaleString('en-IN')}
                        </span>
                        {activeGrade.oldPrice > activeGrade.price && (
                          <span className="font-mono text-sm text-stone-400 line-through tabular-nums">
                            ₹{activeGrade.oldPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[11px] font-semibold">
                            {discountPct}% OFF
                          </span>
                        )}
                      </div>

                      {/* Quick Grade Selector Grid for Multi-Grade Cashews */}
                      {product.grades.length > 2 && (
                        <div className="pt-1">
                          <p className="text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                            {lang === 'hi' ? 'ग्रेड चुनें (काजू रेट लिस्ट):' : 'Select Cashew Grade:'}
                          </p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {product.grades.map((g, idx) => {
                              const shortLabel = g.label.split(' ')[0];
                              const isSelected = idx === gradeIdx;
                              return (
                                <button
                                  key={g.label}
                                  type="button"
                                  onClick={() => handleGradeChange(product.id, idx)}
                                  className={`px-1.5 py-1 rounded-md border text-center transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-amber-400 border-amber-500 text-stone-950 font-semibold'
                                      : 'bg-[#FAF7F2] border-stone-200 text-stone-700 hover:border-amber-400'
                                  }`}
                                >
                                  <div className="text-[11px] leading-tight">{shortLabel}</div>
                                  <div className="font-mono text-[10px] opacity-90">₹{g.price}</div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Weight Info & Stock Status */}
                      <div className="flex items-center justify-between gap-2 text-xs text-stone-600 pt-0.5">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="truncate">{activeGrade.label}</span>
                        </span>

                        {product.stock <= 10 ? (
                          <span className="inline-flex items-center gap-1 text-red-700 font-medium shrink-0">
                            <Flame className="w-3.5 h-3.5 text-orange-600" />
                            {lang === 'hi'
                              ? `सिर्फ ${product.stock} बचे`
                              : `Only ${product.stock} left`}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {lang === 'hi' ? 'स्टॉक में' : 'In Stock'}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-stone-600 leading-relaxed">
                        {lang === 'hi' ? product.description_hi : product.description_en}
                      </p>

                      {/* Rating & Read Reviews */}
                      <div className="pt-1 flex items-center justify-between gap-2 border-t border-stone-100">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  avgRating && i < Math.round(Number(avgRating))
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-stone-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-stone-500">
                            {avgRating
                              ? `${avgRating} (${product.reviews.length})`
                              : lang === 'hi'
                              ? 'कोई समीक्षा नहीं'
                              : 'No reviews'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectProduct(product, gradeIdx)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 hover:text-amber-800 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'समीक्षाएं देखें' : 'Read Reviews'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Controls: Weight Select, Quantity Stepper & Add to Cart */}
                  <div className="px-5 pb-5 pt-2 space-y-3">
                    <div className="flex items-center gap-2">
                      {/* Weight / Grade Dropdown */}
                      <select
                        value={gradeIdx}
                        onChange={(e) => handleGradeChange(product.id, Number(e.target.value))}
                        aria-label="Weight / Grade"
                        className="flex-1 h-10 px-3 rounded-lg border border-stone-300 bg-[#FAF7F2] text-xs sm:text-sm font-medium text-stone-900 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {product.grades.map((g, idx) => (
                          <option key={g.label} value={idx}>
                            {g.label} - ₹{g.price.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>

                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center border border-stone-300 rounded-lg bg-[#FAF7F2] h-10 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, -1, product.stock)}
                          className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200/60 rounded-l-lg cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono text-xs font-semibold tabular-nums text-stone-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(product.id, 1, product.stock)}
                          className="w-8 h-full flex items-center justify-center text-stone-700 hover:bg-stone-200/60 rounded-r-lg cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(product.id, gradeIdx, qty)}
                      className="w-full h-10 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm inline-flex items-center justify-center gap-2 gpu-transition cursor-pointer shadow-2xs"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {lang === 'hi'
                          ? `कार्ट में जोड़ें · ₹${(activeGrade.price * qty).toLocaleString('en-IN')}`
                          : `Add to Cart · ₹${(activeGrade.price * qty).toLocaleString('en-IN')}`}
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
