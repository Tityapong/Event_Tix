"use client"

import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError: (error: string) => void
}

export default function QRScannerComponent({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null

    const initScanner = async () => {
      try {
        // Dynamically import html5-qrcode to avoid SSR issues
        const { Html5Qrcode } = await import("html5-qrcode")

        if (elementRef.current) {
          html5QrCode = new Html5Qrcode("qr-reader")
          scannerRef.current = html5QrCode

          const qrCodeSuccessCallback = (decodedText: string) => {
            onScanSuccess(decodedText)
          }

          const qrCodeErrorCallback = (error: string) => {
            onScanError(error)
          }

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 20,
              qrbox: { width: 350, height: 350 },
              aspectRatio: 1.0,
            },
            qrCodeSuccessCallback,
            qrCodeErrorCallback,
          )
        }
      } catch (err) {
        console.error("Failed to start scanner:", err)
        onScanError("Failed to start scanner: " + (err as Error).message)
      }
    }

    initScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((err: Error) => console.error("Failed to stop scanner:", err))
      }
    }
  }, [onScanSuccess, onScanError])

  return (
    <div
      ref={elementRef}
      id="qr-reader"
      className="mb-6 w-full max-w-[350px] h-[350px] rounded-xl overflow-hidden border-2 border-dashed border-gray-300"
      aria-live="polite"
    />
  )
}