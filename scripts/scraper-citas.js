const axios = require('axios');
const cheerio = require('cheerio');
const { randomDelay, saveToJson, saveToCsv, randomUserAgent, log } = require('../utils/helpers');

const BASE_URL = 'http://quotes.toscrape.com';

async function scrapePage(url) {
  try {
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': randomUserAgent() }
    });
    const $ = cheerio.load(data);
    const quotes = [];

    $('.quote').each((i, el) => {
      quotes.push({
        text: $(el).find('.text').text().trim(),
        author: $(el).find('.author').text().trim(),
        tags: $(el).find('.tags .tag').map((_, tag) => $(tag).text()).get()
      });
    });

    const nextButton = $('.next > a');
    const nextUrl = nextButton.length ? BASE_URL + nextButton.attr('href') : null;

    return { quotes, nextUrl };
  } catch (error) {
    log(`Error pagina: ${error.message}`, 'error');
    return { quotes: [], nextUrl: null };
  }
}

async function scrapeAllQuotes(maxPages = 5) {
  log('Inicio citas', 'info');
  let allQuotes = [];
  let currentUrl = BASE_URL;
  let page = 0;

  while (currentUrl && page < maxPages) {
    page++;
    const { quotes, nextUrl } = await scrapePage(currentUrl);
    allQuotes.push(...quotes);
    log(`Pag ${page}: +${quotes.length} (total ${allQuotes.length})`, 'info');
    currentUrl = nextUrl;
    if (currentUrl) await randomDelay(1000, 2000);
  }
  return allQuotes;
}

(async () => {
  const citas = await scrapeAllQuotes(5);
  if (citas.length) {
    saveToJson(citas, 'citas.json');
    saveToCsv(citas, 'citas.csv');
    log(`Fin citas: ${citas.length}`, 'success');
  } else {
    log('Sin datos', 'warn');
  }
})();