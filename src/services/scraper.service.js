const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

/**
 * ✅ Render-safe scraper
 * Function name preserved: scrapeJKSattaAllMonths
 */
async function scrapeJKSattaAllMonths(startYear = 2026) {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://jksatta.com/", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const pageData = await page.evaluate(() => {
      if (!window.record) return [];

      const rows = [];
      for (const gameId in window.record) {
        for (const dateKey in window.record[gameId]) {
          const r = window.record[gameId][dateKey];
          rows.push({
            gameId,
            date: r.date,
            resultNumber: r.no
          });
        }
      }
      return rows;
    });

    // filter by year
    const results = pageData.filter(r => {
      const year = Number(r.date?.split("-")[2]);
      return year >= startYear;
    });

    return {
      site: "jksatta.com",
      results,
      scrapedAt: new Date()
    };

  } catch (err) {
    console.error("SCRAPER ERROR:", err.message);
    throw new Error("Scraping failed");
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeJKSattaAllMonths };
