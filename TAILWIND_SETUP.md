# Tailwind CSS Setup for Chrome Extension

## Overview
This Chrome extension project has been configured with Tailwind CSS for modern, utility-first styling.

## Configuration Files

### 1. `tailwind.config.js`
- Configured with content paths for all extension files
- Custom color palette with primary colors
- Extended spacing and font family settings
- Optimized for Chrome extension development

### 2. `postcss.config.js`
- Uses `@tailwindcss/postcss` plugin
- Includes autoprefixer for browser compatibility

### 3. `src/styles.css`
- Main Tailwind CSS file with base, components, and utilities
- Custom component classes for Chrome extension UI
- Imports all Tailwind directives

## Usage

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Custom Components

The following custom CSS classes are available:

- `.chrome-extension-popup` - Styled popup container
- `.chrome-extension-button` - Consistent button styling
- `.chrome-extension-input` - Form input styling
- `.chrome-extension-card` - Card container styling

## Chrome Extension Best Practices

1. **Content Security Policy**: Tailwind CSS is safe for Chrome extensions
2. **File Size**: Tailwind CSS is purged in production builds
3. **Styling**: All styles are scoped to extension components
4. **Compatibility**: Works with Chrome's extension architecture

## File Structure

```
src/
├── styles.css          # Main Tailwind CSS file
├── popup.jsx           # Popup component with Tailwind classes
├── options.jsx         # Options component with Tailwind classes
└── ...

dist/
├── assets/
│   └── styles.js       # Compiled Tailwind CSS
└── ...
```

## Notes

- All Tailwind classes are properly purged in production
- Custom colors are defined in the config for brand consistency
- The setup follows Chrome extension development best practices
