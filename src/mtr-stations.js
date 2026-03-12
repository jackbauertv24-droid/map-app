// MTR Heavy Rail Station Database
// Organized by Region -> Line -> Stations
// Station names in Traditional Chinese
// Coordinates from official MTR data and OpenStreetMap

const MTR_DATA = {
  hong_kong_island: {
    name: '港島',
    lines: {
      island: {
        name: '港島綫',
        stations: [
          { name: '堅尼地城', lat: 22.2816, lon: 114.1290 },
          { name: '香港大學', lat: 22.2832, lon: 114.1425 },
          { name: '上環', lat: 22.2863, lon: 114.1498 },
          { name: '中環', lat: 22.2819, lon: 114.1578 },
          { name: '金鐘', lat: 22.2791, lon: 114.1648 },
          { name: '灣仔', lat: 22.2779, lon: 114.1716 },
          { name: '銅鑼灣', lat: 22.2778, lon: 114.1821 },
          { name: '天后', lat: 22.2812, lon: 114.1883 },
          { name: '炮台山', lat: 22.2849, lon: 114.1932 },
          { name: '北角', lat: 22.2888, lon: 114.2003 },
          { name: '鰂魚涌', lat: 22.2838, lon: 114.2066 },
          { name: '太古', lat: 22.2827, lon: 114.2143 },
          { name: '西灣河', lat: 22.2847, lon: 114.2214 },
          { name: '筲箕灣', lat: 22.2798, lon: 114.2269 },
          { name: '杏花邨', lat: 22.2842, lon: 114.2320 },
          { name: '柴灣', lat: 22.2866, lon: 114.2369 }
        ]
      },
      south_island: {
        name: '南港島綫',
        stations: [
          { name: '金鐘', lat: 22.2791, lon: 114.1648 },
          { name: '海洋公園', lat: 22.2478, lon: 114.1748 },
          { name: '黃竹坑', lat: 22.2469, lon: 114.1679 },
          { name: '利東', lat: 22.2441, lon: 114.1533 },
          { name: '海怡半島', lat: 22.2438, lon: 114.1449 }
        ]
      },
      tung_chung: {
        name: '東涌綫',
        stations: [
          { name: '香港', lat: 22.2863, lon: 114.1599 },
          { name: '九龍', lat: 22.3048, lon: 114.1618 }
        ]
      },
      tseung_kwan_o: {
        name: '將軍澳綫',
        stations: [
          { name: '北角', lat: 22.2888, lon: 114.2003 },
          { name: '鰂魚涌', lat: 22.2838, lon: 114.2066 }
        ]
      }
    }
  },
  kowloon: {
    name: '九龍',
    lines: {
      tsuen_wan: {
        name: '荃灣綫',
        stations: [
          { name: '中環', lat: 22.2819, lon: 114.1578 },
          { name: '金鐘', lat: 22.2791, lon: 114.1648 },
          { name: '尖沙咀', lat: 22.2974, lon: 114.1719 },
          { name: '佐敦', lat: 22.3050, lon: 114.1714 },
          { name: '油麻地', lat: 22.3112, lon: 114.1709 },
          { name: '旺角', lat: 22.3193, lon: 114.1707 },
          { name: '太子', lat: 22.3252, lon: 114.1699 },
          { name: '石硤尾', lat: 22.3329, lon: 114.1688 },
          { name: '九龍塘', lat: 22.3379, lon: 114.1739 },
          { name: '荔枝角', lat: 22.3369, lon: 114.1578 },
          { name: '美孚', lat: 22.3379, lon: 114.1469 },
          { name: '荔景', lat: 22.3429, lon: 114.1319 }
        ]
      },
      kwun_tong: {
        name: '觀塘綫',
        stations: [
          { name: '黃埔', lat: 22.3059, lon: 114.1879 },
          { name: '何文田', lat: 22.3099, lon: 114.1839 },
          { name: '油麻地', lat: 22.3112, lon: 114.1709 },
          { name: '旺角', lat: 22.3193, lon: 114.1707 },
          { name: '太子', lat: 22.3252, lon: 114.1699 },
          { name: '石硤尾', lat: 22.3329, lon: 114.1688 },
          { name: '九龍塘', lat: 22.3379, lon: 114.1739 },
          { name: '樂富', lat: 22.3389, lon: 114.1869 },
          { name: '鑽石山', lat: 22.3369, lon: 114.2009 },
          { name: '彩虹', lat: 22.3259, lon: 114.2069 },
          { name: '九龍灣', lat: 22.3209, lon: 114.2129 },
          { name: '牛頭角', lat: 22.3169, lon: 114.2189 },
          { name: '觀塘', lat: 22.3139, lon: 114.2239 },
          { name: '藍田', lat: 22.3039, lon: 114.2269 },
          { name: '油塘', lat: 22.2979, lon: 114.2349 },
          { name: '調景嶺', lat: 22.3049, lon: 114.2499 }
        ]
      },
      tun_ma: {
        name: '屯馬綫',
        stations: [
          { name: '紅磡', lat: 22.3029, lon: 114.1889 },
          { name: '土瓜灣', lat: 22.3099, lon: 114.1959 },
          { name: '宋皇臺', lat: 22.3189, lon: 114.1909 },
          { name: '啟德', lat: 22.3149, lon: 114.2079 },
          { name: '鑽石山', lat: 22.3369, lon: 114.2009 },
          { name: '顯徑', lat: 22.3659, lon: 114.1779 },
          { name: '大圍', lat: 22.3739, lon: 114.1749 }
        ]
      },
      east_rail: {
        name: '東鐵綫',
        stations: [
          { name: '紅磡', lat: 22.3029, lon: 114.1889 },
          { name: '旺角東', lat: 22.3259, lon: 114.1789 },
          { name: '九龍塘', lat: 22.3379, lon: 114.1739 }
        ]
      },
      airport_express: {
        name: '機場快綫',
        stations: [
          { name: '香港', lat: 22.2863, lon: 114.1599 },
          { name: '九龍', lat: 22.3048, lon: 114.1618 },
          { name: '奧運', lat: 22.3159, lon: 114.1539 }
        ]
      },
      tseung_kwan_o: {
        name: '將軍澳綫',
        stations: [
          { name: '油塘', lat: 22.2979, lon: 114.2349 },
          { name: '調景嶺', lat: 22.3049, lon: 114.2499 }
        ]
      }
    }
  },
  new_territories: {
    name: '新界',
    lines: {
      tsuen_wan: {
        name: '荃灣綫',
        stations: [
          { name: '葵興', lat: 22.3589, lon: 114.1329 },
          { name: '葵芳', lat: 22.3569, lon: 114.1269 },
          { name: '大窩口', lat: 22.3669, lon: 114.1219 },
          { name: '荃灣', lat: 22.3719, lon: 114.1139 }
        ]
      },
      tun_ma: {
        name: '屯馬綫',
        stations: [
          { name: '大圍', lat: 22.3739, lon: 114.1749 },
          { name: '車公廟', lat: 22.3769, lon: 114.1689 },
          { name: '沙田圍', lat: 22.3819, lon: 114.1639 },
          { name: '第一城', lat: 22.3849, lon: 114.1579 },
          { name: '石門', lat: 22.3879, lon: 114.1509 },
          { name: '大水坑', lat: 22.3909, lon: 114.1449 },
          { name: '烏溪沙', lat: 22.3979, lon: 114.1389 },
          { name: '恆安', lat: 22.3939, lon: 114.1529 },
          { name: '馬鞍山', lat: 22.3969, lon: 114.1469 },
          { name: '海栢花園', lat: 22.4019, lon: 114.1409 },
          { name: '屯門', lat: 22.3939, lon: 113.9749 },
          { name: '兆康', lat: 22.4079, lon: 113.9839 },
          { name: '藍地', lat: 22.4179, lon: 113.9899 },
          { name: '洪水橋', lat: 22.4279, lon: 113.9969 },
          { name: '屏山', lat: 22.4439, lon: 114.0159 },
          { name: '元朗', lat: 22.4459, lon: 114.0249 },
          { name: '朗屏', lat: 22.4469, lon: 114.0219 },
          { name: '八鄉', lat: 22.4659, lon: 114.1349 },
          { name: '錦上路', lat: 22.4319, lon: 114.0369 },
          { name: '荃灣西', lat: 22.3679, lon: 114.1149 },
          { name: '錦豐', lat: 22.3169, lon: 114.1449 },
          { name: '柯士甸', lat: 22.3049, lon: 114.1569 },
          { name: '尖東', lat: 22.2959, lon: 114.1739 },
          { name: '紅磡', lat: 22.3029, lon: 114.1889 }
        ]
      },
      east_rail: {
        name: '東鐵綫',
        stations: [
          { name: '九龍塘', lat: 22.3379, lon: 114.1739 },
          { name: '大圍', lat: 22.3739, lon: 114.1749 },
          { name: '沙田', lat: 22.3819, lon: 114.1879 },
          { name: '火炭', lat: 22.3979, lon: 114.1979 },
          { name: '馬場', lat: 22.4179, lon: 114.1949 },
          { name: '大學', lat: 22.4149, lon: 114.2049 },
          { name: '大埔墟', lat: 22.4469, lon: 114.1649 },
          { name: '太和', lat: 22.4419, lon: 114.1679 },
          { name: '粉嶺', lat: 22.4899, lon: 114.1409 },
          { name: '上水', lat: 22.5019, lon: 114.1269 },
          { name: '羅湖', lat: 22.5269, lon: 114.1139 },
          { name: '落馬洲', lat: 22.5289, lon: 114.0669 }
        ]
      },
      tung_chung: {
        name: '東涌綫',
        stations: [
          { name: '奧運', lat: 22.3159, lon: 114.1539 },
          { name: '南昌', lat: 22.3269, lon: 114.1539 },
          { name: '荔景', lat: 22.3429, lon: 114.1319 },
          { name: '青衣', lat: 22.3569, lon: 114.1069 },
          { name: '欣澳', lat: 22.3149, lon: 114.0569 },
          { name: '東涌', lat: 22.2899, lon: 113.9439 }
        ]
      },
      tseung_kwan_o: {
        name: '將軍澳綫',
        stations: [
          { name: '藍田', lat: 22.3039, lon: 114.2269 },
          { name: '寶琳', lat: 22.3189, lon: 114.2499 },
          { name: '坑口', lat: 22.3119, lon: 114.2539 },
          { name: '將軍澳', lat: 22.3069, lon: 114.2599 },
          { name: '康城', lat: 22.3009, lon: 114.2659 }
        ]
      },
      airport_express: {
        name: '機場快綫',
        stations: [
          { name: '青衣', lat: 22.3569, lon: 114.1069 },
          { name: '博覽館', lat: 22.3159, lon: 113.9339 },
          { name: '機場', lat: 22.3099, lon: 113.9139 }
        ]
      }
    }
  }
};

// Flat station lookup map for quick searches
const STATION_LOOKUP = {};

Object.keys(MTR_DATA).forEach(regionKey => {
  const region = MTR_DATA[regionKey];
  Object.keys(region.lines).forEach(lineKey => {
    const line = region.lines[lineKey];
    line.stations.forEach(station => {
      const key = station.name.toLowerCase();
      if (!STATION_LOOKUP[key]) {
        STATION_LOOKUP[key] = {
          name: station.name,
          lat: station.lat,
          lon: station.lon,
          region: regionKey,
          line: lineKey
        };
      }
    });
  });
});

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTR_DATA, STATION_LOOKUP };
}

// Expose to browser global scope
if (typeof window !== 'undefined') {
  window.MTR_DATA = MTR_DATA;
  window.STATION_LOOKUP = STATION_LOOKUP;
}
