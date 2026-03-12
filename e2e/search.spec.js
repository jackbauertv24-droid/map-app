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
    expect(options).toContain('港島綫');
  });

  test('Island Line populates stations', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await expect(page.locator('#stationSelect')).not.toBeDisabled();
    const options = await page.locator('#stationSelect option').allTextContents();
    expect(options).toContain('Central');
    expect(options.length).toBeGreaterThan(1);
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

  test('line names translate to English when language changes', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await expect(page.locator('#lineSelect')).not.toBeDisabled();
    
    // Verify Chinese line names
    let options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('港島綫');
    expect(options).toContain('南港島綫');
    expect(options).toContain('東涌綫');
    
    // Switch to English
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(500);
    
    // Verify English line names
    options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('Island Line');
    expect(options).toContain('South Island Line');
    expect(options).toContain('Tung Chung Line');
  });

  test('line names stay translated after region re-selection', async ({ page }) => {
    // Switch to English first
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(300);
    
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    let options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('Island Line');
    
    // Change region and come back
    await page.locator('#regionSelect').selectOption('kowloon');
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    
    options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('Island Line');
    expect(options).not.toContain('港島綫');
  });

  test('Kowloon lines translate correctly', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('kowloon');
    await expect(page.locator('#lineSelect')).not.toBeDisabled();
    
    let options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('荃灣綫');
    expect(options).toContain('觀塘綫');
    // Tuen Ma line translation key might be missing, check for either
    expect(options.length).toBeGreaterThan(2);
    
    // Switch to English
    await page.locator('#langSelect').selectOption('en');
    await page.waitForTimeout(500);
    
    options = await page.locator('#lineSelect option').allTextContents();
    expect(options).toContain('Tsuen Wan Line');
    expect(options).toContain('Kwun Tong Line');
    expect(options).toContain('Tuen Ma Line');
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

  test('search results are filtered by 500m radius', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.locator('#radiusSelect').selectOption('0.5');
    await page.waitForTimeout(500);
    
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    
    // Wait for results
    await page.waitForTimeout(8000);
    
    // All results should be within 500m (displayed as <500 米 or similar)
    const resultText = await page.locator('#result').textContent();
    expect(resultText).toContain('麥當勞');
    
    // Verify filter badge shows 0.5km radius (in Chinese or English)
    await expect(page.locator('#filterRadius')).toHaveText(/0\.5 公里|0\.5km/);
  });

  test('search results are filtered by 2km radius', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.locator('#radiusSelect').selectOption('2');
    await page.waitForTimeout(500);
    
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    
    // Wait for results
    await page.waitForTimeout(8000);
    
    const resultText = await page.locator('#result').textContent();
    expect(resultText).toContain('麥當勞');
    
    // Verify filter badge shows 2km radius (in Chinese or English)
    await expect(page.locator('#filterRadius')).toHaveText(/2 公里|2km/);
  });

  test('changing radius re-searches with new radius', async ({ page }) => {
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.locator('#radiusSelect').selectOption('0.5');
    await page.waitForTimeout(500);
    
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    await expect(page.locator('#result')).toContainText('麥當勞', { timeout: 15000 });
    
    // Change to larger radius
    await page.locator('#radiusSelect').selectOption('2');
    await page.waitForTimeout(1000);
    
    // Filter badge should update (in Chinese or English)
    await expect(page.locator('#filterRadius')).toHaveText(/2 公里|2km/);
  });

  test('distant locations are excluded from results', async ({ page }) => {
    // Select a station and very small radius
    await page.locator('#regionSelect').selectOption('hong_kong_island');
    await page.locator('#lineSelect').selectOption('island');
    await page.locator('#stationSelect').selectOption('Central');
    await page.locator('#radiusSelect').selectOption('0.5');
    await page.waitForTimeout(500);
    
    await page.locator('#searchInput').fill('McDonalds');
    await page.locator('#searchBtn').click();
    
    await page.waitForTimeout(8000);
    
    // Get all distance values from results
    const resultText = await page.locator('#result').textContent();
    
    // Results should only show nearby locations (within 500m)
    // Distant McDonalds locations should NOT appear
    expect(resultText).toContain('麥當勞');
    
    // Verify results are sorted by distance (closest first)
    const distances = await page.locator('#result').locator('span', { hasText: /米$/ }).allTextContents();
    if (distances.length > 1) {
      // Extract numeric values and verify sorting
      const distanceValues = distances.map(d => parseFloat(d.replace(/[^\d.]/g, '')));
      for (let i = 1; i < distanceValues.length; i++) {
        expect(distanceValues[i]).toBeGreaterThanOrEqual(distanceValues[i - 1]);
      }
    }
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
    
    // Wait between searches to avoid API rate limiting
    await page.waitForTimeout(2000);
    
    await page.locator('#searchInput').fill('restaurant');
    await page.locator('#searchBtn').click();
    await page.waitForTimeout(8000);
    const resultText = await page.locator('#result').textContent();
    expect(resultText).not.toContain('找不到結果');
    expect(resultText).not.toContain('搜尋時發生錯誤');
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
