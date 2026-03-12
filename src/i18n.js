// Internationalization (i18n) module - Traditional Chinese only
const I18N = {
  translations: {
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
    kilometers: '公里',
    line_island: '港島綫',
    line_tsuen_wan: '荃灣綫',
    line_kwun_tong: '觀塘綫',
    line_tuen_ma: '屯馬綫',
    line_tung_chung: '東涌綫',
    line_south_island: '南港島綫',
    line_east_rail: '東鐵綫',
    line_west_rail: '西鐵綫',
    line_tseung_kwan_o: '將軍澳綫',
    line_airport_express: '機場快綫',
    line_tun_ma: '屯馬綫'
  },
  
  init() {
    this.translatePage();
  },
  
  t(key) {
    return this.translations[key] || key;
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
      if (this.translations[key]) {
        el.textContent = this.t(key);
      }
    });
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18N;
}

if (typeof window !== 'undefined') {
  window.I18N = I18N;
}
