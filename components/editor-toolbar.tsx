"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
  Check,
  Copy,
  Download,
  FilePlus2,
  Moon,
  QrCode,
  Sun,
  Type,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EditorStats {
  words: number
  chars: number
  lines: number
  bytes: string
  ratio: number
  urlLength: number
}

interface EditorToolbarProps {
  stats: EditorStats
  saved: boolean
  copied: boolean
  hasContent: boolean
  onCopy: () => void
  onNew: () => void
  onDownload: () => void
  onQr: () => void
}

export function EditorToolbar({
  stats,
  saved,
  copied,
  hasContent,
  onCopy,
  onNew,
  onDownload,
  onQr,
}: EditorToolbarProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <TooltipProvider delayDuration={300}>
      <header className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-2.5 sm:px-6">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground">
              <Type className="h-3.5 w-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              mynota
            </span>
          </div>

          <div className="hidden h-4 w-px bg-border sm:block" />

          {/* Save status */}
          <div className="hidden items-center gap-1.5 sm:flex">
            <div
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                saved ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            <span className="text-[11px] text-muted-foreground">
              {saved ? "Synced" : "Saving..."}
            </span>
          </div>
        </div>

        {/* Center: Stats */}
        <div className="hidden items-center gap-4 md:flex">
          <StatChip label="words" value={stats.words} />
          <StatChip label="chars" value={stats.chars} />
          <StatChip label="lines" value={stats.lines} />
          <div className="h-4 w-px bg-border" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {stats.bytes}
          </span>
          {stats.ratio > 0 && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium text-accent">
              -{stats.ratio}%
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onNew}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="New document"
              >
                <FilePlus2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>New document</p>
            </TooltipContent>
          </Tooltip>

          {hasContent && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onCopy}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label={copied ? "Link copied" : "Copy share link"}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{copied ? "Copied!" : "Copy share link"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onDownload}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Download as text file"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Download .txt</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onQr}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Show QR code"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>QR code</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          <div className="mx-1 h-4 w-px bg-border" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )
                ) : (
                  <div className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{theme === "dark" ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </header>
    </TooltipProvider>
  )
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="font-mono text-xs font-medium tabular-nums text-foreground">
        {value.toLocaleString()}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  )
}
