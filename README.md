# Map App

A bilingual (Traditional Chinese / English) map application for searching points of interest (POI) and addresses in Hong Kong by MTR station proximity.

## Features

- **MTR Station Selection**: Three-level dropdown cascade (Region → Line → Station)
- **Proximity Search**: Search for POIs within configurable radius (500m - 3km) from any MTR station
- **Dual API Support**: 
  - Overpass API for POI searches (restaurants, shops, amenities)
  - Nominatim API for address searches
- **Bilingual UI**: Switch between Traditional Chinese (zh-HK) and English
- **Mobile Responsive**: Optimized for mobile and desktop layouts
- **Distance Calculation**: Shows distance from selected station to search results

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Testing**: Jest (unit tests), Playwright (E2E tests)
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

Serve the project locally:

```bash
npx http-server -p 3000 -c-1
```

Open http://localhost:3000 in your browser.

## Testing

### Run All Tests

```bash
npm run test:all
```

### Unit Tests (Jest)

```bash
npm test
```

39 unit tests covering:
- Search type detection (POI vs address)
- Overpass query building
- Result rendering and XSS protection
- MTR station data validation
- Distance calculation
- i18n storage migration

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

22 browser-based tests covering:
- Page load and UI elements
- Dropdown cascade functionality
- Real API search functionality
- Language switching
- Mobile responsive layout
- Cross-feature integration
- Performance timing

### Debug E2E Tests

```bash
npm run test:e2e:debug    # Open Playwright UI
npm run test:e2e:headed   # Run tests in visible browser
```

### View Test Report

After running E2E tests:

```bash
npx playwright show-report
```

## Project Structure

```
map-app/
├── e2e/
│   └── search.spec.js       # Playwright E2E tests
├── src/
│   ├── search.js            # Search functionality, API calls
│   ├── dropdowns.js         # MTR dropdown cascade logic
│   ├── i18n.js              # Internationalization module
│   └── mtr-stations.js      # MTR station database
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI/CD
├── index.html               # Main application page
├── playwright.config.js     # Playwright configuration
├── jest.config.js           # Jest configuration
├── package.json
└── README.md
```

## API Providers

### Overpass API
- Used for POI searches (restaurants, shops, amenities)
- Queries OpenStreetMap data
- Results include Traditional Chinese names when available

### Nominatim API
- Used for address searches
- Restricted to Hong Kong bounding box
- Returns geocoded addresses

## Language Support

| Language | Code | Default |
|----------|------|---------|
| Traditional Chinese | zh-HK | Yes |
| English | en | No |

Language preference is persisted in localStorage.

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **Unit Tests**: Run Jest tests on every push/PR
2. **E2E Tests**: Run Playwright tests with Chromium
3. **Artifacts**: Upload test reports and failure screenshots

## License

MIT
