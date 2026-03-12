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

// Default search radius in km
const DEFAULT_RADIUS_KM = 1;

// Common POI keywords that should use Overpass API (English and Traditional Chinese)
const POI_KEYWORDS = [
  'mcdonald', 'mcdonalds', 'burger king', 'kfc', 'starbucks',
  'restaurant', 'cafe', 'hotel', 'hospital', 'school',
  'park', 'museum', 'shopping', 'mall', 'station',
  'bank', 'atm', 'pharmacy', 'supermarket', 'gym',
  '麥當勞', '餐廳', '咖啡', '酒店', '醫院', '學校',
  '公園', '博物館', '購物', '商場', '車站', '巴士',
  '銀行', '診所', '藥房', '超市', '健身'
];

// Map Chinese search terms to OSM amenity types
const CHINESE_TO_AMENITY = {
  '餐廳': 'restaurant',
  '咖啡館': 'cafe',
  '快餐店': 'fast_food',
  '酒吧': 'bar',
  '酒館': 'pub',
  '啤酒花園': 'biergarten',
  '美食廣場': 'food_court',
  '冰淇淋店': 'ice_cream',
  '學校': 'school',
  '大學': 'university',
  '學院': 'college',
  '幼兒園': 'kindergarten',
  '圖書館': 'library',
  '語言學校': 'language_school',
  '音樂學校': 'music_school',
  '駕駛學校': 'driving_school',
  '醫院': 'hospital',
  '診所': 'clinic',
  '藥房': 'pharmacy',
  '牙醫': 'dentist',
  '醫生': 'doctors',
  '獸醫': 'veterinary',
  '停車場': 'parking',
  '單車停泊處': 'bicycle_parking',
  '單車租賃': 'bicycle_rental',
  '汽車租賃': 'car_rental',
  '洗車場': 'car_wash',
  '充電站': 'charging_station',
  '加油站': 'fuel',
  '的士站': 'taxi',
  '巴士總站': 'bus_station',
  '渡輪碼頭': 'ferry_terminal',
  '銀行': 'bank',
  '自動櫃員機': 'atm',
  '貨幣兌換': 'bureau_de_change',
  '電影院': 'cinema',
  '劇院': 'theatre',
  '博物館': 'museum',
  '畫廊': 'gallery',
  '賭場': 'casino',
  '夜總會': 'nightclub',
  '郵局': 'post_office',
  '警察局': 'police',
  '消防局': 'fire_station',
  '市政廳': 'townhall',
  '法院': 'courthouse',
  '社區中心': 'community_centre',
  '洗手間': 'toilets',
  '淋浴間': 'shower',
  '飲用水': 'drinking_water',
  '長椅': 'bench',
  '涼亭': 'shelter',
  '街市': 'marketplace',
  '購物中心': 'shopping_centre',
  '健身中心': 'gym',
  '游泳池': 'swimming_pool',
  '體育館': 'sports_centre',
  '兒童遊樂場': 'playground',
  '公園': 'park',
  '宗教場所': 'place_of_worship',
  '酒店': 'hotel',
  '青年旅舍': 'hostel',
  '賓館': 'guest_house',
  '汽車旅館': 'motel',
  '旅遊資訊': 'tourist_information',
  '網吧': 'internet_cafe',
  '公共電話': 'phone',
  '回收站': 'recycling',
  '垃圾桶': 'waste_basket'
};

// Current active station filter (shared via window object)
function getActiveStationFilter() {
  return window.activeStationFilter || null;
}

function getActiveRadiusFilter() {
  return window.activeRadiusFilter || DEFAULT_RADIUS_KM;
}

function setActiveStationFilter(station) {
  window.activeStationFilter = station;
}

function setActiveRadiusFilter(radius) {
  window.activeRadiusFilter = radius;
}

/**
 * Calculate bounding box from station center with given radius
 * @param {number} lat - Station latitude
 * @param {number} lon - Station longitude
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {object} - Bounding box coordinates
 */
function calculateStationBounds(lat, lon, radiusKm) {
  const latDelta = radiusKm / 111.0;
  const lonDelta = radiusKm / (111.0 * Math.cos(lat * Math.PI / 180));
  
  return {
    latMin: lat - latDelta,
    latMax: lat + latDelta,
    lonMin: lon - lonDelta,
    lonMax: lon + lonDelta
  };
}

