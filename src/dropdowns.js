// MTR Dropdown Cascade Logic
// Handles region -> line -> station selection flow

/**
 * Get translated text from i18n
 */
function t(key) {
  if (window.I18N) {
    return window.I18N.t(key);
  }
  const defaults = {
    selectLine: 'Select Line',
    selectStation: 'Select Station'
  };
  return defaults[key] || key;
}

/**
 * Get current language
 */
function getCurrentLang() {
  return window.I18N ? window.I18N.currentLang : 'zh-HK';
}

/**
 * Initialize MTR dropdown cascade
 */
function initMTRDropdowns() {
  if (!window.MTR_DATA) {
    console.error('MTR_DATA not loaded. Ensure mtr-stations.js is loaded before dropdowns.js');
    return;
  }
  
  const regionSelect = document.getElementById('regionSelect');
  const lineSelect = document.getElementById('lineSelect');
  const stationSelect = document.getElementById('stationSelect');
  const radiusSelect = document.getElementById('radiusSelect');
  
  if (!regionSelect || !lineSelect || !stationSelect) {
    console.error('MTR dropdown elements not found');
    return;
  }
  
  // Region change → populate lines
  regionSelect.addEventListener('change', () => {
    const regionKey = regionSelect.value;
    
    if (!regionKey) {
      lineSelect.disabled = true;
      stationSelect.disabled = true;
      lineSelect.innerHTML = `<option value="">${t('selectLine')}</option>`;
      stationSelect.innerHTML = `<option value="">${t('selectStation')}</option>`;
      clearStationFilter();
      return;
    }
    
    const region = window.MTR_DATA[regionKey];
    if (!region) return;
    
    // Populate lines for selected region
    lineSelect.innerHTML = `<option value="">${t('selectLine')}</option>`;
    Object.keys(region.lines).forEach(lineKey => {
      const line = region.lines[lineKey];
      const option = document.createElement('option');
      option.value = lineKey;
      option.textContent = line.name;
      lineSelect.appendChild(option);
    });
    lineSelect.disabled = false;
    stationSelect.disabled = true;
    stationSelect.innerHTML = `<option value="">${t('selectStation')}</option>`;
  });
  
  // Line change → populate stations
  lineSelect.addEventListener('change', () => {
    const regionKey = regionSelect.value;
    const lineKey = lineSelect.value;
    
    if (!regionKey || !lineKey) {
      stationSelect.disabled = true;
      stationSelect.innerHTML = `<option value="">${t('selectStation')}</option>`;
      clearStationFilter();
      return;
    }
    
    const region = window.MTR_DATA[regionKey];
    const line = region.lines[lineKey];
    
    if (!line) return;
    
    // Populate stations for selected line
    stationSelect.innerHTML = `<option value="">${t('selectStation')}</option>`;
    line.stations.forEach(station => {
      const option = document.createElement('option');
      option.value = JSON.stringify({
        name: station.name,
        lat: station.lat,
        lon: station.lon,
        region: regionKey,
        line: lineKey
      });
      option.textContent = station.name;
      stationSelect.appendChild(option);
    });
    stationSelect.disabled = false;
  });
  
  // Station change → set active filter
  stationSelect.addEventListener('change', () => {
    const stationValue = stationSelect.value;
    
    if (!stationValue) {
      clearStationFilter();
      return;
    }
    
    const station = JSON.parse(stationValue);
    window.activeStationFilter = station;
    
    const radius = radiusSelect ? radiusSelect.value : '1';
    window.activeRadiusFilter = parseFloat(radius);
    
    updateActiveFilterDisplay(station, window.activeRadiusFilter);
    
    // Auto-trigger search if there's a query
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) searchBtn.click();
    }
  });
  
  // Radius change → update active filter
  if (radiusSelect) {
    radiusSelect.addEventListener('change', () => {
      if (window.activeStationFilter) {
        window.activeRadiusFilter = parseFloat(radiusSelect.value);
        updateActiveFilterDisplay(window.activeStationFilter, window.activeRadiusFilter);
        
        // Re-trigger search if there's a query
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
          const searchBtn = document.getElementById('searchBtn');
          if (searchBtn) searchBtn.click();
        }
      }
    });
  }
  
  // Listen for language changes to update dropdown placeholders
  window.addEventListener('languageChanged', () => {
    // Update line select placeholder if it's empty
    if (lineSelect.disabled || !lineSelect.value) {
      const defaultOption = lineSelect.querySelector('option[value=""]');
      if (defaultOption) {
        defaultOption.textContent = t('selectLine');
      }
    }
    
    // Update station select placeholder if it's empty
    if (stationSelect.disabled || !stationSelect.value) {
      const defaultOption = stationSelect.querySelector('option[value=""]');
      if (defaultOption) {
        defaultOption.textContent = t('selectStation');
      }
    }
  });
}

/**
 * Clear station filter (called from search.js)
 */
function clearStationFilter() {
  window.activeStationFilter = null;
  window.activeRadiusFilter = 1;
  
  const filterDiv = document.getElementById('activeFilter');
  if (filterDiv) {
    filterDiv.style.display = 'none';
  }
}

/**
 * Update active filter display (called from search.js)
 */
function updateActiveFilterDisplay(station, radius) {
  const filterDiv = document.getElementById('activeFilter');
  const filterStation = document.getElementById('filterStation');
  const filterRadius = document.getElementById('filterRadius');
  const lang = getCurrentLang();
  
  if (station && filterDiv && filterStation && filterRadius) {
    filterStation.textContent = station.name;
    const radiusLabel = lang === 'en' ? `${radius}km` : `${radius}公里`;
    filterRadius.textContent = radiusLabel;
    filterDiv.style.display = 'block';
  } else if (filterDiv) {
    filterDiv.style.display = 'none';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMTRDropdowns);
} else {
  initMTRDropdowns();
}

// Export for global access
window.clearStationFilter = clearStationFilter;
window.updateActiveFilterDisplay = updateActiveFilterDisplay;
