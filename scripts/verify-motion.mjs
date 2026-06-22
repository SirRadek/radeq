import { chromium } from "playwright";
const url = process.argv[2];
const out = process.argv[3];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(800);
// scroll through to trigger IntersectionObserver reveals
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y <= h; y += 700) { await p.evaluate((yy) => window.scrollTo(0, yy), y); await p.waitForTimeout(120); }
await p.evaluate(() => window.scrollTo(0, 0));
await p.waitForTimeout(400);
const res = await p.evaluate(() => {
  const rqMotion = document.documentElement.dataset.rqMotion || "(unset)";
  const reveals = Array.from(document.querySelectorAll("[data-rq-reveal]"));
  let hidden = 0;
  for (const el of reveals) { if (parseFloat(getComputedStyle(el).opacity) < 0.5) hidden++; }
  const magnetic = document.querySelectorAll("[data-rq-magnetic]").length;
  const overflow = document.documentElement.scrollWidth - document.documentElement.clientWidth;
  return { rqMotion, reveals: reveals.length, stillHidden: hidden, magnetic, overflow };
});
console.log(JSON.stringify(res));
await p.screenshot({ path: out, fullPage: false });
await b.close();
