import fs from 'fs'
import path from 'path'

const publicDir = path.join(process.cwd(), 'public')
const outputFile = path.join(publicDir, 'products.json')

// 扫描 public 目录下的文件夹
const folders = fs.readdirSync(publicDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

// 为每个文件夹生成产品配置
const products = folders.map(folder => {
  const folderPath = path.join(publicDir, folder)
  
  // 扫描文件夹内的所有图片文件
  const images = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
    .sort()
  
  return {
    id: folder,
    folder: folder,
    images: images
  }
})

// 生成 products.json
const output = {
  products: products
}

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2))
console.log(`Generated products.json with ${products.length} products:`)
products.forEach(p => console.log(`  - ${p.id}: ${p.images.length} images`))