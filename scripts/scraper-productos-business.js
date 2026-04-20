const axios = require('axios');
const cheerio = require('cheerio');
const { randomDelay, saveToJson, saveToCsv, randomUserAgent, log } = require('../utils/helpers');

const BASE_URL = 'https://books.toscrape.com';

function parsePrice(rawPrice) {
  if (!rawPrice) return { currency: '', amount: null };

  const normalized = rawPrice.replace(/[^0-9.,]/g, '').replace(',', '.');
  const amount = Number.parseFloat(normalized);

  return {
    currency: 'GBP',
    amount: Number.isNaN(amount) ? null : Number(amount.toFixed(2))
  };
}

function normalizeText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function buildAbsoluteUrl(pathname) {
  if (!pathname) return BASE_URL;
  if (pathname.startsWith('http')) return pathname;
  return new URL(pathname, `${BASE_URL}/catalogue/`).href;
}

function dedupeProducts(items) {
  const seen = new Set();
  const deduped = [];

  for (const item of items) {
    const dedupeKey = `${item.product_url}::${item.name.toLowerCase()}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);
    deduped.push(item);
  }

  return deduped;
}

async function scrapeBusinessDataset(maxPages = 3) {
  log('Inicio business', 'info');
  const rows = [];

  for (let page = 1; page <= maxPages; page += 1) {
    const pageUrl = page === 1
      ? `${BASE_URL}/catalogue/page-1.html`
      : `${BASE_URL}/catalogue/page-${page}.html`;
    log(`Pag ${page}`, 'info');

    const { data: html } = await axios.get(pageUrl, {
      timeout: 12000,
      headers: { 'User-Agent': randomUserAgent() }
    });

    const $ = cheerio.load(html);
    const extractedAt = new Date().toISOString();

    $('article.product_pod').each((index, element) => {
      const name = normalizeText($(element).find('h3 a').attr('title'));
      const relativeUrl = $(element).find('h3 a').attr('href');
      const productUrl = buildAbsoluteUrl(relativeUrl);
      const rawPrice = normalizeText($(element).find('.price_color').text());
      const price = parsePrice(rawPrice);
      const stockRaw = normalizeText($(element).find('.instock.availability').text());
      const inStock = /in stock/i.test(stockRaw);

      rows.push({
        id: `P${String(rows.length + 1).padStart(4, '0')}`,
        name,
        price_currency: price.currency,
        price_amount: price.amount,
        in_stock: inStock,
        stock_text: stockRaw,
        product_url: productUrl,
        source_page: page,
        source_rank: index + 1,
        extracted_at: extractedAt
      });
    });

    await randomDelay(700, 1300);
  }

  return dedupeProducts(rows);
}

(async () => {
  try {
    const dataset = await scrapeBusinessDataset(3);
    if (!dataset.length) {
      log('Sin datos', 'warn');
      return;
    }

    saveToJson(dataset, 'productos_business_limpio.json');
    saveToCsv(dataset, 'productos_business_limpio.csv');
    log(`Fin business: ${dataset.length}`, 'success');
  } catch (error) {
    log(`Error business: ${error.message}`, 'error');
  }
})();
