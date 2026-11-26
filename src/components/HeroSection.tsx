import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Headphones,
  Watch,
  Sparkles,
  Footprints,
  Coffee,
  Briefcase,
  Camera,
  LayoutGrid,
  Award,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES, HERO_BANNERS } from '../data/marketplaceData';
import { CategoryId } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface HeroSectionProps {
  activeCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onTriggerBannerAction: (action: 'flash' | 'mall' | 'vouchers') => void;
}

const CATEGORY_ICONS: Record<CategoryId, React.ReactNode> = {
  all: <LayoutGrid className="w-5 h-5" />,
  audio: <Headphones className="w-5 h-5" />,
  wearables: <Watch className="w-5 h-5" />,
  beauty: <Sparkles className="w-5 h-5" />,
  footwear: <Footprints className="w-5 h-5" />,
  kitchen: <Coffee className="w-5 h-5" />,
  bags: <Briefcase className="w-5 h-5" />,
  cameras: <Camera className="w-5 h-5" />,
};

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  onTriggerBannerAction,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const currentBanner = HERO_BANNERS[slideIndex];

  return (
    <section className="bg-white border-b border-[#E8E8E8]">
      <div className="max-w-[1200px] mx-auto px-4 pt-4 pb-5">
        {/* Top Hero Carousel + Stacked Side Spotlight Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
          {/* Primary Banner Carousel (8 cols) */}
          <div className="lg:col-span-8 relative rounded-[4px] overflow-hidden border border-[#E8E8E8] bg-[#b22204] min-h-[220px] sm:min-h-[260px] lg:h-[268px] group">
            <MarketplaceImage
              src={currentBanner.image}
              alt={currentBanner.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#222222]/85 via-[#222222]/50 to-transparent" />

            <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-5 sm:p-8 max-w-md text-white">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="bg-[#FFC107] text-[#222222] text-[10px] font-bold px-2 py-0.5 rounded-[2px] tracking-wide">
                  {currentBanner.badge}
                </span>
                <span className="text-[11px] font-semibold text-white/90 tracking-wide">
                  {currentBanner.kicker}
                </span>
              </div>
              <h1 className="text-2xl sm:text-[32px] font-bold leading-tight tracking-[-0.02em] text-balance mb-2">
                {currentBanner.title}
              </h1>
              <p className="text-[13px] sm:text-[14px] text-white/90 leading-snug mb-4 line-clamp-2">
                {currentBanner.subtitle}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => onTriggerBannerAction(currentBanner.targetAction)}
                  className="inline-flex items-center gap-2 bg-[#EE4D2D] hover:bg-[#F94E2F] active:scale-[0.98] text-white text-[13px] font-semibold px-4 py-2 rounded-[4px] shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>{currentBanner.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              type="button"
              onClick={() =>
                setSlideIndex((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
              }
              aria-label="Previous promotion"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-[2px] bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setSlideIndex((prev) => (prev + 1) % HERO_BANNERS.length)}
              aria-label="Next promotion"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-10 rounded-[2px] bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              {HERO_BANNERS.map((banner, idx) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setSlideIndex(idx)}
                  aria-label={`View slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === slideIndex ? 'w-6 bg-[#FFC107]' : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Stacked Promo Spotlights (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => onTriggerBannerAction('mall')}
              className="text-left rounded-[4px] border border-[#E8E8E8] bg-gradient-to-br from-[#FFF5F3] via-white to-[#FFDF9E]/35 p-4 flex items-center justify-between gap-3 hover:border-[#EE4D2D] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer group"
            >
              <div>
                <span className="inline-block bg-[#b22204] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] mb-1.5">
                  OFFICIAL MALL
                </span>
                <h2 className="text-[15px] font-bold text-[#222222] group-hover:text-[#EE4D2D] transition-colors">
                  Verified Flagship Brands
                </h2>
                <p className="text-[12px] text-[#757575] mt-0.5">
                  100% authentic · 15-day returns
                </p>
              </div>
              <div className="w-12 h-12 rounded-[4px] bg-[#b22204]/10 text-[#b22204] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onTriggerBannerAction('vouchers')}
              className="text-left rounded-[4px] border border-[#E8E8E8] bg-gradient-to-br from-[#FFF5F3] via-white to-[#FCD8D4]/45 p-4 flex items-center justify-between gap-3 hover:border-[#EE4D2D] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all cursor-pointer group"
            >
              <div>
                <span className="inline-block bg-[#FFC107] text-[#222222] text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] mb-1.5">
                  VOUCHER HUB
                </span>
                <h2 className="text-[15px] font-bold text-[#222222] group-hover:text-[#EE4D2D] transition-colors">
                  Claim Up to $12 Off
                </h2>
                <p className="text-[12px] text-[#757575] mt-0.5">
                  Stackable with Flash Sale deals
                </p>
              </div>
              <div className="w-12 h-12 rounded-[4px] bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center shrink-0">
                <Ticket className="w-6 h-6" />
              </div>
            </button>
          </div>
        </div>

        {/* Category Quick-Links Rail */}
        <div className="mt-4 pt-3 border-t border-[#F0EDED]">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-[4px] border transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D]'
                      : 'border-transparent hover:border-[#E8E8E8] hover:bg-[#FAFAFA] text-[#222222]'
                  }`}
                >
                  <span
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                      isActive
                        ? 'bg-[#EE4D2D] text-white'
                        : 'bg-[#F5F5F5] text-[#5b403b]'
                    }`}
                  >
                    {CATEGORY_ICONS[cat.id]}
                  </span>
                  <span className="text-[12px] font-medium text-center leading-tight whitespace-nowrap">
                    {cat.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
