import React from 'react';

interface KobonzLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'stacked';
  showText?: boolean;
  className?: string;
}

const KobonzLogo: React.FC<KobonzLogoProps> = ({ 
  size = 'md', 
  variant = 'icon',
  showText = true,
  className = '' 
}) => {
  // Size mappings
  const sizeMap = {
    xs: { icon: 24, text: 'text-sm' },
    sm: { icon: 32, text: 'text-base' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 48, text: 'text-2xl' },
    xl: { icon: 64, text: 'text-3xl' }
  };

  const iconSize = sizeMap[size].icon;
  const textSize = sizeMap[size].text;

  // Icon Only - Modern Geometric K
  const IconOnly = () => (
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Main gradient - Blue to Purple */}
        <linearGradient id="kobonzGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#007AFF" />
          <stop offset="50%" stopColor="#5856D6" />
          <stop offset="100%" stopColor="#764BA2" />
        </linearGradient>
        
        {/* Shimmer effect for hover */}
        <linearGradient id="kobonzShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#007AFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#764BA2" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Background circle with gradient */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill="url(#kobonzGradient)"
        className="transition-all duration-300"
      />
      
      {/* Geometric K Shape */}
      {/* Vertical bar of K */}
      <rect 
        x="25" 
        y="25" 
        width="10" 
        height="50" 
        fill="white"
        rx="2"
      />
      
      {/* Upper diagonal of K */}
      <path 
        d="M 35 45 L 70 25 L 75 30 L 40 50 Z" 
        fill="white"
      />
      
      {/* Lower diagonal of K */}
      <path 
        d="M 35 55 L 40 50 L 75 70 L 70 75 Z" 
        fill="white"
      />
      
      {/* Accent dot (represents connection/network) */}
      <circle 
        cx="72" 
        cy="50" 
        r="4" 
        fill="white"
        className="animate-pulse"
      />
    </svg>
  );

  // Full Logo - Icon + Text Horizontal
  const FullLogo = () => (
    <div className={`flex items-center gap-3 ${className}`}>
      <IconOnly />
      {showText && (
        <span className={`font-bold text-gray-900 ${textSize} tracking-tight`}>
          Kobonz
        </span>
      )}
    </div>
  );

  // Stacked Logo - Icon Above Text
  const StackedLogo = () => (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <IconOnly />
      {showText && (
        <span className={`font-bold text-gray-900 ${textSize} tracking-tight`}>
          Kobonz
        </span>
      )}
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'full':
      return <FullLogo />;
    case 'stacked':
      return <StackedLogo />;
    case 'icon':
    default:
      return <IconOnly />;
  }
};

export default KobonzLogo;
