import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../lib/hooks';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder-image.jpg',
  loading = 'lazy',
  onLoad,
  onError,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjM2E0YTVhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+'
}) => {
  const [imageSrc, setImageSrc] = useState<string>(loading === 'lazy' ? placeholder : src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Set the ref for intersection observer
  useEffect(() => {
    if (imgRef.current) {
      elementRef.current = imgRef.current;
    }
  }, [elementRef]);

  // Load image when it comes into view (for lazy loading)
  useEffect(() => {
    if (loading === 'lazy' && hasIntersected && !isLoaded && !hasError) {
      setImageSrc(src);
    }
  }, [hasIntersected, loading, src, isLoaded, hasError]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(true);
    } else {
      onError?.();
    }
  };

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      onLoad={handleLoad}
      onError={handleError}
      loading={loading}
    />
  );
};

// Blur-up image component for progressive loading
export const BlurUpImage: React.FC<OptimizedImageProps & { blurDataURL?: string }> = ({
  src,
  alt,
  className = '',
  blurDataURL,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL || src);

  const handleLoad = () => {
    if (blurDataURL && currentSrc === blurDataURL) {
      setCurrentSrc(src);
    } else {
      setIsLoaded(true);
      props.onLoad?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        className={`transition-all duration-500 ${
          isLoaded ? 'scale-100 blur-0' : 'scale-110 blur-sm'
        }`}
        onLoad={handleLoad}
        onError={props.onError}
        {...props}
      />
    </div>
  );
}; 