// Google Maps Search Module - Browser Automation
// Scrapes Google Maps for POI search results without API key

const GoogleMapsSearch = {
  cache: new Map(),
  CACHE_TTL: 60 * 60 * 1000, // 1 hour in milliseconds
  
  async search(query, lat, lon, radius = 1000) {
    const cacheKey = `gmaps:${query}:${lat.toFixed(4)}:${lon.toFixed(4)}:${radius}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      console.log('[GoogleMaps] Using cached results:', cached.length);
      return cached;
    }
    
    console.log('[GoogleMaps] Searching:', query, 'at', lat, lon);
    
    try {
      // Launch headless browser via Playwright
      const { chromium } = await import('playwright');
      const browser = await chromium.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
      
      const page = await browser.newPage();
      
      // Set realistic user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Navigate to Google Maps search
      const searchQuery = encodeURIComponent(query);
      const url = `https://www.google.com/maps/search/${searchQuery}/@${lat},${lon},15z`;
      
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 30000 
      });
      
      // Wait for results to load
      await page.waitForTimeout(8000);
      
      // Extract results with smart filtering
      const results = await page.$$eval('div[role="feed"] .fontBodyMedium', els => {
        const texts = els.map(el => el.textContent.trim()).filter(t => t.length > 0);
        
        // Filter out pure ratings and invalid entries
        return texts.filter(t => 
          // Keep if has Chinese characters OR length > 10
          /[\u4e00-\u9fff]/.test(t) || t.length > 10
        );
      });
      
      // Parse results into structured data
      const parsedResults = results.map((text, idx) => this.parseResult(text, lat, lon, idx));
      
      await browser.close();
      
      // Cache the results
      this.saveToCache(cacheKey, parsedResults);
      
      console.log('[GoogleMaps] Found', parsedResults.length, 'results');
      return parsedResults;
      
    } catch (error) {
      console.error('[GoogleMaps] Error:', error.message);
      
      // Return empty array on error (fallback to Overpass)
      return [];
    }
  },
  
  parseResult(text, centerLat, centerLon, idx) {
    // Extract name (before first rating number pattern)
    const ratingMatch = text.match(/\s+(\d\.\d)\s/);
    let name = text;
    let rating = null;
    let info = '';
    
    if (ratingMatch) {
      name = text.substring(0, ratingMatch.index).trim();
      rating = parseFloat(ratingMatch[1]);
      info = text.substring(ratingMatch.index + ratingMatch[0].length).trim();
    }
    
    // Generate pseudo-coordinates (spread around center point)
    // In a real implementation, we'd extract actual coordinates from the page
    const offset = (idx % 10) * 0.001;
    const lat = centerLat + (Math.random() - 0.5) * 0.01;
    const lon = centerLon + (Math.random() - 0.5) * 0.01;
    
    // Extract additional info
    const cuisine = info.match(/([^\s·]+餐廳|[^\s·]+菜|[^\s·]+菜館)/)?.[0] || '';
    const address = info.match(/([^\s·]+號|[^\s·]+舖|[^\s·]+大廈)/)?.[0] || '';
    const hours = info.match(/(營業中|打烊時間：[^\s·]+)/)?.[0] || '';
    
    return {
      place_id: `gmaps_${Date.now()}_${idx}`,
      display_name: name,
      lat: lat.toString(),
      lon: lon.toString(),
      type: 'restaurant',
      tags: {
        name: name,
        rating: rating,
        cuisine: cuisine,
        address: address,
        opening_hours: hours,
        source: 'google-maps'
      },
      distance: undefined,
      info: info
    };
  },
  
  getFromCache(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  },
  
  saveToCache(key, data) {
    // Also save to localStorage for persistence
    try {
      const cacheData = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem('gmaps_cache_' + key, JSON.stringify(cacheData));
    } catch (e) {
      console.warn('[GoogleMaps] localStorage cache save failed:', e.message);
    }
    
    // In-memory cache
    this.cache.set(key, {
      timestamp: Date.now(),
      data: data
    });
  },
  
  loadFromLocalStorage() {
    // Load cached results from localStorage on init
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('gmaps_cache_'));
      keys.forEach(key => {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          const now = Date.now();
          if (now - cached.timestamp < this.CACHE_TTL) {
            const shortKey = key.replace('gmaps_cache_', '');
            this.cache.set(shortKey, cached);
          } else {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('[GoogleMaps] localStorage cache load failed:', e.message);
    }
  },
  
  clearCache() {
    this.cache.clear();
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('gmaps_cache_'));
      keys.forEach(key => localStorage.removeItem(key));
    } catch (e) {
      // Ignore localStorage errors
    }
  }
};

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GoogleMapsSearch;
}

if (typeof window !== 'undefined') {
  window.GoogleMapsSearch = GoogleMapsSearch;
}
