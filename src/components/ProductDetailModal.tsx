import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { Product, ProductVariant } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface ProductDetailModalProps {
  product: Product | null;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, qty: number, openDrawer?: boolean) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [product, onClose]);

  if (!product || !selectedVariant) return null;

  const unitPrice = Math.max(1, product.price + (selectedVariant.priceDelta || 0));
  const unitOriginal = Math.max(
    unitPrice + 5,
    product.originalPrice + (selectedVariant.priceDelta || 0)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div
        className="relative w-full max-w-[920px] max-h-[92vh] overflow-y-auto bg-white rounded-[4px] border border-[#E8E8E8] shadow-[0_12px_32px_rgba(0,0,0,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#eae7e7] text-[#222222] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6">
          {/* Left: Product Media Box */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-[4px] border border-[#E8E8E8] bg-white overflow-hidden">
              <MarketplaceImage
                src={product.image}
                alt={product.title}
                fallbackLabel={product.brand}
                className="w-full h-full object-cover"
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-0 right-0 bg-[#FFC107] text-[#EE4D2D] px-2 py-1 text-[12px] font-bold rounded-bl-[4px] tabular-nums">
                  -{product.discountPercent}% OFF
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[12px] text-[#757575] px-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#EE4D2D]" />
                <span>{product.location}</span>
              </span>
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`inline-flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
                  isWishlisted ? 'text-[#EE4D2D]' : 'text-[#757575] hover:text-[#EE4D2D]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#EE4D2D]' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Save Item'}</span>
              </button>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="md:col-span-7 flex flex-col justify-between gap-4">
            <div className="space-y-3">
              {/* Store Kicker + Title */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {product.badgeType === 'mall' && (
                    <span className="bg-[#b22204] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                      Official Mall
                    </span>
                  )}
                  {product.badgeType === 'preferred' && (
                    <span className="bg-[#EE4D2D] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                      Preferred Seller
                    </span>
                  )}
                  <span className="text-[12px] font-semibold text-[#5b403b]">
                    {product.brand}
                  </span>
                </div>
                <h2
                  id="pdp-title"
                  className="text-[18px] sm:text-[20px] font-bold text-[#222222] leading-snug pr-6"
                >
                  {product.title}
                </h2>
              </div>

              {/* Ratings & Sold Metrics */}
              <div className="flex items-center gap-3 text-[13px] tabular-nums">
                <span className="inline-flex items-center gap-1 font-semibold text-[#EE4D2D]">
                  <span className="underline">{product.rating.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]" />
                </span>
                <span className="text-[#E8E8E8]">|</span>
                <span className="text-[#757575]">
                  <strong className="text-[#222222] font-semibold">
                    {product.reviewCount.toLocaleString()}
                  </strong>{' '}
                  Ratings
                </span>
                <span className="text-[#E8E8E8]">|</span>
                <span className="text-[#757575]">
                  <strong className="text-[#222222] font-semibold">
                    {product.soldDisplay}
                  </strong>
                </span>
              </div>

              {/* Hero Price Strip */}
              <div className="bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px] px-4 py-3 flex items-baseline gap-3 flex-wrap tabular-nums">
                <span className="text-[30px] font-bold text-[#EE4D2D] leading-[36px] tracking-[-0.02em]">
                  <span className="text-[18px] font-semibold mr-0.5">$</span>
                  {unitPrice.toFixed(2)}
                </span>
                <span className="text-[14px] text-[#757575] line-through">
                  ${unitOriginal.toFixed(2)}
                </span>
                <span className="bg-[#EE4D2D] text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px]">
                  {product.discountPercent}% OFF
                </span>
                {product.voucherLabel && (
                  <span className="border border-dashed border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D] text-[11px] font-semibold px-2 py-0.5 rounded-[2px]">
                    Voucher: {product.voucherLabel}
                  </span>
                )}
              </div>

              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-[13px] text-[#222222]">
                <Truck className="w-4 h-4 text-[#006385] shrink-0" />
                <span>
                  {product.freeShipping
                    ? 'Free Express Delivery · Arrives in 2–4 business days'
                    : 'Standard Shipping $4.99 · Free on orders over $25'}
                </span>
              </div>

              {/* Variant Selector */}
              <div>
                <div className="text-[12px] font-semibold text-[#757575] mb-2">
                  Option: <span className="text-[#222222]">{selectedVariant.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = selectedVariant.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors cursor-pointer ${
                          active
                            ? 'border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D] font-semibold'
                            : 'border-[#E8E8E8] bg-white text-[#222222] hover:border-[#EE4D2D]/60'
                        }`}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-1">
                <span className="text-[12px] font-semibold text-[#757575]">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-[#E8E8E8] rounded-[4px] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#222222] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-[13px] font-semibold tabular-nums border-x border-[#E8E8E8]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                    aria-label="Increase quantity"
                    className="w-8 h-8 flex items-center justify-center text-[#222222] hover:bg-[#F5F5F5] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[12px] text-[#757575]">In Stock</span>
              </div>

              {/* Description & Highlights */}
              <div className="pt-2 border-t border-[#E8E8E8]">
                <p className="text-[13px] text-[#222222] leading-relaxed mb-2">
                  {product.description}
                </p>
                <ul className="space-y-1">
                  {product.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-1.5 text-[12px] text-[#757575]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#EE4D2D] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#E8E8E8] space-y-2.5">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedVariant, quantity, false)}
                  className="py-2.5 px-4 rounded-[4px] border border-[#EE4D2D] bg-[#FFF5F3] hover:bg-[#ffdad3]/60 text-[#EE4D2D] text-[13px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAddToCart(product, selectedVariant, quantity, true)}
                  className="py-2.5 px-4 rounded-[4px] bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[13px] font-semibold transition-colors cursor-pointer active:scale-[0.98]"
                >
                  Buy Now · ${(unitPrice * quantity).toFixed(2)}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#757575]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#006385]" />
                <span>ShopVibe Buyer Protection · Verified payout only on delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
