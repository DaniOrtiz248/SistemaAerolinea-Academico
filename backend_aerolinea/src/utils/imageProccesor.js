import sharp from 'sharp'
import fs from 'fs'

export async function convertToJPG (inputPath, outputPath) {
  await sharp(inputPath).jpeg({ quality: 85 }).toFile(outputPath)
  fs.unlinkSync(inputPath)
}
