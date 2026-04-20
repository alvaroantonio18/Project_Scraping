// utils/helpers.js
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'datos');

function resolveOutputPath(filename) {
  if (!filename) throw new Error('El nombre de archivo es obligatorio');
  const targetPath = path.isAbsolute(filename) ? filename : path.join(OUTPUT_DIR, filename);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  return targetPath;
}

/**
 * Espera aleatoria entre min y max milisegundos.
 */
function randomDelay(min = 1000, max = 3000) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Espera fija.
 */
function fixedDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Guarda datos en JSON.
 */
function saveToJson(data, filename) {
  const targetPath = resolveOutputPath(filename);
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
  console.log(`💾 Datos guardados en ${targetPath}`);
}

/**
 * Guarda array de objetos en CSV.
 */
function saveToCsv(data, filename) {
  if (!data || data.length === 0) {
    console.warn('⚠️ No hay datos para CSV');
    return;
  }
  const headers = Object.keys(data[0]);
  const rows = data.map(row => {
    return headers.map(header => {
      let value = row[header];
      if (Array.isArray(value)) value = value.join('|');
      if (typeof value === 'string') value = `"${value.replace(/"/g, '""')}"`;
      return value;
    }).join(',');
  });
  const csvContent = [headers.join(','), ...rows].join('\n');
  const targetPath = resolveOutputPath(filename);
  fs.writeFileSync(targetPath, csvContent);
  console.log(`💾 Datos guardados en ${targetPath}`);
}

/**
 * User-Agent aleatorio.
 */
function randomUserAgent() {
  const agents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

/**
 * Log con timestamp.
 */
function log(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = { info: '📘', success: '✅', error: '❌', warn: '⚠️' }[type] || '📘';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

module.exports = {
  randomDelay,
  fixedDelay,
  saveToJson,
  saveToCsv,
  randomUserAgent,
  log
};