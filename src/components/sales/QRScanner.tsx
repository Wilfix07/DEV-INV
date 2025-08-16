import { useEffect, useRef } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'

interface QRScannerProps {
  onResult: (result: string) => void
}

const QRScanner = ({ onResult }: QRScannerProps) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0
        },
        false
      )

      scannerRef.current.render((decodedText) => {
        onResult(decodedText)
      }, (error) => {
        // Handle scan errors silently
        console.log('QR scan error:', error)
      })
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear()
      }
    }
  }, [onResult])

  return (
    <div className="w-full">
      <div id="qr-reader" ref={containerRef} className="w-full"></div>
      <p className="text-sm text-gray-500 text-center mt-2">
        Point your camera at a QR code or barcode
      </p>
    </div>
  )
}

export default QRScanner
