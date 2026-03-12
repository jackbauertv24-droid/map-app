const MapVisualizer = (function() {
  let map = null;
  let markerClusterGroup = null;
  let currentResults = [];

  function init() {
    createMapModal();
    setupEventListeners();
  }

  function createMapModal() {
    const modal = document.createElement('div');
    modal.id = 'mapModal';
    modal.innerHTML = `
      <button id="mapCloseBtn" title="關閉">&times;</button>
      <div id="mapContainer"></div>
      <div id="mapResultsPanel"></div>
    `;
    document.body.appendChild(modal);
  }

  function setupEventListeners() {
    document.addEventListener('click', function(e) {
      if (e.target.id === 'mapCloseBtn' || e.target.id === 'mapModal') {
        closeMap();
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.getElementById('mapModal').classList.contains('open')) {
        closeMap();
      }
    });
  }

  function openMap(results) {
    currentResults = results || [];
    const modal = document.getElementById('mapModal');
    const container = document.getElementById('mapContainer');
    const panel = document.getElementById('mapResultsPanel');

    if (!modal || !container) return;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (!map) {
      map = L.map('mapContainer', {
        center: [22.3193, 114.1694],
        zoom: 11,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true
      });
      map.addLayer(markerClusterGroup);
    }

    markerClusterGroup.clearLayers();
    panel.innerHTML = '';

    const i18n = window.I18N;
    const panelTitle = i18n ? i18n.t('searchResults') : '搜尋結果';
    panel.innerHTML = `<h3>${panelTitle} (${currentResults.length})</h3>`;

    if (currentResults.length === 0) {
      panel.innerHTML += '<p style="color:#666;">沒有結果</p>';
      map.setView([22.3193, 114.1694], 11);
      return;
    }

    const bounds = L.latLngBounds();
    const markers = [];

    currentResults.forEach((place, idx) => {
      const lat = parseFloat(place.lat);
      const lon = parseFloat(place.lon);

      if (isNaN(lat) || isNaN(lon)) return;

      const marker = L.marker([lat, lon]);
      const popupContent = `<strong>${escapeHtml(place.display_name)}</strong><br/>
        <small>Lat: ${place.lat}, Lon: ${place.lon}</small>`;
      marker.bindPopup(popupContent);

      markerClusterGroup.addLayer(marker);
      markers.push(marker);
      bounds.extend([lat, lon]);

      const resultItem = document.createElement('div');
      resultItem.className = 'map-result-item';
      resultItem.innerHTML = `
        <strong>#${idx + 1} ${escapeHtml(place.display_name)}</strong>
        <small>Lat: ${place.lat}, Lon: ${place.lon}</small>
      `;
      resultItem.addEventListener('click', function() {
        map.setView([lat, lon], 16);
        marker.openPopup();
      });
      panel.appendChild(resultItem);
    });

    if (markers.length > 0) {
      map.fitBounds(bounds, {padding: [50, 50]});
    }
  }

  function closeMap() {
    const modal = document.getElementById('mapModal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function isOpen() {
    const modal = document.getElementById('mapModal');
    return modal && modal.classList.contains('open');
  }

  return {
    init,
    openMap,
    closeMap,
    isOpen
  };
})();

if (typeof window !== 'undefined') {
  window.MapVisualizer = MapVisualizer;
}
