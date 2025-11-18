// ============================================
// Domain Data Import Utility
// Import data from JSON to database
// ============================================

import { PrismaClient } from '@prisma/client'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

const prisma = new PrismaClient()

// Models in dependency order (relations)
const IMPORT_ORDER = [
  'user',
  'menu',
  'menuPermission',
  'seoSettings',
  'media',
  'post',
  'page'
]

async function importData(inputDir: string, clearExisting: boolean = false) {
  console.log('📦 Starting data import...\n')
  
  const stats = {
    success: 0,
    failed: 0,
    total: 0,
    records: 0
  }
  
  // Read metadata if exists
  try {
    const metadata = JSON.parse(
      readFileSync(join(inputDir, 'metadata.json'), 'utf-8')
    )
    console.log('Metadata:')
    console.log(`  Export date:     ${metadata.exportDate}`)
    console.log(`  Database:        ${metadata.database}`)
    console.log(`  Tables:          ${metadata.tablesExported}`)
    console.log(`  Total records:   ${metadata.totalRecords}`)
    console.log('')
  } catch (error) {
    console.log('No metadata found\n')
  }
  
  // Get all JSON files
  const files = readdirSync(inputDir).filter(f => 
    f.endsWith('.json') && f !== 'metadata.json'
  )
  
  for (const model of IMPORT_ORDER) {
    const filename = `${model}.json`
    
    if (!files.includes(filename)) {
      continue
    }
    
    stats.total++
    
    try {
      const data = JSON.parse(
        readFileSync(join(inputDir, filename), 'utf-8')
      )
      
      if (data.length === 0) {
        console.log(`⊘ ${model.padEnd(20)} No data to import`)
        continue
      }
      
      // Clear existing data if requested
      if (clearExisting) {
        await (prisma as any)[model].deleteMany()
      }
      
      // Import records
      let imported = 0
      for (const record of data) {
        try {
          await (prisma as any)[model].create({
            data: record
          })
          imported++
        } catch (error: any) {
          // Skip duplicates
          if (error.code !== 'P2002') {
            console.error(`  Error importing record:`, error.message)
          }
        }
      }
      
      stats.success++
      stats.records += imported
      
      console.log(`✓ ${model.padEnd(20)} ${imported.toString().padStart(5)} records imported`)
    } catch (error: any) {
      if (error.code === 'P2021') {
        console.log(`⊘ ${model.padEnd(20)} Table not found`)
      } else {
        stats.failed++
        console.error(`✗ ${model.padEnd(20)} Error: ${error.message}`)
      }
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Import completed!')
  console.log('='.repeat(50))
  console.log(`Tables imported:  ${stats.success}/${stats.total}`)
  console.log(`Total records:    ${stats.records}`)
  
  await prisma.$disconnect()
}

// Get input directory from command line
const inputDir = process.argv[2]
const clearExisting = process.argv.includes('--clear')

if (!inputDir) {
  console.error('Usage: bun run scripts/import-data.ts <input-directory> [--clear]')
  console.error('\nOptions:')
  console.error('  --clear    Delete existing data before import')
  process.exit(1)
}

importData(inputDir, clearExisting).catch((error) => {
  console.error('Import failed:', error)
  process.exit(1)
})
