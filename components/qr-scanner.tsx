"use client"

import { useEffect, useRef, useState } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, X, Keyboard } from "lucide-react"

interface QRScannerProps {
  onScan: (data: string) => void
  title?: string
  description?: string
}

export function QRScanner({ onScan, title = "Quét QR Code", description }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualInput, setManualInput] = useState("")
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrCodeRegionId = "qr-reader"

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {
          // Ignore errors during cleanup
        }).finally(() => {
          try {
            scannerRef.current?.clear()
          } catch {
            // Ignore clear errors
          }
          scannerRef.current = null
        })
      }
    }
  }, [])

  useEffect(() => {
    // Start scanner after DOM is ready
    if (isInitializing && !isScanning) {
      const initScanner = async () => {
        try {
          // Wait for DOM to be ready
          await new Promise(resolve => setTimeout(resolve, 100))
          
          const element = document.getElementById(qrCodeRegionId)
          if (!element) {
            throw new Error("QR reader element not found")
          }

          const html5QrCode = new Html5Qrcode(qrCodeRegionId)
          scannerRef.current = html5QrCode

          await html5QrCode.start(
            { facingMode: "environment" },
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              onScan(decodedText)
              stopScanning()
            },
            (errorMessage) => {
              // Ignore scanning errors
            }
          )

          setIsScanning(true)
          setIsInitializing(false)
        } catch (err) {
          console.error("Error starting scanner:", err)
          setIsInitializing(false)
          setIsScanning(false)
          alert("Không thể khởi động camera. Vui lòng nhập QR code thủ công.")
          setManualMode(true)
        }
      }

      initScanner()
    }
  }, [isInitializing, isScanning, onScan])

  const startScanning = () => {
    setIsInitializing(true)
  }

  const stopScanning = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current
      
      // Check if DOM element still exists
      const element = document.getElementById(qrCodeRegionId)
      if (!element) {
        // Element already removed, just cleanup state
        scannerRef.current = null
        setIsScanning(false)
        setIsInitializing(false)
        return
      }
      
      try {
        // Stop the scanner first
        await scanner.stop()
      } catch (err) {
        // Ignore errors - element might be in invalid state
      }
      
      try {
        // Clear the scanner UI
        scanner.clear()
      } catch (err) {
        // Ignore clear errors
      }
      
      // Always cleanup state
      scannerRef.current = null
      setIsScanning(false)
      setIsInitializing(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScan(manualInput.trim())
      setManualInput("")
      setManualMode(false)
    }
  }

  if (manualMode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-input">Nhập mã QR thủ công</Label>
              <Input
                id="qr-input"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Nhập mã QR..."
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Xác nhận
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setManualMode(false)
                  setManualInput("")
                }}
              >
                <Camera className="h-4 w-4 mr-2" />
                Quét camera
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {!isScanning && !isInitializing ? (
          <div className="flex flex-col space-y-2">
            <Button onClick={startScanning} className="w-full">
              <Camera className="h-4 w-4 mr-2" />
              Bật camera quét QR
            </Button>
            <Button
              variant="outline"
              onClick={() => setManualMode(true)}
              className="w-full"
            >
              <Keyboard className="h-4 w-4 mr-2" />
              Nhập thủ công
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              id={qrCodeRegionId}
              className="w-full rounded-lg overflow-hidden border min-h-[300px] flex items-center justify-center bg-muted"
            >
              {isInitializing && (
                <p className="text-sm text-muted-foreground">Đang khởi động camera...</p>
              )}
            </div>
            <Button 
              onClick={stopScanning} 
              variant="destructive" 
              className="w-full"
              disabled={isInitializing}
            >
              <X className="h-4 w-4 mr-2" />
              Dừng quét
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}