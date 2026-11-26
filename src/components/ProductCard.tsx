import React from 'react';
import { Star, Heart, Truck } from 'lucide-react';
import { Product } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onSelect: (product: Product) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onSelect,
  onToggleWishlist,
}) => {
  return (
    <article
      onClick={() => onSelect(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(product);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={product.title}
      className="group bg-white rounded-[4px] border border-[#E8E8E8] hover:border-[#EE4D2D] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-150 overflow-hidden cursor-pointer flex flex-col focus-visible:outline-2 focus-visible:outline-[#EE4D2D]"
    >
      {/* 1:1 Media Box */}
      <div className="relative aspect-square w-full bg-white overflow-hidden border-b border-[#F5F5F5]">
        <MarketplaceImage
          src={product.image}
          alt={product.title}
          fallbackLabel={product.brand}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
        />

        {/* Top-Right Discount Ribbon */}
        {product.discountPercent > 0 && (
          <div className="absolute top-0 right-0 bg-[#FFC107] text-[#EE4D2D] px-1.5 py-0.5 text-[10px] font-bold rounded-bl-[4px] tabular-nums">
            -{product.discountPercent}%
          </div>
        )}

        {/* Top-Left Store Badge */}
        {product.badgeType === 'mall' && (
          <span className="absolute top-2 left-2 bg-[#b22204] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
            Mall
          </span>
        )}
        {product.badgeType === 'preferred' && (
          <span className="absolute top-2 left-2 bg-[#EE4D2D] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
            Preferred
          </span>
        )}

        {/* Wishlist Toggle */}
        <button
          type="button"
          onClick={(e) => onToggleWishlist(product.id, e)}
          aria-label={isWishlisted ? 'Remove from saved' : 'Save item'}
          className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-[#FFF5F3] border-[#EE4D2D] text-[#EE4D2D] opacity-100'
              : 'bg-white/90 border-[#E8E8E8] text-[#757575] opacity-0 group-hover:opacity-100 hover:text-[#EE4D2D]'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#EE4D2D]' : ''}`} />
        </button>
      </div>

      {/* Content Area (8px compact padding) */}
      <div className="p-2 flex-1 flex flex-col justify-between gap-1.5">
        <div>
          <h3 className="text-[12px] font-medium text-[#222222] leading-[16px] line-clamp-2 min-h-[32px]">
            {product.title}
          </h3>

          {/* Voucher / Shipping Micro-Tags */}
          <div className="flex items-center gap-1.5 mt-1.5 min-h-[18px] flex-wrap">
            {product.voucherLabel && (
              <span className="border border-dashed border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D] text-[10px] font-semibold px-1 py-0 rounded-[2px] leading-[14px]">
                {product.voucherLabel}
              </span>
            )}
            {product.freeShipping && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#006385] bg-[#c2e8ff]/45 px-1.5 py-0 rounded-full leading-[15px]">
                <Truck className="w-2.5 h-2.5" />
                <span>Free Ship</span>
              </span>
            )}
          </div>
        </div>

        {/* Rating + Price + Sold Row */}
        <div className="pt-1">
          <div className="flex items-center gap-1 text-[10px] text-[#757575] mb-1 tabular-nums">
            <Star className="w-3 h-3 text-[#FFC107] fill-[#FFC107]" />
            <span className="font-semibold text-[#222222]">{product.rating.toFixed(1)}</span>
            <span>·</span>
            <span className="truncate">{product.location}</span>
          </div>

          <div className="flex items-baseline justify-between gap-1 tabular-nums">
            <div className="flex items-baseline gap-1 min-w-0">
              <span className="text-[#EE4D2D] font-semibold text-[16px] leading-[20px]">
                <span className="text-[11px] font-semibold mr-0.5">$</span>
                {product.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#757575] line-through truncate">
                ${product.originalPrice.toFixed(0)}
              </span>
            </div>
            <span className="text-[11px] text-[#757575] whitespace-nowrap shrink-0">
              {product.soldDisplay}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
