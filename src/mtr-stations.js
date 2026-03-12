// MTR Heavy Rail Station Database
// Organized by Region -> Line -> Stations

const MTR_DATA = {
  hong_kong_island: {
    name: 'Hong Kong Island',
    lines: {
      island: {
        name: 'Island Line',
        stations: [
          { name: 'Kennedy Town', lat: 22.2816, lon: 114.1290 },
          { name: 'HKU', lat: 22.2832, lon: 114.1425 },
          { name: 'Sheung Wan', lat: 22.2863, lon: 114.1498 },
          { name: 'Central', lat: 22.2819, lon: 114.1578 },
          { name: 'Admiralty', lat: 22.2791, lon: 114.1648 },
          { name: 'Wan Chai', lat: 22.2779, lon: 114.1716 },
          { name: 'Causeway Bay', lat: 22.2778, lon: 114.1821 },
          { name: 'Tin Hau', lat: 22.2812, lon: 114.1883 },
          { name: 'Fortress Hill', lat: 22.2849, lon: 114.1932 },
          { name: 'North Point', lat: 22.2888, lon: 114.2003 },
          { name: 'Quarry Bay', lat: 22.2838, lon: 114.2066 },
          { name: 'Tai Koo', lat: 22.2827, lon: 114.2143 },
          { name: 'Sai Wan Ho', lat: 22.2847, lon: 114.2214 },
          { name: 'Shau Kei Wan', lat: 22.2798, lon: 114.2269 },
          { name: 'Heng Fa Chuen', lat: 22.2842, lon: 114.2320 },
          { name: 'Chai Wan', lat: 22.2866, lon: 114.2369 }
        ]
      },
      south_island: {
        name: 'South Island Line',
        stations: [
          { name: 'Admiralty', lat: 22.2791, lon: 114.1648 },
          { name: 'Ocean Park', lat: 22.2478, lon: 114.1748 },
          { name: 'Wong Chuk Hang', lat: 22.2469, lon: 114.1679 },
          { name: 'Lei Tung', lat: 22.2441, lon: 114.1533 },
          { name: 'South Horizons', lat: 22.2438, lon: 114.1449 }
        ]
      },
      tung_chung: {
        name: 'Tung Chung Line',
        stations: [
          { name: 'Hong Kong', lat: 22.2863, lon: 114.1599 },
          { name: 'Kowloon', lat: 22.3048, lon: 114.1618 }
        ]
      }
    }
  },
  kowloon: {
    name: 'Kowloon',
    lines: {
      tsuen_wan: {
        name: 'Tsuen Wan Line',
        stations: [
          { name: 'Tsim Sha Tsui', lat: 22.2974, lon: 114.1719 },
          { name: 'Jordan', lat: 22.3050, lon: 114.1714 },
          { name: 'Yau Ma Tei', lat: 22.3112, lon: 114.1709 },
          { name: 'Mong Kok', lat: 22.3193, lon: 114.1707 },
          { name: 'Prince Edward', lat: 22.3252, lon: 114.1699 },
          { name: 'Shek Kip Mei', lat: 22.3329, lon: 114.1688 },
          { name: 'Kowloon Tong', lat: 22.3379, lon: 114.1739 },
          { name: 'Lai Chi Kok', lat: 22.3369, lon: 114.1578 },
          { name: 'Mei Foo', lat: 22.3379, lon: 114.1469 },
          { name: 'Lai King', lat: 22.3429, lon: 114.1319 }
        ]
      },
      kwun_tong: {
        name: 'Kwun Tong Line',
        stations: [
          { name: 'Whampoa', lat: 22.3059, lon: 114.1879 },
          { name: 'Ho Man Tin', lat: 22.3099, lon: 114.1839 },
          { name: 'Yau Ma Tei', lat: 22.3112, lon: 114.1709 },
          { name: 'Mong Kok', lat: 22.3193, lon: 114.1707 },
          { name: 'Yau Tong', lat: 22.2979, lon: 114.2349 },
          { name: 'Tiu Keng Leng', lat: 22.3049, lon: 114.2499 },
          { name: 'Kwun Tong', lat: 22.3139, lon: 114.2239 },
          { name: 'Ngau Tau Kok', lat: 22.3169, lon: 114.2189 },
          { name: 'Kowloon Bay', lat: 22.3209, lon: 114.2129 },
          { name: 'Choi Hung', lat: 22.3259, lon: 114.2069 },
          { name: 'Diamond Hill', lat: 22.3369, lon: 114.2009 }
        ]
      },
      tun_ma: {
        name: 'Tuen Ma Line',
        stations: [
          { name: 'Hung Hom', lat: 22.3029, lon: 114.1889 },
          { name: 'Kai Tak', lat: 22.3149, lon: 114.2079 },
          { name: 'Sung Wong Toi', lat: 22.3189, lon: 114.1909 },
          { name: 'To Kwa Wan', lat: 22.3099, lon: 114.1959 },
          { name: 'Ho Man Tin', lat: 22.3099, lon: 114.1839 },
          { name: 'Diamond Hill', lat: 22.3369, lon: 114.2009 },
          { name: 'Hin Keng', lat: 22.3659, lon: 114.1779 },
          { name: 'Tai Wai', lat: 22.3739, lon: 114.1749 }
        ]
      },
      east_rail: {
        name: 'East Rail Line',
        stations: [
          { name: 'Hung Hom', lat: 22.3029, lon: 114.1889 },
          { name: 'Exhibition Centre', lat: 22.2819, lon: 114.1749 },
          { name: 'Admiralty', lat: 22.2791, lon: 114.1648 }
        ]
      },
      airport_express: {
        name: 'Airport Express',
        stations: [
          { name: 'Hong Kong', lat: 22.2863, lon: 114.1599 },
          { name: 'Kowloon', lat: 22.3048, lon: 114.1618 },
          { name: 'Olympic', lat: 22.3159, lon: 114.1539 }
        ]
      },
      tseung_kwan_o: {
        name: 'Tseung Kwan O Line',
        stations: [
          { name: 'Tiu Keng Leng', lat: 22.3049, lon: 114.2499 },
          { name: 'Yau Tong', lat: 22.2979, lon: 114.2349 },
          { name: 'Lam Tin', lat: 22.3039, lon: 114.2269 },
          { name: 'Po Lam', lat: 22.3189, lon: 114.2499 },
          { name: 'Hang Hau', lat: 22.3119, lon: 114.2539 },
          { name: 'Tseung Kwan O', lat: 22.3069, lon: 114.2599 },
          { name: 'LOHAS Park', lat: 22.3009, lon: 114.2659 }
        ]
      }
    }
  },
  new_territories: {
    name: 'New Territories',
    lines: {
      tun_ma: {
        name: 'Tuen Ma Line',
        stations: [
          { name: 'Tai Wai', lat: 22.3739, lon: 114.1749 },
          { name: 'Che Kung Temple', lat: 22.3769, lon: 114.1689 },
          { name: 'Hin Keng', lat: 22.3659, lon: 114.1779 },
          { name: 'Diamond Hill', lat: 22.3369, lon: 114.2009 },
          { name: 'Kai Tak', lat: 22.3149, lon: 114.2079 },
          { name: 'Sung Wong Toi', lat: 22.3189, lon: 114.1909 },
          { name: 'To Kwa Wan', lat: 22.3099, lon: 114.1959 },
          { name: 'Hung Hom', lat: 22.3029, lon: 114.1889 },
          { name: 'East Tsim Sha Tsui', lat: 22.2959, lon: 114.1739 },
          { name: 'Austin', lat: 22.3049, lon: 114.1569 },
          { name: 'Olympic', lat: 22.3159, lon: 114.1539 },
          { name: 'Nan Fung', lat: 22.3169, lon: 114.1449 },
          { name: 'Tsuen Wan West', lat: 22.3679, lon: 114.1149 },
          { name: 'Kam Sheung Road', lat: 22.4319, lon: 114.0369 },
          { name: 'Yuen Long', lat: 22.4459, lon: 114.0249 },
          { name: 'Long Ping', lat: 22.4469, lon: 114.0219 },
          { name: 'Ping Shan', lat: 22.4439, lon: 114.0159 },
          { name: 'Tuen Mun', lat: 22.3939, lon: 113.9749 }
        ]
      },
      east_rail: {
        name: 'East Rail Line',
        stations: [
          { name: 'Admiralty', lat: 22.2791, lon: 114.1648 },
          { name: 'Exhibition Centre', lat: 22.2819, lon: 114.1749 },
          { name: 'Hung Hom', lat: 22.3029, lon: 114.1889 },
          { name: 'Kowloon Tong', lat: 22.3379, lon: 114.1739 },
          { name: 'Tai Po Market', lat: 22.4469, lon: 114.1649 },
          { name: 'Fanling', lat: 22.4899, lon: 114.1409 },
          { name: 'Sheung Shui', lat: 22.5019, lon: 114.1269 },
          { name: 'Lo Wu', lat: 22.5269, lon: 114.1139 },
          { name: 'Lok Ma Chau', lat: 22.5289, lon: 114.0669 },
          { name: 'University', lat: 22.4149, lon: 114.2049 },
          { name: 'Fo Tan', lat: 22.3979, lon: 114.1979 },
          { name: 'Sha Tin', lat: 22.3819, lon: 114.1879 },
          { name: 'Siu Lek Wan', lat: 22.3869, lon: 114.1939 },
          { name: 'Tai Wo', lat: 22.4419, lon: 114.1679 },
          { name: 'Wo Hang', lat: 22.4739, lon: 114.1469 },
          { name: 'Pat Heung', lat: 22.4659, lon: 114.1349 }
        ]
      },
      tung_chung: {
        name: 'Tung Chung Line',
        stations: [
          { name: 'Kowloon', lat: 22.3048, lon: 114.1618 },
          { name: 'Olympic', lat: 22.3159, lon: 114.1539 },
          { name: 'Lai King', lat: 22.3429, lon: 114.1319 },
          { name: 'Sunny Bay', lat: 22.3149, lon: 114.0569 },
          { name: 'Tung Chung', lat: 22.2899, lon: 113.9439 },
          { name: 'Nam Cheong', lat: 22.3269, lon: 114.1539 },
          { name: 'Tsing Yi', lat: 22.3569, lon: 114.1069 },
          { name: 'Siu Ho Wan', lat: 22.3039, lon: 114.0139 }
        ]
      },
      tseung_kwan_o: {
        name: 'Tseung Kwan O Line',
        stations: [
          { name: 'Tiu Keng Leng', lat: 22.3049, lon: 114.2499 },
          { name: 'Yau Tong', lat: 22.2979, lon: 114.2349 },
          { name: 'Lam Tin', lat: 22.3039, lon: 114.2269 },
          { name: 'Po Lam', lat: 22.3189, lon: 114.2499 },
          { name: 'Hang Hau', lat: 22.3119, lon: 114.2539 },
          { name: 'Tseung Kwan O', lat: 22.3069, lon: 114.2599 },
          { name: 'LOHAS Park', lat: 22.3009, lon: 114.2659 }
        ]
      },
      west_rail: {
        name: 'West Rail Line',
        stations: [
          { name: 'Hung Hom', lat: 22.3029, lon: 114.1889 },
          { name: 'East Tsim Sha Tsui', lat: 22.2959, lon: 114.1739 },
          { name: 'Austin', lat: 22.3049, lon: 114.1569 },
          { name: 'Olympic', lat: 22.3159, lon: 114.1539 },
          { name: 'Nan Fung', lat: 22.3169, lon: 114.1449 },
          { name: 'Tsuen Wan West', lat: 22.3679, lon: 114.1149 },
          { name: 'Kam Sheung Road', lat: 22.4319, lon: 114.0369 },
          { name: 'Yuen Long', lat: 22.4459, lon: 114.0249 },
          { name: 'Long Ping', lat: 22.4469, lon: 114.0219 },
          { name: 'Ping Shan', lat: 22.4439, lon: 114.0159 },
          { name: 'Tuen Mun', lat: 22.3939, lon: 113.9749 }
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MTR_DATA, STATION_LOOKUP };
}
