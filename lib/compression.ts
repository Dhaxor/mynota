// Compress text using the Compression Streams API (deflate-raw)
export async function compressText(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text))
      controller.close()
    },
  }).pipeThrough(new CompressionStream('deflate-raw'))

  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  let totalLength = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    totalLength += value.length
  }

  const combined = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    combined.set(chunk, offset)
    offset += chunk.length
  }

  // Convert to base64url (URL-safe base64)
  const base64 = btoa(String.fromCharCode(...combined))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// Decompress text from base64url-encoded deflate-raw data
export async function decompressText(encoded: string): Promise<string> {
  // Restore standard base64
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes)
      controller.close()
    },
  }).pipeThrough(new DecompressionStream('deflate-raw'))

  const reader = stream.getReader()
  const chunks: Uint8Array[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const decoder = new TextDecoder()
  return chunks.map((c) => decoder.decode(c, { stream: true })).join('') + decoder.decode()
}

// Calculate compression ratio
export function getCompressionRatio(original: string, compressed: string): number {
  const originalSize = new TextEncoder().encode(original).length
  const compressedSize = compressed.length
  if (originalSize === 0) return 0
  return Math.round((1 - compressedSize / originalSize) * 100)
}

// Get byte size of text
export function getByteSize(text: string): number {
  return new TextEncoder().encode(text).length
}

// Format byte size for display
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
