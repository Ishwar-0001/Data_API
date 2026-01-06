function extractYear(dateStr) {
  const match = dateStr.match(/\b(20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

module.exports = { extractYear };
