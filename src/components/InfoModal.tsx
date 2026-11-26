import React from 'react';
import { X, ShieldCheck, Store, HelpCircle, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface InfoModalProps {
  mode: 'seller' | 'help' | 'guarantee' | 'wishlist' | null;
  wishlistProducts: Product[];
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  mode,
  wishlistProducts,
  onClose,
  onSelectProduct,
  onRemoveWishlist,
}) => {
  if (!mode) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-[520px] bg-white rounded-[4px] border border-[#E8E8E8] shadow-[0_12px_32px_rgba(0,0,0,0.16)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-3.5 border-b border-[#E8E8E8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mode === 'seller' && <Store className="w-4 h-4 text-[#EE4D2D]" />}
            {mode === 'help' && <HelpCircle className="w-4 h-4 text-[#EE4D2D]" />}
            {mode === 'guarantee' && <ShieldCheck className="w-4 h-4 text-[#EE4D2D]" />}
            {mode === 'wishlist' && <Heart className="w-4 h-4 text-[#EE4D2D] fill-[#EE4D2D]" />}
            <h3 className="text-[16px] font-bold text-[#222222]">
              {mode === 'seller' && 'ShopVibe Seller Centre'}
              {mode === 'help' && 'Help & Customer Care'}
              {mode === 'guarantee' && 'ShopVibe Buyer Guarantee'}
              {mode === 'wishlist' && `Saved Items (${wishlistProducts.length})`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#757575] hover:text-[#222222] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto">
          {mode === 'seller' && (
            <div className="space-y-3 text-[13px] text-[#222222]">
              <p className="leading-relaxed">
                Launch your storefront on ShopVibe with zero upfront listing fees, integrated Flash Sale campaigns, and verified Mall badges.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px]">
                  <div className="font-bold text-[#EE4D2D] text-[16px] tabular-nums">0% Fee</div>
                  <div className="text-[12px] text-[#757575] mt-0.5">First 90 days for new stores</div>
                </div>
                <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px]">
                  <div className="font-bold text-[#EE4D2D] text-[16px] tabular-nums">24h Payout</div>
                  <div className="text-[12px] text-[#757575] mt-0.5">Fast settlement on delivery</div>
                </div>
              </div>
            </div>
          )}

          {mode === 'guarantee' && (
            <div className="space-y-3 text-[13px] text-[#222222]">
              <p className="leading-relaxed">
                Every order on ShopVibe is protected by Escrow Guarantee: funds are only released to sellers after you confirm receipt of authentic items in good condition.
              </p>
              <ul className="space-y-1.5 text-[#757575] text-[12px] list-disc pl-4">
                <li>100% Authentic guarantee on all Official Mall listings</li>
                <li>15-day hassle-free returns and instant voucher refunds</li>
                <li>Free shipping threshold unlocked automatically at $25+</li>
              </ul>
            </div>
          )}

          {mode === 'help' && (
            <div className="space-y-3 text-[13px] text-[#222222]">
              <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px]">
                <div className="font-semibold mb-1">How do vouchers stack?</div>
                <p className="text-[12px] text-[#757575]">
                  Claim any voucher on the homepage strip and select it inside your Cart Drawer before checkout.
                </p>
              </div>
              <div className="p-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px]">
                <div className="font-semibold mb-1">What is Cash on Delivery (COD)?</div>
                <p className="text-[12px] text-[#757575]">
                  Pay directly to the courier upon package arrival with full Buyer Guarantee coverage.
                </p>
              </div>
            </div>
          )}

          {mode === 'wishlist' && (
            <>
              {wishlistProducts.length === 0 ? (
                <p className="text-[13px] text-[#757575] text-center py-6">
                  No saved items yet. Click the heart icon on any product card to save it for later.
                </p>
              ) : (
                <div className="divide-y divide-[#F0EDED]">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-[4px] border border-[#E8E8E8] overflow-hidden shrink-0">
                        <MarketplaceImage
                          src={p.image}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[#222222] line-clamp-1">
                          {p.title}
                        </p>
                        <p className="text-[14px] font-bold text-[#EE4D2D] tabular-nums mt-0.5">
                          ${p.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProduct(p);
                          }}
                          className="px-2.5 py-1.5 bg-[#EE4D2D] text-white text-[12px] font-semibold rounded-[4px] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveWishlist(p.id)}
                          aria-label="Remove saved item"
                          className="p-1.5 text-[#757575] hover:text-[#ba1a1a] cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
