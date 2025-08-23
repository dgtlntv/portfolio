#!/usr/bin/env node

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const publicDir = path.join(__dirname, '..', 'public')
const imageExtensions = ['.jpg', '.jpeg', '.png']

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  
  if (!imageExtensions.includes(ext)) return
  
  const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp')
  
  try {
    await sharp(filePath)
      .webp({ lossless: true, quality: 100 })
      .toFile(webpPath)
    
    // Delete the original file after successful conversion
    fs.unlinkSync(filePath)
    
    console.log(`✓ Converted: ${path.relative(publicDir, filePath)} → ${path.basename(webpPath)} (original deleted)`)
  } catch (error) {
    console.error(`✗ Failed to convert ${filePath}:`, error.message)
  }
}

async function walkDirectory(dir) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      await walkDirectory(fullPath)
    } else if (stat.isFile()) {
      await convertToWebP(fullPath)
    }
  }
}

async function main() {
  console.log('🖼️  Converting images to WebP (lossless, replacing originals)...')
  await walkDirectory(path.join(publicDir, 'images'))
  console.log('✅ Image conversion complete!')
}

main().catch(console.error)