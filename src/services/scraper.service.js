const puppeteer = require("puppeteer");

async function scrapeJKSattaAllMonths(startYear = 2026) {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://jksatta.com/", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    const rawData = await page.evaluate(() => {
      if (!window.record) return [];

      return Object.entries(window.record).flatMap(
        ([gameId, dates]) =>
          Object.values(dates).map(item => ({
            gameId,
            date: item?.date,
            resultNumber: item?.no
          }))
      );
    });

    const filtered = rawData.filter(
      r => r?.date?.includes(startYear)
    );

    return {
      site: "jksatta.com",
      totalResults: filtered.length,
      results: filtered,
      scrapedAt: new Date()
    };
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = scrapeJKSattaAllMonths;
