// Internationalization (i18n) module
// Schema version - increment when localStorage structure changes
const I18N_SCHEMA_VERSION = 1;

const I18N = {
  defaultLang: 'zh-HK',
  currentLang: 'zh-HK',
  schemaVersion: I18N_SCHEMA_VERSION,
  
  translations: {
    'zh-HK': {
      appTitle: '地圖應用程式',
      appSubtitle: '按港鐵站搜尋',
      selectMTRStation: '選擇港鐵站',
      regionLabel: '地區',
      lineLabel: '路綫',
      stationLabel: '車站',
      radiusLabel: '範圍',
      searchPOI: '搜尋地點或地址',
      searchPlaceholder: '輸入地點或地址 (例如：麥當勞，餐廳)',
      searchBtn: '搜尋',
      searchingNear: '搜尋附近：',
      radius: '範圍內',
      clearFilter: '清除篩選',
      noResults: '找不到結果。',
      pleaseEnterAddress: '請輸入地址。',
      searching: '搜尋中...',
      searchError: '搜尋時發生錯誤。',
      allHongKong: '全香港',
      hongKongIsland: '港島',
      kowloon: '九龍',
      newTerritories: '新界',
      selectLine: '選擇路綫',
      selectStation: '選擇車站',
      meters: '米',
      kilometers: '公里'
    },
    'en': {
      appTitle: 'Map App',
      appSubtitle: 'Search by MTR Station',
      selectMTRStation: 'Select MTR Station',
      regionLabel: 'Region',
      lineLabel: 'Line',
      stationLabel: 'Station',
      radiusLabel: 'Radius',
      searchPOI: 'Search POI or Address',
      searchPlaceholder: 'Enter address or POI (e.g., McDonalds, restaurants)',
      searchBtn: 'Search',
      searchingNear: 'Searching near:',
      radius: 'radius',
      clearFilter: 'Clear Filter',
      noResults: 'No results found.',
      pleaseEnterAddress: 'Please enter an address.',
      searching: 'Searching...',
      searchError: 'Error while searching.',
      allHongKong: 'All Hong Kong',
      hongKongIsland: 'Hong Kong Island',
      kowloon: 'Kowloon',
      newTerritories: 'New Territories',
      selectLine: 'Select Line',
      selectStation: 'Select Station',
      meters: 'm',
      kilometers: 'km'
    }
  },
  
  _checkAndMigrateStorage() {
    try {
      const storedVersion = localStorage.getItem('i18n_schema_version');
      const currentVersion = this.schemaVersion;
      
      if (!storedVersion) {
        localStorage.setItem('i18n_schema_version', currentVersion.toString());
        return;
      }
      
      const parsedVersion = parseInt(storedVersion, 10);
      
      if (isNaN(parsedVersion) || parsedVersion < currentVersion) {
        console.log(`[I18N] Migrating storage from v${parsedVersion} to v${currentVersion}`);
        localStorage.clear();
        localStorage.setItem('i18n_schema_version', currentVersion.toString());
        localStorage.setItem('preferredLang', this.defaultLang);
        console.log(`[I18N] Storage cleared and reset to default language: ${this.defaultLang}`);
      }
    } catch (e) {
      console.error('[I18N] Storage migration error:', e);
      localStorage.setItem('i18n_schema_version', this.schemaVersion.toString());
    }
  },
  
  init() {
    this._checkAndMigrateStorage();
    
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
    }
    this.translatePage();
  },
  
  t(key) {
    return this.translations[this.currentLang][key] || this.translations['zh-HK'][key] || key;
  },
  
  translatePage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) {
          el.placeholder = text;
        }
      } else if (el.tagName === 'OPTION') {
        el.textContent = text;
      } else {
        el.textContent = text;
      }
    });
    
    document.querySelectorAll('label[for]').forEach(el => {
      const forId = el.getAttribute('for');
      const key = forId + 'Label';
      if (this.translations[this.currentLang][key]) {
        el.textContent = this.t(key);
      }
    });
    
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.value = this.currentLang;
    }
  },
  
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('preferredLang', lang);
      this.translatePage();
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}

if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
