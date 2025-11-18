// ============================================
// Domain Data Export Utility
// Export all data from a domain to JSON
// ============================================

import { PrismaClient } from '@prisma/client'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

// Models to export (Prisma model names)
const MODELS = [
  'user',
  'menu',
  'menuPermission',
  'post',
  'page',
  'media',
  'seoSettings'
]

async function exportData(outputDir: string) {
  console.log('📦 Starting data export...\n')
  
  // Create output directory
  mkdirSync(outputDir, { recursive: true })
  
  const stats = {
    success: 0,
    failed: 0,
    total: MODELS.length,
    records: 0
  }
  
  for (const model of MODELS) {
    try {
      const data = await (prisma as any)[model].findMany()
      
      const outputFile = join(outputDir, `${model}.json`)
      writeFileSync(outputFile, JSON.stringify(data, null, 2))
      
      stats.success++
      stats.records += data.length
      
      console.log(`✓ ${model.padEnd(20)} ${data.length.toString().padStart(5)} records`)
    } catch (error: any) {
      if (error.code === 'P2021') {
        // Table doesn't exist
        const outputFile = join(outputDir, `${model}.json`)
        writeFileSync(outputFile, '[]')
        console.log(`⊘ ${model.padEnd(20)} Table not found`)
      } else {
        stats.failed++
        console.error(`✗ ${model.padEnd(20)} Error: ${error.message}`)
      }
    }
  }
  
  // Create metadata
  const metadata = {
    exportDate: new Date().toISOString(),
    database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[1] || 'unknown',
    tablesExported: stats.success,
    totalTables: stats.total,
    totalRecords: stats.records
  }
  
  writeFileSync(
    join(outputDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Export completed!')
  console.log('='.repeat(50))
  console.log(`Tables exported: ${stats.success}/${stats.total}`)
  console.log(`Total records:   ${stats.records}`)
  console.log(`Output:          ${outputDir}`)
  
  await prisma.$disconnect()
}

// Get output directory from command line or use default
const outputDir = process.argv[2] || './export-data'

exportData(outputDir).catch((error) => {
  console.error('Export failed:', error)
  process.exit(1)
})
