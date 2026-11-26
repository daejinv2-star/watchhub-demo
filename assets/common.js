/* Watch HUB — shared data layer + SVG watch renderer
 * Synthetic data only. Structure modeled on observed dealer-market UX
 * (model → listings(new/used/wanted) → dealer trust metrics).
 */
(function () {
  'use strict';

  // ---------- seeded RNG ----------
  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = typeof seed === 'string' ? hashStr(seed) : seed >>> 0; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const gauss = (r) => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  // ---------- config ----------
  const BRAND_NAME = 'Watch HUB';
  const NOW = new Date();

  const BRANDS = [
    { id: 'cartier', ko: '까르띠에', en: 'Cartier', mark: 'Cartier', serif: true },
    { id: 'rolex', ko: '롤렉스', en: 'Rolex', mark: 'ROLEX', serif: true },
    { id: 'rm', ko: '리차드밀', en: 'Richard Mille', mark: 'RM' },
    { id: 'vc', ko: '바쉐론 콘스탄틴', en: 'Vacheron Constantin', mark: 'VC', serif: true },
    { id: 'ap', ko: '오데마피게', en: 'Audemars Piguet', mark: 'AP', serif: true },
    { id: 'hublot', ko: '위블로', en: 'Hublot', mark: 'HUBLOT' },
    { id: 'tudor', ko: '튜더', en: 'Tudor', mark: 'TUDOR' },
    { id: 'patek', ko: '파텍필립', en: 'Patek Philippe', mark: 'PP', serif: true },
    { id: 'omega', ko: '오메가', en: 'Omega', mark: 'Ω' }
  ];
  const brandById = Object.fromEntries(BRANDS.map(b => [b.id, b]));

  const DIALS = {
    White: '#f4f4f1', Black: '#16171a', Blue: '#1d3f8a', 'Ice Blue': '#bfe3ee', Green: '#1f6b46', 'Olive': '#5d6b3a',
    Grey: '#6f747c', Silver: '#cfd3d8', Champ: '#d8c08a', Choco: '#5a3624', Brown: '#6b4428', Rose: '#e7b7a6', Pink: '#f2a7bd',
    Turquoise: '#36c1c4', Meteo: '#7d8088', Salmon: '#f0a385', Slate: '#4b5563', Lavender: '#b9a7dc', Pistachio: '#c8dfa4',
    Tiffany: '#81d8d0', 'Candy Pink': '#f6a6c8', Beige: '#e5d6b8', Red: '#a3202b', Purple: '#5b2b82', Yellow: '#e8c547', Orange: '#f07b26'
  };
  const METALS = {
    SS: { name: 'SS', c1: '#f1f3f5', c2: '#9aa1a9', c3: '#5f666e' },
    WG: { name: 'WG', c1: '#f4f5f7', c2: '#a8adb4', c3: '#6a7078' },
    PT: { name: 'PT', c1: '#f6f7f9', c2: '#b2b7be', c3: '#727880' },
    YG: { name: 'YG', c1: '#fbe7a6', c2: '#d4a93f', c3: '#8c6a1c' },
    RG: { name: 'RG', c1: '#f9d3c0', c2: '#d08f6e', c3: '#8e5236' },
    TI: { name: 'TI', c1: '#d9dadb', c2: '#8a8c8f', c3: '#4d4f52' },
    CER: { name: 'Ceramic', c1: '#3a3b3f', c2: '#1d1e21', c3: '#08080a' },
    'SS/YG': { name: 'SS/YG', c1: '#f1f3f5', c2: '#c9a24a', c3: '#5f666e', two: true },
    'SS/RG': { name: 'SS/RG', c1: '#f1f3f5', c2: '#cf8f6f', c3: '#5f666e', two: true }
  };

  // [brand, lineKo, family, ref, size, metal, bezel, dial, variant, strap, shape, retailHKD, marketHKD, flags]
  // shape: round | octa | cushion | tonneau | rect | barrel ; strap: bracelet | rubber | leather | jubilee | fabric
  const RAW = [
    ['rolex', '데이토나', 'Cosmograph Daytona', '126500LN-0001', '40mm', 'SS', 'Ceramic Bezel', 'White', 'Index', 'Oyster', 'round', 136200, 269800, { chrono: 1, bezel: '#111' }],
    ['rolex', '데이토나', 'Cosmograph Daytona', '126500LN-0002', '40mm', 'SS', 'Ceramic Bezel', 'Black', 'Index', 'Oyster', 'round', 136200, 228000, { chrono: 1, bezel: '#111' }],
    ['rolex', '데이토나', 'Cosmograph Daytona', '126508-0008', '40mm', 'YG', 'Engraved Bezel', 'Green', 'Index', 'Oyster', 'round', 446700, 631000, { chrono: 1 }],
    ['rolex', '데이토나', 'Cosmograph Daytona', '126518LN-0014', '40mm', 'YG', 'Ceramic Bezel', 'Turquoise', 'Index', 'Oysterflex', 'round', 345100, 750000, { chrono: 1, bezel: '#111' }],
    ['rolex', '데이토나', 'Cosmograph Daytona', '126506-0001', '40mm', 'PT', 'Ceramic Bezel', 'Ice Blue', 'Index', 'Oyster', 'round', 684000, 898067, { chrono: 1, bezel: '#5a3a2a' }],
    ['rolex', '데이토나', 'Cosmograph Daytona', '126515LN-0010', '40mm', 'RG', 'Ceramic Bezel', 'Choco', 'Index', 'Oysterflex', 'round', 363000, 374000, { chrono: 1, bezel: '#111' }],
    ['rolex', '지엠티마스터2', 'GMT-Master II', '126710BLNR-0002', '40mm', 'SS', 'Ceramic Bezel', 'Black', '', 'Jubilee', 'round', 97100, 143000, { bezel2: ['#1d3f8a', '#111'] }],
    ['rolex', '지엠티마스터2', 'GMT-Master II', '126710GRNR-0003', '40mm', 'SS', 'Ceramic Bezel', 'Black', '', 'Jubilee', 'round', 97100, 157333, { bezel2: ['#555a60', '#111'] }],
    ['rolex', '지엠티마스터2', 'GMT-Master II', '126720VTNR-0002', '40mm', 'SS', 'Ceramic Bezel', 'Black', '', 'Jubilee', 'round', 101500, 130824, { bezel2: ['#1f6b46', '#111'], lefty: 1 }],
    ['rolex', '서브마리너', 'Submariner Date', '126610LN-0001', '41mm', 'SS', 'Ceramic Bezel', 'Black', '', 'Oyster', 'round', 84100, 98500, { bezel: '#111' }],
    ['rolex', '서브마리너', 'Submariner Date', '126610LV-0002', '41mm', 'SS', 'Ceramic Bezel', 'Black', '', 'Oyster', 'round', 87300, 112000, { bezel: '#1f6b46' }],
    ['rolex', '서브마리너', 'Submariner', '124060-0001', '41mm', 'SS', 'Ceramic Bezel', 'Black', 'No Date', 'Oyster', 'round', 76400, 86500, { bezel: '#111' }],
    ['rolex', '데이데이트', 'Day-Date 40', '228238-0004', '40mm', 'YG', 'Fluted Bezel', 'Black', 'Bag-dia', 'President', 'round', 446100, 567887, { fluted: 1 }],
    ['rolex', '데이데이트', 'Day-Date 40', '228235JG-0003', '40mm', 'RG', 'Fluted Bezel', 'Green', 'Aventurine Bag-dia', 'President', 'round', 531400, 1350000, { fluted: 1 }],
    ['rolex', '데이저스트', 'Datejust 41', '126334-0028', '41mm', 'SS/WG', 'Fluted Bezel', 'Green', 'Index', 'Jubilee', 'round', 96100, 130000, { fluted: 1 }],
    ['rolex', '데이저스트', 'Datejust 41', '126334-0034', '41mm', 'WG', 'Fluted Bezel', 'Olive', 'Ombre Index', 'Jubilee', 'round', 96100, 142000, { fluted: 1 }],
    ['rolex', '데이저스트', 'Datejust 36', '126234-0051', '36mm', 'SS/WG', 'Fluted Bezel', 'Green', 'Index', 'Jubilee', 'round', 81900, 107000, { fluted: 1 }],
    ['rolex', '오이스터 퍼페츄얼', 'Oyster Perpetual 41', '134300-0010', '41mm', 'SS', 'Domed Bezel', 'Turquoise', 'Multicoloured Index', 'Oyster', 'round', 57000, 129000, {}],
    ['rolex', '오이스터 퍼페츄얼', 'Oyster Perpetual 36', '126000-0006', '36mm', 'SS', 'Smooth Bezel', 'Turquoise', 'Index', 'Oyster', 'round', 54400, 116557, {}],
    ['rolex', '오이스터 퍼페츄얼', 'Oyster Perpetual 36', '126000-0008', '36mm', 'SS', 'Smooth Bezel', 'Candy Pink', 'Index', 'Oyster', 'round', 54400, 78833, {}],
    ['rolex', '오이스터 퍼페츄얼', 'Oyster Perpetual 41', '134300-0006', '41mm', 'SS', 'Domed Bezel', 'Pistachio', 'Index', 'Oyster', 'round', 57000, 73500, {}],
    ['rolex', '스카이드웰러', 'Sky-Dweller', '336934-0002', '42mm', 'SS/WG', 'Fluted Bezel', 'Green', 'Index', 'Jubilee', 'round', 145100, 197000, { fluted: 1 }],
    ['rolex', '익스플로러', 'Explorer', '224270-0001', '40mm', 'SS', 'Smooth Bezel', 'Black', '', 'Oyster', 'round', 66900, 72000, {}],
    ['rolex', '요트마스터', 'Yacht-Master 42', '226659-0002', '42mm', 'WG', 'Ceramic Bezel', 'Black', '', 'Oysterflex', 'round', 243300, 258000, { bezel: '#222' }],
    ['rolex', '랜드웰러', 'Land-Dweller 40', '127336-0001', '40mm', 'PT', 'Fluted Bezel', 'Ice Blue', '', 'Flat Jubilee', 'round', 553300, 1038431, { fluted: 1 }],

    ['patek', '노틸러스', 'Nautilus', '5811/1G-001', '41mm', 'WG', 'Bezel', 'Blue', '', 'Bracelet', 'cushion', 597000, 1710000, {}],
    ['patek', '노틸러스', 'Nautilus', '5712/1R-001', '40mm', 'RG', 'Bezel', 'Brown', '', 'Bracelet', 'cushion', 711000, 2314502, { sub: 1 }],
    ['patek', '노틸러스', 'Nautilus', '5712G-001', '40mm', 'WG', 'Bezel', 'Grey', '', 'Alligator leather', 'cushion', 520000, 679000, { sub: 1, strap: 'leather' }],
    ['patek', '노틸러스', 'Nautilus', '5990/1R-001', '40.5mm', 'RG', 'Bezel', 'Blue', 'Travel Time Chrono', 'Bracelet', 'cushion', 1014000, 2445000, { chrono: 1 }],
    ['patek', '노틸러스', 'Nautilus', '5726/1A-014', '40.5mm', 'SS', 'Bezel', 'Blue', 'Annual Calendar', 'Bracelet', 'cushion', 457000, 1150000, { sub: 1 }],
    ['patek', '노틸러스', 'Nautilus', '7118/1A-001', '35.2mm', 'SS', 'Bezel', 'Blue', '', 'Bracelet', 'cushion', 261000, 658000, {}],
    ['patek', '노틸러스', 'Nautilus', '7118/1200R-001', '35.2mm', 'RG', 'Dia Bezel', 'Silver', '', 'Bracelet', 'cushion', 557000, 1668000, { dia: 1 }],
    ['patek', '아쿠아넛', 'Aquanaut', '5167A-001', '40.8mm', 'SS', 'Bezel', 'Black', 'Tropical', 'Rubber', 'cushion', 198500, 763297, { strap: 'rubber', grid: 1 }],
    ['patek', '아쿠아넛', 'Aquanaut', '5167R-001', '40.8mm', 'RG', 'Bezel', 'Choco', '', 'Rubber', 'cushion', 389500, 1025000, { strap: 'rubber', grid: 1 }],
    ['patek', '아쿠아넛', 'Aquanaut Luce', '5267/200A-010', '38.8mm', 'SS', 'Dia Bezel', 'White', '', 'Rubber', 'cushion', 179300, 731000, { strap: 'rubber', grid: 1, dia: 1 }],
    ['patek', '아쿠아넛', 'Aquanaut Chronograph', '5968A-001', '42.2mm', 'SS', 'Bezel', 'Black', 'Orange', 'Rubber', 'cushion', 449700, 1288772, { strap: 'rubber', grid: 1, chrono: 1, accent: '#f07b26' }],
    ['patek', '칼라트라바', 'Calatrava', '5227G-010', '39mm', 'WG', 'Bezel', 'Ivory', '', 'Alligator leather', 'round', 279000, 268000, { strap: 'leather' }],
    ['patek', '컴플리케이션', 'Complications', '5961P-001', '40.5mm', 'PT', 'Bezel', 'Blue', 'Annual Calendar Chrono', 'Alligator leather', 'round', 980000, 1070000, { strap: 'leather', chrono: 1 }],
    ['patek', '그랜드 컴플리케이션', 'Grand Complications', '5270P-014', '41mm', 'PT', 'Bezel', 'Salmon', 'Perpetual Chrono', 'Alligator leather', 'round', 1720000, 2380000, { strap: 'leather', chrono: 1 }],

    ['ap', '로열 오크', 'Royal Oak', '15510ST.OO.1320ST.06', '41mm', 'SS', 'Bezel', 'Blue', '50th Anniversary', 'Bracelet', 'octa', 209000, 418000, { tapis: 1 }],
    ['ap', '로열 오크', 'Royal Oak', '15500ST.OO.1220ST.01', '41mm', 'SS', 'Bezel', 'Black', '', 'Bracelet', 'octa', 198000, 331000, { tapis: 1 }],
    ['ap', '로열 오크', 'Royal Oak Chronograph', '26240ST.OO.1320ST.02', '41mm', 'SS', 'Bezel', 'Blue', '', 'Bracelet', 'octa', 279000, 468000, { tapis: 1, chrono: 1 }],
    ['ap', '로열 오크', 'Royal Oak Jumbo', '16202ST.OO.1240ST.02', '39mm', 'SS', 'Bezel', 'Blue', 'Extra-Thin', 'Bracelet', 'octa', 291000, 742750, { tapis: 1 }],
    ['ap', '로열 오크', 'Royal Oak', '15407ST.OO.1220ST.02', '41mm', 'SS', 'Bezel', 'Salmon', 'Double Balance Openworked', 'Bracelet', 'octa', 629000, 1614910, { open: 1 }],
    ['ap', '로열 오크', 'Royal Oak', '15550BA.OO.1356BA.01', '37mm', 'YG', 'Bezel', 'Tiffany', '', 'Bracelet', 'octa', 549000, 1489028, { tapis: 1 }],
    ['ap', '로열 오크 오프쇼어', 'Royal Oak Offshore', '26420SO.OO.A600CA.01', '43mm', 'SS', 'Ceramic', 'Black', 'Chronograph', 'Rubber', 'octa', 239000, 268000, { tapis: 1, chrono: 1, strap: 'rubber' }],
    ['ap', '코드 11.59', 'Code 11.59', '15210ST.OO.A002KB.01', '41mm', 'SS', 'Bezel', 'Blue', 'Selfwinding', 'Leather', 'round', 199000, 152000, { strap: 'leather' }],

    ['cartier', '산토스', 'Santos de Cartier', 'WSSA0018', '39.8mm', 'SS', 'Bezel', 'Silver', 'Large', 'Bracelet', 'rect', 57500, 52500, { roman: 1 }],
    ['cartier', '산토스', 'Santos-Dumont', 'WGSA0021', '43.5mm', 'RG', 'Bezel', 'Silver', 'XL', 'Leather', 'rect', 103000, 88000, { roman: 1, strap: 'leather' }],
    ['cartier', '탱크', 'Tank Louis Cartier', 'WGTA0011', '33.7mm', 'YG', 'Bezel', 'Silver', 'Large', 'Leather', 'rect', 98500, 96000, { roman: 1, strap: 'leather' }],
    ['cartier', '탱크', 'Tank', 'WHTA0032', '32.6 x 25.7mm', 'PT', 'Bezel', 'Silver', 'Normale', 'Bracelet', 'rect', 530000, 1333333, { roman: 1 }],
    ['cartier', '발롱 블루', 'Ballon Bleu', 'WSBB0040', '40mm', 'SS', 'Bezel', 'Silver', '', 'Bracelet', 'round', 60500, 46500, { roman: 1 }],
    ['cartier', '팬더', 'Panthère de Cartier', 'WSPN0007', '27mm', 'SS', 'Bezel', 'Silver', 'Medium', 'Bracelet', 'rect', 48000, 41000, { roman: 1 }],

    ['vc', '오버시즈', 'Overseas', '4500V/110A-B128', '41mm', 'SS', 'Bezel', 'Blue', 'Self-winding', 'Bracelet', 'round', 225000, 238000, {}],
    ['vc', '오버시즈', 'Overseas Chronograph', '5500V/110A-B148', '42.5mm', 'SS', 'Bezel', 'Blue', '', 'Bracelet', 'round', 285000, 302000, { chrono: 1 }],
    ['vc', '패트리모니', 'Patrimony', '85180/000R-9248', '40mm', 'RG', 'Bezel', 'Silver', 'Self-winding', 'Leather', 'round', 220000, 168000, { strap: 'leather' }],
    ['vc', '히스토릭', 'Historiques 222', '4200H/222J-B935', '37mm', 'YG', 'Bezel', 'Champ', '', 'Bracelet', 'round', 520000, 612000, {}],

    ['rm', 'RM 011', 'RM 011', 'RM011-FM', '50 x 40mm', 'TI', 'Bezel', 'Grey', 'Felipe Massa', 'Rubber', 'tonneau', 1350000, 2480000, { strap: 'rubber', skel: 1 }],
    ['rm', 'RM 035', 'RM 035-02', 'RM035-02', '49.9 x 42.7mm', 'CER', 'Bezel', 'Black', 'Rafael Nadal', 'Rubber', 'tonneau', 1180000, 2150000, { strap: 'rubber', skel: 1 }],
    ['rm', 'RM 67', 'RM 67-01', 'RM67-01-TI', '38.7 x 47.5mm', 'TI', 'Bezel', 'Grey', 'Extra Flat', 'Rubber', 'tonneau', 1060000, 1680000, { strap: 'rubber', skel: 1 }],
    ['rm', 'RM 07', 'RM 07-01', 'RM07-01-RG', '45.7 x 31.4mm', 'RG', 'Dia Bezel', 'Pink', 'Ladies', 'Rubber', 'tonneau', 1100000, 1420000, { strap: 'rubber', dia: 1 }],

    ['hublot', '빅뱅', 'Big Bang Unico', '441.NX.1171.RX', '42mm', 'TI', 'Bezel', 'Grey', 'Titanium', 'Rubber', 'round', 165000, 98000, { strap: 'rubber', skel: 1, screws: 1 }],
    ['hublot', '클래식 퓨전', 'Classic Fusion', '511.NX.1171.RX', '45mm', 'TI', 'Bezel', 'Black', '', 'Rubber', 'round', 64000, 39500, { strap: 'rubber', screws: 1 }],
    ['hublot', '스피릿 오브 빅뱅', 'Spirit of Big Bang', '642.NX.0170.RX', '42mm', 'TI', 'Bezel', 'Grey', 'Chronograph', 'Rubber', 'tonneau', 198000, 128000, { strap: 'rubber', skel: 1 }],

    ['tudor', '블랙베이', 'Black Bay 58', 'M79030N-0001', '39mm', 'SS', 'Bezel', 'Black', '', 'Bracelet', 'round', 31200, 26500, { bezel: '#111', snow: 1 }],
    ['tudor', '블랙베이', 'Black Bay GMT', 'M79830RB-0001', '41mm', 'SS', 'Bezel', 'Black', 'Pepsi', 'Bracelet', 'round', 33600, 29800, { bezel2: ['#a3202b', '#1d3f8a'], snow: 1 }],
    ['tudor', '펠라고스', 'Pelagos 39', 'M25407N-0001', '39mm', 'TI', 'Bezel', 'Black', '', 'Bracelet', 'round', 36800, 33500, { bezel: '#111', snow: 1 }],
    ['tudor', '블랙베이', 'Black Bay Chrono', 'M79360N-0002', '41mm', 'SS', 'Bezel', 'White', 'Panda', 'Bracelet', 'round', 42800, 39800, { bezel: '#111', chrono: 1 }],

    ['omega', '스피드마스터', 'Speedmaster Moonwatch', '310.30.42.50.01.001', '42mm', 'SS', 'Bezel', 'Black', 'Professional', 'Bracelet', 'round', 58600, 49800, { bezel: '#111', chrono: 1 }],
    ['omega', '씨마스터', 'Seamaster Diver 300M', '210.30.42.20.03.001', '42mm', 'SS', 'Ceramic Bezel', 'Blue', '', 'Bracelet', 'round', 45800, 38500, { bezel: '#1d3f8a', waves: 1 }],
    ['omega', '씨마스터', 'Seamaster Aqua Terra', '220.10.41.21.03.004', '41mm', 'SS', 'Bezel', 'Blue', '', 'Bracelet', 'round', 48200, 39000, {}]
  ];

  const DIAL_FIX = { Ivory: '#efe8d6' };

  const MODELS = RAW.map((r, i) => {
    const [brand, line, family, ref, size, metal, bezel, dial, variant, strapName, shape, retail, market, f] = r;
    const rr = rng('m' + ref);
    const name = [family, dial, variant, strapName].filter(Boolean).join(' ').replace(/\s+/g, ' ');
    const flags = f || {};
    const strap = flags.strap || (/rubber|flex/i.test(strapName) ? 'rubber' : /leather/i.test(strapName) ? 'leather' : /jubilee|president/i.test(strapName) ? 'jubilee' : 'bracelet');
    const counts = { new: Math.floor(10 + rr() * 380), used: Math.floor(rr() * 90), wanted: Math.floor(rr() * 42) };
    if (brand === 'rm') { counts.new = Math.floor(3 + rr() * 20); counts.used = Math.floor(rr() * 12); }
    const released = new Date(2017 + Math.floor(rr() * 9), Math.floor(rr() * 12), 1);
    const discontinued = rr() < 0.08;
    // history: 400 daily points ending at market
    const hr = rng('h' + ref);
    const hist = new Array(400);
    let p = market * (0.82 + hr() * 0.3);
    const drift = Math.log(market / p) / 400;
    for (let d = 0; d < 400; d++) { p = p * Math.exp(drift + gauss(hr) * 0.011); hist[d] = p; }
    const scale = market / hist[399];
    for (let d = 0; d < 400; d++) hist[d] = Math.round(hist[d] * scale);
    const dayChange = (hist[399] - hist[398]) / hist[398] * 100 + gauss(rr) * 2.2;
    return {
      id: btoa(ref).replace(/=+$/, '').replace(/\//g, '_').replace(/\+/g, '-'),
      idx: i, brand, line, family, ref, size, metal, bezel, dial, variant, strapName, shape, strap, retail, price: market,
      name, specs: [size, METALS[metal] ? METALS[metal].name : metal, bezel !== 'Bezel' ? bezel : null].filter(Boolean).join(', '),
      premium: retail ? (market / retail - 1) * 100 : null, counts, released, discontinued, hist, dayChange, flags,
      dialColor: DIALS[dial] || DIAL_FIX[dial] || '#cfd3d8'
    };
  });
  const modelById = Object.fromEntries(MODELS.map(m => [m.id, m]));

  // ---------- dealers ----------
  const COLORS = ['Onyx', 'Ash', 'Jade', 'Pearl', 'Teal', 'Sage', 'Crimson', 'Slate', 'Coral', 'Blue', 'Cobalt', 'Olive', 'Bronze', 'Indigo', 'Ruby', 'Mint', 'Rust', 'Amber', 'Ivory', 'Plum'];
  const ANIMALS = ['Wren', 'Raven', 'Ibis', 'Stag', 'Koi', 'Fox', 'Owl', 'Falcon', 'Heron', 'Tern', 'Elk', 'Otter', 'Seal', 'Hawk', 'Lynx', 'Crane', 'Puma', 'Swan'];
  const SUFFIX = ['Mube', 'Maifu', 'Vitu', 'Halki', 'Sanmon', 'Kohi', 'Gudor', 'Zepa', 'Andin', 'Gunel', 'Hedor', 'Solho', 'Doso', 'Sejo', 'Rivin', 'Talne', 'Riza', 'Ligu', 'Meldo', 'Naber'];
  const AV_COLORS = ['#ef4444', '#a855f7', '#06b6d4', '#84cc16', '#0ea5e9', '#f97316', '#10b981', '#ec4899', '#6366f1', '#eab308', '#14b8a6', '#f43f5e'];
  const COUNTRIES = [['HK', '홍콩', '🇭🇰'], ['KR', '한국', '🇰🇷'], ['JP', '일본', '🇯🇵'], ['SG', '싱가포르', '🇸🇬'], ['AE', 'UAE', '🇦🇪'], ['TW', '대만', '🇹🇼']];
  const DEALERS = [];
  {
    const r = rng('dealers');
    for (let i = 0; i < 90; i++) {
      const c = pick(r, COLORS), a = pick(r, ANIMALS);
      const hyphen = r() < 0.6;
      const name = hyphen ? `${c}-${a}-${pick(r, SUFFIX)}` : `${c} ${a}`;
      const verified = r() < 0.72;
      const nReviews = r() < 0.45 ? Math.floor(1 + r() * 7) : 0;
      const reviews = [];
      for (let k = 0; k < nReviews; k++) {
        const replied = r() < 0.75; const stock = replied && r() < 0.55;
        const d = new Date(NOW.getTime() - Math.floor(r() * 120) * 864e5);
        reviews.push({ replied, stock, date: d });
      }
      const replied = reviews.filter(x => x.replied).length;
      const country = r() < 0.7 ? COUNTRIES[0] : pick(r, COUNTRIES);
      DEALERS.push({
        id: 'd' + i, name, initials: name.split(/[-\s]/).slice(0, 2).map(s => s[0]).join('').toUpperCase(),
        color: pick(r, AV_COLORS), verified, member: !verified, store: r() < 0.18, country,
        reviews, responseRate: reviews.length ? Math.round(replied / reviews.length * 100) : null,
        stockAccuracy: replied ? Math.round(reviews.filter(x => x.stock).length / replied * 100) : null
      });
    }
  }
  const dealerById = Object.fromEntries(DEALERS.map(d => [d.id, d]));

  function listingsFor(model, kind) {
    const r = rng(model.ref + kind);
    const n = Math.min(model.counts[kind], 60);
    const out = [];
    for (let i = 0; i < n; i++) {
      const dealer = DEALERS[Math.floor(r() * DEALERS.length)];
      const hours = Math.floor(Math.pow(r(), 1.6) * 24 * 14) + 1;
      const wy = 2025 + (r() < 0.75 ? 1 : 0); const wm = 1 + Math.floor(r() * 11);
      const factor = kind === 'used' ? 0.9 + gauss(r) * 0.03 : 1 + gauss(r) * 0.018;
      out.push({
        id: model.ref + kind + i, dealer, kind, hours,
        price: kind === 'wanted' ? null : Math.round(model.price * factor / 500) * 500,
        warranty: kind === 'used' && r() < 0.3 ? `${wy - 2}·풀세트` : `${wy}.${String(wm).padStart(2, '0')}`,
        condition: kind === 'used' ? pick(r, ['A급', 'S급', '미착용', '사용감 적음']) : '신품'
      });
    }
    out.sort((a, b) => a.hours - b.hours);
    return out;
  }

  // ---------- currency ----------
  const FX = { HKD: { sym: 'HK$', rate: 1 }, KRW: { sym: '₩', rate: 186.4 }, USD: { sym: '$', rate: 0.1284 }, JPY: { sym: '¥', rate: 19.6 } };
  function fmtMoney(hkd, cur) {
    if (hkd == null) return '—';
    const c = FX[cur] || FX.HKD; const v = hkd * c.rate;
    return c.sym + Math.round(v).toLocaleString('en-US');
  }
  function fmtKRW(won) { return '₩' + Math.round(won).toLocaleString('ko-KR'); }
  function fmtPct(p, opts) { if (p == null || isNaN(p)) return '—'; const s = p > 0 ? '+' : p < 0 ? '−' : ''; return s + Math.abs(p).toFixed((opts && opts.dp) != null ? opts.dp : 1) + '%'; }
  function ago(hours) { if (hours < 24) return hours + '시간'; return Math.floor(hours / 24) + '일'; }

  // ---------- photo renderer (real photos, see assets/photos.js + credits.html) ----------
  function photoKey(m) { const P = window.WH_PHOTOS || { byRef: {} }; return P.byRef[m.ref] || null; }
  function watchImg(m, opts) {
    opts = opts || {};
    const k = photoKey(m);
    const src = k ? 'assets/img/' + k + '.jpg' : 'assets/img/' + (window.WH_PHOTOS ? window.WH_PHOTOS.byRef['126500LN-0001'] : '') + '.jpg';
    return `<img class="watch-img" src="${src}" alt="${esc(m.name || m.family || '')}" loading="${opts.eager ? 'eager' : 'lazy'}" decoding="async">`;
  }
  function hexToRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function luminance(h) { const [r, g, b] = hexToRgb(h); return (0.299 * r + 0.587 * g + 0.114 * b) / 255; }
  function shade(h, amt) { const [r, g, b] = hexToRgb(h); const f = (c) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt)))); return '#' + [f(r), f(g), f(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ---------- store (localStorage) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('wh_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('wh_' + k, JSON.stringify(v)); } catch (e) { } }
  };

  window.WH = { BRAND_NAME, BRANDS, brandById, MODELS, modelById, DEALERS, dealerById, COUNTRIES, listingsFor, FX, fmtMoney, fmtKRW, fmtPct, ago, watchImg, esc, rng, pick, store, NOW, shade, luminance };
})();
