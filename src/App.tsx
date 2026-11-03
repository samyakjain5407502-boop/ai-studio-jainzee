/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CartItem, Coupon, Language, Order, Product, StoreSettings } from './types';
import {
  AVAILABLE_COUPONS,
  DEFAULT_STORE_SETTINGS,
  INITIAL_PRODUCTS,
  SAMPLE_ORDERS,
} from './data/storeData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCatalog } from './components/ProductCatalog';
import { RoasteryAndStorySection } from './components/RoasteryAndStorySection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AuditAndDeployModal } from './components/AuditAndDeployModal';
import { DiwaliSpecialPopup } from './components/DiwaliSpecialPopup';
import { OrderSuccessPopup } from './components/OrderSuccessPopup';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('jainzee_lang');
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('jainzee_products_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PRODUCTS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('jainzee_coupons_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return AVAILABLE_COUPONS;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('jainzee_settings_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STORE_SETTINGS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('jainzee_cart_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('jainzee_wishlist_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('jainzee_orders_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return SAMPLE_ORDERS;
  });

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [diwaliPopupOpen, setDiwaliPopupOpen] = useState(true);
  const [justPlacedOrder, setJustPlacedOrder] = useState<Order | null>(null);
  const [selectedProductModal, setSelectedProductModal] = useState<{
    product: Product;
    gradeIndex: number;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  useEffect(() => {
    localStorage.setItem('jainzee_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('jainzee_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('jainzee_coupons_v5', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('jainzee_settings_v5', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('jainzee_cart_v5', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('jainzee_wishlist_v5', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('jainzee_orders_v5', JSON.stringify(orders));
  }, [orders]);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddToCart = (productId: number, gradeIndex: number, quantity: number) => {
    const prod = products.find((p) => p.id === productId);
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (i) => i.productId === productId && i.gradeIndex === gradeIndex
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { productId, gradeIndex, quantity }];
    });

    if (prod) {
      showToast(lang === 'hi' ? 'कार्ट में जोड़ दिया गया!' : 'Added to cart!');
    }
  };

  const handleAddDiwaliGiftBoxToCart = (quantity: number) => {
    const diwaliProduct = products.find((p) => p.sku === 'DIW-001');
    if (diwaliProduct) {
      handleAddToCart(diwaliProduct.id, 0, quantity);
      setCartDrawerOpen(true);
    }
  };

  const handleUpdateCartQty = (productId: number, gradeIndex: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.gradeIndex === gradeIndex) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: number, gradeIndex: number) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.gradeIndex === gradeIndex))
    );
  };

  const handleToggleWishlist = (productId: number) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      showToast(
        exists
          ? lang === 'hi'
            ? 'विशलिस्ट से हटाया गया'
            : 'Removed from wishlist'
          : lang === 'hi'
          ? 'विशलिस्ट में जोड़ा गया!'
          : 'Added to wishlist!'
      );
      return next;
    });
  };

  const handleAddReview = (
    productId: number,
    author: string,
    city: string,
    rating: number,
    comment: string
  ) => {
    const newRev = {
      id: `rev-${Date.now()}`,
      author,
      city,
      rating,
      comment_en: comment,
      comment_hi: comment,
      date: new Date().toLocaleDateString('en-IN'),
      verified: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedProduct = { ...p, reviews: [newRev, ...p.reviews] };
        if (selectedProductModal?.product.id === productId) {
          setSelectedProductModal({
            ...selectedProductModal,
            product: updatedProduct,
          });
        }
        return updatedProduct;
      })
    );
    showToast(lang === 'hi' ? 'रिव्यू सबमिट हो गया!' : 'Review submitted successfully!');
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setJustPlacedOrder(newOrder);
    showToast(
      lang === 'hi'
        ? `ऑर्डर #${newOrder.id} कन्फर्म हो गया!`
        : `Order #${newOrder.id} confirmed!`
    );
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(lang === 'hi' ? 'ऑर्डर स्टेटस अपडेट किया गया!' : 'Order status updated!');
  };

  const handleToggleArchiveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, archived: !o.archived } : o))
    );
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(lang === 'hi' ? 'ऑर्डर हटाया गया' : 'Order deleted');
  };

  const handleSaveProduct = (savedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
    showToast('Product saved successfully!');
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product deleted');
  };

  const handleUpdateProductStock = (
    productId: number,
    newStock: number,
    newBasePrice?: number
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const updatedGrades =
          newBasePrice && newBasePrice > 0 && p.grades.length > 0
            ? p.grades.map((g, idx) => (idx === 0 ? { ...g, price: newBasePrice } : g))
            : p.grades;
        return { ...p, stock: newStock, grades: updatedGrades };
      })
    );
    showToast('Stock & rate updated!');
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev.filter((c) => c.code !== newCoupon.code)]);
    showToast(`Coupon ${newCoupon.code} created!`);
  };

  const handleToggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.code === code ? { ...c, isActive: c.isActive === false ? true : false } : c
      )
    );
  };

  const handleDeleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return;
      const gIdx = Math.max(
        0,
        prod.grades.findIndex((g) => g.label === item.gradeLabel)
      );
      handleAddToCart(prod.id, gIdx, item.quantity);
    });
    setCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1917]">
      <Navbar
        lang={lang}
        setLang={setLang}
        cartCount={totalCartItems}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenDiwaliSpecial={() => setDiwaliPopupOpen(true)}
      />

      <main className="flex-1">
        <HeroSection lang={lang} />

        <ProductCatalog
          lang={lang}
          products={products}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onSelectProduct={(product, initialGradeIndex) =>
            setSelectedProductModal({ product, gradeIndex: initialGradeIndex })
          }
          onOpenDiwaliSpecial={() => setDiwaliPopupOpen(true)}
        />

        <RoasteryAndStorySection lang={lang} />
      </main>

      <Footer lang={lang} onOpenAdmin={() => setAdminModalOpen(true)} />

      <DiwaliSpecialPopup
        isOpen={diwaliPopupOpen}
        onClose={() => setDiwaliPopupOpen(false)}
        lang={lang}
        onAddGiftBoxToCart={handleAddDiwaliGiftBoxToCart}
      />

      <OrderSuccessPopup
        order={justPlacedOrder}
        onClose={() => setJustPlacedOrder(null)}
        lang={lang}
        onOpenTracker={() => setTrackerModalOpen(true)}
        onAddDiwaliBox={() => handleAddDiwaliGiftBoxToCart(1)}
      />

      <ProductDetailModal
        lang={lang}
        product={selectedProductModal?.product || null}
        initialGradeIndex={selectedProductModal?.gradeIndex || 0}
        onClose={() => setSelectedProductModal(null)}
        onAddToCart={handleAddToCart}
        onAddReview={handleAddReview}
      />

      <CartCheckoutDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        lang={lang}
        cart={cart}
        products={products}
        coupons={coupons}
        settings={settings}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        isOpen={trackerModalOpen}
        onClose={() => setTrackerModalOpen(false)}
        lang={lang}
        orders={orders}
        onReorder={handleReorder}
      />

      <AuditAndDeployModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onToggleArchiveOrder={handleToggleArchiveOrder}
        onDeleteOrder={handleDeleteOrder}
        products={products}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdateProductStock={handleUpdateProductStock}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onToggleCoupon={handleToggleCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        settings={settings}
        onSaveSettings={setSettings}
        onOpenDiwaliSpecial={() => setDiwaliPopupOpen(true)}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg bg-[#141210] text-stone-100 border border-stone-700 shadow-xl flex items-center gap-2.5 text-xs font-medium gpu-transition"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
