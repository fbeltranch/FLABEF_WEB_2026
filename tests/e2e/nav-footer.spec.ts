import { test, expect } from '@playwright/test';

test('navbar and footer basic interactions', async ({ page }) => {
  // Visit home
  await page.goto('/');
  await expect(page).toHaveURL(/\/?$/);

  // Search: fill and press Enter
  const search = page.locator('input[placeholder="Buscar en Flabef..."]');
  await expect(search).toBeVisible();
  await search.fill('Camiseta');
  await search.press('Enter');
  await expect(page).toHaveURL(/\/products/);
  await expect(page.url()).toContain('search=Camiseta');

  // Cart link
  await page.click('a[href="/cart"]');
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.locator('text=Carrito de Compras')).toBeVisible();

  // Go back home
  await page.goto('/');

  // Footer: Catálogo link (use .first() to avoid strict mode conflicts when multiple matches exist)
  const footerCatalog = page.locator('footer a:has-text("Catálogo")').first();
  await expect(footerCatalog).toBeVisible();
  await footerCatalog.click();
  await expect(page).toHaveURL(/\/products/);

  // Footer contact phone and email should have proper hrefs
  const phone = page.locator('footer a[href^="tel:"]');
  const mail = page.locator('footer a[href^="mailto:"]');
  await expect(phone).toHaveCount(1);
  await expect(mail).toHaveCount(1);
  const phoneHref = await phone.getAttribute('href');
  const mailHref = await mail.getAttribute('href');
  expect(phoneHref?.startsWith('tel:')).toBeTruthy();
  expect(mailHref?.startsWith('mailto:')).toBeTruthy();

  // Footer small links (Política de Cookies / Mapa del Sitio) are clickable and do not navigate away (href="#")
  const smallLinks = page.locator('footer a:has-text("Política de Cookies"), footer a:has-text("Mapa del Sitio"), footer a:has-text("Seguridad")');
  const count = await smallLinks.count();
  for (let i = 0; i < count; i++) {
    const l = smallLinks.nth(i);
    await l.click();
  }

  // Hamburger menu: open and click first category (if exists)
  const menuBtn = page.locator('button[title="Abrir menú"]');
  if (await menuBtn.isVisible()) {
    await menuBtn.click();
    // Scope to the sheet/dialog that contains the menu and wait until visible/stable
    const sheet = page.locator('div[role="dialog"]:has-text("FLABEF Menú")');
    await expect(sheet).toBeVisible();
    // Category buttons are inside a column inside the sheet
    const catBtn = sheet.locator('div.flex-col button').first();
    if ((await catBtn.count()) > 0) {
      await catBtn.click();
      // URL should change to /category/:slug or similar
      await expect(page).toHaveURL(/\/category\//);
    }
  }
});