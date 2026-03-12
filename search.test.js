const fs = require('fs');
const path = require('path');

describe('Map App', () => {
  test('index.html exists', () => {
    const indexPath = path.join(__dirname, 'index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('index.html contains search input', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('searchInput');
    // Default is Traditional Chinese
    expect(html).toContain('輸入地點或地址');
  });

  test('index.html contains search button', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('searchBtn');
    expect(html).toContain('搜尋');
  });

  test('index.html references external search.js', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('src="src/search.js"');
  });

  test('search.js exists', () => {
    const searchPath = path.join(__dirname, 'src/search.js');
    expect(fs.existsSync(searchPath)).toBe(true);
  });
});

describe('Overpass Query Building', () => {
  const { buildOverpassQuery, HK_BOUNDS } = require('./src/search');

  test('builds query for McDonalds with name filter', () => {
    const query = buildOverpassQuery('McDonalds');
    expect(query).toContain('[out:json]');
    expect(query).toContain('["name"~"McDonald",i]');
  });

  test('builds query for KFC', () => {
    const query = buildOverpassQuery('KFC');
    expect(query).toContain('["name"~"KFC",i]');
  });

  test('builds query for Starbucks', () => {
    const query = buildOverpassQuery('Starbucks');
    expect(query).toContain('["name"~"Starbucks",i]');
  });

  test('builds query for Burger King', () => {
    const query = buildOverpassQuery('Burger King');
    expect(query).toContain('["name"~"Burger King",i]');
  });

  test('builds query for restaurants by amenity type', () => {
    const query = buildOverpassQuery('restaurant');
    expect(query).toContain('["amenity"="restaurant"]');
  });

  test('builds query for cafes', () => {
    const query = buildOverpassQuery('coffee');
    expect(query).toContain('["amenity"="cafe"]');
  });

  test('builds query for hotels', () => {
    const query = buildOverpassQuery('hotel');
    expect(query).toContain('["amenity"="hotel"]');
  });

  test('builds query with Chinese amenity terms', () => {
    const query = buildOverpassQuery('餐廳');
    expect(query).toContain('["amenity"="restaurant"]');
  });

  test('builds query with bounding box', () => {
    const query = buildOverpassQuery('hotels');
    expect(query).toContain('22.15');
    expect(query).toContain('113.8');
    expect(query).toContain('22.55');
    expect(query).toContain('114.45');
  });

  test('builds generic query for unknown terms', () => {
    const query = buildOverpassQuery('Victoria Peak');
    expect(query).toContain('["name"~"Victoria Peak",i]');
  });
});



describe('Search Functionality - renderResults', () => {
  const { renderResults, escapeHtml } = require('./src/search');

  let resultDiv;

  beforeEach(() => {
    resultDiv = { innerHTML: '', textContent: '' };
  });

  test('renders multiple results correctly', () => {
    const mockResults = [
      { display_name: "McDonald's", lat: '22.3299', lon: '114.1625' },
      { display_name: "McDonald's 2", lat: '22.2944', lon: '114.1687' },
      { display_name: "McDonald's 3", lat: '22.3320', lon: '114.1615' },
      { display_name: "McDonald's 4", lat: '22.2493', lon: '114.1487' },
      { display_name: "McDonald's 5", lat: '22.3715', lon: '113.9925' }
    ];

    renderResults(mockResults, resultDiv);

    expect(resultDiv.innerHTML).toContain('>#1<');
    expect(resultDiv.innerHTML).toContain('>#2<');
    expect(resultDiv.innerHTML).toContain('>#3<');
    expect(resultDiv.innerHTML).toContain('>#4<');
    expect(resultDiv.innerHTML).toContain('>#5<');
    expect(resultDiv.innerHTML).toContain("McDonald's");
  });

  test('displays "No results found" when API returns empty array', () => {
    renderResults([], resultDiv);
    expect(resultDiv.textContent).toBe('找不到結果。');
  });

  test('displays "No results found" when API returns null', () => {
    renderResults(null, resultDiv);
    expect(resultDiv.textContent).toBe('找不到結果。');
  });

  test('escapes HTML to prevent XSS attacks', () => {
    const mockResults = [
      { display_name: '<script>alert("XSS")</script> Test', lat: '22.3', lon: '114.2' }
    ];

    renderResults(mockResults, resultDiv);

    expect(resultDiv.innerHTML).not.toContain('<script>');
    expect(resultDiv.innerHTML).toContain('&lt;script&gt;');
  });

  test('escapeHtml function works correctly', () => {
    expect(escapeHtml('<script>alert("XSS")</script>')).toBe('&lt;script&gt;alert("XSS")&lt;/script&gt;');
    expect(escapeHtml('Normal text')).toBe('Normal text');
    expect(escapeHtml('Test & special <chars>')).toBe('Test &amp; special &lt;chars&gt;');
  });
});

