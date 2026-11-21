// Screenshot of one screen to compare it with the Figma (docs/figma).
// Usage: node shot.mjs /familia/carpeta 430 /tmp/carpeta.png   (WEB_URL defaults to the dev server on :3001)
import { chromium } from "@playwright/test";

const [path, width, out] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto((process.env.WEB_URL ?? "http://localhost:3001") + path);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
