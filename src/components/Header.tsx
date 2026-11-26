import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  ShoppingBag,
  X,
  HelpCircle,
  Store,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { TRENDING_KEYWORDS } from '../data/marketplaceData';

interface HeaderProps {
  searchQuery: string;
  onSearchSubmit: (query: string) => void;
  onResetHome: () => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenInfoModal: (tab: 'seller' | 'help' | 'guarantee') => void;
  onQuickFilterFreeShipping: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchSubmit,
  onResetHome,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenInfoModal,
  onQuickFilterFreeShipping,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchSubmit(inputValue.trim());
  };

  const handleSuggestionClick = (keyword: string) => {
    setInputValue(keyword);
    setShowSuggestions(false);
    onSearchSubmit(keyword);
  };

  const handleClear = () => {
    setInputValue('');
    onSearchSubmit('');
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-[#EE4D2D] to-[#F94E2F] text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      {/* Slim Utility Row (Desktop) */}
      <div className="hidden md:block border-b border-white/15">
        <div className="max-w-[1200px] mx-auto px-4 h-8 flex items-center justify-between text-[12px] text-white/95">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenInfoModal('seller')}
              className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Seller Centre</span>
            </button>
            <span aria-hidden="true" className="text-white/30">
              |
            </span>
            <button
              type="button"
              onClick={onQuickFilterFreeShipping}
              className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Free Shipping Over $25</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenInfoModal('guarantee')}
              className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Buyer Guarantee</span>
            </button>
            <span aria-hidden="true" className="text-white/30">
              |
            </span>
            <button
              type="button"
              onClick={() => onOpenInfoModal('help')}
              className="inline-flex items-center gap-1.5 hover:text-white/80 transition-colors cursor-pointer whitespace-nowrap"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Master Header Row */}
      <div className="max-w-[1200px] mx-auto px-4 py-2.5 md:py-3 flex items-center gap-3 md:gap-8">
        {/* Brand Zone */}
        <button
          type="button"
          onClick={onResetHome}
          className="flex items-center gap-2 text-white hover:opacity-95 transition-opacity cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-white rounded"
          aria-label="ShopVibe Home"
        >
          <span className="w-8 h-8 md:w-9 md:h-9 rounded-[4px] bg-white text-[#EE4D2D] flex items-center justify-center shadow-xs">
            <ShoppingBag className="w-5 h-5 stroke-[2.25]" />
          </span>
          <span className="text-xl md:text-[22px] font-bold tracking-tight">ShopVibe</span>
        </button>

        {/* Marketplace Master Search */}
        <div ref={searchBoxRef} className="flex-1 min-w-0 relative">
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-white rounded-[4px] p-[3px] border-2 border-[#EE4D2D] shadow-xs focus-within:ring-2 focus-within:ring-[#FFC107]"
          >
            <input
              type="text"
              value={inputValue}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search wireless audio, titanium watch, skincare, sneakers..."
              aria-label="Search marketplace products"
              className="flex-1 min-w-0 px-3 py-1.5 text-[14px] text-[#222222] placeholder:text-[#757575] bg-transparent outline-none"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search"
                className="p-1.5 text-[#757575] hover:text-[#222222] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="bg-[#EE4D2D] hover:bg-[#F94E2F] active:scale-[0.98] text-white px-4 md:px-5 py-1.5 rounded-[2px] flex items-center justify-center transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 stroke-[2.25]" />
            </button>
          </form>

          {/* Trending Keywords Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 mt-1.5 text-[11px] text-white/90 overflow-hidden">
            {TRENDING_KEYWORDS.slice(0, 5).map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => handleSuggestionClick(kw)}
                className="hover:underline hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Search Suggestions Popover */}
          {showSuggestions && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] md:top-[44px] bg-white rounded-[4px] border border-[#E8E8E8] shadow-[0_12px_32px_rgba(0,0,0,0.14)] z-50 overflow-hidden">
              <div className="px-3 py-2 bg-[#F5F5F5] border-b border-[#E8E8E8] text-[11px] font-semibold text-[#757575]">
                Trending Searches
              </div>
              <div className="divide-y divide-[#F5F5F5]">
                {TRENDING_KEYWORDS.filter(
                  (kw) =>
                    !inputValue.trim() ||
                    kw.toLowerCase().includes(inputValue.trim().toLowerCase())
                ).map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => handleSuggestionClick(kw)}
                    className="w-full px-3 py-2 text-left text-[13px] text-[#222222] hover:bg-[#FFF5F3] hover:text-[#EE4D2D] flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{kw}</span>
                    <Search className="w-3.5 h-3.5 text-[#757575]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Utility Actions: Wishlist & Cart */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button
            type="button"
            onClick={onOpenWishlist}
            aria-label={`Saved items (${wishlistCount})`}
            className="relative p-2 rounded-[4px] hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FFC107] text-[#222222] text-[10px] font-bold flex items-center justify-center tabular-nums border border-[#EE4D2D]">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping cart (${cartCount} items)`}
            className="relative p-2 rounded-[4px] hover:bg-white/15 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-white"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
            <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[18px] px-1 rounded-full bg-white text-[#EE4D2D] text-[11px] font-bold flex items-center justify-center tabular-nums shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
