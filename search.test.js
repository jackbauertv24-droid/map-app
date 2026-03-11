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
    expect(html).toContain('Enter address');
  });

  test('index.html contains search button', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('searchBtn');
    expect(html).toContain('Search');
  });

  test('index.html uses Nominatim API', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('nominatim.openstreetmap.org');
  });

  test('index.html displays results', () => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    expect(html).toContain('result');
    expect(html).toContain('No results found');
  });
});

describe('Search Functionality', () => {
  const { JSDOM } = require('jsdom');

  let dom;
  let window;
  let document;

  beforeEach(() => {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost/'
    });
    window = dom.window;
    document = dom.window.document;
  });

  afterEach(() => {
    if (dom) {
      dom.window.close();
    }
  });

  test('displays multiple results when API returns multiple places', async () => {
    const mockResults = [
      { display_name: 'Paris, France', lat: '48.8566', lon: '2.3522' },
      { display_name: 'Paris, Texas, USA', lat: '33.6609', lon: '-95.5555' },
      { display_name: 'Paris, Ontario, Canada', lat: '43.2000', lon: '-80.3839' },
      { display_name: 'Paris, Tennessee, USA', lat: '36.3020', lon: '-88.3267' },
      { display_name: 'Paris, Kentucky, USA', lat: '38.2098', lon: '-84.2529' }
    ];

    window.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResults)
    });

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = 'Paris';
    searchBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(resultDiv.innerHTML).toContain('>#1<');
    expect(resultDiv.innerHTML).toContain('>#2<');
    expect(resultDiv.innerHTML).toContain('>#3<');
    expect(resultDiv.innerHTML).toContain('>#4<');
    expect(resultDiv.innerHTML).toContain('>#5<');
    expect(resultDiv.innerHTML).toContain('Paris, France');
    expect(resultDiv.innerHTML).toContain('Paris, Texas, USA');
    
    // Verify exactly 5 result cards are displayed
    const resultCards = resultDiv.querySelectorAll('div[style*="background:#fff"]');
    expect(resultCards.length).toBe(5);
  });

  test('displays "No results found" when API returns empty array', async () => {
    window.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve([])
    });

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = 'NonExistentPlace12345';
    searchBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(resultDiv.textContent).toBe('No results found.');
  });

  test('displays error message when fetch fails', async () => {
    window.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = 'Paris';
    searchBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(resultDiv.textContent).toBe('Error while searching.');
  });

  test('displays validation message when search is empty', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = '';
    searchBtn.click();

    expect(resultDiv.textContent).toBe('Please enter an address.');
  });

  test('displays "Searching..." while fetching', async () => {
    let resolvePromise;
    window.fetch = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        resolvePromise = resolve;
      });
    });

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = 'Paris';
    searchBtn.click();

    await new Promise(resolve => setTimeout(resolve, 50));

    expect(resultDiv.textContent).toBe('Searching...');

    resolvePromise({
      json: () => Promise.resolve([])
    });
    await new Promise(resolve => setTimeout(resolve, 50));
  });

  test('escapes HTML to prevent XSS attacks', async () => {
    const mockResults = [
      { display_name: '<script>alert("XSS")</script> Paris', lat: '48.8566', lon: '2.3522' }
    ];

    window.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResults)
    });

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultDiv = document.getElementById('result');

    searchInput.value = 'Test';
    searchBtn.click();

    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify script tags are escaped
    expect(resultDiv.innerHTML).not.toContain('<script>');
    expect(resultDiv.innerHTML).toContain('&lt;script&gt;');
  });
});
