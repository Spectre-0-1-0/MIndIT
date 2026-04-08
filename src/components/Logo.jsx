import React from 'react';

/**
 * Logo Component
 *
 * A flexible logo component with placeholder implementation for easy replacement.
 *
 * Props:
 * - variant: 'header' | 'hero' | 'footer' | 'results' | 'contact' | 'udaan'
 * - className: Additional CSS classes
 * - alt: Alt text for accessibility (defaults to "Organization Logo")
 * - title: Title attribute for tooltip
 * - width: Custom width (overrides variant defaults)
 * - height: Custom height (overrides variant defaults)
 */
const Logo = ({
  variant = 'header',
  className = '',
  alt = 'Organization Logo',
  title = 'MindCheck - Mental Health Assessment Platform',
  width,
  height,
  ...props
}) => {
  // Define default dimensions for each variant
  const dimensions = {
    header: { width: 40, height: 40 },
    hero: { width: 100, height: 100 },
    footer: { width: 60, height: 60 },
    results: { width: 80, height: 80 },
    contact: { width: 70, height: 70 },
    udaan: { width: 90, height: 90 },
  };

  const { width: defaultWidth, height: defaultHeight } = dimensions[variant] || dimensions.header;
  const logoWidth = width || defaultWidth;
  const logoHeight = height || defaultHeight;

  // Placeholder SVG with professional styling
  const PlaceholderLogo = () => (
    <svg
      width={logoWidth}
      height={logoHeight}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`logo-placeholder ${className}`}
      role="img"
      aria-labelledby="logo-title"
      {...props}
    >
      <title id="logo-title">{title}</title>
      {/* Background circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#logoGradient)"
        stroke="#e2e8f0"
        strokeWidth="2"
      />

      {/* Mind/Brain icon representation */}
      <g transform="translate(25, 25)">
        {/* Brain outline */}
        <path
          d="M25 15c-5 0-9 4-9 9 0 2 0.5 4 1.5 5.5C15 32 13 35 13 38.5c0 6.5 5.5 11.5 12 11.5s12-5 12-11.5c0-3.5-2-6.5-4.5-9C33.5 28 34 26 34 24c0-5-4-9-9-9z"
          fill="#6366f1"
          opacity="0.8"
        />

        {/* Thought waves */}
        <path
          d="M10 20c0-2 1.5-3.5 3.5-3.5"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M6 15c0-2 1.5-3.5 3.5-3.5"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M40 20c0-2-1.5-3.5-3.5-3.5"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M44 15c0-2-1.5-3.5-3.5-3.5"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Heart symbol for care */}
        <path
          d="M25 35c-2-2-5-2-7 0-2 2-2 5 0 7 2 2 5 2 7 0 2-2 2-5 0-7z"
          fill="#ef4444"
          opacity="0.7"
        />
      </g>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
    </svg>
  );

  return (
    <div
      className={`logo-container logo-${variant} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <PlaceholderLogo />
      {/* Screen reader text for better accessibility */}
      <span className="sr-only">{alt}</span>
    </div>
  );
};

export default Logo;