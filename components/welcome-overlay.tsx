"use client"

import { useEffect, useState } from "react"
import {
  ArrowRight,
  FileText,
  Link2,
  QrCode,
  Shrink,
  Moon,
  Keyboard,
} from "lucide-react"

interface WelcomeOverlayProps {
  onDismiss: () => void
}

const features = [
  {
    icon: Shrink,
    title: "Compressed in the URL",
    desc: "Your text is deflate-compressed and stored in the URL hash. Share by copying the link.",
  },
  {
    icon: Link2,
    title: "Shareable links",
    desc: "Every note has a unique URL. Send it to anyone, no account needed.",
  },
  {
    icon: FileText,
    title: "Download as .txt",
    desc: "Export your document as a plain text file with one click.",
  },
  {
    icon: QrCode,
    title: "QR code sharing",
    desc: "Generate a QR code to transfer notes between devices instantly.",
  },
  {
    icon: Moon,
    title: "Dark & light modes",
    desc: "Switch between themes for comfortable writing day or night.",
  },
  {
    icon: Keyboard,
    title: "Keyboard friendly",
    desc: "Tab for indentation, Ctrl+S to force sync. No distractions.",
  },
]

export function WelcomeOverlay({ onDismiss }: WelcomeOverlayProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`mx-4 w-full max-w-lg transform transition-all duration-500 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              mynota
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A minimal text editor that lives in your browser.
              <br />
              Everything is stored in the URL.
            </p>
          </div>

          {/* Feature grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-3 rounded-xl border border-border/50 bg-secondary/30 p-3.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground/5">
                  <f.icon className="h-4 w-4 text-foreground/70" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{f.title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro tips */}
          <div className="mb-8 rounded-xl bg-secondary/50 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pro tips
            </p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">{'>'}</span>
                <span>
                  Start with <code className="rounded bg-foreground/5 px-1 py-0.5 font-mono text-[11px] text-foreground"># Title</code> to set a custom page title
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">{'>'}</span>
                <span>Data is stored in both localStorage and the URL hash</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-accent">{'>'}</span>
                <span>
                  Press <code className="rounded bg-foreground/5 px-1 py-0.5 font-mono text-[11px] text-foreground">Tab</code> to insert indentation
                </span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={handleDismiss}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Start writing
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
