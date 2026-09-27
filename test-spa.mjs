export default async function run(page, ui) {
  const results = {};
  const pages = ['about', 'products', 'services', 'contact', 'home'];

  // Wait for DOM and script to be ready
  await page.waitForFunction(() => typeof window.showPage === 'function', { timeout: 5000 }).catch(() => {});

  for (const p of pages) {
    await page.evaluate(id => window.showPage(id), p);
    await page.waitForTimeout(300);
    results[p] = await page.evaluate(() => JSON.stringify({
      activeCount: document.querySelectorAll('.page.active').length,
      visiblePages: [...document.querySelectorAll('.page')].filter(el => getComputedStyle(el).display !== 'none').map(el => el.id),
      activeNavLinks: [...document.querySelectorAll('.nav-link.active')].map(el => el.textContent.trim())
    }));
  }

  return results;
}
