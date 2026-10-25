const fs = require("fs");
const path = require("path");

const files = ["index.html", "work.html", "gallery.html", "about.html", "contact.html", "assets/css/tokens.css", "assets/css/base.css", "assets/css/chrome.css", "assets/css/home.css", "assets/css/work.css", "assets/css/gallery.css", "assets/css/about.css", "assets/css/contact.css"];

let totalMissing = 0;
files.forEach(file => {
  if (!fs.existsSync(file)) return;
  const content = fs.readFileSync(file, "utf8");
  const matches = [...new Set(content.match(/assets\/(?:img|fonts)\/[^\s"',)]+/g) || [])];
  matches.forEach(p => {
    // clean any trailing quote or paren
    const cleanPath = p.replace(/[)"';]+$/, "");
    if (!fs.existsSync(cleanPath)) {
      console.error(`[${file}] MISSING:`, cleanPath);
      totalMissing++;
    } else {
      console.log(`[${file}] OK:`, cleanPath);
    }
  });
});

console.log("Total missing across all files:", totalMissing);
