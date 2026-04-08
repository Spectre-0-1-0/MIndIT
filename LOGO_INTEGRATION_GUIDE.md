# Logo Integration Guide for MindCheck Platform

## Overview
The MindCheck platform now includes comprehensive logo integration with professional placeholder components. This guide explains how to replace placeholders with actual organization logos.

## Logo Component Architecture

### Component Structure
- **Location**: `src/components/Logo.jsx`
- **Styles**: `src/components/Logo.css`
- **Variants**: header, hero, footer, results, contact, udaan

### Component Props
```jsx
<Logo
  variant="header"           // Required: defines size and styling
  alt="Organization Logo"    // Accessibility text
  title="Tooltip text"       // Optional tooltip
  width={40}                 // Optional custom width
  height={40}                // Optional custom height
  className="custom-class"   // Optional additional CSS classes
/>
```

## Integration Points

### 1. Header/Navigation Bar
- **File**: `src/components/Header.jsx`
- **Location**: Top left corner, replaces "MC" text
- **Variant**: `header`
- **Size**: 40x40px (responsive: 32px mobile)

### 2. Footer Section
- **File**: `src/components/Footer.jsx`
- **Location**: Next to copyright information
- **Variant**: `footer`
- **Size**: 60x60px (responsive: 48px tablet, 40px mobile)

### 3. Homepage Hero Section
- **File**: `src/pages/Home.jsx`
- **Location**: Prominent placement above title
- **Variant**: `hero`
- **Size**: 100x100px (responsive: 80px mobile)

### 4. Results Page
- **File**: `src/pages/ResultsPage.jsx`
- **Location**: Branding area above results
- **Variant**: `results`
- **Size**: 80x80px

### 5. Contact Us Page
- **File**: `src/pages/ContactUs.jsx`
- **Location**: Above page title for trust-building
- **Variant**: `contact`
- **Size**: 70x70px

### 6. UDAAN Initiative Page
- **File**: `src/pages/UdaanPage.jsx`
- **Location**: Program branding above title
- **Variant**: `udaan`
- **Size**: 90x90px

## Replacing Placeholders

### Step 1: Prepare Logo Assets
Create logo variants optimized for different contexts:

```
public/logos/
├── logo-primary.svg          # Full color, high quality
├── logo-primary.png          # PNG fallback
├── logo-monochrome.svg       # Single color for dark backgrounds
├── logo-monochrome.png       # PNG fallback
├── logo-square.svg          # Square format for favicons
└── logo-square.png          # Square PNG
```

### Step 2: Update Logo Component
Replace the placeholder SVG in `src/components/Logo.jsx`:

```jsx
// Replace this section:
const PlaceholderLogo = () => (
  <svg width={logoWidth} height={logoHeight} ...>
    {/* Current placeholder SVG */}
  </svg>
);

// With this:
const ActualLogo = () => (
  <img
    src="/logos/logo-primary.svg"
    alt={alt}
    width={logoWidth}
    height={logoHeight}
    className="logo-image"
    onError={(e) => {
      // Fallback to PNG if SVG fails
      e.target.src = '/logos/logo-primary.png';
    }}
  />
);
```

### Step 3: Update CSS Classes
Add logo-specific styles in `src/components/Logo.css`:

```css
.logo-image {
  object-fit: contain;
  transition: all 0.3s ease;
}

.logo-image:hover {
  transform: scale(1.05);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .logo-image {
    /* Use monochrome version for dark backgrounds */
    content: url('/logos/logo-monochrome.svg');
  }
}
```

### Step 4: Update Alt Text and Titles
Customize alt text and titles for your organization:

```jsx
<Logo
  variant="header"
  alt="Your Organization Name - Mental Health Platform"
  title="Visit Your Organization Website"
/>
```

## Responsive Design Considerations

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

### Size Adjustments
```css
/* Example responsive logo sizing */
@media (max-width: 480px) {
  .logo-header .logo-image {
    width: 28px !important;
    height: 28px !important;
  }
}
```

## Accessibility Guidelines

### Alt Text Requirements
- **Header**: "Organization Name - Mental Health Platform"
- **Hero**: "Organization Name Logo"
- **Footer**: "Organization Name"
- **Results**: "Organization Name Assessment Results"
- **Contact**: "Organization Name Contact Support"
- **UDAAN**: "Organization Name UDAAN Initiative"

### Screen Reader Support
- Include `role="img"` for SVG logos
- Use semantic HTML structure
- Ensure sufficient color contrast

## Performance Optimization

### Image Optimization
1. **Compress SVG files** using tools like SVGO
2. **Create WebP versions** for modern browsers
3. **Use appropriate sizes** to avoid oversized images

### Loading Strategy
```jsx
// Lazy loading for non-critical logos
<Logo
  variant="footer"
  loading="lazy"
  alt="Organization Logo"
/>
```

### CDN Integration
```jsx
// For external logo hosting
<img
  src="https://cdn.organization.com/logo.svg"
  alt={alt}
  width={logoWidth}
  height={logoHeight}
  onError={(e) => {
    // Fallback to local copy
    e.target.src = '/logos/logo-primary.svg';
  }}
/>
```

## Branding Guidelines

### Logo Clear Space
Maintain minimum clear space equal to logo height around all sides.

### Color Variations
- **Primary**: Full color for light backgrounds
- **Monochrome**: Single color for dark backgrounds
- **Inverted**: For special cases requiring contrast

### File Formats
- **SVG**: Preferred for scalability and small file size
- **PNG**: Fallback with transparency support
- **WebP**: Modern format for optimal compression

## Testing Checklist

- [ ] Logos display correctly on all screen sizes
- [ ] Alt text is descriptive and accurate
- [ ] Hover effects work appropriately
- [ ] Dark mode compatibility
- [ ] High contrast mode support
- [ ] Print styles work correctly
- [ ] Loading states are smooth
- [ ] Error fallbacks function properly

## Future Enhancements

### Logo Variants
- Seasonal logo versions
- Event-specific branding
- Multilingual logo adaptations

### Advanced Features
- Logo animation on page load
- Interactive logo elements
- Logo tooltip with additional information

## Support

For questions about logo integration or customization needs, refer to the development team or check the component documentation in `src/components/Logo.jsx`.