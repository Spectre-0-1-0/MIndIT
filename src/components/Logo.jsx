import React from 'react';
import UdaanLogo from '../assets/Udaan_logo-removebg-preview.webp';

/**
 * Logo Component
 *
 * Uses the actual UDAAN logo from assets folder.
 *
 * Props:
 * - variant: 'header' | 'hero' | 'footer' | 'results' | 'contact' | 'udaan'
 * - className: Additional CSS classes
 * - alt: Alt text for accessibility (defaults to "UDAAN Logo")
 * - title: Title attribute for tooltip
 * - width: Custom width (overrides variant defaults)
 * - height: Custom height (overrides variant defaults)
 */
const Logo = ({
  variant = 'header',
  className = '',
  alt = 'UDAAN - A UDAAN Initiative Logo',
  title = 'MCheck - A UDAAN Initiative - Mental Health Assessment Platform',
  width,
  height,
  ...props
}) => {
  // Define default dimensions for each variant
  const dimensions = {
    header: { width: 45, height: 45 },
    hero: { width: 120, height: 120 },
    footer: { width: 70, height: 70 },
    results: { width: 90, height: 90 },
    contact: { width: 85, height: 85 },
    udaan: { width: 110, height: 110 },
  };

  const { width: defaultWidth, height: defaultHeight } = dimensions[variant] || dimensions.header;
  const logoWidth = width || defaultWidth;
  const logoHeight = height || defaultHeight;

  return (
    <div
      className={`logo-container logo-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={UdaanLogo}
        alt={alt}
        title={title}
        width={logoWidth}
        height={logoHeight}
        className="logo-image asmr-hover"
        style={{
          objectFit: 'contain',
          maxWidth: '100%',
          maxHeight: '100%',
        }}
        {...props}
      />
      {/* Screen reader text for better accessibility */}
      <span className="sr-only">{alt}</span>
    </div>
  );
};

export default Logo;