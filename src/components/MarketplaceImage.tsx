import React, { useState } from 'react';
import { Package } from 'lucide-react';

interface MarketplaceImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const MarketplaceImage: React.FC<MarketplaceImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF5F3] via-[#F5F5F5] to-[#FCD8D4]/50 text-[#757575] p-3 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Package className="w-7 h-7 text-[#EE4D2D]/60 mb-1.5" />
        <span className="text-[11px] font-medium text-[#5b403b] line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
