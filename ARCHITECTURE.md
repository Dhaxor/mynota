# Architecture

This document describes the technical architecture of mynota.

## Overview

mynota is a client-side web application built with Next.js 16 that provides a minimal text editing experience with URL-based compression and sharing capabilities.

## Core Principles

1. **Client-Side Only** - No backend servers, all processing happens in the browser
2. **Privacy First** - No data leaves the user's device
3. **URL as Storage** - Compressed text is stored in the URL hash for easy sharing
4. **Progressive Enhancement** - Works without JavaScript for basic functionality
5. **Performance** - Fast load times and instant interactions

## Technology Stack

### Frontend Framework
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better developer experience

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **next-themes** - Theme management (dark/light mode)

### Build Tools
- **Turbopack** - Fast development bundler
- **pnpm** - Efficient package manager

## Project Structure

```
mynota/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Home page (renders Editor)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── editor.tsx         # Main editor component
│   ├── editor-toolbar.tsx # Toolbar with actions and stats
│   ├── qr-modal.tsx       # QR code generation modal
│   ├── welcome-overlay.tsx # First-time user welcome
│   ├── theme-provider.tsx # Theme context provider
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
│   ├── compression.ts     # Text compression/decompression
│   └── utils.ts           # General utilities
├── hooks/                 # Custom React hooks
│   ├── use-mobile.tsx     # Mobile detection hook
│   └── use-toast.ts       # Toast notifications hook
└── styles/                # Additional styles
    └── globals.css        # Extended global styles
```

## Key Components

### Editor (`components/editor.tsx`)
The main component that handles:
- Text input and editing
- Auto-save with debouncing (500ms)
- URL hash synchronization
- localStorage persistence
- Statistics calculation
- Keyboard shortcuts

### Compression (`lib/compression.ts`)
Handles text compression using:
- **Algorithm**: deflate-raw (native Compression Streams API)
- **Encoding**: Base64URL (URL-safe)
- **Compression Ratio**: Typically 40-70% for text content

### Storage Strategy

1. **Primary**: URL Hash
   - Compressed text stored in `window.location.hash`
   - Enables sharing via URL
   - Survives page refreshes

2. **Backup**: localStorage
   - Uncompressed text stored locally
   - Provides persistence across sessions
   - Fallback when URL hash is invalid

## Data Flow

```
User Input → Debounce (500ms) → Compress → Update URL Hash + localStorage
                                          ↓
                                    Update Stats
                                          ↓
                                    Update UI
```

## Compression Algorithm

```typescript
Text → UTF-8 Encode → Deflate-Raw → Base64 → URL-Safe Base64 → URL Hash
```

## Decompression Algorithm

```typescript
URL Hash → URL-Safe Base64 → Base64 → Inflate-Raw → UTF-8 Decode → Text
```

## Performance Optimizations

1. **Debounced Saves** - Reduces compression operations
2. **Turbopack** - Fast development builds
3. **Static Generation** - Pre-rendered at build time
4. **Code Splitting** - Automatic by Next.js
5. **Font Optimization** - Next.js font optimization

## Browser Compatibility

Requires modern browsers with support for:
- Compression Streams API (Chrome 80+, Firefox 113+, Safari 16.4+)
- localStorage
- URL API
- TextEncoder/TextDecoder

## Security Considerations

1. **No Server** - No server-side vulnerabilities
2. **No Cookies** - No tracking or session management
3. **No External Requests** - All processing is local
4. **CSP Headers** - Content Security Policy via Vercel
5. **XSS Protection** - React's built-in XSS protection

## Deployment

### Vercel (Recommended)
- Automatic deployments from GitHub
- Edge network for fast global access
- Zero configuration required
- Environment variables (if needed)

### Build Process
```bash
pnpm install  # Install dependencies
pnpm build    # Create production build
pnpm start    # Start production server
```

## Future Considerations

- Markdown preview mode
- Syntax highlighting
- Multiple note management
- Export to more formats (PDF, HTML)
- Collaborative editing (WebRTC)
- Offline PWA support
- Custom themes

