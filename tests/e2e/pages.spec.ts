import { test, expect } from '@playwright/test';

test('admin can edit static pages and changes are visible on frontend', async ({ page }) => {
  await page.addInitScript(() => { sessionStorage.setItem('adminToken', 'true'); (window as any).__FLABEF_TESTING__ = true; });
  await page.goto('/admin');
  await expect(page.locator('text=Panel de Administración')).toBeVisible();

  // Open Pages tab
  await page.click('button:has-text("Páginas")');
  const pagesTab = page.locator('text=Páginas').first();
  await expect(pagesTab).toBeVisible();

  // Select Política de Cookies page
  const pageBtn = page.locator('button:has-text("Política de Cookies")').first();
  await pageBtn.click();

  // Edit title/content
  const titleInput = page.locator('label:has-text("Título")').locator('..').locator('input');
  const contentArea = page.locator('label:has-text("Contenido (HTML permitido)")').locator('..').locator('textarea');
  await titleInput.fill('Política de Cookies (Editada)');
  await contentArea.fill('<p>Contenido de cookies actualizado.</p>');
  await page.locator('button:has-text("Guardar")').click();

  // Visit the page and check content
  await page.goto('/page/cookies');
  await expect(page.locator('text=Política de Cookies (Editada)')).toBeVisible();
  await expect(page.locator('text=Contenido de cookies actualizado.')).toBeVisible();
});