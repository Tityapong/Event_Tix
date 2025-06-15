"use client"
import { useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void
  onScanError: (error: string) => void
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (isInitialized.current) return

    const initScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("qr-reader")
        scannerRef.current = html5QrCode
        isInitialized.current = true

        const qrCodeSuccessCallback = async (decodedText: string) => {
          try {
            await html5QrCode.stop()
            onScanSuccess(decodedText)
          } catch (err) {
            console.error("Error stopping scanner:", err)
            onScanSuccess(decodedText)
          }
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
      } catch (err) {
        console.error("Failed to start scanner:", err)
        onScanError("Failed to start scanner: " + (err instanceof Error ? err.message : "Unknown error"))
      }
    }

    initScanner()

    return () => {
      if (scannerRef.current && isInitialized.current) {
        scannerRef.current.stop().catch((err) => console.error("Failed to stop scanner:", err))
        scannerRef.current = null
        isInitialized.current = false
      }
    }
  }, [onScanSuccess, onScanError])

  return (
    <div
      id="qr-reader"
      className="mb-6 w-full max-w-[350px] h-[350px] rounded-xl overflow-hidden border-2 border-dashed border-gray-300"
      aria-live="polite"
    />
  )
}
