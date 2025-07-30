const fs = require('fs');
const path = require('path');

// Directorios a excluir
const excludeDirs = ['node_modules', '.next', '.git', 'public'];

// Extensiones de archivo a procesar
const targetExtensions = ['.js', '.jsx', '.ts', '.tsx'];

// Contador de logs eliminados
let totalRemoved = 0;
let filesModified = 0;

// Función para verificar si un directorio debe ser excluido
function shouldExclude(dir) {
  return excludeDirs.some(excluded => dir.includes(excluded));
}

// Función para procesar un archivo
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Regex para encontrar console.log, console.error, console.warn, console.info
  const consoleRegex = /console\.(log|error|warn|info)\([^)]*\);?\s*/g;
  
  // Contar matches
  const matches = content.match(consoleRegex);
  if (!matches || matches.length === 0) return;
  
  // Reemplazar console.logs
  const newContent = content.replace(consoleRegex, '');
  
  // Solo escribir si hay cambios
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    `);
    totalRemoved += matches.length;
    filesModified++;
  }
}

// Función recursiva para procesar directorios
function processDirectory(dir) {
  if (shouldExclude(dir)) return;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (stat.isFile() && targetExtensions.includes(path.extname(file))) {
      processFile(filePath);
    }
  });
}

// Iniciar procesamiento
processDirectory(process.cwd());

