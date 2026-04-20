const axios = require('axios');
const cheerio = require('cheerio');
const {
  randomDelay,
  fixedDelay,
  saveToJson,
  saveToCsv,
  randomUserAgent,
  log
} = require('../utils/helpers');

const BASE_URL = 'http://quotes.toscrape.com';

async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;
  let lastError;

  while (attempt < maxRetries) {
    attempt += 1;
    try {
      const response = await axios.get(url, {
        timeout: 12000,
        headers: { 'User-Agent': randomUserAgent() }
      });
      return response.data;
    } catch (error) {
      lastError = error;
      log(`Retry ${attempt}/${maxRetries}`, 'warn');
      if (attempt < maxRetries) {
        const backoffMs = 1000 * attempt;
        await fixedDelay(backoffMs);
      }
    }
  }

  throw lastError;
}

async function scrapeQuotesWithPagination(maxPages = 8) {
  log('Inicio resiliente', 'info');
  let currentUrl = BASE_URL;
  let currentPage = 0;
  const allQuotes = [];

  while (currentUrl && currentPage < maxPages) {
    currentPage += 1;

    try {
      const html = await fetchWithRetry(currentUrl, 3);
      const $ = cheerio.load(html);

      const quotes = $('.quote').map((_, el) => {
        const text = $(el).find('.text').text().trim();
        const author = $(el).find('.author').text().trim();
        const tags = $(el).find('.tags .tag').map((__, tag) => $(tag).text().trim()).get();

        return {
          text,
          author,
          tags,
          page: currentPage,
          source_url: currentUrl
        };
      }).get();

      allQuotes.push(...quotes);
      log(`Pag ${currentPage}: +${quotes.length} (total ${allQuotes.length})`, 'info');

      const nextHref = $('.next > a').attr('href');
      currentUrl = nextHref ? `${BASE_URL}${nextHref}` : null;

      if (currentUrl) {
        await randomDelay(900, 1600);
      }
    } catch (error) {
      log(`Error pag ${currentPage}: ${error.message}`, 'error');
      break;
    }
  }

  return allQuotes;
}

(async () => {
  const data = await scrapeQuotesWithPagination(8);

  if (!data.length) {
    log('Sin datos', 'warn');
    return;
  }

  saveToJson(data, 'citas_resiliente.json');
  saveToCsv(data, 'citas_resiliente.csv');
  log(`Fin resiliente: ${data.length}`, 'success');
})();
