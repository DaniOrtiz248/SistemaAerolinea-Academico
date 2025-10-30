import sharp from 'sharp'
import fs from 'fs'

export async function convertToJPG (inputPath, outputPath) {
  await sharp(inputPath).jpeg({ quality: 85 }).toFile(outputPath)
  fs.unlink(inputPath, (err) => {
    if (err) {
      console.error('Error al borrar archivo original:', err)
    } else {
      console.log('Archivo original borrado correctamente:', inputPath)
    }
  })
}
