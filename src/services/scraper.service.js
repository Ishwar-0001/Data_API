const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

async function scrapeJKSattaAllMonths(startYear = 2026) {
  let browser;

  try {
    const executablePath = await chromium.executablePath();

    if (!executablePath) {
      throw new Error("Chromium executable not found");
    }

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless
    });

    const page = await browser.newPage();

    await page.goto("https://jksatta.com/", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const results = await page.evaluate(() => {
      if (!window.record) return [];

      const rows = [];
      for (const gameId in window.record) {
        for (const key in window.record[gameId]) {
          const r = window.record[gameId][key];
          rows.push({
            gameId,
            date: r.date,
            resultNumber: r.no
          });
        }
      }
      return rows;
    });

    const filtered = results.filter(r => {
      const year = Number(r.date?.split("-")[2]);
      return year >= startYear;
    });

    return {
      site: "jksatta.com",
      results: filtered,
      scrapedAt: new Date()
    };

  } catch (err) {
    console.error("SCRAPER ERROR:", err);
    throw new Error("Scraping failed");
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { scrapeJKSattaAllMonths };
