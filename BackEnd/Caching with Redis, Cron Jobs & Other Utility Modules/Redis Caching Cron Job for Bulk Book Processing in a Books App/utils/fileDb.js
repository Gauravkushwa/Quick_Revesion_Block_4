/**
 * Simple JSON file-based DB utilities
 * Used for reading and writing users/books without a real DB.
 */
const fs = require("fs");

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data || "[]");
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON };
