import React from 'react';
import {
  X,
  CheckCircle2,
  Printer,
  Truck,
  Sparkles,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { Language, Order } from '../types';
import { STORE_INFO } from '../data/storeData';

interface OrderSuccessPopupProps {
  order: Order | null;
  onClose: () => void;
  lang: Language;
  onOpenTracker: () => void;
  onAddDiwaliBox: () => void;
}

export const OrderSuccessPopup: React.FC<OrderSuccessPopupProps> = ({
  order,
  onClose,
  lang,
  onOpenTracker,
  onAddDiwaliBox,
}) => {
  if (!order) return null;

  const handleSendWhatsAppOrder = () => {
    const itemsList = order.items
      .map((i) => `• ${i.name_en} (${i.gradeLabel}) x ${i.quantity} = ₹${i.lineTotal}`)
      .join('\n');
    const message = encodeURIComponent(
      `*New Order Confirmed - ${STORE_INFO.brandFull_en}*\n` +
        `Order ID: *#${order.id}*\n` +
        `Customer: ${order.customer.name}\n` +
        `Phone: ${order.customer.phone}\n` +
        `Address: ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}\n` +
        `Payment: ${order.paymentMethod}\n\n` +
        `*Items:*\n${itemsList}\n\n` +
        `Subtotal: ₹${order.subtotal}\n` +
        (order.discount > 0 ? `Discount (${order.couponCode}): -₹${order.discount}\n` : '') +
        `Delivery: ${order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}\n` +
        `*Total Payable: ₹${order.total}*`
    );
    window.open(
      `https://wa.me/${STORE_INFO.whatsappNumber}?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs"
        aria-hidden="true"
      />

      {/* Popup Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#FAF7F2] border border-amber-400/50 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Celebratory Top Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-400/20 border border-emerald-300/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-200 block">
                {lang === 'hi' ? `ऑर्डर आईडी #${order.id}` : `ORDER ID #${order.id} • CONFIRMED`}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-white leading-tight">
                {lang === 'hi'
                  ? 'बधाई हो! आपका ऑर्डर सफलतापूर्वक दर्ज हो गया है!'
                  : 'Thank You! Your Order Has Been Placed!'}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Order Confirmation Popup"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Customer & Delivery Details Card */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1.5">
              <p className="text-[11px] font-mono uppercase text-stone-400">
                {lang === 'hi' ? 'ग्राहक विवरण' : 'Customer Details'}
              </p>
              <p className="font-semibold text-stone-900 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-600" />
                <span>{order.customer.name}</span>
              </p>
              <p className="font-mono text-stone-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-600" />
                <span>{order.customer.phone}</span>
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-mono uppercase text-stone-400">
                {lang === 'hi' ? 'डिलीवरी पता और भुगतान' : 'Delivery & Payment'}
              </p>
              <p className="text-stone-700 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {order.customer.address}, {order.customer.city} - {order.customer.pincode}
                </span>
              </p>
              <p className="font-mono text-stone-900 font-semibold">
                {lang === 'hi' ? 'भुगतान मोड़: ' : 'Payment Mode: '}
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                  {order.paymentMethod}
                </span>
              </p>
            </div>
          </div>

          {/* Itemized Bill Summary */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2.5 text-xs">
            <p className="text-[11px] font-mono uppercase text-stone-400">
              {lang === 'hi' ? 'ऑर्डर किए गए उत्पाद' : 'Order Summary'}
            </p>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold text-stone-900">
                      {lang === 'hi' ? item.name_hi : item.name_en}
                    </span>{' '}
                    <span className="text-stone-500">
                      ({item.gradeLabel}) × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    ₹{item.lineTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-1">
              <div className="flex justify-between text-stone-600">
                <span>{lang === 'hi' ? 'उप-योग (Subtotal)' : 'Subtotal'}</span>
                <span className="font-mono tabular-nums">
                  ₹{order.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>
                    {lang === 'hi' ? '10% कूपन छूट' : '10% Coupon Discount'} ({order.couponCode})
                  </span>
                  <span className="font-mono tabular-nums">
                    -₹{order.discount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>{lang === 'hi' ? 'डिलीवरी चार्ज' : 'Delivery Charge'}</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm sm:text-base font-semibold text-stone-900">
                <span>{lang === 'hi' ? 'कुल देय राशि (Total)' : 'Total Payable'}</span>
                <span className="font-mono text-amber-700 tabular-nums">
                  ₹{order.total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Primary Post-Order Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={handleSendWhatsAppOrder}
              className="py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lang === 'hi' ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="py-2.5 px-4 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'रसीद प्रिंट करें' : 'Print Receipt'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTracker();
              }}
              className="py-2.5 px-4 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>{lang === 'hi' ? 'ऑर्डर ट्रैक करें' : 'Track Order'}</span>
            </button>
          </div>

          {/* Post-Order Diwali Special Video Popup Spotlight */}
          <div className="p-4 rounded-xl bg-[#161311] text-stone-100 border border-amber-400/40 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-28 h-28 rounded-lg overflow-hidden border border-amber-400/30 shrink-0 bg-stone-900">
              <video
                src={STORE_INFO.diwaliVideoUrl}
                poster="/images/diwali-gift-box.jpg"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1.5">
              <div className="inline-flex items-center gap-1 text-[11px] font-mono uppercase text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {lang === 'hi'
                    ? 'दिवाली स्पेशल गिफ्ट ऑफर • फ्री डिलीवरी'
                    : 'DIWALI SPECIAL GIFT BOX • FREE DELIVERY'}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold text-white">
                {lang === 'hi'
                  ? 'रॉयल मयूर 4-जार ड्राई फ्रूट गिफ्ट बॉक्स @ ₹1,350'
                  : 'Royal Peacock 4-Jar Dry Fruit Gift Box @ ₹1,350'}
              </h3>
              <p className="text-xs text-stone-300">
                {lang === 'hi'
                  ? 'अपने परिवार व मित्रों को देने के लिए प्रीमियम 4-जार गिफ्ट बॉक्स (DIWALI10 कूपन से 10% छूट पाएं)।'
                  : 'Gift your loved ones our luxury 4-jar dry fruit box (Use code DIWALI10 for extra 10% OFF).'}
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAddDiwaliBox();
                  }}
                  className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'hi'
                      ? 'दिवाली बॉक्स भी ऑर्डर करें — ₹1,350'
                      : 'Add Diwali Gift Box — ₹1,350'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              FSSAI Lic. {STORE_INFO.fssaiLicense} • Siyaganj, Indore • {STORE_INFO.phone}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
