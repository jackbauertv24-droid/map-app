// Search API providers
const API_PROVIDERS = {
  OVERPASS: 'overpass',
  NOMINATIM: 'nominatim'
};

// Hong Kong bounding box for POI searches
const HK_BOUNDS = {
  latMin: 22.15,
  latMax: 22.55,
  lonMin: 113.80,
  lonMax: 114.45
};

// Common POI keywords that should use Overpass API
const POI_KEYWORDS = [
  'mcdonald', 'mcdonalds', 'burger king', 'kfc', 'starbucks',
  'restaurant', 'cafe', 'hotel', 'hospital', 'school',
  'park', 'museum', 'shopping', 'mall', 'station',
  'bank', 'atm', 'pharmacy', 'supermarket', 'gym'
];

/**
 * Detect if query is POI-focused or address-focused
 * @param {string} query - User search query
 * @returns {string} - API provider to use
 */
function detectSearchType(query) {
  const lowerQuery = query.toLowerCase();
  
  // Check for POI keywords
  if (POI_KEYWORDS.some(keyword => lowerQuery.includes(keyword))) {
    return API_PROVIDERS.OVERPASS;
  }
  
  // Check for location modifiers (e.g., "in Hong Kong", "near Central")
  if (lowerQuery.includes(' in ') || lowerQuery.includes(' near ')) {
    return API_PROVIDERS.OVERPASS;
  }
  
  // Default to Nominatim for address searches
  return API_PROVIDERS.NOMINATIM;
}

/**
 * Build Overpass API query for POI search
 * @param {string} query - User search query
 * @param {object} bounds - Geographic bounds
 * @returns {string} - Overpass QL query
 */
function buildOverpassQuery(query, bounds = HK_BOUNDS) {
  const lowerQuery = query.toLowerCase();
  
  // Extract POI type and location from query
  let poiType = 'fast_food';
  let namePattern = query;
  
  // Map common POI terms to OSM tags
  if (lowerQuery.includes('mcdonald')) {
    poiType = 'fast_food';
    namePattern = 'McDonald';
  } else if (lowerQuery.includes('burger')) {
    poiType = 'fast_food';
    namePattern = 'Burger';
  } else if (lowerQuery.includes('restaurant')) {
    poiType = 'restaurant';
    namePattern = '';
  } else if (lowerQuery.includes('cafe') || lowerQuery.includes('coffee')) {
    poiType = 'cafe';
    namePattern = '';
  } else if (lowerQuery.includes('hotel')) {
    poiType = 'hotel';
    namePattern = '';
  }
  
  // Build Overpass QL query
  let queryStr = `[out:json][timeout:25];`;
  queryStr += `(`;
  
  if (namePattern) {
    // Search by name pattern
    queryStr += `node["amenity"="${poiType}"]["name"~"${namePattern}",i](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `way["amenity"="${poiType}"]["name"~"${namePattern}",i](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
  } else {
    // Search by amenity type only
    queryStr += `node["amenity"="${poiType}"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `way["amenity"="${poiType}"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
  }
  
  queryStr += `);out center;`;
  
  return queryStr;
}

/**
 * Search using Overpass API
 * @param {string} query - User search query
 * @returns {Promise<Array>} - Array of search results
 */
async function searchOverpass(query) {
  const overpassQuery = buildOverpassQuery(query);
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Transform Overpass results to standard format
  return data.elements.map((element, idx) => {
    const name = element.tags?.name || element.tags?.['name:en'] || 'Unknown';
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;
    
    return {
      place_id: element.id,
      display_name: name,
      lat: lat.toString(),
      lon: lon.toString(),
      type: element.tags?.amenity || element.type,
      tags: element.tags || {}
    };
  });
}

/**
 * Search using Nominatim API
 * @param {string} query - User search query
 * @returns {Promise<Array>} - Array of search results
 */
async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&q=${encodeURIComponent(query)}`;
  
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'en' }
  });
  return response.json();
}

/**
 * Main search function - routes to appropriate API
 * @param {string} query - User search query
 * @returns {Promise<Array>} - Array of search results
 */
async function performSearch(query) {
  const searchType = detectSearchType(query);
  
  if (searchType === API_PROVIDERS.OVERPASS) {
    return searchOverpass(query);
  } else {
    return searchNominatim(query);
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Render search results to the DOM
 * @param {Array} results - Search results
 * @param {HTMLElement} resultDiv - DOM element to render into
 */
function renderResults(results, resultDiv) {
  if (!results || results.length === 0) {
    resultDiv.textContent = 'No results found.';
    return;
  }
  
  let html = '';
  results.forEach((place, idx) => {
    const displayName = escapeHtml(place.display_name);
    const lat = place.lat;
    const lon = place.lon;
    const badgeNum = idx + 1;
    
    html += `<div style="background:#fff; border:1px solid #ddd; border-radius:4px; padding:0.75rem; margin-bottom:0.75rem; text-align:left;">
      <div style="font-weight:bold; color:#2c3e50; margin-bottom:0.25rem;">
        <span style="background:#3498db; color:#fff; padding:0.15rem 0.5rem; border-radius:3px; margin-right:0.5rem; font-size:0.85rem;">#${badgeNum}</span>
        ${displayName}
      </div>
      <div style="color:#666; font-size:0.9rem;">
        <span>Latitude: ${lat}</span> | <span>Longitude: ${lon}</span>
      </div>
    </div>`;
  });
  
  resultDiv.innerHTML = html;
}

/**
 * Initialize search functionality
 */
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultDiv = document.getElementById('result');
  
  if (!searchInput || !searchBtn || !resultDiv) {
    console.error('Search elements not found');
    return;
  }
  
  // Search function
  function doSearch() {
    const query = searchInput.value.trim();
    
    if (!query) {
      resultDiv.textContent = 'Please enter an address.';
      return;
    }
    
    resultDiv.textContent = 'Searching...';
    
    performSearch(query)
      .then(results => {
        renderResults(results, resultDiv);
      })
      .catch(err => {
        console.error('Search error:', err);
        resultDiv.textContent = 'Error while searching.';
      });
  }
  
  // Event listeners
  searchBtn.addEventListener('click', doSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSearch);
} else {
  initSearch();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    detectSearchType,
    buildOverpassQuery,
    searchOverpass,
    searchNominatim,
    performSearch,
    escapeHtml,
    renderResults,
    API_PROVIDERS,
    POI_KEYWORDS,
    HK_BOUNDS
  };
}
