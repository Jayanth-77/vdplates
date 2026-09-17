import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PlateVisualProps {
  code?: string;
  shape?: 'Square' | 'Round';
  name: string;
  imageFileName?: string;
  customImageUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Constructs the local static asset path for product images.
 * Format: /product-images/${product.imageFileName}
 */
export function getProductImageUrl(imageFileName?: string, customImageUrl?: string): string | null {
  if (customImageUrl) return customImageUrl;
  if (!imageFileName) return null;
  if (imageFileName.startsWith('http://') || imageFileName.startsWith('https://') || imageFileName.startsWith('data:')) {
    return imageFileName;
  }
  const cleanName = imageFileName.replace(/^\/?(product-images\/)?/, '');
  return `/product-images/${cleanName}?v=20260917-r2`;
}

export const PlateVisual: React.FC<PlateVisualProps> = ({
  name,
  imageFileName,
  customImageUrl,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = getProductImageUrl(imageFileName, customImageUrl);

  React.useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-3 bg-neutral-950 text-neutral-400 select-none ${className}`}
        role="img"
        aria-label={`${name} (Image not available)`}
      >
        <ImageOff className="w-8 h-8 text-neutral-500 mb-1 stroke-1" />
        <span className="text-[11px] font-medium text-neutral-400 text-center tracking-tight">
          Image not available
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center w-full h-full bg-black overflow-hidden ${className}`}>
      <img
        src={imageUrl}
        alt={name}
        className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
