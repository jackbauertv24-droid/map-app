// Common OSM Amenity Types with Traditional Chinese translations
// Based on https://wiki.openstreetmap.org/wiki/Map_features#Amenity

const AMENITY_SUGGESTIONS = [
  // Sustenance (飲食)
  { en: 'restaurant', zh: '餐廳', amenity: 'restaurant' },
  { en: 'cafe', zh: '咖啡館', amenity: 'cafe' },
  { en: 'fast food', zh: '快餐店', amenity: 'fast_food' },
  { en: 'bar', zh: '酒吧', amenity: 'bar' },
  { en: 'pub', zh: '酒館', amenity: 'pub' },
  { en: 'biergarten', zh: '啤酒花園', amenity: 'biergarten' },
  { en: 'food court', zh: '美食廣場', amenity: 'food_court' },
  { en: 'ice cream', zh: '冰淇淋店', amenity: 'ice_cream' },
  
  // Education (教育)
  { en: 'school', zh: '學校', amenity: 'school' },
  { en: 'university', zh: '大學', amenity: 'university' },
  { en: 'college', zh: '學院', amenity: 'college' },
  { en: 'kindergarten', zh: '幼兒園', amenity: 'kindergarten' },
  { en: 'library', zh: '圖書館', amenity: 'library' },
  { en: 'language school', zh: '語言學校', amenity: 'language_school' },
  { en: 'music school', zh: '音樂學校', amenity: 'music_school' },
  { en: 'driving school', zh: '駕駛學校', amenity: 'driving_school' },
  
  // Healthcare (醫療)
  { en: 'hospital', zh: '醫院', amenity: 'hospital' },
  { en: 'clinic', zh: '診所', amenity: 'clinic' },
  { en: 'pharmacy', zh: '藥房', amenity: 'pharmacy' },
  { en: 'dentist', zh: '牙醫', amenity: 'dentist' },
  { en: 'doctors', zh: '醫生', amenity: 'doctors' },
  { en: 'veterinary', zh: '獸醫', amenity: 'veterinary' },
  
  // Transportation (交通)
  { en: 'parking', zh: '停車場', amenity: 'parking' },
  { en: 'bicycle parking', zh: '單車停泊處', amenity: 'bicycle_parking' },
  { en: 'bicycle rental', zh: '單車租賃', amenity: 'bicycle_rental' },
  { en: 'car rental', zh: '汽車租賃', amenity: 'car_rental' },
  { en: 'car wash', zh: '洗車場', amenity: 'car_wash' },
  { en: 'charging station', zh: '充電站', amenity: 'charging_station' },
  { en: 'fuel', zh: '加油站', amenity: 'fuel' },
  { en: 'taxi', zh: '的士站', amenity: 'taxi' },
  { en: 'bus station', zh: '巴士總站', amenity: 'bus_station' },
  { en: 'ferry terminal', zh: '渡輪碼頭', amenity: 'ferry_terminal' },
  
  // Financial (金融)
  { en: 'bank', zh: '銀行', amenity: 'bank' },
  { en: 'atm', zh: '自動櫃員機', amenity: 'atm' },
  { en: 'bureau de change', zh: '貨幣兌換', amenity: 'bureau_de_change' },
  
  // Entertainment & Culture (娛樂文化)
  { en: 'cinema', zh: '電影院', amenity: 'cinema' },
  { en: 'theatre', zh: '劇院', amenity: 'theatre' },
  { en: 'museum', zh: '博物館', amenity: 'museum' },
  { en: 'gallery', zh: '畫廊', amenity: 'gallery' },
  { en: 'casino', zh: '賭場', amenity: 'casino' },
  { en: 'nightclub', zh: '夜總會', amenity: 'nightclub' },
  
  // Public Service (公共服務)
  { en: 'post office', zh: '郵局', amenity: 'post_office' },
  { en: 'police', zh: '警察局', amenity: 'police' },
  { en: 'fire station', zh: '消防局', amenity: 'fire_station' },
  { en: 'townhall', zh: '市政廳', amenity: 'townhall' },
  { en: 'courthouse', zh: '法院', amenity: 'courthouse' },
  { en: 'community centre', zh: '社區中心', amenity: 'community_centre' },
  
  // Facilities (設施)
  { en: 'toilets', zh: '洗手間', amenity: 'toilets' },
  { en: 'shower', zh: '淋浴間', amenity: 'shower' },
  { en: 'drinking water', zh: '飲用水', amenity: 'drinking_water' },
  { en: 'bench', zh: '長椅', amenity: 'bench' },
  { en: 'shelter', zh: '涼亭', amenity: 'shelter' },
  
  // Shopping (購物)
  { en: 'marketplace', zh: '街市', amenity: 'marketplace' },
  { en: 'shopping centre', zh: '購物中心', amenity: 'shopping_centre' },
  
  // Sports & Leisure (運動康樂)
  { en: 'gym', zh: '健身中心', amenity: 'gym' },
  { en: 'swimming pool', zh: '游泳池', amenity: 'swimming_pool' },
  { en: 'sports centre', zh: '體育館', amenity: 'sports_centre' },
  { en: 'playground', zh: '兒童遊樂場', amenity: 'playground' },
  { en: 'park', zh: '公園', amenity: 'park' },
  
  // Religious (宗教)
  { en: 'place of worship', zh: '宗教場所', amenity: 'place_of_worship' },
  
  // Tourism (旅遊)
  { en: 'hotel', zh: '酒店', amenity: 'hotel' },
  { en: 'hostel', zh: '青年旅舍', amenity: 'hostel' },
  { en: 'guest house', zh: '賓館', amenity: 'guest_house' },
  { en: 'motel', zh: '汽車旅館', amenity: 'motel' },
  { en: 'tourist information', zh: '旅遊資訊', amenity: 'tourist_information' },
  
  // Other (其他)
  { en: 'internet cafe', zh: '網吧', amenity: 'internet_cafe' },
  { en: 'phone', zh: '公共電話', amenity: 'phone' },
  { en: 'recycling', zh: '回收站', amenity: 'recycling' },
  { en: 'waste basket', zh: '垃圾桶', amenity: 'waste_basket' }
];

// Get random amenity suggestions
function getRandomAmenities(count = 10) {
  const shuffled = [...AMENITY_SUGGESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Get amenity by English name
function getAmenityByEn(en) {
  return AMENITY_SUGGESTIONS.find(a => a.en.toLowerCase() === en.toLowerCase());
}

// Get amenity by Chinese name
function getAmenityByZh(zh) {
  return AMENITY_SUGGESTIONS.find(a => a.zh === zh);
}

// Get all amenity keys for Overpass API
function getAllAmenityKeys() {
  return AMENITY_SUGGESTIONS.map(a => a.amenity);
}

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AMENITY_SUGGESTIONS,
    getRandomAmenities,
    getAmenityByEn,
    getAmenityByZh,
    getAllAmenityKeys
  };
}

if (typeof window !== 'undefined') {
  window.AMENITY_SUGGESTIONS = AMENITY_SUGGESTIONS;
  window.getRandomAmenities = getRandomAmenities;
  window.getAmenityByEn = getAmenityByEn;
  window.getAmenityByZh = getAmenityByZh;
  window.getAllAmenityKeys = getAllAmenityKeys;
}
