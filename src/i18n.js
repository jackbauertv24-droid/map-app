// Internationalization (i18n) module
const I18N = {
  defaultLang: 'zh-HK',
  currentLang: 'zh-HK',
  
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
  
  init() {
    console.log('[i18n] init() called, currentLang:', this.currentLang);
    console.log('[i18n] document.readyState:', document.readyState);
    
    // Check for saved language preference or use default
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang && this.translations[savedLang]) {
      this.currentLang = savedLang;
      console.log('[i18n] Loaded saved language:', savedLang);
    }
    
    // Apply translations
    this.translatePage();
  },
  
  t(key) {
    const result = this.translations[this.currentLang][key] || this.translations['zh-HK'][key] || key;
    return result;
  },
  
  translatePage() {
    console.log('[i18n] translatePage() called, currentLang:', this.currentLang);
    
    // Translate elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    console.log('[i18n] Found', elements.length, 'elements with data-i18n');
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.hasAttribute('placeholder')) {
          el.placeholder = text;
        }
      } else if (el.tagName === 'OPTION') {
        // For option elements, update text content
        el.textContent = text;
      } else {
        el.textContent = text;
      }
    });
    
    // Translate labels with for attribute
    document.querySelectorAll('label[for]').forEach(el => {
      const forId = el.getAttribute('for');
      const key = forId + 'Label';
      if (this.translations[this.currentLang][key]) {
        el.textContent = this.t(key);
      }
    });
    
    // Update language selector
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.value = this.currentLang;
    }
    
    console.log('[i18n] translatePage() completed');
  },
  
  setLanguage(lang) {
    console.log('[i18n] setLanguage() called:', lang);
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem('preferredLang', lang);
      this.translatePage();
      
      // Dispatch event for other modules to listen
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }
  }
};

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}

// Expose to browser global scope
if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
