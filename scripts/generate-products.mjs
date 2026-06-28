import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')
const outputFile = path.join(publicDir, 'products.json')

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'svg', 'bmp', 'ico', 'tif', 'tiff',
  'heic', 'heif', 'avif'
])

const folders = fs.readdirSync(publicDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .filter(dirent => !['.git', 'node_modules', 'dist'].includes(dirent.name))
  .map(dirent => dirent.name)

console.log(`Found ${folders.length} folders in public/:`, folders)

const products = folders.map(folder => {
  const folderPath = path.join(publicDir, folder)
  
  let files = []
  try {
    files = fs.readdirSync(folderPath)
    console.log(`  ${folder}: ${files.length} files -`, files)
  } catch (err) {
    console.error(`Error reading folder ${folder}: ${err.message}`)
    files = []
  }
  
  const images = files
    .filter(file => {
      const ext = file.split('.').pop()?.toLowerCase()
      const isImage = IMAGE_EXTENSIONS.has(ext)
      if (!isImage && file.includes('.')) {
        console.log(`    Skipping non-image: ${file} (ext: ${ext})`)
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
console.log(`\nGenerated products.json with ${products.length} products:`)
products.forEach(p => {
  console.log(`  - ${p.id}: ${p.images.length} images`)
})