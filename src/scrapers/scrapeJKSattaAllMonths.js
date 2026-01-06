const puppeteer = require("puppeteer");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scrapeJKSattaAllMonths = async (startYear = 2026) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto("https://jksatta.com/", {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  const allResults = [];

  // Attempt to extract all data available on the page (then filter to startYear)
  // The site exposes `record` in page context containing gameId -> dates
  const pageData = await page.evaluate(() => {
    if (typeof window.record === 'undefined') return [];

    const rows = [];
    for (const gameId in window.record) {
      for (const dateKey in window.record[gameId]) {
        const item = window.record[gameId][dateKey];
        rows.push({ gameId, date: item.date, resultNumber: item.no });
      }
    }

    return rows;
  });

  if (Array.isArray(pageData) && pageData.length) {
    allResults.push(...pageData);
  } else {
    // Fallback: try iterating months to force page to populate `record`
    for (let month = 1; month <= 12; month++) {
      console.log(`📅 Forcing month load: ${month}`);

      await page.evaluate((m) => {
        const formatted = String(m).padStart(2, '0');
        const buttons = document.querySelectorAll('.month-btn, .month, select option, button');
        for (const b of buttons) {
          const txt = b.textContent ? b.textContent.trim() : '';
          if (txt === formatted || b.getAttribute('data-month') === formatted) {
            b.click();
            break;
          }
        }
      }, month);

      await sleep(2000);

      const partial = await page.evaluate(() => {
        if (typeof window.record === 'undefined') return [];
        const rows = [];
        for (const gameId in window.record) {
          for (const dateKey in window.record[gameId]) {
            const item = window.record[gameId][dateKey];
            rows.push({ gameId, date: item.date, resultNumber: item.no });
          }
        }
        return rows;
      });

      if (Array.isArray(partial) && partial.length) allResults.push(...partial);
    }
  }

  await browser.close();

  // Normalize and filter: only include items from startYear onward, dedupe, group by game name
  const seen = new Set();
  const filtered = [];

  for (const it of allResults) {
    if (!it || !it.date) continue;

    // try to extract year from date string
    const m = String(it.date).match(/(\d{4})/);
    if (!m) continue;
    const year = Number(m[1]);
    if (Number.isNaN(year) || year < startYear) continue;

    const key = `${it.gameId || ''}|${it.date}|${it.resultNumber}`;
    if (seen.has(key)) continue;
    seen.add(key);

    filtered.push(it);
  }

  // Helper to create readable game name from gameId
  const formatGameName = (gameId) => {
    if (!gameId) return 'UNKNOWN';
    // Replace dashes/underscores, remove non-letters/numbers, collapse spaces, uppercase
    return String(gameId)
      .replace(/[-_]+/g, ' ')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  };

  const resultsByGame = {};
  for (const it of filtered) {
    const name = formatGameName(it.gameId);
    if (!resultsByGame[name]) resultsByGame[name] = [];
    resultsByGame[name].push(it);
  }

  return {
    site: 'jksatta.com',
    totalResults: filtered.length,
    results: filtered,
    resultsByGame,
    scrapedAt: new Date(),
  };
};

module.exports = scrapeJKSattaAllMonths;
