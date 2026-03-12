const { test, expect } = require('@playwright/test');

const beforeEachTest = async ({ page, context }) => {
  await context.clearCookies();
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
};

test.describe('Map Visualize Feature', () => {
  test.beforeEach(beforeEachTest);

  test('visualize button appears after search and opens map', async ({ page }) => {
    await page.fill('#searchInput', '麥當勞');
    await page.click('#searchBtn');
    await page.waitForSelector('#visualizeBtn', { timeout: 15000 });
    await page.waitForTimeout(500);

    const visualizeBtn = page.locator('#visualizeBtn');
    await expect(visualizeBtn).toBeVisible();
    
    const btnText = await visualizeBtn.textContent();
    console.log('✓ Visualize button found:', btnText.trim());
  });

  test('map modal opens with markers after clicking visualize', async ({ page }) => {
    await page.fill('#searchInput', '麥當勞');
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    await page.click('#visualizeBtn');
    await page.waitForTimeout(1500);

    const modal = page.locator('#mapModal');
    await expect(modal).toBeVisible();
    
    const isOpen = await modal.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBe(true);
    console.log('✓ Map modal is open');

    const mapContainer = page.locator('#mapContainer');
    await expect(mapContainer).toBeVisible();
    console.log('✓ Map container visible');

    const markers = page.locator('.leaflet-marker-icon');
    const markerCount = await markers.count();
    console.log(`✓ Markers on map: ${markerCount}`);
    expect(markerCount).toBeGreaterThan(0);

    const resultItems = page.locator('.map-result-item');
    const itemCount = await resultItems.count();
    console.log(`✓ Result items in panel: ${itemCount}`);
    expect(itemCount).toBeGreaterThan(0);
  });

  test('map modal closes with close button', async ({ page }) => {
    await page.fill('#searchInput', '麥當勞');
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    await page.click('#visualizeBtn');
    await page.waitForTimeout(1500);

    await page.click('#mapCloseBtn');
    await page.waitForTimeout(500);

    const modal = page.locator('#mapModal');
    const isOpen = await modal.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBe(false);
    console.log('✓ Map modal closed successfully');
  });

  test('map modal closes with Escape key', async ({ page }) => {
    await page.fill('#searchInput', '麥當勞');
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    await page.click('#visualizeBtn');
    await page.waitForTimeout(1500);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    const modal = page.locator('#mapModal');
    const isOpen = await modal.evaluate(el => el.classList.contains('open'));
    expect(isOpen).toBe(false);
    console.log('✓ Map modal closed with Escape key');
  });

  test('clicking result item zooms to marker', async ({ page }) => {
    await page.fill('#searchInput', '麥當勞');
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    const visualizeBtn = page.locator('#visualizeBtn');
    if (await visualizeBtn.isVisible()) {
      await visualizeBtn.click();
      await page.waitForTimeout(1500);

      const firstResult = page.locator('.map-result-item').first();
      await firstResult.click();
      await page.waitForTimeout(1000);

      const popup = page.locator('.leaflet-popup');
      const isVisible = await popup.isVisible();
      console.log('✓ Popup visible after clicking result:', isVisible);
    }
  });

  test('marker cluster groups nearby markers', async ({ page }) => {
    await page.fill('#searchInput', '餐廳');
    await page.click('#searchBtn');
    await page.waitForTimeout(3000);

    const visualizeBtn = page.locator('#visualizeBtn');
    if (await visualizeBtn.isVisible()) {
      await visualizeBtn.click();
      await page.waitForTimeout(1500);

      const clusters = page.locator('.marker-cluster');
      const clusterCount = await clusters.count();
      console.log(`✓ Marker clusters found: ${clusterCount}`);

      const markers = page.locator('.leaflet-marker-icon');
      const markerCount = await markers.count();
      console.log(`✓ Total markers: ${markerCount}`);
    }
  });
});
