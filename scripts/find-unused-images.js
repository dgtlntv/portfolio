#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.join(__dirname, '..')
const imagesDir = path.join(projectRoot, 'public', 'images')
const contentDir = path.join(projectRoot, 'src', 'content')

function getAllImageFiles(dir, imageFiles = []) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      getAllImageFiles(fullPath, imageFiles)
    } else if (stat.isFile()) {
      const ext = path.extname(item).toLowerCase()
      if (['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg'].includes(ext)) {
        // Store relative path from public directory
        const relativePath = path.relative(path.join(projectRoot, 'public'), fullPath)
        imageFiles.push(relativePath)
      }
    }
  }
  
  return imageFiles
}

function getAllContentFiles(dir, contentFiles = []) {
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      getAllContentFiles(fullPath, contentFiles)
    } else if (stat.isFile() && (path.extname(item) === '.mdx' || path.extname(item) === '.tsx')) {
      contentFiles.push(fullPath)
    }
  }
  
  return contentFiles
}

function getAllContent(contentFiles) {
  let allContent = ''
  
  for (const filePath of contentFiles) {
    const content = fs.readFileSync(filePath, 'utf8')
    allContent += content + '\n'
  }
  
  return allContent
}

function main() {
  console.log('🔍 Searching for unused images...\n')
  
  // Get all image files
  const imageFiles = getAllImageFiles(imagesDir)
  console.log(`Found ${imageFiles.length} image files`)
  
  // Get all content files
  const contentFiles = getAllContentFiles(contentDir)
  console.log(`Found ${contentFiles.length} content files`)
  
  // Get all content as one string
  const allContent = getAllContent(contentFiles)
  
  const unusedImages = []
  
  // Check each image file
  for (const imagePath of imageFiles) {
    // Convert to the path format used in content files
    const publicPath = '/' + imagePath.replace(/\\/g, '/')
    
    // Check if the image path appears anywhere in content
    if (!allContent.includes(publicPath)) {
      unusedImages.push(imagePath)
    }
  }
  
  console.log(`\n📊 Results:`)
  console.log(`- Total images: ${imageFiles.length}`)
  console.log(`- Used images: ${imageFiles.length - unusedImages.length}`)
  console.log(`- Unused images: ${unusedImages.length}`)
  
  if (unusedImages.length > 0) {
    console.log(`\n🗑️  Unused images:`)
    unusedImages.forEach(image => {
      console.log(`   ${image}`)
    })
  } else {
    console.log(`\n✅ All images are being used!`)
  }
}

main()