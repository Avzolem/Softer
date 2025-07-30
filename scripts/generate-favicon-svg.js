const fs = require('fs');
const path = require('path');

// Generar favicon.svg con el estilo del logo de Softer
const svgContent = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="white"/>
  <text x="16" y="16" font-family="Times New Roman, serif" font-size="20" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="black">S</text>
</svg>`;

const outputPath = path.join(__dirname, '..', 'app', 'favicon.svg');
fs.writeFileSync(outputPath, svgContent);

