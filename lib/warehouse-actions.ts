'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import QRCode from 'qrcode'

// ==================== WAREHOUSE ====================
export async function getWarehouses() {
  try {
    const warehouses = await prisma.warehouse.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { lots: true }
        }
      }
    })
    return warehouses
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return []
  }
}

export async function createWarehouse(formData: FormData) {
  const name = formData.get('name') as string
  const code = formData.get('code') as string
  const address = formData.get('address') as string
  const description = formData.get('description') as string

  if (!name || !code) {
    return { success: false, error: 'Tên và mã kho là bắt buộc' }
  }

  try {
    const existingWarehouse = await prisma.warehouse.findUnique({
      where: { code }
    })

    if (existingWarehouse) {
      return { success: false, error: 'Mã kho đã tồn tại' }
    }

    const warehouse = await prisma.warehouse.create({
      data: {
        name,
        code,
        address: address || null,
        description: description || null,
      },
    })
    
    revalidatePath('/warehouse')
    return { success: true, warehouse, message: 'Tạo kho thành công!' }
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return { success: false, error: 'Không thể tạo kho' }
  }
}

// ==================== LOT ====================
export async function getLots(warehouseId?: string) {
  try {
    const where = warehouseId ? { warehouseId } : {}
    const lots = await prisma.lot.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        warehouse: true,
        createdBy: true,
        _count: {
          select: { boxes: true }
        }
      }
    })
    return lots
  } catch (error) {
    console.error('Error fetching lots:', error)
    return []
  }
}

export async function createLot(formData: FormData) {
  const name = formData.get('name') as string
  const warehouseId = formData.get('warehouseId') as string
  const userId = formData.get('userId') as string
  const description = formData.get('description') as string

  if (!name || !warehouseId || !userId) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    // Generate lot code: LOT-YYYYMMDD-XXX
    const today = new Date()
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
    const count = await prisma.lot.count({
      where: {
        code: {
          startsWith: `LOT-${dateStr}`
        }
      }
    })
    const code = `LOT-${dateStr}-${String(count + 1).padStart(3, '0')}`

    const lot = await prisma.lot.create({
      data: {
        name,
        code,
        description: description || null,
        warehouseId,
        createdById: userId,
      },
      include: {
        warehouse: true,
        createdBy: true
      }
    })
    
    revalidatePath('/import')
    revalidatePath('/lots')
    return { success: true, lot, message: 'Tạo lô thành công!' }
  } catch (error) {
    console.error('Error creating lot:', error)
    return { success: false, error: 'Không thể tạo lô' }
  }
}

// ==================== BOX ====================
export async function getBoxes(lotId?: string) {
  try {
    const where = lotId ? { lotId } : {}
    const boxes = await prisma.box.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        lot: {
          include: {
            warehouse: true
          }
        },
        _count: {
          select: { products: true }
        }
      }
    })
    return boxes
  } catch (error) {
    console.error('Error fetching boxes:', error)
    return []
  }
}

export async function createBox(formData: FormData) {
  const name = formData.get('name') as string
  const lotId = formData.get('lotId') as string
  const capacity = parseInt(formData.get('capacity') as string) || 100
  const description = formData.get('description') as string

  if (!name || !lotId) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    const lot = await prisma.lot.findUnique({
      where: { id: lotId }
    })

    if (!lot) {
      return { success: false, error: 'Không tìm thấy lô' }
    }

    // Generate box code: BOX-{LOT_CODE}-XXX
    const count = await prisma.box.count({
      where: { lotId }
    })
    const code = `BOX-${lot.code}-${String(count + 1).padStart(3, '0')}`
    
    // Generate QR code string
    const qrCodeData = JSON.stringify({
      type: 'box',
      code: code,
      lotId: lotId,
      timestamp: Date.now()
    })

    const box = await prisma.box.create({
      data: {
        name,
        code,
        qrCode: qrCodeData,
        capacity,
        description: description || null,
        lotId,
      },
      include: {
        lot: true
      }
    })
    
    revalidatePath('/import')
    revalidatePath('/boxes')
    return { success: true, box, message: 'Tạo thùng thành công!' }
  } catch (error) {
    console.error('Error creating box:', error)
    return { success: false, error: 'Không thể tạo thùng' }
  }
}

export async function getBoxByQRCode(qrCode: string) {
  try {
    const box = await prisma.box.findUnique({
      where: { qrCode },
      include: {
        lot: {
          include: {
            warehouse: true
          }
        },
        products: true,
        _count: {
          select: { products: true }
        }
      }
    })
    return box
  } catch (error) {
    console.error('Error fetching box by QR:', error)
    return null
  }
}

