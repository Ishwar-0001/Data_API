const axios = require("axios");
const cheerio = require("cheerio");

const scrapeJKSatta = async (startYear = 2026, filterGameIds = [116, 117]) => {
  try {
    const url = "https://jksatta.com/";
    const { data } = await axios.get(url);

    const $ = cheerio.load(data);

    let recordData = null;

    // 🔍 Find script that contains "var record"
    $("script").each((i, script) => {
      const scriptText = $(script).html();

      if (scriptText && scriptText.includes("var record")) {
        const match = scriptText.match(/var record\s*=\s*(\{[\s\S]*?\});/);

        if (match && match[1]) {
          recordData = JSON.parse(
            match[1]
              .replace(/(\w+):/g, '"$1":') // fix keys
              .replace(/'/g, '"')          // fix quotes
          );
        }
      }
    });

    if (!recordData) {
      throw new Error("Record data not found");
    }

    /* ---------------- Clean + Filter Data ---------------- */
    const all = [];

    for (const gameId in recordData) {
      for (const dateKey in recordData[gameId]) {
        const item = recordData[gameId][dateKey];
        all.push({ gameId, date: item.date, resultNumber: item.no });
      }
    }

    // helper: map some known numeric ids to names; fallback to formatting
    const nameMap = {
      116: 'BOMBAY CITY',
      117: 'FARIDABAD'
    };

    const formatGameName = (gid) => {
      if (!gid) return 'UNKNOWN';
      if (nameMap[String(gid)]) return nameMap[String(gid)];
      // if numeric string -> return as-is
      if (/^\d+$/.test(String(gid))) return String(gid);
      return String(gid).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    };

    // Filter by startYear and requested gameIds, dedupe
    const seen = new Set();
    const results = [];

    for (const it of all) {
      if (!it || !it.date) continue;
      const m = String(it.date).match(/(\d{4})/);
      if (!m) continue;
      const year = Number(m[1]);
      if (Number.isNaN(year) || year < startYear) continue;

      // filter by gameId if provided
      if (filterGameIds && Array.isArray(filterGameIds) && filterGameIds.length) {
        const gidNum = Number(it.gameId);
        const gidStr = String(it.gameId);
        const match = filterGameIds.some(f => String(f) === gidStr || Number(f) === gidNum);
        if (!match) continue;
      }

      const key = `${it.gameId}|${it.date}|${it.resultNumber}`;
      if (seen.has(key)) continue;
      seen.add(key);

      results.push(it);
    }

    // Group by readable game name
    const resultsByGame = {};
    for (const r of results) {
      const name = formatGameName(r.gameId);
      if (!resultsByGame[name]) resultsByGame[name] = [];
      resultsByGame[name].push(r);
    }

    return {
      siteName: "jksatta.com",
      page: "chart",
      totalResults: results.length,
      results,
      resultsByGame,
      scrapedAt: new Date()
    };

  } catch (error) {
    console.error("Scraping Error:", error.message);
    return null;
  }
};

module.exports = scrapeJKSatta;
