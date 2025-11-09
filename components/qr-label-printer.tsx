"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Printer } from "lucide-react"
import { useState } from "react"

interface QRLabelPrinterProps {
  qrCodeDataUrl: string
  title: string
  code: string
  additionalInfo?: string
}

export function QRLabelPrinter({ qrCodeDataUrl, title, code, additionalInfo }: QRLabelPrinterProps) {
  const [showPreview, setShowPreview] = useState(false)

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Nhãn QR - ${code}</title>
          <style>
            @page {
              size: 80mm 50mm;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 10mm;
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 50mm;
            }
            .label {
              text-align: center;
              width: 100%;
            }
            .qr-code {
              margin: 5mm 0;
            }
            .qr-code img {
              width: 25mm;
              height: 25mm;
            }
            .title {
              font-size: 14pt;
              font-weight: bold;
              margin-bottom: 2mm;
            }
            .code {
              font-size: 12pt;
              font-family: monospace;
              margin: 2mm 0;
            }
            .info {
              font-size: 9pt;
              color: #666;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="title">${title}</div>
            <div class="qr-code">
              <img src="${qrCodeDataUrl}" alt="QR Code" />
            </div>
            <div class="code">${code}</div>
            ${additionalInfo ? `<div class="info">${additionalInfo}</div>` : ''}
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    
    // Auto print
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setShowPreview(true)}
        className="w-full"
      >
        <Printer className="h-4 w-4 mr-2" />
        Xem & In Nhãn
      </Button>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Xem trước nhãn QR</DialogTitle>
            <DialogDescription>
              Nhãn sẽ được in với kích thước 80mm x 50mm
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center space-y-4 py-4">
            <Card className="w-full">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-2">
                {qrCodeDataUrl && (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code" 
                    className="w-32 h-32 border-2 border-muted"
                  />
                )}
                <p className="font-mono text-sm font-bold">{code}</p>
                {additionalInfo && (
                  <CardDescription className="text-xs">{additionalInfo}</CardDescription>
                )}
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="flex-col space-y-2">
            <Button onClick={handlePrint} className="w-full">
              <Printer className="h-4 w-4 mr-2" />
              In ngay
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(false)} className="w-full">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
