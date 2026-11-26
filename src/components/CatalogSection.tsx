import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Star,
  Check,
  RotateCcw,
  ChevronDown,
  X,
} from 'lucide-react';
import { CATEGORIES } from '../data/marketplaceData';
import { CategoryId, FilterState, Product, SortOption } from '../types/marketplace';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  filters: FilterState;
  showSidebar: boolean;
  wishlistIds: string[];
  onToggleSidebar: () => void;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onResetFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
}

const SORT_TABS: { id: SortOption; label: string }[] = [
  { id: 'popular', label: 'Popular' },
  { id: 'latest', label: 'Latest' },
  { id: 'top_sales', label: 'Top Sales' },
];

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  filters,
  showSidebar,
  wishlistIds,
  onToggleSidebar,
  onUpdateFilter,
  onResetFilters,
  onSelectProduct,
  onToggleWishlist,
}) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.category !== 'all' ||
    filters.minPrice !== '' ||
    filters.maxPrice !== '' ||
    filters.minRating > 0 ||
    filters.mallOnly ||
    filters.preferredOnly ||
    filters.freeShippingOnly ||
    filters.flashSaleOnly;

  const renderFacetCheckbox = (
    checked: boolean,
    label: string,
    onChange: () => void
  ) => (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2.5 w-full py-1.5 text-left text-[13px] text-[#222222] hover:text-[#EE4D2D] transition-colors cursor-pointer group"
    >
      <span
        className={`w-4 h-4 rounded-[2px] border-2 flex items-center justify-center shrink-0 transition-colors ${
          checked
            ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
            : 'bg-white border-[#E8E8E8] group-hover:border-[#EE4D2D]/60'
        }`}
      >
        {checked && <Check className="w-3 h-3 stroke-[3]" />}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );

  const sidebarContent = (
    <div className="space-y-5">
      {/* Categories */}
      <div>
        <h3 className="text-[13px] font-bold text-[#222222] mb-2.5">
          By Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const active = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onUpdateFilter('category', cat.id as CategoryId)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-[4px] text-[13px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FFF5F3] text-[#EE4D2D] font-semibold'
                    : 'text-[#222222] hover:bg-[#F5F5F5]'
                }`}
              >
                <span className="truncate">{cat.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#EE4D2D]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-[#E8E8E8]" />

      {/* Service & Promotion Checkboxes */}
      <div>
        <h3 className="text-[13px] font-bold text-[#222222] mb-2">
          Service & Promotion
        </h3>
        <div className="space-y-0.5">
          {renderFacetCheckbox(filters.mallOnly, 'Official Mall', () =>
            onUpdateFilter('mallOnly', !filters.mallOnly)
          )}
          {renderFacetCheckbox(filters.preferredOnly, 'Preferred Seller', () =>
            onUpdateFilter('preferredOnly', !filters.preferredOnly)
          )}
          {renderFacetCheckbox(filters.freeShippingOnly, 'Free Shipping', () =>
            onUpdateFilter('freeShippingOnly', !filters.freeShippingOnly)
          )}
          {renderFacetCheckbox(filters.flashSaleOnly, 'Flash Sale Deals', () =>
            onUpdateFilter('flashSaleOnly', !filters.flashSaleOnly)
          )}
        </div>
      </div>

      <div className="h-px bg-[#E8E8E8]" />

      {/* Price Range */}
      <div>
        <h3 className="text-[13px] font-bold text-[#222222] mb-2.5">
          Price Range ($)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="MIN"
            value={filters.minPrice}
            onChange={(e) => onUpdateFilter('minPrice', e.target.value)}
            aria-label="Minimum price"
            className="w-full px-2.5 py-1.5 text-[12px] bg-white border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D] tabular-nums"
          />
          <span className="text-[#757575] text-xs">—</span>
          <input
            type="number"
            min="0"
            placeholder="MAX"
            value={filters.maxPrice}
            onChange={(e) => onUpdateFilter('maxPrice', e.target.value)}
            aria-label="Maximum price"
            className="w-full px-2.5 py-1.5 text-[12px] bg-white border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D] tabular-nums"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: 'Under $50', min: '', max: '50' },
            { label: '$50–$120', min: '50', max: '120' },
            { label: '$120+', min: '120', max: '' },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onUpdateFilter('minPrice', preset.min);
                onUpdateFilter('maxPrice', preset.max);
              }}
              className="px-2 py-1 text-[11px] font-medium bg-[#F5F5F5] hover:bg-[#FFF5F3] hover:text-[#EE4D2D] text-[#222222] rounded-[2px] transition-colors cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#E8E8E8]" />

      {/* Rating Filter */}
      <div>
        <h3 className="text-[13px] font-bold text-[#222222] mb-2">Rating</h3>
        <div className="space-y-1">
          {[4.9, 4.8, 4.5].map((ratingVal) => {
            const active = filters.minRating === ratingVal;
            return (
              <button
                key={ratingVal}
                type="button"
                onClick={() =>
                  onUpdateFilter('minRating', active ? 0 : ratingVal)
                }
                className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-[4px] text-[12px] transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FFF5F3] text-[#EE4D2D] font-semibold'
                    : 'text-[#222222] hover:bg-[#F5F5F5]'
                }`}
              >
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-[#FFC107] fill-[#FFC107]"
                    />
                  ))}
                </span>
                <span className="tabular-nums">{ratingVal}+ & Up</span>
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="w-full py-2 px-3 bg-[#F5F5F5] hover:bg-[#eae7e7] text-[#222222] text-[12px] font-semibold rounded-[4px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <section id="catalog-section" className="max-w-[1200px] mx-auto px-4 mt-4 pb-12">
      {/* Section Header & Sort Bar */}
      <div className="bg-white rounded-[4px] border border-[#E8E8E8] mb-3">
        <div className="px-4 py-3 border-b border-[#E8E8E8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold text-[#EE4D2D] tracking-tight uppercase">
              {filters.searchQuery
                ? `Search Results for "${filters.searchQuery}"`
                : filters.category !== 'all'
                ? CATEGORIES.find((c) => c.id === filters.category)?.label
                : 'Daily Discover'}
            </h2>
            <span className="text-[12px] text-[#757575] tabular-nums">
              ({products.length} {products.length === 1 ? 'item' : 'items'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#E8E8E8] bg-[#F5F5F5] text-[12px] font-semibold text-[#222222] cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Desktop Faceted Sidebar Toggle */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border text-[12px] font-semibold transition-colors cursor-pointer ${
                showSidebar
                  ? 'border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D]'
                  : 'border-[#E8E8E8] bg-[#F5F5F5] text-[#222222] hover:border-[#EE4D2D]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showSidebar ? 'Hide Filters' : 'Faceted Filters'}</span>
            </button>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="px-4 py-2.5 bg-[#FAFAFA] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[12px] text-[#757575] mr-1">Sort by</span>
            {SORT_TABS.map((tab) => {
              const active = filters.sortBy === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onUpdateFilter('sortBy', tab.id)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-[12px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#EE4D2D] text-white'
                      : 'bg-white border border-[#E8E8E8] text-[#222222] hover:border-[#EE4D2D]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}

            <div className="relative">
              <select
                value={
                  filters.sortBy === 'price_asc' || filters.sortBy === 'price_desc'
                    ? filters.sortBy
                    : ''
                }
                onChange={(e) => {
                  if (e.target.value) {
                    onUpdateFilter('sortBy', e.target.value as SortOption);
                  }
                }}
                aria-label="Sort by price"
                className={`appearance-none pl-3 pr-8 py-1.5 rounded-[4px] text-[12px] font-semibold border cursor-pointer outline-none transition-colors ${
                  filters.sortBy === 'price_asc' || filters.sortBy === 'price_desc'
                    ? 'bg-[#EE4D2D] text-white border-[#EE4D2D]'
                    : 'bg-white text-[#222222] border-[#E8E8E8] hover:border-[#EE4D2D]'
                }`}
              >
                <option value="" className="text-[#222222] bg-white">
                  Price
                </option>
                <option value="price_asc" className="text-[#222222] bg-white">
                  Price: Low to High
                </option>
                <option value="price_desc" className="text-[#222222] bg-white">
                  Price: High to Low
                </option>
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                  filters.sortBy === 'price_asc' || filters.sortBy === 'price_desc'
                    ? 'text-white'
                    : 'text-[#757575]'
                }`}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-[12px] font-semibold text-[#EE4D2D] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Layout: Optional 220px Left Faceted Rail + Dense Product Grid */}
      <div className="flex items-start gap-4">
        {showSidebar && (
          <aside className="hidden lg:block w-[220px] shrink-0 bg-white rounded-[4px] border border-[#E8E8E8] p-4 sticky top-[106px]">
            {sidebarContent}
          </aside>
        )}

        <div className="flex-1 min-w-0">
          {products.length === 0 ? (
            <div className="bg-white rounded-[4px] border border-[#E8E8E8] p-12 text-center">
              <p className="text-[16px] font-semibold text-[#222222] mb-1">
                No matching items found
              </p>
              <p className="text-[13px] text-[#757575] mb-5">
                Try clearing a price limit or switching categories to explore all marketplace deals.
              </p>
              <button
                type="button"
                onClick={onResetFilters}
                className="px-5 py-2 bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[13px] font-semibold rounded-[4px] transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 ${
                showSidebar ? 'lg:grid-cols-5' : 'lg:grid-cols-6'
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isWishlisted={wishlistIds.includes(product.id)}
                  onSelect={onSelectProduct}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-[290px] max-w-[85vw] h-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] flex flex-col">
            <div className="px-4 py-3 border-b border-[#E8E8E8] flex items-center justify-between">
              <span className="text-[15px] font-bold text-[#222222]">
                Search Filters
              </span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 text-[#757575] hover:text-[#222222] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{sidebarContent}</div>
            <div className="p-3 border-t border-[#E8E8E8]">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-[#EE4D2D] text-white text-[13px] font-semibold rounded-[4px] cursor-pointer"
              >
                Apply Filters ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
