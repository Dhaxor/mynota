# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-16

### Added
- Initial release of mynota
- URL-based text compression using deflate-raw algorithm
- Auto-save to localStorage with debounced syncing
- Dark/light theme support with system preference detection
- Real-time statistics (word count, character count, line count, byte size)
- Compression ratio display
- URL length tracking
- Download as .txt file with smart filename generation
- QR code generation for easy mobile sharing
- Welcome overlay for first-time users
- Keyboard shortcuts (Tab for indentation, Ctrl/Cmd+S for save)
- Responsive design for mobile, tablet, and desktop
- Copy URL to clipboard functionality
- Dynamic document title based on content
- Monospace font (JetBrains Mono) for editor
- Clean, minimal UI with shadcn/ui components

### Technical
- Built with Next.js 16 and React 19
- TypeScript for type safety
- Tailwind CSS for styling
- Turbopack for fast development builds
- Client-side only (no backend required)
- Compression Streams API for native browser compression
- localStorage for persistence
- URL hash for sharing

[1.0.0]: https://github.com/Dhaxor/mynota/releases/tag/v1.0.0

