export type Language = 'en' | 'hi';

export interface ProductGrade {
  label: string;
  weightGrams: number;
  price: number;
  oldPrice: number;
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  comment_en: string;
  comment_hi: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: number;
  sku: string;
  category:
    | 'cashews'
    | 'almonds'
    | 'pistachios'
    | 'walnuts'
    | 'dried-fruits'
    | 'makhana'
    | 'gifting'
    | 'blends';
  categoryLabel_en: string;
  categoryLabel_hi: string;
  name_en: string;
  name_hi: string;
  subtitle_en: string;
  subtitle_hi: string;
  description_en: string;
  description_hi: string;
  origin_en: string;
  origin_hi: string;
  image: string;
  video?: string;
  fallbackColor: string;
  stock: number;
  featuredTag_en?: string;
  featuredTag_hi?: string;
  grades: ProductGrade[];
  nutritionPer100g: {
    energyKcal: number;
    proteinG: number;
    healthyFatsG: number;
    fiberG: number;
  };
  reviews: ProductReview[];
}

export interface CartItem {
  productId: number;
  gradeIndex: number;
  quantity: number;
}

export interface Coupon {
  id?: number;
  code: string;
  title_en: string;
  title_hi: string;
  discountType: 'percent' | 'flat';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usedCount?: number;
  isActive?: boolean;
}

export interface OrderItemSummary {
  productId: number;
  name_en: string;
  name_hi: string;
  gradeLabel: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Dispatched' | 'Delivered';
  archived?: boolean;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
    distanceKm?: number;
  };
  paymentMethod: 'COD' | 'UPI' | 'Razorpay';
  items: OrderItemSummary[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  distanceKm?: number;
  total: number;
}

export interface StoreSettings {
  shopName_en: string;
  shopName_hi: string;
  tagline_en: string;
  tagline_hi: string;
  about_en: string;
  about_hi: string;
  address_en: string;
  address_hi: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  hours_en: string;
  hours_hi: string;
  globalDiscountPercent: number;
  upiId: string;
  gstin: string;
  gstRatePercent: number;
  freeShippingThreshold: number;
  perKmRate: number;
  baseDeliveryCharge: number;
  minDiwaliBoxPriceAfterDiscount: number;
  razorpayKeyId: string;
  twilioAccountSid: string;
  twilioVerifySid: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
}
