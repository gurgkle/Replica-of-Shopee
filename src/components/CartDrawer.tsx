import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  Minus,
  Plus,
  Ticket,
  Truck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { CartItem, OrderConfirmation, Voucher } from '../types/marketplace';
import { MarketplaceImage } from './MarketplaceImage';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  vouchers: Voucher[];
  claimedVoucherIds: string[];
  selectedVoucherId: string | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onSelectVoucher: (voucherId: string | null) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  vouchers,
  claimedVoucherIds,
  selectedVoucherId,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onSelectVoucher,
  onClearCart,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'ShopVibePay'>('COD');
  const [formError, setFormError] = useState('');
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.product.price + (item.variant.priceDelta || 0)) * item.quantity,
        0
      ),
    [items]
  );

  const baseShipping = subtotal >= 25 || items.every((i) => i.product.freeShipping) ? 0 : 4.99;

  const claimedVouchers = vouchers.filter((v) => claimedVoucherIds.includes(v.id));
  const activeVoucher = claimedVouchers.find((v) => v.id === selectedVoucherId) || null;

  const voucherDiscount = useMemo(() => {
    if (!activeVoucher || subtotal < activeVoucher.minSpend) return 0;
    if (activeVoucher.discountType === 'fixed') return activeVoucher.discountValue;
    if (activeVoucher.discountType === 'shipping') return baseShipping;
    if (activeVoucher.discountType === 'percent') {
      const mallSubtotal = items
        .filter((i) => !activeVoucher.mallOnly || i.product.badgeType === 'mall')
        .reduce(
          (sum, i) => sum + (i.product.price + (i.variant.priceDelta || 0)) * i.quantity,
          0
        );
      const raw = (mallSubtotal * activeVoucher.discountValue) / 100;
      return activeVoucher.maxDiscount ? Math.min(raw, activeVoucher.maxDiscount) : raw;
    }
    return 0;
  }, [activeVoucher, subtotal, baseShipping, items]);

  const total = Math.max(0, subtotal + baseShipping - voucherDiscount);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim() || !postalCode.trim()) {
      setFormError('Please complete your name, phone, delivery address, and postal code.');
      return;
    }
    setFormError('');
    const order: OrderConfirmation = {
      orderId: `SV-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      postalCode: postalCode.trim(),
      paymentMethod,
      subtotal,
      shippingFee: baseShipping,
      voucherDiscount,
      total,
      itemCount: totalCount,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConfirmation(order);
    onClearCart();
    setStep('confirmed');
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setConfirmation(null);
    setFormError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={handleResetAndClose}
      />
      <aside
        className="relative w-full max-w-[440px] h-full bg-white shadow-[0_12px_32px_rgba(0,0,0,0.16)] flex flex-col"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="px-4 py-3.5 border-b border-[#E8E8E8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                aria-label="Back to cart"
                className="p-1 text-[#222222] hover:text-[#EE4D2D] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-[16px] font-bold text-[#222222]">
              {step === 'cart' && `Shopping Cart (${totalCount})`}
              {step === 'checkout' && 'Checkout & Delivery'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close drawer"
            className="p-1.5 rounded-[4px] text-[#757575] hover:bg-[#F5F5F5] hover:text-[#222222] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Cart View */}
        {step === 'cart' && (
          <>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFF5F3] text-[#EE4D2D] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-[15px] font-bold text-[#222222] mb-1">
                  Your shopping cart is empty
                </p>
                <p className="text-[13px] text-[#757575] mb-5">
                  Browse Flash Sale drops or Daily Discover items to fill your bag.
                </p>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2 bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[13px] font-semibold rounded-[4px] transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {/* Free Shipping Progress */}
                <div className="px-4 py-2.5 bg-[#FFF5F3] border-b border-[#E8E8E8] flex items-center gap-2 text-[12px]">
                  <Truck className="w-4 h-4 text-[#EE4D2D] shrink-0" />
                  {baseShipping === 0 ? (
                    <span className="text-[#222222] font-medium">
                      Free Shipping unlocked for your order!
                    </span>
                  ) : (
                    <span className="text-[#222222]">
                      Add{' '}
                      <strong className="text-[#EE4D2D] tabular-nums">
                        ${Math.max(0, 25 - subtotal).toFixed(2)}
                      </strong>{' '}
                      more for Free Shipping
                    </span>
                  )}
                </div>

                {/* Item List */}
                <div className="flex-1 overflow-y-auto divide-y divide-[#F0EDED] px-4">
                  {items.map((item) => {
                    const unitPrice =
                      item.product.price + (item.variant.priceDelta || 0);
                    return (
                      <div
                        key={`${item.product.id}-${item.variant.id}`}
                        className="py-3.5 flex gap-3"
                      >
                        <div className="w-16 h-16 rounded-[4px] border border-[#E8E8E8] overflow-hidden shrink-0 bg-white">
                          <MarketplaceImage
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#222222] line-clamp-1">
                            {item.product.title}
                          </p>
                          <p className="text-[11px] text-[#757575] mt-0.5">
                            {item.variant.label} · {item.product.brand}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-[14px] font-bold text-[#EE4D2D] tabular-nums">
                              ${(unitPrice * item.quantity).toFixed(2)}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className="inline-flex items-center border border-[#E8E8E8] rounded-[4px]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.product.id,
                                      item.variant.id,
                                      -1
                                    )
                                  }
                                  aria-label="Decrease item quantity"
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center text-[12px] font-semibold tabular-nums border-x border-[#E8E8E8]">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.product.id,
                                      item.variant.id,
                                      1
                                    )
                                  }
                                  aria-label="Increase item quantity"
                                  className="w-6 h-6 flex items-center justify-center hover:bg-[#F5F5F5] cursor-pointer"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onRemoveItem(item.product.id, item.variant.id)
                                }
                                aria-label="Remove item"
                                className="p-1 text-[#757575] hover:text-[#ba1a1a] cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Claimed Vouchers Selector */}
                <div className="px-4 py-3 border-t border-[#E8E8E8] bg-[#FAFAFA]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#222222]">
                      <Ticket className="w-3.5 h-3.5 text-[#EE4D2D]" />
                      <span>ShopVibe Vouchers</span>
                    </span>
                    <span className="text-[11px] text-[#757575]">
                      {claimedVouchers.length} claimed
                    </span>
                  </div>
                  {claimedVouchers.length === 0 ? (
                    <p className="text-[11px] text-[#757575]">
                      Claim vouchers on the home strip to unlock instant savings.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {claimedVouchers.map((v) => {
                        const eligible = subtotal >= v.minSpend;
                        const active = selectedVoucherId === v.id;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            disabled={!eligible}
                            onClick={() =>
                              onSelectVoucher(active ? null : v.id)
                            }
                            className={`px-2 py-1 rounded-[2px] text-[11px] font-semibold border border-dashed transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                              active
                                ? 'bg-[#EE4D2D] border-[#EE4D2D] text-white'
                                : 'bg-[#FFF5F3] border-[#EE4D2D] text-[#EE4D2D]'
                            }`}
                          >
                            {v.title} ({v.code})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Summary Footer */}
                <div className="p-4 border-t border-[#E8E8E8] bg-white space-y-2">
                  <div className="flex justify-between text-[13px] text-[#757575] tabular-nums">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#757575] tabular-nums">
                    <span>Shipping</span>
                    <span>{baseShipping === 0 ? 'Free' : `$${baseShipping.toFixed(2)}`}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between text-[13px] text-[#EE4D2D] font-medium tabular-nums">
                      <span>Voucher Discount</span>
                      <span>-${voucherDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-2 border-t border-[#F0EDED] tabular-nums">
                    <span className="text-[14px] font-bold text-[#222222]">Total</span>
                    <span className="text-[22px] font-bold text-[#EE4D2D]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('checkout')}
                    className="w-full py-2.5 bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[14px] font-semibold rounded-[4px] transition-colors cursor-pointer active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* Step 2: Checkout Form */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col overflow-y-auto">
            <div className="flex-1 p-4 space-y-4">
              <div className="bg-[#FFF5F3] border border-dashed border-[#EE4D2D] rounded-[4px] p-3 text-[12px] text-[#222222]">
                <strong>Cash on Delivery (COD)</strong> & Card supported · Free returns within 15 days.
              </div>

              {formError && (
                <div className="bg-[#ffdad6] text-[#93000a] text-[12px] font-medium px-3 py-2 rounded-[4px]">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2 text-[13px] border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 234-8910"
                    className="w-full px-3 py-2 text-[13px] border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="742 Market Street, Apt 4B"
                    className="w-full px-3 py-2 text-[13px] border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-[#222222] mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="94103"
                    className="w-full px-3 py-2 text-[13px] border border-[#E8E8E8] rounded-[4px] outline-none focus:border-[#EE4D2D]"
                  />
                </div>
              </div>

              <div>
                <span className="block text-[12px] font-semibold text-[#222222] mb-2">
                  Payment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'COD', label: 'Cash on Delivery' },
                      { id: 'Card', label: 'Credit / Debit' },
                      { id: 'ShopVibePay', label: 'ShopVibe Pay' },
                    ] as const
                  ).map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`py-2 px-2 rounded-[4px] border text-[11px] font-semibold transition-colors cursor-pointer ${
                        paymentMethod === pm.id
                          ? 'border-[#EE4D2D] bg-[#FFF5F3] text-[#EE4D2D]'
                          : 'border-[#E8E8E8] bg-white text-[#222222]'
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E8E8] bg-white space-y-3">
              <div className="flex justify-between items-baseline tabular-nums">
                <span className="text-[13px] font-semibold text-[#757575]">
                  Order Total ({totalCount} items)
                </span>
                <span className="text-[22px] font-bold text-[#EE4D2D]">
                  ${total.toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[14px] font-semibold rounded-[4px] transition-colors cursor-pointer active:scale-[0.98]"
              >
                Place Order
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Order Confirmed Receipt */}
        {step === 'confirmed' && confirmation && (
          <div className="flex-1 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="text-center pt-4">
              <div className="w-14 h-14 rounded-full bg-[#FFF5F3] text-[#EE4D2D] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-bold text-[#222222]">
                Order #{confirmation.orderId} Confirmed
              </h3>
              <p className="text-[13px] text-[#757575] mt-1">
                Preparing shipment for {confirmation.customerName}
              </p>

              <div className="mt-6 text-left bg-[#FAFAFA] border border-[#E8E8E8] rounded-[4px] p-4 space-y-2 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-[#757575]">Payment</span>
                  <span className="font-semibold text-[#222222]">
                    {confirmation.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#757575]">Deliver to</span>
                  <span className="font-semibold text-[#222222] text-right max-w-[220px]">
                    {confirmation.address}, {confirmation.postalCode}
                  </span>
                </div>
                <div className="flex justify-between tabular-nums">
                  <span className="text-[#757575]">Items Subtotal</span>
                  <span>${confirmation.subtotal.toFixed(2)}</span>
                </div>
                {confirmation.voucherDiscount > 0 && (
                  <div className="flex justify-between text-[#EE4D2D] tabular-nums">
                    <span>Voucher Applied</span>
                    <span>-${confirmation.voucherDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-[#E8E8E8] font-bold text-[#222222] tabular-nums">
                  <span>Total Paid / Due</span>
                  <span className="text-[#EE4D2D]">
                    ${confirmation.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 bg-[#EE4D2D] hover:bg-[#F94E2F] text-white text-[14px] font-semibold rounded-[4px] transition-colors cursor-pointer"
            >
              Back to Marketplace
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
