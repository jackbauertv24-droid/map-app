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

test.describe('Map App - Page Load', () => {
  test.beforeEach(beforeEachTest);

  test('page loads with all UI elements', async ({ page }) => {
    await expect(page).toHaveTitle(/地圖應用程式|Map App/);
    await expect(page.locator('#langSelect')).toBeVisible();
    await expect(page.locator('#regionSelect')).toBeVisible();
    await expect(page.locator('#searchInput')).toBeVisible();
    await expect(page.locator('#searchBtn')).toHaveText('搜尋');
  });

  test('dropdowns disabled by default', async ({ page }) => {
    await expect(page.locator('#lineSelect')).toBeDisabled();
    await expect(page.locator('#stationSelect')).toBeDisabled();
  });
});

test.describe('Map App - Dropdowns', () => {
  test.beforeEach(beforeEachTest);

  test('Hong Kong Island populates lines', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await expect(page.locator('#lineSelect')).not.toBeDisabled();
    const options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('Island Line');
  });

  test('Island Line populates stations', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await expect(page.locator('#stationSelect')).not.toBeDisabled();
    const options = await page.locator('#stationSelect option').allTextContents();
    expect(options).toContain('Central');
  });

  test('station selection shows filter badge', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.waitForTimeout(500);
    await expect(page.locator('#activeFilter')).toBeVisible();
    await expect(page.locator('#filterStation')).toHaveText('Central');
    await expect(page.locator('#filterRadius')).toHaveText(/1 公里|1km/);
  });

  test('clear filter button works', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.locator('#clearFilter').click();
    await expect(page.locator('#activeFilter')).not.toBeVisible();
  });
});

test.describe('Map App - Search (Real API)', () => {
  test.beforeEach(beforeEachTest);

  test('search McDonalds returns results', async ({ page }) => {
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
  });

  test('search with station shows distance', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.waitForTimeout(500);
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('米', { timeout: 15000 });
  });

  test('Enter key triggers search', async ({ page }) => {
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchInput').press('Enter');
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
  });

  test('empty search shows error', async ({ page }) => {
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toHaveText('請輸入地址。');
  });

  test('no results for invalid query', async ({ page }) => {
    await page.locator('#searchInput').fill('xyzabc123nonexistent');
    await page.locator('#searchBtn').click();
    await page.waitForTimeout(5000);
    await expect(page.locator('#result')).toContainText('找不到結果');
  });
});

test.describe('Map App - Language', () => {
  test.beforeEach(beforeEachTest);

  test('switch to English', async ({ page }) => {
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(300);
    await expect(page.locator('#searchBtn')).toHaveText('Search');
    await expect(page.locator('h1')).toHaveText('Map App');
  });

  test('English filter badge', async ({ page }) => {
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(300);
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.waitForTimeout(500);
    await expect(page.locator('#filterRadius')).toHaveText('1km');
  });

  test('language persists after reload', async ({ page }) => {
    await page.locator('#langSelect').selectOption('en');
    await page.reload({ waitUntil: 'networkidle' });
    await expect(page.locator('#langSelect')).toHaveValue('en');
    await expect(page.locator('#searchBtn')).toHaveText('Search');
  });

  test('search results in English', async ({ page }) => {
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(300);
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.waitForTimeout(500);
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('m', { timeout: 15000 });
  });
});

test.describe('Map App - Mobile', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
  });

  test('mobile layout stacks elements', async ({ page }) => {
    const regionBox = await page.locator('#regionSelect').boundingBox();
    const lineBox = await page.locator('#lineSelect').boundingBox();
    expect(lineBox.y).toBeGreaterThan(regionBox.y);
  });

  test('mobile search works', async ({ page }) => {
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
  });
});

test.describe('Map App - Integration', () => {
  test.beforeEach(beforeEachTest);

  test('full workflow', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.waitForTimeout(500);
    
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
    
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(500);
    await expect(page.locator('#filterRadius')).toHaveText('1km');
  });

  test('multiple searches', async ({ page }) => {
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
    
    await page.locator('#searchInput').fill('restaurant');
    await page.locator('#searchBtn').click();
    await page.waitForTimeout(5000);
    const resultText = await page.locator('#result').textContent();
    expect(resultText).not.toContain('找不到結果');
  });

  test('XSS protection', async ({ page }) => {
    await page.locator('#searchInput').fill('<script>alert("xss")</script>');
    await page.locator('#searchBtn').click();
    await page.waitForTimeout(5000);
    const resultHTML = await page.locator('#result').innerHTML();
    expect(resultHTML).not.toContain('<script>');
  });
});

test.describe('Map App - Performance', () => {
  test.beforeEach(beforeEachTest);

  test('page loads within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(Date.now() - startTime).toBeLessThan(3000);
  });

  test('search completes within 10 seconds', async ({ page }) => {
    await page.locator('#searchInput').fill('McDonalds');
    const startTime = Date.now();
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 10000 });
    expect(Date.now() - startTime).toBeLessThan(10000);
  });
});
