export type CategoryId =
  | 'all'
  | 'audio'
  | 'wearables'
  | 'beauty'
  | 'footwear'
  | 'kitchen'
  | 'bags'
  | 'cameras';

export type SortOption = 'popular' | 'latest' | 'top_sales' | 'price_asc' | 'price_desc';

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta?: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  soldDisplay: string;
  image: string;
  badgeType?: 'mall' | 'preferred';
  freeShipping: boolean;
  voucherLabel?: string;
  isFlashSale?: boolean;
  flashStockTotal?: number;
  flashStockLeft?: number;
  location: string;
  description: string;
  highlights: string[];
  variants: ProductVariant[];
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  minSpend: number;
  discountType: 'fixed' | 'percent' | 'shipping';
  discountValue: number;
  maxDiscount?: number;
  mallOnly?: boolean;
  expiryLabel: string;
}

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface FilterState {
  searchQuery: string;
  category: CategoryId;
  minPrice: string;
  maxPrice: string;
  minRating: number;
  mallOnly: boolean;
  preferredOnly: boolean;
  freeShippingOnly: boolean;
  flashSaleOnly: boolean;
  sortBy: SortOption;
}

export interface OrderConfirmation {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  postalCode: string;
  paymentMethod: 'COD' | 'Card' | 'ShopVibePay';
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  total: number;
  itemCount: number;
  placedAt: string;
}
