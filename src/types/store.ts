export type CurrencyCode = 'INR' | 'USD';

export type ProductSizeId = 'large' | 'small';

export type ColourId = 'black' | 'tan' | 'grey' | 'light-blue' | 'light-pink';

export type GalleryAngleId =
  | 'heroAction'
  | 'front'
  | 'kitDesk'
  | 'lifestyle'
  | 'interior'
  | 'back';

export interface ProductGalleryImage {
  id: GalleryAngleId;
  label: string;
  src: string;
}

export interface ProductFinish {
  id: ColourId;
  name: string;
  hex: string;
  accentHex: string;
  surfaceHex: string;
  hasStudioPhotos: boolean;
  gallery?: ProductGalleryImage[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sizeId: ProductSizeId;
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  categoryLabel: string;
  priceInr: number;
  compareAtInr?: number;
  containerCount: number;
  containerSummary: string;
  capacityLabel: string;
  heatingTimeLabel: string;
  powerModeLabel: string;
  dimensionsLabel: string;
  idealFor: string;
  availabilityText: string;
  rating: number;
  reviewCount: number;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  finishes: ProductFinish[];
  specs: ProductSpec[];
  inTheBox: string[];
}

export interface CartItem {
  key: string;
  productId: string;
  sizeId: ProductSizeId;
  name: string;
  finishId: ColourId;
  finishName: string;
  finishHex: string;
  unitPriceInr: number;
  quantity: number;
}

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSubtotalInr: number;
  description: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  eta: string;
  description: string;
  costInr: number;
  freeOverInr?: number;
}

export type PaymentMethodType = 'card' | 'upi' | 'express' | 'cod';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  notes: string;
}

export interface OrderTimelineStep {
  title: string;
  subtitle: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string;
  transactionRef: string;
  createdAt: string;
  estimatedDelivery: string;
  status: 'Confirmed' | 'Quality Check' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  currency: CurrencyCode;
  items: CartItem[];
  address: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethodType;
  paymentSummary: string;
  promoCode?: string;
  subtotalInr: number;
  discountInr: number;
  shippingInr: number;
  codFeeInr: number;
  taxInr: number;
  totalInr: number;
  courierName: string;
  trackingNumber: string;
  timeline: OrderTimelineStep[];
}

export interface CustomerReview {
  id: string;
  author: string;
  role: string;
  organization: string;
  productName: string;
  colourName: string;
  rating: number;
  date: string;
  headline: string;
  body: string;
  verified: boolean;
}

export type ActiveView =
  | { type: 'home' }
  | { type: 'product'; productId: string; initialFinishId?: ColourId }
  | { type: 'checkout' }
  | { type: 'confirmation'; orderId: string }
  | { type: 'tracking'; initialOrderId?: string };
