import React, { useState } from 'react';
import { X, Search, PackageCheck, RotateCcw, Printer, CheckCircle2, Truck } from 'lucide-react';
import { Language, Order } from '../types';
import { STORE_INFO } from '../data/storeData';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  orders: Order[];
  onReorder: (order: Order) => void;
}

const STAGES = ['Confirmed', 'Processing', 'Dispatched', 'Delivered'] as const;

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  lang,
  orders,
  onReorder,
}) => {
  const [searchInput, setSearchInput] = useState('');

  if (!isOpen) return null;

  const filteredOrders = orders.filter((o) => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return true;
    return (
      o.id.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-3xl bg-[#FAF7F2] border border-stone-300 rounded-xl shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-[#B45309]" />
            <h2 className="font-display text-xl font-semibold text-stone-900">
              {lang === 'hi'
                ? 'ऑर्डर ट्रैक करें और इनवॉइस डाउनलोड करें'
                : 'Track Order & Download Tax Invoice'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                lang === 'hi'
                  ? 'ऑर्डर आईडी (जैसे JZ-1042) या मोबाइल नंबर दर्ज करें...'
                  : 'Search by Order ID (e.g. JZ-1042) or Phone Number (+91 97529 37733)...'
              }
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-white border border-stone-300 text-stone-900 focus:outline-none focus:border-[#B45309]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="p-6 pt-3 overflow-y-auto space-y-4 flex-1">
          {filteredOrders.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-xl border border-stone-200 space-y-2">
              <p className="font-display text-xl font-semibold text-stone-800">
                {lang === 'hi' ? 'कोई ऑर्डर नहीं मिला' : 'No matching orders found'}
              </p>
              <p className="text-xs text-stone-500">
                Try searching with demo Order ID <span className="font-mono font-semibold">JZ-1042</span> or place a new guest order.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const currentStageIdx = STAGES.indexOf(order.status);

              return (
                <div
                  key={order.id}
                  className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-semibold text-stone-900">
                          Order #{order.id}
                        </span>
                        <span aria-hidden="true" className="text-stone-300">·</span>
                        <span className="text-xs font-medium text-[#B45309]">{order.status}</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {order.createdAt} · {order.customer.name} ({order.customer.city})
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-mono text-base font-semibold text-stone-900 tabular-nums">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[11px] font-mono text-stone-500">{order.paymentMethod}</p>
                    </div>
                  </div>

                  {/* 4-Step Progress Tracker */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {STAGES.map((stage, idx) => {
                      const done = idx <= currentStageIdx;
                      return (
                        <div key={stage} className="space-y-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              done ? 'bg-[#B45309]' : 'bg-stone-200'
                            }`}
                          />
                          <div className="flex items-center gap-1 text-[11px] font-medium">
                            {done ? (
                              <CheckCircle2 className="w-3 h-3 text-[#B45309] shrink-0" />
                            ) : (
                              <Truck className="w-3 h-3 text-stone-400 shrink-0" />
                            )}
                            <span className={done ? 'text-stone-900' : 'text-stone-400'}>
                              {stage}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Order Items */}
                  <div className="bg-[#FAF7F2] rounded-lg p-3 space-y-1.5 text-xs">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-stone-700">
                        <span>
                          {lang === 'hi' ? item.name_hi : item.name_en} ({item.gradeLabel}) ×{' '}
                          {item.quantity}
                        </span>
                        <span className="font-mono tabular-nums font-medium">
                          ₹{item.lineTotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions: Reorder & Print Invoice */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <span className="text-[11px] text-stone-500 font-mono">
                      FSSAI Lic. {STORE_INFO.fssaiLicense} · Siyaganj, Indore
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-3.5 py-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-medium text-stone-800 inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'इनवॉइस (PDF)' : 'Invoice (PDF)'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onReorder(order);
                          onClose();
                        }}
                        className="px-3.5 py-2 rounded-lg bg-[#1C1917] hover:bg-stone-800 text-stone-100 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'hi' ? 'दोबारा ऑर्डर करें' : 'Reorder Items'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
