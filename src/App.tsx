import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PRODUCTS, VOUCHERS } from './data/marketplaceData';
import { CartItem, CategoryId, FilterState, Product, ProductVariant } from './types/marketplace';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FlashSaleSection } from './components/FlashSaleSection';
import { VoucherStrip } from './components/VoucherStrip';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { InfoModal } from './components/InfoModal';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  minPrice: '',
  maxPrice: '',
  minRating: 0,
  mallOnly: false,
  preferredOnly: false,
  freeShippingOnly: false,
  flashSaleOnly: false,
  sortBy: 'popular',
};

export default function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [showSidebar, setShowSidebar] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopvibe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopvibe_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [claimedVoucherIds, setClaimedVoucherIds] = useState<string[]>(['v-save5']);
  const [selectedVoucherId, setSelectedVoucherId] = useState<string | null>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [infoModalMode, setInfoModalMode] = useState<
    'seller' | 'help' | 'guarantee' | 'wishlist' | null
  >(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('shopvibe_cart', JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('shopvibe_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore storage quota errors
    }
  }, [wishlistIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUpdateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearchSubmit = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    if (query) {
      setShowSidebar(true);
      scrollToCatalog();
    }
  };

  const handleSelectCategory = (category: CategoryId) => {
    setFilters((prev) => ({ ...prev, category }));
    if (category !== 'all') {
      setShowSidebar(true);
    }
    scrollToCatalog();
  };

  const handleBannerAction = (action: 'flash' | 'mall' | 'vouchers') => {
    if (action === 'vouchers') {
      const el = document.getElementById('voucher-hub');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (action === 'flash') {
      setFilters({ ...INITIAL_FILTERS, flashSaleOnly: true });
      setShowSidebar(true);
      scrollToCatalog();
      return;
    }
    if (action === 'mall') {
      setFilters({ ...INITIAL_FILTERS, mallOnly: true });
      setShowSidebar(true);
      scrollToCatalog();
    }
  };

  const handleResetHome = () => {
    setFilters(INITIAL_FILTERS);
    setShowSidebar(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimVoucher = (voucherId: string) => {
    if (claimedVoucherIds.includes(voucherId)) {
      showToast('Voucher already claimed — apply it in your cart!');
      return;
    }
    setClaimedVoucherIds((prev) => [...prev, voucherId]);
    const v = VOUCHERS.find((item) => item.id === voucherId);
    showToast(`Claimed ${v?.title || 'voucher'} (${v?.code})`);
  };

  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      showToast(exists ? 'Removed from saved items' : 'Saved to wishlist');
      return next;
    });
  };

  const handleAddToCart = (
    product: Product,
    variant: ProductVariant,
    quantity: number,
    openDrawer = false
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.variant.id === variant.id
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { product, variant, quantity }];
    });

    if (openDrawer) {
      setSelectedProduct(null);
      setCartOpen(true);
    } else {
      showToast(`Added ${quantity} × ${product.brand} to cart`);
    }
  };

  const handleUpdateCartQuantity = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.variant.id === variantId) {
            return { ...item, quantity: item.quantity + delta };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.variant.id === variantId)
      )
    );
  };

  const flashSaleProducts = useMemo(
    () => PRODUCTS.filter((p) => p.isFlashSale),
    []
  );

  const filteredProducts = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    const minP = filters.minPrice !== '' ? parseFloat(filters.minPrice) : null;
    const maxP = filters.maxPrice !== '' ? parseFloat(filters.maxPrice) : null;

    const list = PRODUCTS.filter((p) => {
      if (
        q &&
        !p.title.toLowerCase().includes(q) &&
        !p.brand.toLowerCase().includes(q) &&
        !p.category.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.category !== 'all' && p.category !== filters.category) {
        return false;
      }
      if (minP !== null && !Number.isNaN(minP) && p.price < minP) return false;
      if (maxP !== null && !Number.isNaN(maxP) && p.price > maxP) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.mallOnly && p.badgeType !== 'mall') return false;
      if (filters.preferredOnly && p.badgeType !== 'preferred') return false;
      if (filters.freeShippingOnly && !p.freeShipping) return false;
      if (filters.flashSaleOnly && !p.isFlashSale) return false;
      return true;
    });

    const sorted = [...list];
    switch (filters.sortBy) {
      case 'top_sales':
        sorted.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case 'price_asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'latest':
        sorted.reverse();
        break;
      case 'popular':
      default:
        sorted.sort((a, b) => b.rating * b.soldCount - a.rating * a.soldCount);
        break;
    }
    return sorted;
  }, [filters]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const wishlistProducts = useMemo(
    () => PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#222222]">
      <Header
        searchQuery={filters.searchQuery}
        onSearchSubmit={handleSearchSubmit}
        onResetHome={handleResetHome}
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setInfoModalMode('wishlist')}
        onOpenInfoModal={(tab) => setInfoModalMode(tab)}
        onQuickFilterFreeShipping={() => {
          setFilters({ ...INITIAL_FILTERS, freeShippingOnly: true });
          setShowSidebar(true);
          scrollToCatalog();
        }}
      />

      <main className="flex-1">
        <HeroSection
          activeCategory={filters.category}
          onSelectCategory={handleSelectCategory}
          onTriggerBannerAction={handleBannerAction}
        />

        <FlashSaleSection
          products={flashSaleProducts}
          onSelectProduct={setSelectedProduct}
          onSeeAllFlashSales={() => handleBannerAction('flash')}
        />

        <VoucherStrip
          vouchers={VOUCHERS}
          claimedIds={claimedVoucherIds}
          onClaimVoucher={handleClaimVoucher}
        />

        <CatalogSection
          products={filteredProducts}
          filters={filters}
          showSidebar={showSidebar}
          wishlistIds={wishlistIds}
          onToggleSidebar={() => setShowSidebar((prev) => !prev)}
          onUpdateFilter={handleUpdateFilter}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          onSelectProduct={setSelectedProduct}
          onToggleWishlist={handleToggleWishlist}
        />
      </main>

      {/* Clean Marketplace Footer */}
      <footer className="bg-white border-t border-[#E8E8E8] py-8 mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#757575]">
          <div>
            <span className="font-bold text-[#222222] text-[14px] mr-2">
              ShopVibe
            </span>
            <span>Vibrant Marketplace · Curated Flash Deals & Official Mall</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setInfoModalMode('guarantee')}
              className="hover:text-[#EE4D2D] cursor-pointer"
            >
              Buyer Guarantee
            </button>
            <button
              type="button"
              onClick={() => setInfoModalMode('seller')}
              className="hover:text-[#EE4D2D] cursor-pointer"
            >
              Sell on ShopVibe
            </button>
            <button
              type="button"
              onClick={() => setInfoModalMode('help')}
              className="hover:text-[#EE4D2D] cursor-pointer"
            >
              Help Centre
            </button>
            <span>© 2026 ShopVibe</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        isWishlisted={
          selectedProduct ? wishlistIds.includes(selectedProduct.id) : false
        }
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={(id) => handleToggleWishlist(id)}
      />

      <CartDrawer
        isOpen={cartOpen}
        items={cart}
        vouchers={VOUCHERS}
        claimedVoucherIds={claimedVoucherIds}
        selectedVoucherId={selectedVoucherId}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onSelectVoucher={setSelectedVoucherId}
        onClearCart={() => {
          setCart([]);
          setSelectedVoucherId(null);
        }}
      />

      <InfoModal
        mode={infoModalMode}
        wishlistProducts={wishlistProducts}
        onClose={() => setInfoModalMode(null)}
        onSelectProduct={setSelectedProduct}
        onRemoveWishlist={(id) => handleToggleWishlist(id)}
      />

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#222222] text-white px-4 py-2.5 rounded-[4px] shadow-[0_8px_24px_rgba(0,0,0,0.2)] flex items-center gap-2 text-[13px] font-medium whitespace-nowrap"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FFC107]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
