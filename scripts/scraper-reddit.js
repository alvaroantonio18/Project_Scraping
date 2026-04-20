const puppeteer = require('puppeteer');
const { randomDelay, saveToJson, log } = require('../utils/helpers');

async function scrapeReddit() {
  log('Inicio reddit', 'info');
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.reddit.com/r/programming/top/?t=day', {
    waitUntil: 'networkidle2'
  });

  await randomDelay(2000, 3000);

  const posts = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('h3').forEach((titleElem, idx) => {
      if (idx < 20) {
        const linkElem = titleElem.closest('a');
        items.push({
          title: titleElem.innerText.trim(),
          url: linkElem ? linkElem.href : null
        });
      }
    });
    return items;
  });

  await browser.close();
  log(`Posts: ${posts.length}`, 'info');
  return posts;
}

(async () => {
  try {
    const posts = await scrapeReddit();
    if (posts.length) {
      saveToJson(posts, 'reddit_posts.json');
      log('Fin reddit', 'success');
    } else {
      log('Sin datos', 'warn');
    }
  } catch (error) {
    log(`Error reddit: ${error.message}`, 'error');
  }
})();