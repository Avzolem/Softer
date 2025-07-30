const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    // Crear un SVG con el diseño del logo Softer
    const svgBuffer = Buffer.from(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" fill="white"/>
        <text x="16" y="20" font-family="Times New Roman, serif" font-size="24" font-weight="bold" text-anchor="middle" fill="black">S</text>
      </svg>
    `);

    // Generar PNG de 32x32
    const pngBuffer = await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toBuffer();

    // Guardar como PNG (los navegadores modernos aceptan PNG como favicon)
    const outputPath = path.join(__dirname, '..', 'app', 'favicon.ico');
    fs.writeFileSync(outputPath, pngBuffer);

    } catch (error) {
    }
}

generateFavicon();