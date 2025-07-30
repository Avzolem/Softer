const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Generar favicon con el estilo del logo de Softer
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Fondo blanco
ctx.fillStyle = '#ffffff';
ctx.fillRect(0, 0, size, size);

// Configurar el texto
ctx.fillStyle = '#000000';
ctx.font = 'bold 20px "Times New Roman"';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Dibujar solo la "S" de SOFTER
ctx.fillText('S', size / 2, size / 2);

// Guardar como PNG temporalmente
const buffer = canvas.toBuffer('image/png');
const tempPath = path.join(__dirname, '..', 'app', 'favicon.png');
fs.writeFileSync(tempPath, buffer);

