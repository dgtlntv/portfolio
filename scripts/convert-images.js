#!/usr/bin/env node

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDir = path.join(__dirname, '..', 'public')
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif']
const MAX_DIMENSION = 1920

async function processImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  
  if (!imageExtensions.includes(ext)) return
  
  try {
    const image = sharp(filePath)
    const metadata = await image.metadata()
    const { width, height } = metadata
    
    let processedImage = image
    let resized = false
    
    // Resize if either dimension exceeds MAX_DIMENSION
    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      processedImage = processedImage.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      resized = true
    }
    
    // Convert to WebP if not already WebP
    if (ext !== '.webp') {
      const webpPath = filePath.replace(/\.(jpe?g|png|avif)$/i, '.webp')
      
      await processedImage
        .webp({ lossless: true, quality: 100 })
        .toFile(webpPath)
      
      // Delete the original file after successful conversion
      fs.unlinkSync(filePath)
      
      const resizeInfo = resized ? ` (resized from ${width}x${height})` : ''
      console.log(`✓ Converted: ${path.relative(publicDir, filePath)} → ${path.basename(webpPath)}${resizeInfo} (original deleted)`)
    } else if (resized) {
      // Already WebP but needs resizing - use temp file
      const tempPath = filePath + '.temp'
      
      await processedImage
        .webp({ lossless: true, quality: 100 })
        .toFile(tempPath)
      
      // Replace original with temp file
      fs.renameSync(tempPath, filePath)
      
      console.log(`✓ Resized: ${path.relative(publicDir, filePath)} (${width}x${height} → max ${MAX_DIMENSION}px)`)
    }
  } catch (error) {
    console.error(`✗ Failed to process ${filePath}:`, error.message)
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
      await processImage(fullPath)
    }
  }
}

async function main() {
  console.log('🖼️  Processing images: converting to WebP and resizing (max 1920px)...')
  await walkDirectory(path.join(publicDir, 'images'))
  console.log('✅ Image processing complete!')
}

main().catch(console.error)