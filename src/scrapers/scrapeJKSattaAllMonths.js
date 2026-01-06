const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const scrapeJKSattaAllMonths = async (startYear = 2026) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    await page.goto("https://jksatta.com/", {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    const allResults = [];

    // ⚠️ SERVERLESS SAFE: limit months
    const MAX_MONTHS = 3;

    for (let month = 1; month <= MAX_MONTHS; month++) {
      await page.evaluate((m) => {
        const formatted = String(m).padStart(2, "0");
        const buttons = document.querySelectorAll("button, option");

        for (const b of buttons) {
          const txt = b.textContent?.trim();
          if (txt === formatted || b.getAttribute("data-month") === formatted) {
            b.click();
            break;
          }
        }
      }, month);

      await sleep(1500);

      const data = await page.evaluate(() => {
        if (!window.record) return [];

        const rows = [];
        for (const gameId in window.record) {
          for (const d in window.record[gameId]) {
            const item = window.record[gameId][d];
            rows.push({
              gameId,
              date: item.date,
              resultNumber: item.no,
            });
          }
        }
        return rows;
      });

      allResults.push(...data);
    }

    // ---------- Filter + Dedupe ----------
    const seen = new Set();
    const filtered = [];

    for (const it of allResults) {
      if (!it?.date) continue;

      const match = String(it.date).match(/(\d{4})/);
      if (!match || Number(match[1]) < startYear) continue;

      const key = `${it.gameId}|${it.date}|${it.resultNumber}`;
      if (seen.has(key)) continue;

      seen.add(key);
      filtered.push(it);
    }

    return {
      site: "jksatta.com",
      totalResults: filtered.length,
      results: filtered,
      scrapedAt: new Date(),
    };
  } catch (err) {
    console.error("❌ Scraper Error:", err);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = scrapeJKSattaAllMonths;
