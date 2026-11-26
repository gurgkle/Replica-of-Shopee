import React, { useState, useEffect } from 'react';
import { Flame, ChevronRight } from 'lucide-react';
import { Product } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface FlashSaleSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSeeAllFlashSales: () => void;
}

export const FlashSaleSection: React.FC<FlashSaleSectionProps> = ({
  products,
  onSelectProduct,
  onSeeAllFlashSales,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(2 * 3600 + 44 * 60 + 18);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 3600 * 3));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className="max-w-[1200px] mx-auto px-4 mt-4">
      <div className="bg-white rounded-[4px] border border-[#E8E8E8]">
        {/* Header Bar */}
        <div className="px-4 py-3 border-b border-[#E8E8E8] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-[#EE4D2D] fill-[#EE4D2D]" />
              <h2 className="text-[18px] font-bold text-[#EE4D2D] tracking-tight">
                FLASH SALE
              </h2>
            </div>

            {/* Segmented Dark Charcoal Countdown Timer */}
            <div
              className="flex items-center gap-1 font-mono text-[13px] font-bold tabular-nums"
              aria-label={`Flash sale ends in ${hours} hours ${mins} minutes ${secs} seconds`}
            >
              <span className="bg-[#222222] text-white px-1.5 py-0.5 rounded-[2px] min-w-[26px] text-center">
                {hours}
              </span>
              <span className="text-[#222222] font-bold">:</span>
              <span className="bg-[#222222] text-white px-1.5 py-0.5 rounded-[2px] min-w-[26px] text-center">
                {mins}
              </span>
              <span className="text-[#222222] font-bold">:</span>
              <span className="bg-[#222222] text-white px-1.5 py-0.5 rounded-[2px] min-w-[26px] text-center">
                {secs}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSeeAllFlashSales}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#EE4D2D] hover:text-[#b22204] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>See All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6-Column Flash Sale Row */}
        <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {products.slice(0, 6).map((product) => {
            const total = product.flashStockTotal || 60;
            const left = product.flashStockLeft ?? 10;
            const soldRatio = Math.min(95, Math.max(20, Math.round(((total - left) / total) * 100)));

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelectProduct(product)}
                className="group text-left bg-white rounded-[4px] border border-[#E8E8E8] hover:border-[#EE4D2D] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all duration-150 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* 1:1 Media Box */}
                <div className="relative aspect-square w-full bg-white overflow-hidden">
                  <MarketplaceImage
                    src={product.image}
                    alt={product.title}
                    fallbackLabel={product.brand}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200"
                  />
                  {/* Top-Right Discount Ribbon */}
                  <div className="absolute top-0 right-0 bg-[#FFC107] text-[#EE4D2D] px-1.5 py-0.5 text-[11px] font-bold leading-tight rounded-bl-[4px] tabular-nums">
                    -{product.discountPercent}%
                  </div>
                  {product.badgeType === 'mall' && (
                    <span className="absolute top-2 left-2 bg-[#b22204] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-[2px]">
                      Mall
                    </span>
                  )}
                </div>

                {/* Price + Stock Meter */}
                <div className="p-2.5 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <p className="text-[12px] text-[#222222] leading-[16px] line-clamp-1 mb-1">
                      {product.title}
                    </p>
                    <div className="flex items-baseline gap-1.5 tabular-nums">
                      <span className="text-[#EE4D2D] font-bold text-[16px] leading-[20px]">
                        <span className="text-[12px] font-semibold mr-0.5">$</span>
                        {product.price.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-[#757575] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stock Progress Meter */}
                  <div className="relative h-[16px] rounded-full bg-[#FCD8D4] overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-y-0 left-0 bg-[#EE4D2D] rounded-full"
                      style={{ width: `${soldRatio}%` }}
                    />
                    <span className="relative z-10 text-[10px] font-bold text-white tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] tabular-nums">
                      {left <= 10 ? `${left} LEFT` : `${soldRatio}% SOLD`}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