/**
 * Detect MTR station from search query
 * @param {string} query - User search query
 * @returns {object|null} - Station object or null
 */
function detectStationFromQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  // Check for station patterns: "near [station]", "[station] mtr", etc.
  const patterns = [
    /near\s+(.+)/i,
    /(.+)\s+mtr/i,
    /(.+)\s+station/i
  ];
  
  for (const pattern of patterns) {
    const match = query.match(pattern);
    if (match) {
      const potentialStation = match[1].trim().toLowerCase();
      
      // Try exact match first
      if (STATION_LOOKUP && STATION_LOOKUP[potentialStation]) {
        return STATION_LOOKUP[potentialStation];
      }
      
      // Try partial match
      for (const [key, station] of Object.entries(STATION_LOOKUP || {})) {
        if (key.includes(potentialStation) || potentialStation.includes(key)) {
          return station;
        }
      }
    }
  }
  
  return null;
}

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
  let useMultiTagQuery = false;
  
  // Check if query matches a Chinese amenity term first
  for (const [zhTerm, amenity] of Object.entries(CHINESE_TO_AMENITY)) {
    if (lowerQuery === zhTerm.toLowerCase() || lowerQuery.includes(zhTerm.toLowerCase())) {
      poiType = amenity;
      namePattern = '';
      
      // Special handling for transportation hubs that use different tagging schemes
      if (amenity === 'bus_station') {
        useMultiTagQuery = true;
      } else if (amenity === 'ferry_terminal') {
        useMultiTagQuery = true;
      }
      break;
    }
  }
  
  // If no Chinese match, check English terms
  if (namePattern === query) {
    if (lowerQuery.includes('mcdonald') || lowerQuery.includes('麥當勞')) {
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
    } else if (lowerQuery.includes('fast_food') || lowerQuery.includes('快餐')) {
      poiType = 'fast_food';
      namePattern = '';
    }
  }
  
  // Build Overpass QL query
  let queryStr = `[out:json][timeout:25];`;
  queryStr += `(`;
  
  if (useMultiTagQuery && poiType === 'bus_station') {
    // Bus terminals in HK are mostly tagged as highway=bus_stop with names containing 總站
    // Also include amenity=bus_station
    queryStr += `node["amenity"="bus_station"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `way["amenity"="bus_station"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    // Search for bus stops with names containing 總站 (most common in HK)
    queryStr += `node["highway"="bus_stop"]["name"~"總站"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
  } else if (useMultiTagQuery && poiType === 'ferry_terminal') {
    // Ferry terminals may use amenity=ferry_terminal or public_transport=station + ferry=yes
    queryStr += `node["amenity"="ferry_terminal"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `way["amenity"="ferry_terminal"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `node["public_transport"="station"]["ferry"="yes"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
    queryStr += `node["amenity"="ferry_terminal"](${bounds.latMin},${bounds.lonMin},${bounds.latMax},${bounds.lonMax});`;
  } else if (namePattern) {
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
 * Calculate distance between two points in km
 * @param {number} lat1 - Point 1 latitude
 * @param {number} lon1 - Point 1 longitude
 * @param {number} lat2 - Point 2 latitude
 * @param {number} lon2 - Point 2 longitude
 * @returns {number} - Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Search using Overpass API
 * @param {string} query - User search query
 * @param {object} bounds - Geographic bounds
 * @param {object} station - Station object for distance calculation
 * @returns {Promise<Array>} - Array of search results
 */
async function searchOverpass(query, bounds = HK_BOUNDS, station = null, radiusKm = DEFAULT_RADIUS_KM) {
  const overpassQuery = buildOverpassQuery(query, bounds);
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Transform Overpass results to standard format
  // Prefer Traditional Chinese names, then English, then generic name
  let results = data.elements.map((element, idx) => {
    const tags = element.tags || {};
    // Priority: name:zh-HK > name:zh-TW > name:zh > name:en > name
    const name = tags['name:zh-HK'] || tags['name:zh-TW'] || tags['name:zh'] || tags.name || tags['name:en'] || 'Unknown';
    const lat = element.lat || element.center?.lat;
    const lon = element.lon || element.center?.lon;
    
    const result = {
      place_id: element.id,
      display_name: name,
      lat: lat.toString(),
      lon: lon.toString(),
      type: element.tags?.amenity || element.type,
      tags: tags
    };
    
    // Calculate distance from station if provided
    if (station && lat && lon) {
      result.distance = calculateDistance(station.lat, station.lon, lat, lon);
    }
    
    return result;
  });
  
  // Filter by radius if station is provided
  if (station) {
    results = results.filter(r => r.distance !== undefined && r.distance <= radiusKm);
    results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
  }
  
  return results;
}

/**
 * Search using Nominatim API
 * @param {string} query - User search query
 * @param {object} station - Optional station object for distance calculation
 * @param {number} radiusKm - Optional search radius in kilometers
 * @returns {Promise<Array>} - Array of search results
 */
async function searchNominatim(query, station = null, radiusKm = DEFAULT_RADIUS_KM) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=20&viewbox=113.8,22.15,114.45,22.55&bounded=1&q=${encodeURIComponent(query)}&accept-language=zh`;
  
  const response = await fetch(url, {
    headers: { 'Accept-Language': 'zh' }
  });
  let results = await response.json();
  
  // Calculate distances and filter by radius if station is provided
  if (station && results && results.length > 0) {
    results = results.map(result => {
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const distance = calculateDistance(station.lat, station.lon, lat, lon);
      return { ...result, distance };
    });
    
    // Filter by radius and sort by distance
    results = results
      .filter(r => r.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }
  
  return results;
}

/**
 * Main search function - routes to appropriate API
 * @param {string} query - User search query
 * @param {object} station - Optional station object for proximity search
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {Promise<Array>} - Array of search results
 */
async function performSearch(query, station = null, radiusKm = DEFAULT_RADIUS_KM) {
  let bounds = HK_BOUNDS;
  
  // Use station-based bounds if station is provided
  if (station) {
    bounds = calculateStationBounds(station.lat, station.lon, radiusKm);
  }
  
  const searchType = detectSearchType(query);
  
  if (searchType === API_PROVIDERS.OVERPASS) {
    return searchOverpass(query, bounds, station, radiusKm);
  } else {
    return searchNominatim(query, station, radiusKm);
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
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} - Formatted distance
 */
function formatDistance(distanceKm) {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters}米`;
  }
  const km = distanceKm.toFixed(1);
  return `${km}公里`;
}

/**
 * Render search results to the DOM
 * @param {Array} results - Search results
 * @param {HTMLElement} resultDiv - DOM element to render into
 * @param {object} station - Optional station object
 * @param {number} radius - Search radius used
 */
function renderResults(results, resultDiv, station = null, radius = null) {
  const i18n = window.I18N;
  
  if (!results || results.length === 0) {
    resultDiv.textContent = i18n ? i18n.t('noResults') : '找不到結果。';
    return;
  }
  
  let html = '';
  
  // Show active filter info
  if (station) {
    const searchingText = i18n ? i18n.t('searchingNear') : '搜尋附近：';
    const radiusText = i18n ? i18n.t('radius') : '範圍內';
    const radiusLabel = radius < 1 ? `${radius * 1000}米` : `${radius}公里`;
    
    html += `<div style="background:#e8f4fd; border:1px solid #3498db; border-radius:4px; padding:0.75rem; margin-bottom:1rem; text-align:left;">
      <div style="color:#2c3e50; font-weight:bold;">
        <span style="color:#3498db;">🚇</span> ${searchingText} <strong>${escapeHtml(station.name)} MTR</strong>
        <span style="color:#666; font-weight:normal;">(${radiusLabel} ${radiusText})</span>
      </div>
    </div>`;
  }
  
  results.forEach((place, idx) => {
    const displayName = escapeHtml(place.display_name);
    const lat = place.lat;
    const lon = place.lon;
    const badgeNum = idx + 1;
    
    html += `<div style="background:#fff; border:1px solid #ddd; border-radius:4px; padding:0.75rem; margin-bottom:0.75rem; text-align:left;">
      <div style="font-weight:bold; color:#2c3e50; margin-bottom:0.25rem;">
        <span style="background:#3498db; color:#fff; padding:0.15rem 0.5rem; border-radius:3px; margin-right:0.5rem; font-size:0.85rem;">#${badgeNum}</span>
        ${displayName}`;
    
    // Add distance badge if available
    if (place.distance !== undefined && station) {
      html += `<span style="background:#27ae60; color:#fff; padding:0.15rem 0.5rem; border-radius:3px; margin-left:0.5rem; font-size:0.75rem; font-weight:normal;">${formatDistance(place.distance)}</span>`;
    }
    
    html += `</div>
      <div style="color:#666; font-size:0.9rem;">
        <span>Latitude: ${lat}</span> | <span>Longitude: ${lon}</span>
      </div>
    </div>`;
  });
  
  resultDiv.innerHTML = html;
}

/**
 * Update active filter display
 * @param {object} station - Station object
 * @param {number} radius - Search radius
 */
function updateActiveFilterDisplay(station, radius) {
  const filterDiv = document.getElementById('activeFilter');
  const filterStation = document.getElementById('filterStation');
  const filterRadius = document.getElementById('filterRadius');
  
  if (station && filterDiv && filterStation && filterRadius) {
    filterStation.textContent = station.name;
    const radiusLabel = radius < 1 ? `${radius * 1000} 米` : `${radius} 公里`;
    filterRadius.textContent = radiusLabel;
    filterDiv.style.display = 'block';
  } else if (filterDiv) {
    filterDiv.style.display = 'none';
  }
}

/**
 * Clear station filter
 */
function clearStationFilter() {
  setActiveStationFilter(null);
  setActiveRadiusFilter(DEFAULT_RADIUS_KM);
  
  // Reset dropdowns
  const regionSelect = document.getElementById('regionSelect');
  const lineSelect = document.getElementById('lineSelect');
  const stationSelect = document.getElementById('stationSelect');
  
  if (regionSelect) regionSelect.value = '';
  if (lineSelect) {
    lineSelect.value = '';
    lineSelect.disabled = true;
  }
  if (stationSelect) {
    stationSelect.value = '';
    stationSelect.disabled = true;
  }
  
  updateActiveFilterDisplay(null, null);
}

/**
 * Initialize amenity suggestions
 */
function initAmenitySuggestions() {
  const suggestionsDiv = document.getElementById('amenitySuggestions');
  const searchInput = document.getElementById('searchInput');
  
  if (!suggestionsDiv || !searchInput) {
    return;
  }
  
  // Get random 10 amenities
  const amenities = getRandomAmenities(10);
  
  // Create chips
  suggestionsDiv.innerHTML = '';
  amenities.forEach(amenity => {
    const chip = document.createElement('span');
    chip.className = 'amenity-chip';
    chip.textContent = amenity.zh;
    chip.title = amenity.en;
    chip.addEventListener('click', () => {
      searchInput.value = amenity.zh;
      searchInput.focus();
      // Trigger search after a short delay to ensure value is set
      setTimeout(() => {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) searchBtn.click();
      }, 100);
    });
    suggestionsDiv.appendChild(chip);
  });
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
  
  // Initialize amenity suggestions
  initAmenitySuggestions();
  
  // Search function
  function doSearch() {
    const query = searchInput.value.trim();
    const i18n = window.I18N;
    
    if (!query) {
      resultDiv.textContent = i18n ? i18n.t('pleaseEnterAddress') : '請輸入地址。';
      return;
    }
    
    resultDiv.textContent = i18n ? i18n.t('searching') : '搜尋中...';
    
    // Check if query mentions a station
    let station = getActiveStationFilter();
    const detectedStation = detectStationFromQuery(query);
    if (detectedStation) {
      station = detectedStation;
    }
    
    const radius = getActiveRadiusFilter();
    
    performSearch(query, station, radius)
      .then(results => {
        renderResults(results, resultDiv, station, radius);
      })
      .catch(err => {
        console.error('Search error:', err);
        resultDiv.textContent = i18n ? i18n.t('searchError') : '搜尋時發生錯誤。';
      });
  }
  
  // Event listeners
  searchBtn.addEventListener('click', doSearch);
  
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  });
  
  // Clear filter button
  const clearFilterBtn = document.getElementById('clearFilter');
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', clearStationFilter);
  }
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
    calculateStationBounds,
    detectStationFromQuery,
    calculateDistance,
    formatDistance,
    API_PROVIDERS,
    POI_KEYWORDS,
    CHINESE_TO_AMENITY,
    HK_BOUNDS,
    DEFAULT_RADIUS_KM,
    initAmenitySuggestions
  };
}
