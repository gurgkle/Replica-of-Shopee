import React from 'react';
import { Ticket, Check } from 'lucide-react';
import { Voucher } from '../types/marketplace';

interface VoucherStripProps {
  vouchers: Voucher[];
  claimedIds: string[];
  onClaimVoucher: (voucherId: string) => void;
}

export const VoucherStrip: React.FC<VoucherStripProps> = ({
  vouchers,
  claimedIds,
  onClaimVoucher,
}) => {
  return (
    <section id="voucher-hub" className="max-w-[1200px] mx-auto px-4 mt-4">
      <div className="bg-white rounded-[4px] border border-[#E8E8E8] p-4">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-[#EE4D2D]" />
            <h2 className="text-[15px] font-bold text-[#222222]">
              Marketplace Vouchers
            </h2>
            <span className="text-[12px] text-[#757575] hidden sm:inline">
              · Claim and apply at checkout
            </span>
          </div>
          <span className="text-[12px] font-semibold text-[#EE4D2D] tabular-nums">
            {claimedIds.length}/{vouchers.length} Claimed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {vouchers.map((voucher) => {
            const isClaimed = claimedIds.includes(voucher.id);
            return (
              <div
                key={voucher.id}
                className="voucher-ticket border border-dashed border-[#EE4D2D] bg-[#FFF5F3] rounded-[4px] px-3.5 py-2.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#EE4D2D] tabular-nums">
                      {voucher.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#b22204] bg-[#ffdad3] px-1.5 py-0.5 rounded-[2px]">
                      {voucher.code}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#222222] font-medium truncate mt-0.5">
                    {voucher.subtitle}
                  </p>
                  <p className="text-[10px] text-[#757575] mt-0.5">
                    {voucher.expiryLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onClaimVoucher(voucher.id)}
                  className={`px-3 py-1.5 rounded-[4px] text-[12px] font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer active:scale-[0.98] ${
                    isClaimed
                      ? 'bg-white border border-[#EE4D2D] text-[#EE4D2D] inline-flex items-center gap-1'
                      : 'bg-[#EE4D2D] hover:bg-[#F94E2F] text-white'
                  }`}
                >
                  {isClaimed ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Claimed</span>
                    </>
                  ) : (
                    <span>Claim</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
