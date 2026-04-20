const axios = require('axios');
const cheerio = require('cheerio');
const { saveToCsv, randomUserAgent, log } = require('../utils/helpers');

const URL = 'https://www.scrapingcourse.com/ecommerce/';

async function scrapeProducts() {
  log('Inicio directorio', 'info');
  const { data } = await axios.get(URL, {
    headers: { 'User-Agent': randomUserAgent() }
  });
  const $ = cheerio.load(data);
  const products = [];

  $('.product-item').each((i, el) => {
    const name = $(el).find('.product-name').text().trim();
    const price = $(el).find('.price').text().trim();
    if (name && price) {
      products.push({ name, price });
    }
  });
  log(`Productos: ${products.length}`, 'info');
  return products;
}

(async () => {
  try {
    const productos = await scrapeProducts();
    if (productos.length) {
      saveToCsv(productos, 'productos.csv');
      log('Fin directorio', 'success');
    } else {
      log('Sin datos', 'warn');
    }
  } catch (error) {
    log(`Error directorio: ${error.message}`, 'error');
  }
})();