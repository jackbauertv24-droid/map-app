// MTR Dropdown Cascade Logic
// Handles region -> line -> station selection flow

function t(key) {
  if (window.I18N && typeof window.I18N.t === 'function') {
    return window.I18N.t(key);
  }
  const defaults = {
    selectLine: '選擇路綫',
    selectStation: '選擇車站'
  };
  return defaults[key] || key;
}

function getLineName(lineKey) {
  if (window.I18N && typeof window.I18N.t === 'function') {
    const i18nKey = `line_${lineKey}`;
    return window.I18N.t(i18nKey);
  }
  const fallbackNames = {
    island: '港島綫',
    tsuen_wan: '荃灣綫',
    kwun_tong: '觀塘綫',
    tuen_ma: '屯馬綫',
    tun_ma: '屯馬綫',
    tung_chung: '東涌綫',
    south_island: '南港島綫',
    east_rail: '東鐵綫',
    west_rail: '西鐵綫',
    tseung_kwan_o: '將軍澳綫',
    airport_express: '機場快綫'
  };
  return fallbackNames[lineKey] || lineKey;
}

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
    
    lineSelect.innerHTML = `<option value="">${t('selectLine')}</option>`;
    Object.keys(region.lines).forEach(lineKey => {
      const option = document.createElement('option');
      option.value = lineKey;
      option.textContent = getLineName(lineKey);
      lineSelect.appendChild(option);
    });
    lineSelect.disabled = false;
    stationSelect.disabled = true;
    stationSelect.innerHTML = `<option value="">${t('selectStation')}</option>`;
  });
  
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
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) searchBtn.click();
    }
  });
  
  if (radiusSelect) {
    radiusSelect.addEventListener('change', () => {
      if (window.activeStationFilter) {
        window.activeRadiusFilter = parseFloat(radiusSelect.value);
        updateActiveFilterDisplay(window.activeStationFilter, window.activeRadiusFilter);
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
          const searchBtn = document.getElementById('searchBtn');
          if (searchBtn) searchBtn.click();
        }
      }
    });
  }
}

function clearStationFilter() {
  window.activeStationFilter = null;
  window.activeRadiusFilter = 1;
  
  const filterDiv = document.getElementById('activeFilter');
  if (filterDiv) {
    filterDiv.style.display = 'none';
  }
}

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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMTRDropdowns);
} else {
  setTimeout(initMTRDropdowns, 0);
}

window.clearStationFilter = clearStationFilter;
window.updateActiveFilterDisplay = updateActiveFilterDisplay;
