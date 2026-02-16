"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { compressText, decompressText, getByteSize, formatBytes, getCompressionRatio } from "@/lib/compression"
import { EditorToolbar } from "./editor-toolbar"
import { QrModal } from "./qr-modal"
import { WelcomeOverlay } from "./welcome-overlay"

const STORAGE_KEY = "mynota-content"
const DEBOUNCE_MS = 500

interface EditorStats {
  words: number
  chars: number
  lines: number
  bytes: string
  ratio: number
  urlLength: number
}

function countStats(text: string, compressed: string): EditorStats {
  const trimmed = text.trim()
  return {
    words: trimmed === "" ? 0 : trimmed.split(/\s+/).length,
    chars: text.length,
    lines: text === "" ? 0 : text.split("\n").length,
    bytes: formatBytes(getByteSize(text)),
    ratio: getCompressionRatio(text, compressed),
    urlLength: compressed.length,
  }
}

function extractTitle(text: string): string | null {
  const match = text.match(/^#\s+(.+)/)
  return match ? match[1].trim() : null
}

export function Editor() {
  const [content, setContent] = useState("")
  const [compressed, setCompressed] = useState("")
  const [stats, setStats] = useState<EditorStats>({
    words: 0, chars: 0, lines: 0, bytes: "0 B", ratio: 0, urlLength: 0,
  })
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialLoadRef = useRef(true)

  // Load from URL hash or localStorage on mount
  useEffect(() => {
    async function load() {
      const hash = window.location.hash.slice(1)

      if (hash) {
        try {
          const decoded = await decompressText(hash)
          setContent(decoded)
          setCompressed(hash)
          setStats(countStats(decoded, hash))
          localStorage.setItem(STORAGE_KEY, decoded)
        } catch {
          // Invalid hash, try localStorage
          const stored = localStorage.getItem(STORAGE_KEY)
          if (stored) {
            setContent(stored)
            const c = await compressText(stored)
            setCompressed(c)
            setStats(countStats(stored, c))
          } else {
            setShowWelcome(true)
          }
        }
      } else {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored && stored.length > 0) {
          setContent(stored)
          const c = await compressText(stored)
          setCompressed(c)
          setStats(countStats(stored, c))
          window.location.hash = c
        } else {
          setShowWelcome(true)
        }
      }

      setIsLoaded(true)
      isInitialLoadRef.current = false
    }

    load()
  }, [])

  // Update document title based on content
  useEffect(() => {
    const title = extractTitle(content)
    document.title = title ? `${title} — mynota` : "mynota"
  }, [content])

  // Sync to URL hash & localStorage with debounce
  const syncContent = useCallback(async (text: string) => {
    if (text === "") {
      setCompressed("")
      setStats({ words: 0, chars: 0, lines: 0, bytes: "0 B", ratio: 0, urlLength: 0 })
      history.replaceState(null, "", window.location.pathname)
      localStorage.removeItem(STORAGE_KEY)
      setSaved(true)
      return
    }

    const c = await compressText(text)
    setCompressed(c)
    setStats(countStats(text, c))
    window.location.hash = c
    localStorage.setItem(STORAGE_KEY, text)
    setSaved(true)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = e.target.value
      setContent(text)
      setSaved(false)

      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => syncContent(text), DEBOUNCE_MS)
    },
    [syncContent]
  )

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${compressed}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [compressed])

  const handleNew = useCallback(() => {
    setContent("")
    setCompressed("")
    setStats({ words: 0, chars: 0, lines: 0, bytes: "0 B", ratio: 0, urlLength: 0 })
    history.replaceState(null, "", window.location.pathname)
    localStorage.removeItem(STORAGE_KEY)
    setSaved(true)
    textareaRef.current?.focus()
  }, [])

  const handleDownload = useCallback(() => {
    const title = extractTitle(content) || "mynota-document"
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [content])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab inserts 2 spaces
      if (e.key === "Tab") {
        e.preventDefault()
        const ta = e.currentTarget
        const start = ta.selectionStart
        const end = ta.selectionEnd
        const value = ta.value
        const newValue = value.substring(0, start) + "  " + value.substring(end)
        setContent(newValue)
        setSaved(false)
        // Reset cursor
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2
        })
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => syncContent(newValue), DEBOUNCE_MS)
      }

      // Ctrl/Cmd+S to force save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        syncContent(content)
      }
    },
    [content, syncContent]
  )

  const handleDismissWelcome = useCallback(() => {
    setShowWelcome(false)
    textareaRef.current?.focus()
  }, [])

  // Focus on load
  useEffect(() => {
    if (isLoaded && !showWelcome) {
      textareaRef.current?.focus()
    }
  }, [isLoaded, showWelcome])

  return (
    <div className="flex h-dvh flex-col bg-background transition-colors duration-300">
      <EditorToolbar
        stats={stats}
        saved={saved}
        copied={copied}
        hasContent={content.length > 0}
        onCopy={handleCopy}
        onNew={handleNew}
        onDownload={handleDownload}
        onQr={() => setShowQr(true)}
      />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing..."
            spellCheck={false}
            aria-label="Text editor"
            className="h-full w-full resize-none bg-transparent px-6 py-8 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none sm:px-12 md:px-24 lg:px-32 xl:px-48"
            style={{ tabSize: 2 }}
          />
        </div>
      </main>

      {/* Mobile stats footer */}
      {content.length > 0 && (
        <footer className="flex shrink-0 items-center justify-between border-t border-border/50 px-4 py-2 md:hidden">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-muted-foreground">
              {stats.words} words
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {stats.chars} chars
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted-foreground">
              {stats.bytes}
            </span>
            {stats.ratio > 0 && (
              <span className="rounded-full bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent">
                -{stats.ratio}%
              </span>
            )}
          </div>
        </footer>
      )}

      {showWelcome && <WelcomeOverlay onDismiss={handleDismissWelcome} />}
      {showQr && (
        <QrModal
          url={`${typeof window !== "undefined" ? window.location.origin : ""}${typeof window !== "undefined" ? window.location.pathname : ""}#${compressed}`}
          onClose={() => setShowQr(false)}
        />
      )}
    </div>
  )
}
