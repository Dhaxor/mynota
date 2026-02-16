"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { X, AlertCircle } from "lucide-react"
import QRCode from "qrcode"

interface QrModalProps {
  url: string
  onClose: () => void
}

export function QrModal({ url, onClose }: QrModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 280,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "L",
        },
        (err) => {
          if (err) {
            setError(true)
          }
        }
      )
    }
  }, [url])

  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose]
  )

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label="QR Code"
    >
      <div className="relative flex flex-col items-center gap-5 rounded-2xl border border-border bg-background p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-sm font-medium text-foreground">Share via QR Code</h2>

        <div className="overflow-hidden rounded-xl border border-border bg-card p-3">
          {error ? (
            <div className="flex h-[280px] w-[280px] flex-col items-center justify-center gap-3 text-muted-foreground">
              <AlertCircle className="h-8 w-8" />
              <p className="text-center text-xs">
                URL is too long to encode
                <br />
                as a QR code. Try a shorter note.
              </p>
            </div>
          ) : (
            <canvas ref={canvasRef} className="h-[280px] w-[280px]" />
          )}
        </div>

        <p className="max-w-[280px] text-center text-[11px] leading-relaxed text-muted-foreground">
          Scan this code to open your note on another device. All content is encoded in the URL.
        </p>
      </div>
    </div>
  )
}
