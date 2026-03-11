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
