import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')
const outputFile = path.join(publicDir, 'products.json')

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'svg', 'bmp', 'ico', 'tif', 'tiff',
  'heic', 'heif', 'avif'
])

console.log('========================================')
console.log('Generating products.json...')
console.log('Current working directory:', process.cwd())
console.log('Public directory:', publicDir)
console.log('========================================')

let allEntries
try {
  allEntries = fs.readdirSync(publicDir, { withFileTypes: true })
  console.log('All entries in public/:')
  allEntries.forEach(entry => {
    const type = entry.isDirectory() ? '[DIR]' : '[FILE]'
    console.log(`  ${type} ${entry.name}`)
  })
} catch (err) {
  console.error('ERROR: Cannot read public directory:', err.message)
  console.error('Trying fallback: reading from root...')
  try {
    allEntries = fs.readdirSync('.', { withFileTypes: true })
    console.log('Entries in current dir:')
    allEntries.forEach(entry => {
      const type = entry.isDirectory() ? '[DIR]' : '[FILE]'
      console.log(`  ${type} ${entry.name}`)
    })
  } catch (fallbackErr) {
    console.error('Fallback also failed:', fallbackErr.message)
    process.exit(1)
  }
}

const folders = allEntries
  .filter(dirent => dirent.isDirectory())
  .filter(dirent => !['.git', 'node_modules', 'dist'].includes(dirent.name))
  .map(dirent => dirent.name)

console.log('\nFound', folders.length, 'product folders:', folders)

const products = folders.map(folder => {
  const folderPath = path.join(publicDir, folder)
  console.log(`\nProcessing folder: ${folder}`)
  console.log(`  Path: ${folderPath}`)
  
  let files = []
  try {
    files = fs.readdirSync(folderPath)
    console.log(`  Found ${files.length} files`)
  } catch (err) {
    console.error(`  ERROR: Cannot read folder: ${err.message}`)
    files = []
  }
  
  const images = files
    .filter(file => {
      const ext = file.split('.').pop()?.toLowerCase()
      const isImage = IMAGE_EXTENSIONS.has(ext)
      if (isImage) {
        console.log(`  ✓ Image: ${file}`)
      } else if (file.includes('.')) {
        console.log(`  ✗ Skipped (not image): ${file} (ext: ${ext})`)
      } else {
        console.log(`  ✗ Skipped (no extension): ${file}`)
      }
      return isImage
    })
    .sort()
  
  return {
    id: folder,
    folder: folder,
    images: images
  }
})

const output = {
  products: products
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))
console.log('\n========================================')
console.log('Generated products.json:')
console.log(JSON.stringify(output, null, 2))
console.log('========================================')