// ==================== PRODUCT ====================
export async function getProducts(boxId?: string) {
  try {
    const where = boxId ? { boxId } : {}
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        box: {
          include: {
            lot: {
              include: {
                warehouse: true
              }
            }
          }
        }
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function createProducts(formData: FormData) {
  const name = formData.get('name') as string
  const boxId = formData.get('boxId') as string
  const quantity = parseInt(formData.get('quantity') as string) || 1
  const unit = formData.get('unit') as string || 'pcs'
  const description = formData.get('description') as string

  if (!name || !boxId || quantity < 1) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    const box = await prisma.box.findUnique({
      where: { id: boxId }
    })

    if (!box) {
      return { success: false, error: 'Không tìm thấy thùng' }
    }

    // Check capacity
    const currentProducts = await prisma.product.count({
      where: { boxId, status: 'in_stock' }
    })

    if (currentProducts + quantity > box.capacity) {
      return { 
        success: false, 
        error: `Vượt quá sức chứa thùng (${currentProducts}/${box.capacity})` 
      }
    }

    // Create multiple products
    const products = []
    for (let i = 0; i < quantity; i++) {
      const code = `${box.code}-${String(currentProducts + i + 1).padStart(4, '0')}`
      const qrCodeData = JSON.stringify({
        type: 'product',
        code: code,
        boxId: boxId,
        timestamp: Date.now()
      })

      const product = await prisma.product.create({
        data: {
          name,
          code,
          qrCode: qrCodeData,
          unit,
          description: description || null,
          boxId,
          status: 'in_stock'
        }
      })
      products.push(product)
    }

    // Create stock movement
    await prisma.stockMovement.create({
      data: {
        type: 'import',
        quantity: quantity,
        boxId,
        userId: formData.get('userId') as string,
        note: `Nhập ${quantity} ${name}`
      }
    })
    
    revalidatePath('/import')
    revalidatePath('/products')
    return { success: true, products, message: `Tạo ${quantity} sản phẩm thành công!` }
  } catch (error) {
    console.error('Error creating products:', error)
    return { success: false, error: 'Không thể tạo sản phẩm' }
  }
}

export async function getProductByQRCode(qrCode: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { qrCode },
      include: {
        box: {
          include: {
            lot: {
              include: {
                warehouse: true
              }
            }
          }
        }
      }
    })
    return product
  } catch (error) {
    console.error('Error fetching product by QR:', error)
    return null
  }
}

// ==================== STOCK MOVEMENT ====================
export async function exportProducts(formData: FormData) {
  const productIds = JSON.parse(formData.get('productIds') as string) as string[]
  const userId = formData.get('userId') as string
  const note = formData.get('note') as string

  if (!productIds || productIds.length === 0 || !userId) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    // Update products status
    await prisma.product.updateMany({
      where: {
        id: { in: productIds },
        status: 'in_stock'
      },
      data: {
        status: 'exported'
      }
    })

    // Create stock movements
    for (const productId of productIds) {
      await prisma.stockMovement.create({
        data: {
          type: 'export',
          quantity: 1,
          productId,
          userId,
          note: note || 'Xuất kho'
        }
      })
    }
    
    revalidatePath('/export')
    revalidatePath('/dashboard')
    return { success: true, message: `Xuất ${productIds.length} sản phẩm thành công!` }
  } catch (error) {
    console.error('Error exporting products:', error)
    return { success: false, error: 'Không thể xuất sản phẩm' }
  }
}

export async function getStockMovements(limit: number = 50) {
  try {
    const movements = await prisma.stockMovement.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        product: {
          include: {
            box: {
              include: {
                lot: true
              }
            }
          }
        },
        box: true,
        lot: true
      }
    })
    return movements
  } catch (error) {
    console.error('Error fetching stock movements:', error)
    return []
  }
}

// ==================== INVENTORY CHECK ====================
export async function createInventoryCheck(formData: FormData) {
  const productId = formData.get('productId') as string
  const userId = formData.get('userId') as string
  const actualQty = parseInt(formData.get('actualQty') as string) || 0
  const note = formData.get('note') as string

  if (!productId || !userId) {
    return { success: false, error: 'Thiếu thông tin bắt buộc' }
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    const expectedQty = product.status === 'in_stock' ? 1 : 0
    const difference = actualQty - expectedQty

    const check = await prisma.inventoryCheck.create({
      data: {
        productId,
        checkedById: userId,
        expectedQty,
        actualQty,
        difference,
        status: 'completed',
        completedAt: new Date(),
        note: note || null
      },
      include: {
        product: true,
        checkedBy: true
      }
    })

    // If there's a difference, create adjustment movement
    if (difference !== 0) {
      await prisma.stockMovement.create({
        data: {
          type: 'adjust',
          quantity: Math.abs(difference),
          productId,
          userId,
          note: `Điều chỉnh: ${difference > 0 ? 'Thừa' : 'Thiếu'} ${Math.abs(difference)}`
        }
      })
    }
    
    revalidatePath('/inventory')
    revalidatePath('/dashboard')
    return { success: true, check, message: 'Kiểm kê thành công!' }
  } catch (error) {
    console.error('Error creating inventory check:', error)
    return { success: false, error: 'Không thể kiểm kê' }
  }
}

// ==================== DASHBOARD & REPORTS ====================
export async function getDashboardStats() {
  try {
    const [
      totalWarehouses,
      totalLots,
      totalBoxes,
      totalProducts,
      inStockProducts,
      exportedProducts,
      recentMovements
    ] = await Promise.all([
      prisma.warehouse.count({ where: { isActive: true } }),
      prisma.lot.count(),
      prisma.box.count(),
      prisma.product.count(),
      prisma.product.count({ where: { status: 'in_stock' } }),
      prisma.product.count({ where: { status: 'exported' } }),
      prisma.stockMovement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          product: {
            include: {
              box: {
                include: {
                  lot: true
                }
              }
            }
          }
        }
      })
    ])

    return {
      totalWarehouses,
      totalLots,
      totalBoxes,
      totalProducts,
      inStockProducts,
      exportedProducts,
      recentMovements
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return null
  }
}

export async function getInventoryByLot() {
  try {
    const lots = await prisma.lot.findMany({
      include: {
        warehouse: true,
        boxes: {
          include: {
            _count: {
              select: {
                products: true
              }
            },
            products: {
              where: {
                status: 'in_stock'
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return lots.map(lot => ({
      ...lot,
      totalProducts: lot.boxes.reduce((sum, box) => sum + box._count.products, 0),
      inStockProducts: lot.boxes.reduce((sum, box) => sum + box.products.length, 0)
    }))
  } catch (error) {
    console.error('Error fetching inventory by lot:', error)
    return []
  }
}

// ==================== QR CODE GENERATION ====================
export async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    return qrCodeDataURL
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}