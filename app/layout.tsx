import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'mynota | Minimal text editor in your browser',
  description:
    'A beautiful, minimal text editor that lives entirely in your browser. Compress, share, and store notes in the URL. No backend, no tracking, just pure simplicity.',
  keywords: [
    'text editor',
    'note taking',
    'minimal editor',
    'browser editor',
    'url compression',
    'share notes',
    'markdown editor',
    'online notepad',
  ],
  authors: [{ name: 'Dhaxor', url: 'https://github.com/Dhaxor' }],
  creator: 'Dhaxor',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mynota.vercel.app',
    title: 'mynota | Minimal text editor in your browser',
    description:
      'A beautiful, minimal text editor that lives entirely in your browser. Compress, share, and store notes in the URL.',
    siteName: 'mynota',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mynota | Minimal text editor in your browser',
    description:
      'A beautiful, minimal text editor that lives entirely in your browser. Compress, share, and store notes in the URL.',
    creator: '@Dhaxor',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
