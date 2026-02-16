# mynota

> A minimal, browser-based text editor with URL compression and sharing

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dhaxor/mynota)

## ✨ Features

- **📦 URL Compression** - Text is deflate-compressed and stored in the URL hash, making notes instantly shareable
- **🌐 No Backend** - Everything runs client-side in your browser. No servers, no databases, no tracking
- **💾 Auto-Save** - Automatic persistence to localStorage with debounced syncing
- **📤 Export Options** - Download as `.txt` or share via QR code
- **🎨 Theme Support** - Beautiful dark/light modes with system preference detection
- **📊 Live Stats** - Real-time word/character/line count, compression ratio, and URL length tracking
- **⌨️ Keyboard Shortcuts** - Tab for indentation, Ctrl/Cmd+S to force save
- **📱 Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18.18 or higher
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Dhaxor/mynota.git
cd mynota

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
pnpm build

# Start production server
pnpm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **QR Codes**: [qrcode](https://github.com/soldair/node-qrcode)
- **Fonts**: Inter (sans-serif) + JetBrains Mono (monospace)
- **Language**: TypeScript
- **Dev Tools**: Turbopack for fast development builds

## 📖 How It Works

### Compression

mynota uses the browser's native [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API) with `deflate-raw` algorithm to compress text content. The compressed data is then encoded as URL-safe base64 and stored in the URL hash.

### Storage Strategy

1. **URL Hash** - Primary storage for sharing and bookmarking
2. **localStorage** - Backup storage for persistence across sessions
3. **Auto-sync** - Changes are debounced (500ms) and automatically synced to both locations

### Privacy

- ✅ No data leaves your browser
- ✅ No analytics or tracking
- ✅ No cookies
- ✅ No server-side storage
- ✅ Open source and auditable

## 🎯 Use Cases

- Quick note-taking and drafting
- Sharing text snippets via URL
- Temporary scratchpad for coding
- Markdown writing and previewing
- Collaborative text sharing (via URL)
- Offline-first note storage

## 📝 Keyboard Shortcuts

- `Tab` - Insert 2 spaces (indentation)
- `Ctrl/Cmd + S` - Force save to URL and localStorage

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

## 🔗 Links

- [Live Demo](https://mynota.vercel.app)
- [Report Bug](https://github.com/Dhaxor/mynota/issues)
- [Request Feature](https://github.com/Dhaxor/mynota/issues)

---

Made with ❤️ by [Dhaxor](https://github.com/Dhaxor)

