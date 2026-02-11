import React from 'react';

// Base Skeleton Component
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`skeleton ${className}`} />
);

// Skeleton Text
export const SkeletonText: React.FC<{ lines?: number; width?: string; size?: 'small' | 'base' | 'large' }> = ({
  lines = 1,
  width = '100%',
  size = 'base',
}) => (
  <>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`skeleton skeleton-text ${size !== 'base' ? size : ''}`}
        style={{ width: index === lines - 1 ? width : '100%' }}
      />
    ))}
  </>
);

// Skeleton Avatar
export const SkeletonAvatar: React.FC<{ size?: 'small' | 'base' | 'large' }> = ({ size = 'base' }) => (
  <div className={`skeleton skeleton-avatar ${size !== 'base' ? size : ''}`} />
);

// Skeleton Image
export const SkeletonImage: React.FC<{ aspectRatio?: 'wide' | 'square' | '16:9' }> = ({
  aspectRatio = '16:9',
}) => <div className={`skeleton skeleton-image ${aspectRatio !== '16:9' ? aspectRatio : ''}`} />;

// Skeleton Button
export const SkeletonButton: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => (
  <div className={`skeleton skeleton-button ${fullWidth ? 'full-width' : ''}`} />
);

// Skeleton Card
export const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-card-header">
      <SkeletonAvatar />
      <div style={{ flex: 1 }}>
        <SkeletonText lines={1} width="60%" size="large" />
        <SkeletonText lines={1} width="40%" size="small" />
      </div>
    </div>
    <SkeletonText lines={3} width="90%" />
    <div style={{ marginTop: '1rem' }}>
      <SkeletonButton />
    </div>
  </div>
);

// Skeleton Coupon Card
export const SkeletonCouponCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-coupon-card">
      <div className="skeleton-coupon-image skeleton" />
      <div className="skeleton-coupon-content">
        <SkeletonText lines={1} width="80%" size="large" />
        <SkeletonText lines={2} width="100%" />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton Shop Card
export const SkeletonShopCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-shop-card">
      <div className="skeleton-shop-logo skeleton" />
      <div className="skeleton-shop-info">
        <SkeletonText lines={1} width="70%" size="large" />
        <SkeletonText lines={2} width="100%" size="small" />
        <div style={{ marginTop: '0.5rem' }}>
          <SkeletonButton />
        </div>
      </div>
    </div>
  </div>
);

// Skeleton Dashboard Card
export const SkeletonDashboardCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="skeleton-dashboard-card">
      <div className="skeleton-stat">
        <div className="skeleton-stat-value skeleton" />
        <div className="skeleton-stat-label skeleton" />
      </div>
      <SkeletonAvatar size="large" />
    </div>
  </div>
);

// Skeleton Table
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="skeleton-table">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="skeleton-table-row">
        <div className="skeleton-table-cell skeleton" />
        <div className="skeleton-table-cell skeleton" />
        <div className="skeleton-table-cell skeleton" />
        <div className="skeleton-table-cell skeleton" />
      </div>
    ))}
  </div>
);

// Skeleton Grid
export const SkeletonGrid: React.FC<{ items?: number; component?: React.ReactNode }> = ({
  items = 6,
  component = <SkeletonCard />,
}) => (
  <div className="skeleton-grid">
    {Array.from({ length: items }).map((_, index) => (
      <div key={index}>{component}</div>
    ))}
  </div>
);

// Progressive Image Component
interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
}

export const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholderSrc,
  alt,
  className = '',
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`progressive-image-container ${isLoaded ? 'loaded' : ''} ${className}`}>
      {placeholderSrc && (
        <img src={placeholderSrc} alt="" className="progressive-image-placeholder" aria-hidden="true" />
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`progressive-image-main ${isLoaded ? 'loaded' : ''}`}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
};

// Lazy Load Wrapper
interface LazyLoadProps {
  children: React.ReactNode;
  minHeight?: string;
}

export const LazyLoad: React.FC<LazyLoadProps> = ({ children, minHeight = '200px' }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lazy-load-wrapper ${isVisible ? 'loaded' : ''}`}
      style={{ minHeight }}
    >
      {isVisible && <div className="content-loaded">{children}</div>}
    </div>
  );
};