describe('MTR Station Bounds Calculation', () => {
  const { calculateStationBounds } = require('./src/search');

  test('calculates bounds for Central station with 1km radius', () => {
    const bounds = calculateStationBounds(22.2819, 114.1578, 1);
    
    expect(bounds.latMin).toBeCloseTo(22.2729, 2);
    expect(bounds.latMax).toBeCloseTo(22.2909, 2);
    expect(bounds.lonMin).toBeCloseTo(114.1488, 2);
    expect(bounds.lonMax).toBeCloseTo(114.1668, 2);
  });

  test('calculates bounds with different radius values', () => {
    const bounds500m = calculateStationBounds(22.2819, 114.1578, 0.5);
    const bounds2km = calculateStationBounds(22.2819, 114.1578, 2);
    
    expect(bounds500m.latMax - bounds500m.latMin).toBeLessThan(bounds2km.latMax - bounds2km.latMin);
  });

  test('calculates bounds for Kowloon station', () => {
    const bounds = calculateStationBounds(22.2974, 114.1719, 1.5);
    
    expect(bounds.latMin).toBeLessThan(22.2974);
    expect(bounds.latMax).toBeGreaterThan(22.2974);
    expect(bounds.lonMin).toBeLessThan(114.1719);
    expect(bounds.lonMax).toBeGreaterThan(114.1719);
  });
});

describe('Distance Calculation', () => {
  const { calculateDistance, formatDistance } = require('./src/search');

  test('calculates distance between two points', () => {
    const distance = calculateDistance(22.2819, 114.1578, 22.2974, 114.1719);
    
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(5);
  });

  test('formats distance correctly (default Traditional Chinese)', () => {
    // Default is Traditional Chinese when I18N is not set
    expect(formatDistance(0.5)).toBe('500米');
    expect(formatDistance(0.35)).toBe('350米');
    expect(formatDistance(1.5)).toBe('1.5公里');
    expect(formatDistance(2.3)).toBe('2.3公里');
  });
});

describe('MTR Station Data', () => {
  const { MTR_DATA, STATION_LOOKUP } = require('./src/mtr-stations');

  test('MTR_DATA has three regions', () => {
    expect(Object.keys(MTR_DATA)).toHaveLength(3);
    expect(MTR_DATA).toHaveProperty('hong_kong_island');
    expect(MTR_DATA).toHaveProperty('kowloon');
    expect(MTR_DATA).toHaveProperty('new_territories');
  });

  test('Hong Kong Island has Island Line', () => {
    expect(MTR_DATA.hong_kong_island.lines).toHaveProperty('island');
    expect(MTR_DATA.hong_kong_island.lines.island.stations.length).toBeGreaterThan(0);
  });

  test('Central station exists in lookup', () => {
    expect(STATION_LOOKUP['中環']).toBeDefined();
    expect(STATION_LOOKUP['中環'].name).toBe('中環');
    expect(STATION_LOOKUP['中環'].lat).toBe(22.2819);
  });

  test('Mong Kok station exists in lookup', () => {
    expect(STATION_LOOKUP['旺角']).toBeDefined();
    expect(STATION_LOOKUP['旺角'].name).toBe('旺角');
  });

  test('Tsim Sha Tsui station exists in lookup', () => {
    expect(STATION_LOOKUP['尖沙咀']).toBeDefined();
    expect(STATION_LOOKUP['尖沙咀'].name).toBe('尖沙咀');
  });

  test('All stations have required properties', () => {
    Object.keys(MTR_DATA).forEach(regionKey => {
      const region = MTR_DATA[regionKey];
      Object.keys(region.lines).forEach(lineKey => {
        const line = region.lines[lineKey];
        line.stations.forEach(station => {
          expect(station).toHaveProperty('name');
          expect(station).toHaveProperty('lat');
          expect(station).toHaveProperty('lon');
          expect(typeof station.lat).toBe('number');
          expect(typeof station.lon).toBe('number');
        });
      });
    });
  });
});

describe('I18N - Traditional Chinese Only', () => {
  const I18N = require('./src/i18n');

  test('I18N is simplified with Chinese only', () => {
    expect(I18N.translations).toBeDefined();
    expect(I18N.translations.appTitle).toBe('地圖應用程式');
    expect(I18N.translations.searchBtn).toBe('搜尋');
  });

  test('I18N.t returns Chinese translations', () => {
    expect(I18N.t('appTitle')).toBe('地圖應用程式');
    expect(I18N.t('searchBtn')).toBe('搜尋');
    expect(I18N.t('noResults')).toBe('找不到結果。');
  });

  test('I18N.t returns key for missing translations', () => {
    expect(I18N.t('nonexistent')).toBe('nonexistent');
  });

  test('I18N has no language switching methods', () => {
    expect(I18N.setLanguage).toBeUndefined();
    expect(I18N.currentLang).toBeUndefined();
    expect(I18N.schemaVersion).toBeUndefined();
  });

  test('I18N.translatePage exists', () => {
    expect(typeof I18N.translatePage).toBe('function');
  });
});
