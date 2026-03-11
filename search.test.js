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
    expect(html).toContain('Enter address or POI');
  });

  test('index.html contains search button', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('searchBtn');
    expect(html).toContain('Search');
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

describe('Search Type Detection', () => {
  const { detectSearchType, API_PROVIDERS, POI_KEYWORDS } = require('./src/search');

  test('detects POI keywords - McDonalds', () => {
    expect(detectSearchType('McDonalds in Hong Kong')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('mcdonalds')).toBe(API_PROVIDERS.OVERPASS);
  });

  test('detects POI keywords - various restaurants', () => {
    expect(detectSearchType('KFC')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('Starbucks')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('Burger King')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('restaurant')).toBe(API_PROVIDERS.OVERPASS);
  });

  test('detects POI keywords - amenities', () => {
    expect(detectSearchType('hotel')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('hospital')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('school')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('park')).toBe(API_PROVIDERS.OVERPASS);
  });

  test('detects location modifiers', () => {
    expect(detectSearchType('shops in Central')).toBe(API_PROVIDERS.OVERPASS);
    expect(detectSearchType('cafes near Tsim Sha Tsui')).toBe(API_PROVIDERS.OVERPASS);
  });

  test('defaults to Nominatim for address searches', () => {
    expect(detectSearchType('123 Main Street')).toBe(API_PROVIDERS.NOMINATIM);
    expect(detectSearchType('Paris, France')).toBe(API_PROVIDERS.NOMINATIM);
    expect(detectSearchType('Hong Kong International Airport')).toBe(API_PROVIDERS.NOMINATIM);
  });
});

describe('Overpass Query Building', () => {
  const { buildOverpassQuery, HK_BOUNDS } = require('./src/search');

  test('builds query for McDonalds', () => {
    const query = buildOverpassQuery('McDonalds in Hong Kong');
    expect(query).toContain('[out:json]');
    expect(query).toContain('node["amenity"="fast_food"]["name"~"McDonald"');
    expect(query).toContain(HK_BOUNDS.latMin.toString());
  });

  test('builds query for restaurants', () => {
    const query = buildOverpassQuery('restaurants');
    expect(query).toContain('node["amenity"="restaurant"]');
  });

  test('builds query for cafes', () => {
    const query = buildOverpassQuery('coffee shops');
    expect(query).toContain('node["amenity"="cafe"]');
  });

  test('includes bounding box coordinates', () => {
    const query = buildOverpassQuery('hotels');
    expect(query).toContain('22.15');
    expect(query).toContain('113.8');
    expect(query).toContain('22.55');
    expect(query).toContain('114.45');
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
    expect(resultDiv.textContent).toBe('No results found.');
  });

  test('displays "No results found" when API returns null', () => {
    renderResults(null, resultDiv);
    expect(resultDiv.textContent).toBe('No results found.');
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
