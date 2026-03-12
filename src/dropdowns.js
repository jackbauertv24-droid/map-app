// MTR Dropdown Cascade Logic
// Handles region -> line -> station selection flow

/**
 * Initialize MTR dropdown cascade
 */
function initMTRDropdowns() {
  console.log('[dropdowns] initMTRDropdowns called');
  console.log('[dropdowns] window.MTR_DATA exists:', !!window.MTR_DATA);
  
  if (!window.MTR_DATA) {
    console.error('MTR_DATA not loaded. Ensure mtr-stations.js is loaded before dropdowns.js');
    return;
  }
  
  console.log('[dropdowns] MTR_DATA regions:', Object.keys(window.MTR_DATA));
  
  const regionSelect = document.getElementById('regionSelect');
  const lineSelect = document.getElementById('lineSelect');
  const stationSelect = document.getElementById('stationSelect');
  const radiusSelect = document.getElementById('radiusSelect');
  
  if (!regionSelect || !lineSelect || !stationSelect) {
    console.error('MTR dropdown elements not found');
    return;
  }
  
  // Region change → populate lines
  console.log('[dropdowns] Adding region change listener');
  regionSelect.addEventListener('change', () => {
    console.log('[dropdowns] Region changed to:', regionSelect.value);
    const regionKey = regionSelect.value;
    
    if (!regionKey) {
      lineSelect.disabled = true;
      stationSelect.disabled = true;
      lineSelect.innerHTML = '<option value="">Select Line</option>';
      stationSelect.innerHTML = '<option value="">Select Station</option>';
      clearStationFilter();
      return;
    }
    
    const region = window.MTR_DATA[regionKey];
    if (!region) return;
    
    // Populate lines for selected region
    lineSelect.innerHTML = '<option value="">Select Line</option>';
    Object.keys(region.lines).forEach(lineKey => {
      const line = region.lines[lineKey];
      const option = document.createElement('option');
      option.value = lineKey;
      option.textContent = line.name;
      lineSelect.appendChild(option);
    });
    lineSelect.disabled = false;
    stationSelect.disabled = true;
    stationSelect.innerHTML = '<option value="">Select Station</option>';
  });
  
  // Line change → populate stations
  lineSelect.addEventListener('change', () => {
    const regionKey = regionSelect.value;
    const lineKey = lineSelect.value;
    
    if (!regionKey || !lineKey) {
      stationSelect.disabled = true;
      stationSelect.innerHTML = '<option value="">Select Station</option>';
      clearStationFilter();
      return;
    }
    
    const region = window.MTR_DATA[regionKey];
    const line = region.lines[lineKey];
    
    if (!line) return;
    
    // Populate stations for selected line
    stationSelect.innerHTML = '<option value="">Select Station</option>';
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
  
  if (station && filterDiv && filterStation && filterRadius) {
    filterStation.textContent = station.name;
    filterRadius.textContent = `${radius}km`;
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
