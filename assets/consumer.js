/* Watch HUB — consumer site (vanilla JS SPA, hash router) */
(function () {
  'use strict';
  const { MODELS, brandById, watchImg, esc, rng, store } = WH;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const won = (v) => Math.round(v).toLocaleString('ko-KR');
  const KRW = 186;
  const svg = (p, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24">${p}</svg>`;
  const IC = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', arrow: '<path d="M7 17 17 7M8 7h9v9"/>', chevD: '<path d="m6 9 6 6 6-6"/>', chevU: '<path d="m6 15 6-6 6 6"/>', chevR: '<path d="m9 6 6 6-6 6"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>', hand: '<path d="m4 13 4 4 3-1 4 4 5-5-6-6-3 1-3-3z"/><path d="m11 16 3-3"/>', book: '<path d="M12 6c-2-1.5-5-2-8-2v14c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v14"/>', receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    heart: '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10z"/>', pause: '<rect x="7" y="6" width="3" height="12" rx="1" fill="currentColor"/><rect x="14" y="6" width="3" height="12" rx="1" fill="currentColor"/>', play: '<path d="M8 6v12l10-6z" fill="currentColor"/>', chat: '<path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7z"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };

  // ---------- consumer catalog ----------
  const RAIL = [
    ['all', '전체보기', 'All'], ['rolex', '롤렉스', 'ROLEX', 1], ['omega', '오메가', 'Ω\nOMEGA'], ['ap', '오데마 피게', 'AUDEMARS\nPIGUET', 1], ['patek', '파텍 필립', 'PATEK\nPHILIPPE', 1], ['cartier', '까르띠에', 'Cartier', 1],
    ['tudor', '튜더', 'TUDOR'], ['breitling', '브라이틀링', 'BREITLING'], ['iwc', 'IWC', 'IWC'], ['vc', '바쉐론 콘스탄틴', 'VACHERON\nCONSTANTIN', 1], ['panerai', '파네라이', 'PANERAI'], ['tag', '태그호이어', 'TAG\nHEUER'],
    ['hublot', '위블로', 'HUBLOT'], ['hermes', '에르메스', 'HERMÈS', 1], ['chanel', '샤넬', 'CHANEL'], ['bvlgari', '불가리', 'BVLGARI'], ['blancpain', '블랑팡', 'BLANCPAIN', 1], ['jlc', '예거 르쿨트르', 'JAEGER\nLECOULTRE', 1],
    ['piaget', '피아제', 'PIAGET', 1], ['lange', '랑에 운트 죄네', 'A.LANGE\n& SÖHNE', 1], ['breguet', '브레게', 'Breguet', 1], ['rm', '리차드밀', 'RICHARD\nMILLE'], ['etc', '기타', '···']
  ];
  const railById = Object.fromEntries(RAIL.map(r => [r[0], r]));
  const EXTRA = [
    { brand: 'blancpain', ko: '피프티 패덤즈 바티스카프', family: 'Fifty Fathoms Bathyscaphe', ref: '5100-1140-O52A', metal: 'SS', dial: 'Blue', dialColor: '#1d3f8a', strap: 'leather', shape: 'round', flags: { bezel: '#1d3f8a', strap: 'leather' }, mark: 'BLANCPAIN', krw: 13900000 },
    { brand: 'tag', ko: '까레라 크로노그래프', family: 'Carrera Chronograph', ref: 'CV2014', metal: 'SS', dial: 'Black', dialColor: '#16171a', strap: 'bracelet', shape: 'round', flags: { chrono: 1, bezel: '#111' }, mark: 'TAG HEUER', krw: 3100000 },
    { brand: 'panerai', ko: '루미노르 마리나', family: 'Luminor Marina', ref: 'PAM01312', metal: 'SS', dial: 'Black', dialColor: '#16171a', strap: 'leather', shape: 'cushion', flags: { strap: 'leather' }, mark: 'PANERAI', krw: 7200000 },
    { brand: 'breitling', ko: '내비타이머 B01', family: 'Navitimer B01 43', ref: 'AB0138211B1A1', metal: 'SS', dial: 'Black', dialColor: '#16171a', strap: 'bracelet', shape: 'round', flags: { chrono: 1, fluted: 1 }, mark: 'BREITLING', krw: 8400000 },
    { brand: 'jlc', ko: '마스터 컨트롤', family: 'Master Control Date', ref: 'Q4018420', metal: 'SS', dial: 'Silver', dialColor: '#e9eaec', strap: 'leather', shape: 'round', flags: { strap: 'leather' }, mark: 'JAEGER-LECOULTRE', serif: 1, krw: 9900000 },
  ];
  const DIAL_KO = { White: '화이트', Black: '블랙', Blue: '블루', 'Ice Blue': '아이스블루', Green: '그린', Olive: '올리브', Grey: '그레이', Silver: '실버', Champ: '샴페인', Choco: '초코', Brown: '브라운', Rose: '로즈', Pink: '핑크', Turquoise: '터콰이즈', Salmon: '살몬', Tiffany: '티파니', 'Candy Pink': '캔디핑크', Pistachio: '피스타치오' };
  const MARKET = [
    ...MODELS.map(m => ({ ...m, ko: m.line + (/\d/.test(m.line) ? '' : ((m.family.match(/\b(\d{2})\b/) || [])[1] ? ' ' + m.family.match(/\b(\d{2})\b/)[1] : '')), krw: Math.round(m.price * KRW * (0.86 + rng(m.ref + 'k')() * 0.1) / 10000) * 10000 })),
    ...EXTRA.map(e => ({ ...e, name: e.family, specs: e.metal }))
  ].map((x, i) => ({ ...x, mid: 'L' + i, bg: Math.floor(rng('bg' + x.ref)() * 3) }));
  const marketById = Object.fromEntries(MARKET.map(x => [x.mid, x]));
  const brandKo = (id) => (railById[id] && railById[id][1]) || (brandById[id] && brandById[id].ko) || '';
  // daily "new" picks
  const todays = [MARKET.find(x => x.brand === 'blancpain'), MARKET.find(x => x.ref === '126334-0028'), MARKET.find(x => x.brand === 'tag'), MARKET.find(x => x.ref === '210.30.42.20.03.001')].filter(Boolean);

  const SELLERS = ['시계좋아', 'Timekeeper', '강남워치', '오이스터맨', '빈티지헌터', 'WatchNerd', '한남동시계방', '노틸러스러버'];
  const fav = { get: () => store.get('c_fav', []), has: (id) => store.get('c_fav', []).includes(id), toggle(id) { const f = store.get('c_fav', []); store.set('c_fav', f.includes(id) ? f.filter(x => x !== id) : [id, ...f]); } };

  // ---------- magazine ----------
  const ARTICLES = [
    { id: 'design-first', cat: '브랜드 & 컬처', title: '독립 시계 브랜드가 ‘설계’로 승부하는 법', lead: '규모로 대형 메종과 경쟁할 수 없는 독립 브랜드는 무엇으로 차별화할까. 최근 신작 세 개를 통해 설계 철학과 그 검증 과제를 짚어본다.', model: 'M79030N-0001',
      body: [['', '독립 브랜드의 신작을 볼 때 가장 먼저 확인할 것은 ‘무엇을 포기했는가’다. 생산 규모가 작은 브랜드는 모든 것을 다 잘할 수 없다. 그래서 좋은 독립 브랜드일수록 케이스 두께, 무브먼트 마감, 가격 가운데 하나를 분명하게 고른다.'], ['두께를 고른 브랜드', '얇은 케이스를 목표로 한 시계는 대개 핸드와인딩이나 마이크로 로터를 택한다. 착용감은 좋아지지만 파워리저브와 내충격성에서 손해를 본다. 스펙표의 숫자보다 ‘어떤 사용자를 상정했는가’를 읽는 편이 정확하다.'], ['마감을 고른 브랜드', '수작업 앵글라주와 블랙 폴리싱을 전면에 내세운 브랜드는 생산량이 극히 적다. 이 경우 문제는 애프터서비스다. 부품 수급 기간과 서비스 네트워크를 구매 전에 확인해야 한다.'], ['검증 과제', '신생 브랜드의 시계는 중고 시세 데이터가 거의 없다. 리셀 가치를 기대하기보다 ‘오래 찰 시계인가’를 기준으로 판단하는 게 좋다. Watch HUB 슈퍼검색에서 같은 가격대의 기성 브랜드 매물과 나란히 비교해 보는 것도 방법이다.']] },
    { id: 'thin-case', cat: '워치 인사이트', title: '6mm대 케이스에 담긴 선택', lead: '얇은 시계는 기술 과시가 아니라 설계의 일관성 문제다. 초박형 케이스가 착용감, 내구성, 정비성에 어떤 트레이드오프를 만드는지 정리했다.', model: '5227G-010',
      body: [['', '케이스 두께 1mm는 손목 위에서 생각보다 크게 느껴진다. 셔츠 커프 안으로 들어가느냐 마느냐가 갈리는 지점이 대략 10mm이고, 7mm 아래로 내려가면 ‘차고 있다는 느낌’ 자체가 줄어든다.'], ['무브먼트 높이', '자동 무브먼트에서 가장 두께를 차지하는 것은 로터다. 마이크로 로터나 페리페럴 로터를 쓰면 2mm 가까이 줄일 수 있지만 와인딩 효율은 떨어진다.'], ['소재의 역할', '티타늄 케이스는 가볍고 단단하지만 가공이 어렵다. 얇은 케이스일수록 강성을 확보하기 위해 미들 케이스 설계가 중요해진다.'], ['구매 팁', '초박형 시계는 방수 등급이 낮은 경우가 많다. 일상 착용 시 30m 방수인지, 50m 이상인지 꼭 확인하자.']] },
    { id: 'warranty-date', cat: '구매 가이드', title: '중고 시계, 보증서 날짜가 가격을 바꾸는 이유', lead: '같은 레퍼런스라도 보증서 날짜에 따라 수백만 원씩 차이가 난다. 딜러 시장에서 보증서 날짜가 어떻게 읽히는지 정리했다.', model: '126610LN-0001',
      body: [['', '딜러 시장에서 신품과 중고를 가르는 기준은 ‘착용 여부’보다 ‘보증서 날짜’인 경우가 많다. 최근 날짜의 미착용 시계는 신품으로, 1~2년 지난 시계는 상태가 좋아도 중고 시세에 가깝게 거래된다.'], ['남은 보증 기간', '대부분의 브랜드가 5년 국제 보증을 제공한다. 보증 기간이 많이 남을수록 다음 구매자에게도 매력적이라 가격 방어가 잘 된다.'], ['풀세트의 의미', '보증서, 박스, 태그, 여분 링크까지 갖춘 풀세트는 5~10% 높은 가격에 거래된다. 특히 여분 링크는 잃어버리기 쉬워 체크 포인트다.'], ['확인 방법', 'Watch HUB Pro의 매물 목록에서는 보증서 날짜 필터로 올해, 1년, 3년, 5년 이내 매물만 골라 볼 수 있다.']] },
    { id: 'premium', cat: '마켓 리포트', title: '프리미엄 시세는 어떻게 만들어질까', lead: '리테일가보다 비싸게 거래되는 시계들. 공급, 대기 명단, 딜러 간 거래가 프리미엄을 만드는 구조를 데이터로 살펴본다.', model: '5167A-001',
      body: [['', '프리미엄은 ‘정가로 살 수 없는 사람’이 많을 때 생긴다. 매장 대기 명단이 길수록, 생산량이 적을수록 딜러 시장 가격은 리테일가에서 멀어진다.'], ['딜러 간 거래', '실제 시세는 소비자 플랫폼보다 딜러 간 메신저 그룹에서 먼저 움직인다. 홍콩, 두바이, 싱가포르의 딜러 그룹 호가가 며칠 뒤 국내 플랫폼에 반영되는 패턴이 반복된다.'], ['단종 효과', '단종 발표는 가장 강력한 가격 촉매다. 발표 직후 몇 주 동안 구함(Wanted) 수요가 급증하고 매물이 줄어든다.'], ['읽는 법', '프리미엄률만 보지 말고 ‘구함’ 수와 매물 수의 비율을 함께 보자. 구함이 매물보다 빠르게 늘면 상승 신호다.']] }
  ];

  const HERO = [
    { k: 'GRAND OPEN · 그랜드 오픈', d: '검색부터 거래까지, 시계의 모든 순간을\n한 곳에서 — Watch HUB', bg: 'linear-gradient(160deg,#f6f2ea 0%,#e9dfcf 55%,#d9cbb3 100%)', ref: '126334-0028', rings: '#c9b48e' },
    { k: 'SUPER SEARCH · 슈퍼검색', d: '여러 플랫폼에 흩어진 매물을 한 번에\n원하는 시계를 가장 빠르게 찾으세요', bg: 'linear-gradient(150deg,#eaf6ff 0%,#bfe0f3 50%,#7fa3d8 100%)', ref: '126506-0001', rings: '#ffffff' },
    { k: 'MARKET · 중고장터', d: '사고 싶은 시계도, 팔고 싶은 시계도\n더 쉽고 안전하게', bg: 'linear-gradient(170deg,#f2f4f1 0%,#d7e2d3 60%,#9fb79a 100%)', ref: '126720VTNR-0002', rings: '#ffffff' },
    { k: 'CONCIERGE · 대리구매', d: '구하기 어려운 시계도, 사기 어려운 시계도\nWatch HUB가 대신 찾아드려요', bg: 'radial-gradient(circle at 30% 20%,#ffffff 0%,#d6ecf6 35%,#6d8fc9 100%)', ref: '126500LN-0001', rings: '#ffffff' },
    { k: 'PREMIUM CONCIERGE · 프리미엄 대리구매', d: '검수부터 배송까지 전담 매니저가\n처음부터 끝까지 함께합니다', bg: 'linear-gradient(160deg,#1b1b1f 0%,#0c0c0e 60%,#2a1f14 100%)', ref: '5990/1R-001', dark: 1, rings: '#a07a4a' },
    { k: 'MAGAZINE · 매거진', d: '알면 알수록 달라 보이는 시계 이야기\n에디터가 고른 이번 주 읽을거리', bg: 'linear-gradient(160deg,#fbeef0 0%,#f3d3da 55%,#d9a1ae 100%)', ref: '15550BA.OO.1356BA.01', rings: '#ffffff' }
  ];
  const modelByRef = (ref) => MODELS.find(m => m.ref === ref);

  // ---------- router ----------
  const app = $('#app');
  function parse() { const h = location.hash.replace(/^#/, '') || '/'; const [p, q] = h.split('?'); return { path: p, q: Object.fromEntries(new URLSearchParams(q || '')) }; }
  let heroTimer = null;
  function route() {
    clearInterval(heroTimer);
    const { path, q } = parse();
    const key = path.split('/')[1] || 'home';
    clearInterval(tunnelTimer); cancelAnimationFrame(railRAF);
    paintDock(key);
    let m;
    if (path === '/' || path === '') home();
    else if (path === '/supersearch') superSearch(q);
    else if ((m = path.match(/^\/market\/(.+)$/))) marketDetail(m[1]);
    else if (path === '/market') market(q);
    else if (path === '/concierge') concierge();
    else if ((m = path.match(/^\/magazine\/(.+)$/))) article(m[1]);
    else if (path === '/magazine') magazine(q);
    else if ((m = path.match(/^\/retail\/(.+)$/))) retailBrand(m[1]);
    else if (path === '/retail') retail();
    else if (path === '/favorites') favorites();
    else placeholder(path);
    window.scrollTo(0, 0);
    requestAnimationFrame(reveal);
    document.title = ({ supersearch: '슈퍼검색', market: '중고장터', concierge: '대리구매', magazine: '매거진', retail: '리테일' }[key] ? ({ supersearch: '슈퍼검색', market: '중고장터', concierge: '대리구매', magazine: '매거진', retail: '리테일' }[key] + ' | ') : '') + 'Watch HUB — 한국·일본 중고 시계 통합 검색';
  }
  window.addEventListener('hashchange', route);

  // ---------- pieces ----------
  const logoTile = (id, cls) => { const r = railById[id] || ['etc', '기타', '···']; return `<div class="lg ${r[3] ? 'serif' : ''} ${id === 'all' ? 'all' : ''} ${cls || ''}">${esc(r[2]).replace('\n', '<br>')}</div>`; };
  const pcard = (x) => `<a class="pcard" href="#/market/${x.mid}"><div class="ph ph-bg-${x.bg}"><button class="heart ${fav.has(x.mid) ? 'on' : ''}" data-heart="${x.mid}" aria-label="찜">${svg(IC.heart, 'sm')}</button><div class="w">${watchImg(x)}</div></div>
    <div class="b">${esc(brandKo(x.brand))}</div><div class="n">${esc(x.ko)}</div><div class="r">Ref. ${esc(x.ref.split('-')[0])}</div><div class="p">₩${won(x.krw)}</div></a>`;
  document.addEventListener('click', (e) => { const h = e.target.closest('[data-heart]'); if (!h) return; e.preventDefault(); fav.toggle(h.dataset.heart); h.classList.toggle('on', fav.has(h.dataset.heart)); toast(fav.has(h.dataset.heart) ? '즐겨찾기에 담았어요' : '즐겨찾기에서 뺐어요'); });

  // ---------- home : virtual boutique ----------
  let railRAF = null, tunnelTimer = null;
  function home() {
    const brandsOnRail = ['all', 'rolex', 'patek', 'ap', 'cartier', 'omega', 'tudor', 'vc', 'hublot', 'rm'];
    const platTotals = PLATFORMS.map(p => Math.round(2400 * p.w * (0.8 + rng('pt' + p.id)() * 0.4)));
    const tunnelItems = [...todays, ...MARKET.filter(x => ['5811/1G-001', '15510ST.OO.1320ST.06', 'WSSA0018', '126710BLNR-0002', 'M79030N-0001', '4500V/110A-B128', '511.NX.1171.RX', '310.30.42.50.01.001'].includes(x.ref))];
    const shelfBrands = RAIL.filter(r => !['all', 'etc'].includes(r[0])).slice(0, 16);
    const words = '좋은 시계는 기다리게 만들죠. 그래서 우리가 대신 찾고, 검수하고, 안전하게 손목까지 옮겨드려요.'.split(' ');
    const retailPicks = ['5227G-010', '126610LN-0001', '15510ST.OO.1320ST.06', 'WGTA0011', '310.30.42.50.01.001'].map(modelByRef).filter(Boolean);
    const [lead, ...side] = ARTICLES;
    app.innerHTML = `
      <section class="boutique">
        <div class="b-head">
          <div class="b-eb">Virtual Watch Boutique · Seoul / Tokyo / Hong Kong</div>
          <div class="wordmark-wrap"><h1 class="wordmark"><span>WATCH</span> <span>HUB</span></h1></div>
          <div class="b-sub">흩어진 매물을, 하나의 레일 위에서.</div>
          <div class="pills" id="pills">${brandsOnRail.map(b => `<button data-b="${b}" class="${b === 'all' ? 'on' : ''}">${b === 'all' ? '전체' : esc(brandKo(b))}</button>`).join('')}</div>
        </div>
        <div class="rail-zone" id="railZone" aria-label="시계 레일 — 드래그해서 넘겨보세요">
          <div class="rod"></div>
          <div class="track" id="track"></div>
          <div class="b-count" id="bCount"></div>
          <div class="rail-hint">DRAG · SCROLL ← →</div>
        </div>
      </section>

      <section class="qband"><div class="wrap">
        <div class="eb rv">Super Search</div>
        <div class="q-big rv rv-d1">어디에 있든,<br><em>한 번에</em> 찾아요.</div>
        <form class="q-form rv rv-d2" id="hform" role="search"><input id="hq" autocomplete="off" aria-label="슈퍼검색"><button class="q-go" aria-label="검색">${svg(IC.arrow)}</button></form>
        <div class="q-chips rv rv-d3">${['데이토나', '서브마리너', '노틸러스', '로열 오크', '산토스', '126610', '스피드마스터'].map(t => `<a href="#/supersearch?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>
        <div class="plat-strip rv">${PLATFORMS.map((p, i) => `<div><b data-count="${platTotals[i]}">0</b><small>${p.name} · 오늘 수집</small></div>`).join('')}</div>
      </div></section>

      <section class="sec tunnel-sec"><div class="wrap">
        <div class="sec-h"><div><div class="eb rv">New arrivals</div><h2 class="rv rv-d1">오늘 들어온 <em>시계</em></h2></div><a class="more rv" href="#/market">장터 전체 ${svg(IC.arrow, 'sm')}</a></div>
        <div class="tunnel" id="tunnel"><div class="tunnel-track" id="ttrack">${tunnelItems.map((x, i) => `<a class="tcard" data-i="${i}" href="#/market/${x.mid}"><div class="ph">${watchImg(x)}</div><div class="meta"><div><b>${esc(x.ko)}</b><small>${esc(brandKo(x.brand))} · Ref. ${esc(x.ref.split('-')[0])}</small></div><span class="pr">₩${won(x.krw)}</span></div></a>`).join('')}</div></div>
        <div class="t-ctrl"><button id="tPrev" aria-label="이전">${svg('<path d="M15 6l-6 6 6 6"/>')}</button><button id="tNext" aria-label="다음">${svg(IC.chevR)}</button></div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-h"><div><div class="eb rv">Brand shelf</div><h2 class="rv rv-d1">브랜드 <em>선반</em></h2></div><p class="rv">선반에서 브랜드를 꺼내면 그 브랜드의 중고 매물만 모아 보여드려요.</p></div>
        <div class="shelf rv">${[shelfBrands.slice(0, 8), shelfBrands.slice(8, 16)].map((row, ri) => `<div class="shelf-row ${ri ? 'second' : ''}">${row.map(r => `<a class="bbox" href="#/market?brand=${r[0]}"><div class="cube ${r[3] ? '' : 'sans'}"><span>${esc(r[2]).replace('\n', '<br>')}<small>${esc(r[1])}</small></span></div></a>`).join('')}</div><div class="shelf-board"></div>`).join('')}</div>
      </div></section>

      <section class="story" id="story"><div class="wrap" style="position:relative">
        <div class="eb" style="color:#8c8a85">Watch HUB Concierge</div>
        <p class="big" id="storyBig">${words.map(w => `<span class="w">${/대신|안전하게/.test(w) ? `<em>${esc(w)}</em>` : esc(w)}</span>`).join(' ')}</p>
        <div class="steps-line">${[['01', '신청', '모델과 예산을 알려주세요.'], ['02', '탐색', '딜러 네트워크에서 매물을 찾아 제안해요.'], ['03', '검수', '정품·상태·구성품을 확인해요.'], ['04', '배송', '안전결제 후 보험 배송.']].map(s => `<div class="rv"><b>STEP ${s[0]}</b><strong>${s[1]}</strong><p>${s[2]}</p></div>`).join('')}</div>
        <a class="btn-brass" href="#/concierge">대리구매 신청 ${svg(IC.arrow, 'sm')}</a>
        <div class="story-img">${watchImg(modelByRef('5990/1R-001'))}</div>
      </div></section>

      <section class="sec"><div class="wrap">
        <div class="sec-h"><div><div class="eb rv">Magazine</div><h2 class="rv rv-d1">읽고 나면 <em>달리</em> 보여요</h2></div><a class="more rv" href="#/magazine">매거진 ${svg(IC.arrow, 'sm')}</a></div>
        <div class="edit"><div class="lead-card rv">${magCard(lead)}</div><div class="edit-side">${side.slice(0, 3).map((a, i) => `<div class="rv rv-d${i + 1}">${magCard(a)}</div>`).join('')}</div></div>
      </div></section>

      <section class="sec" style="padding-top:40px"><div class="wrap">
        <div class="sec-h"><div><div class="eb rv">Retail price tags</div><h2 class="rv rv-d1">정가는 <em>태그</em>에</h2></div><a class="more rv" href="#/retail">리테일 ${svg(IC.arrow, 'sm')}</a></div>
        <div class="tags">${retailPicks.map((m, i) => `<a class="ptag rv rv-d${i % 3}" href="#/retail/${m.brand}"><div class="th">${watchImg(m)}</div><b>${esc(m.family)}</b><small>${esc(brandKo(m.brand))} · ${esc(m.ref)}</small><span class="pr">₩${won(Math.round(m.retail * KRW * 1.07 / 10000) * 10000)}</span></a>`).join('')}</div>
      </div></section>`;

    initRail(brandsOnRail);
    initTunnel(tunnelItems.length);
    initStory();
    typePlaceholder($('#hq'), ['데이토나 126500LN', '파텍 노틸러스', '로열 오크 15510', '까르띠에 산토스', '튜더 블랙베이']);
    $('#hform').onsubmit = (e) => { e.preventDefault(); const v = $('#hq').value.trim(); location.hash = '#/supersearch' + (v ? '?q=' + encodeURIComponent(v) : ''); };
  }

  function initRail(brands) {
    const zone = $('#railZone'), track = $('#track'), count = $('#bCount');
    const SP = innerWidth < 760 ? 180 : 240;
    let items = [], offset = 0, vel = -0.35, dragging = false, lastX = 0, target = null, focusIdx = -1, swing = 0;
    const build = (brand) => {
      let list = MARKET.filter(x => brand === 'all' || x.brand === brand);
      const seen = new Set(); list = list.filter(x => { const k = (window.WH_PHOTOS.byRef[x.ref] || x.ref); if (brand === 'all' && seen.has(k)) return false; seen.add(k); return true; }).slice(0, 18);
      while (list.length < 8) list = list.concat(list);
      items = list;
      track.innerHTML = list.map((x, i) => `<div class="hang" data-i="${i}"><span class="hook"></span><span class="strings"></span><div class="card">${watchImg(x, { eager: i < 8 })}</div><div class="tag"><span class="tag-in"><small>${esc(brandKo(x.brand))}</small><b>${esc(x.ko)}</b><span class="pr">₩${won(x.krw)}</span></span></div></div>`).join('');
      track.style.opacity = 0; requestAnimationFrame(() => { track.style.transition = 'opacity .5s'; track.style.opacity = 1; });
      offset = 0; focusIdx = -1;
    };
    build('all');
    const frame = () => {
      if (!document.body.contains(zone)) return cancelAnimationFrame(railRAF);
      const W = zone.clientWidth, total = items.length * SP, cx = W / 2;
      if (target != null) { const d = target - offset; offset += d * 0.12; vel = 0; if (Math.abs(d) < 0.5) target = null; }
      else if (!dragging) { vel += (-0.35 - vel) * 0.02; offset += vel; }
      swing += (vel * 2.2 - swing) * 0.08;
      const els = track.children; let best = 1e9, bi = 0;
      for (let i = 0; i < els.length; i++) {
        let x = ((i * SP + offset) % total + total) % total; if (x > total - SP * 1.5) x -= total;
        const cardW = els[i].offsetWidth; const center = x + cardW / 2 - (W > total ? 0 : 0);
        const dist = Math.abs(center - cx); if (dist < best) { best = dist; bi = i; }
        const s = 1 + 0.34 * Math.max(0, 1 - dist / (SP * 1.4));
        const rot = Math.max(-9, Math.min(9, -swing)) * (1 - Math.min(1, dist / 900) * .5);
        els[i].style.transform = `translateX(${x}px) scale(${s.toFixed(3)}) rotate(${rot.toFixed(2)}deg)`;
        els[i].style.zIndex = String(100 - Math.round(dist / 10));
        els[i].style.filter = dist > SP * 2.2 ? 'saturate(.6) brightness(.97)' : '';
        const tag = els[i].querySelector('.tag'); if (tag) tag.style.top = (els[i].querySelector('.card').offsetHeight - 18) + 'px', tag.style.transform = `translate(-50%,0) scale(${(1 / s).toFixed(3)})`;
      }
      if (bi !== focusIdx) { if (els[focusIdx]) els[focusIdx].classList.remove('focus'); els[bi] && els[bi].classList.add('focus'); focusIdx = bi; const x = items[bi]; if (x) count.textContent = `${String(bi + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')} — ${brandKo(x.brand)} ${x.ko}`; }
      railRAF = requestAnimationFrame(frame);
    };
    cancelAnimationFrame(railRAF); railRAF = requestAnimationFrame(frame);
    let moved = 0;
    zone.addEventListener('pointerdown', e => { dragging = true; moved = 0; lastX = e.clientX; target = null; zone.classList.add('drag'); zone.setPointerCapture(e.pointerId); });
    zone.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); offset += dx; vel = dx; });
    const end = (e) => {
      if (!dragging) return; dragging = false; zone.classList.remove('drag');
      if (moved < 6) { // click
        const h = document.elementFromPoint(e.clientX, e.clientY)?.closest('.hang');
        if (h) { const i = +h.dataset.i; if (i === focusIdx) { location.hash = '#/market/' + items[i].mid; } else { const W = zone.clientWidth; const cur = ((i * SP + offset) % (items.length * SP) + items.length * SP) % (items.length * SP); let xNow = cur > items.length * SP - SP * 1.5 ? cur - items.length * SP : cur; target = offset + (W / 2 - (xNow + h.offsetWidth / 2)); } }
      }
    };
    zone.addEventListener('pointerup', end); zone.addEventListener('pointercancel', end);
    zone.addEventListener('wheel', e => { const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0; if (d) { e.preventDefault(); offset -= d; vel = -d * .3; target = null; } }, { passive: false });
    $$('#pills button').forEach(b => b.onclick = () => { $$('#pills button').forEach(x => x.classList.toggle('on', x === b)); build(b.dataset.b); });
  }

  function initTunnel(n) {
    const cards = $$('#ttrack .tcard'); let cur = 0;
    const paint = () => cards.forEach((c, i) => {
      let d = i - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n;
      const ad = Math.abs(d);
      c.style.transform = `translateX(${d * (innerWidth < 760 ? 170 : 250)}px) translateZ(${-ad * 160}px) rotateY(${d * -28}deg)`;
      c.style.opacity = ad > 3 ? 0 : 1 - ad * 0.18; c.style.zIndex = String(50 - ad); c.style.pointerEvents = ad > 3 ? 'none' : '';
      c.classList.toggle('c', d === 0);
    });
    const go = (k) => { cur = (cur + k + n) % n; paint(); };
    cards.forEach((c, i) => c.addEventListener('click', e => { if (!c.classList.contains('c')) { e.preventDefault(); let d = i - cur; if (d > n / 2) d -= n; if (d < -n / 2) d += n; go(d); restart(); } }));
    $('#tPrev').onclick = () => { go(-1); restart(); }; $('#tNext').onclick = () => { go(1); restart(); };
    let sx = null; const tn = $('#tunnel');
    tn.addEventListener('pointerdown', e => sx = e.clientX); tn.addEventListener('pointerup', e => { if (sx != null && Math.abs(e.clientX - sx) > 40) { go(e.clientX < sx ? 1 : -1); restart(); } sx = null; });
    const restart = () => { clearInterval(tunnelTimer); tunnelTimer = setInterval(() => { if (!document.body.contains(tn)) return clearInterval(tunnelTimer); go(1); }, 3800); };
    paint(); restart();
  }

  function initStory() {
    const ws = $$('#storyBig .w'); const sec = $('#story');
    const onScroll = () => { if (!document.body.contains(sec)) return window.removeEventListener('scroll', onScroll); const r = sec.getBoundingClientRect(); const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height * 0.55))); const lit = Math.round(p * ws.length); ws.forEach((w, i) => w.classList.toggle('lit', i < lit)); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  function typePlaceholder(input, list) {
    let li = 0, ci = 0, del = false;
    const tick = () => { if (!document.body.contains(input)) return; const s = list[li]; if (!del) { ci++; if (ci > s.length) { del = true; return setTimeout(tick, 1400); } } else { ci--; if (ci === 0) { del = false; li = (li + 1) % list.length; } } input.placeholder = s.slice(0, ci) + (input.value ? '' : '▍'); setTimeout(tick, del ? 35 : 85); };
    tick();
  }

  function countUp(el) { const t = +el.dataset.count; const st = performance.now(); const f = (now) => { const p = Math.min(1, (now - st) / 1400); el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))).toLocaleString(); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }

  // reveal-on-scroll for every route
  let io = null;
  function reveal() {
    if (io) io.disconnect();
    io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); $$('[data-count]', e.target).forEach(countUp); io.unobserve(e.target); } }), { threshold: 0.12 });
    $$('.rv').forEach(el => io.observe(el));
    $$('.pgrid > *, .sgrid > *, .mgrid > *, .rlist > a, .steps > div, .tags > *').forEach((el, i) => { if (!el.classList.contains('rv')) { el.classList.add('rv'); el.style.transitionDelay = (i % 4) * 0.06 + 's'; io.observe(el); } });
  }

  // command palette (search)
  function palette() {
    const ov = document.createElement('div'); ov.className = 'pal-ov';
    ov.innerHTML = `<div class="pal" role="dialog" aria-label="검색"><input placeholder="브랜드, 모델, 레퍼런스…" autocomplete="off"><div class="res"></div></div>`;
    document.body.appendChild(ov);
    const inp = $('input', ov), res = $('.res', ov); let items = [], fi = 0;
    const close = () => ov.remove();
    ov.onmousedown = e => { if (e.target === ov) close(); };
    const run = () => { const q = inp.value.trim(); items = q ? matchModels(q).slice(0, 12) : []; fi = 0;
      res.innerHTML = q ? (items.length ? items.map((x, i) => `<a class="it ${i === 0 ? 'f' : ''}" href="#/market/${x.mid}"><div class="th">${watchImg(x)}</div><div><b>${esc(x.ko)}</b><small>${esc(brandKo(x.brand))} · ${esc(x.ref)}</small></div><span class="pr">₩${won(x.krw)}</span></a>`).join('') + `<a class="it" href="#/supersearch?q=${encodeURIComponent(q)}"><div><b>‘${esc(q)}’ 슈퍼검색으로 전체 플랫폼 보기 →</b></div></a>` : `<div class="hint">결과가 없어요. 슈퍼검색에서 다시 찾아볼까요? <a href="#/supersearch?q=${encodeURIComponent(q)}" style="text-decoration:underline">이동</a></div>`) : '<div class="hint">예: 데이토나, 126610, 노틸러스, 산토스</div>';
      $$('a', res).forEach(a => a.addEventListener('click', close)); };
    inp.oninput = run;
    inp.onkeydown = e => { const as = $$('.it', res); if (e.key === 'Escape') close(); else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); fi = Math.max(0, Math.min(as.length - 1, fi + (e.key === 'ArrowDown' ? 1 : -1))); as.forEach((a, i) => a.classList.toggle('f', i === fi)); } else if (e.key === 'Enter') { const a = as[fi]; if (a) { location.hash = a.getAttribute('href'); close(); } else if (inp.value.trim()) { location.hash = '#/supersearch?q=' + encodeURIComponent(inp.value.trim()); close(); } } };
    run(); inp.focus();
  }
  $('#cmdk').onclick = palette;
  document.addEventListener('keydown', e => { if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !$('.pal-ov')) { e.preventDefault(); palette(); } });

  // dock indicator + cursor spotlight + fav count
  function paintDock(key) {
    const a = $(`#dock a[data-k="${key}"]`) || $('#dock a[data-k="home"]');
    $$('#dock a').forEach(x => x.classList.toggle('on', x === a));
    const ind = $('#dockInd'); ind.style.left = a.offsetLeft + 'px'; ind.style.width = a.offsetWidth + 'px';
    const n = fav.get().length; $('#favN').textContent = n ? n : '';
  }
  const spot = $('#spot');
  window.addEventListener('pointermove', e => { spot.style.left = e.clientX + 'px'; spot.style.top = e.clientY + 'px'; }, { passive: true });

  function magCard(a) { const m = modelByRef(a.model); return `<a class="mcard" href="#/magazine/${a.id}"><div class="cv" style="background:linear-gradient(135deg,#f3f4f6,#e5e7eb)">${m ? `<div style="position:absolute;inset:0">${watchImg(m)}</div>` : ''}</div><div class="cat">${esc(a.cat)}</div><h3>${esc(a.title)}</h3><p>${esc(a.lead)}</p><span class="rm">더보기 ${svg(IC.arrow, 'sm')}</span></a>`; }

  // ---------- super search ----------
  const PLATFORMS = [
    { id: 'p1', name: '중고마켓', color: '#111', fg: '#22c55e', mark: 'J', w: 0.14 },
    { id: 'p2', name: '번쩍장터', color: '#ef1c1c', fg: '#fff', mark: '⚡', w: 0.035 },
    { id: 'p3', name: '시계거래소', color: '#fff', fg: '#111', mark: 'WE', w: 0.37, italic: 1 },
    { id: 'p4', name: '하이타임', color: '#fff', fg: '#111', mark: '◎', w: 0.115 },
    { id: 'p5', name: '바이워치', color: '#0f172a', fg: '#fff', mark: 'B', w: 0.28 },
    { id: 'p6', name: '럭스웨이', color: '#7c3aed', fg: '#fff', mark: 'L', w: 0.06 }
  ];
  const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, '');
  function matchModels(q) {
    const n = norm(q); if (!n) return [];
    return MARKET.filter(x => [brandKo(x.brand), x.brand, (brandById[x.brand] || {}).en, x.ko, x.line, x.family, x.ref, x.name].some(f => f && (norm(f).includes(n) || n.includes(norm(f)) && norm(f).length > 2)));
  }
  const PHRASES = ['판매합니다', '풀박스', '국내 정품', '급매', '신품급', '보증서 有', '정품 직거래', '네고 가능', '미착용', '새상품 풀세트', ''];
  function genListings(q, plat, page, per, total, models) {
    const r = rng(q + plat.id + page); const out = [];
    const n = Math.min(per, total - page * per);
    for (let i = 0; i < n; i++) {
      const m = models[Math.floor(r() * models.length)];
      const acc = r() < 0.07;
      const dial = DIAL_KO[m.dial] || '';
      const title = acc ? `${brandKo(m.brand)} ${m.ko} 정품 ${r() < 0.5 ? '브레이슬릿 링크' : '박스 세트'}` : `${brandKo(m.brand)} ${m.ref.split(/[-/.]/)[0]} ${m.ko} ${dial ? dial + '판 ' : ''}${WH.pick(r, PHRASES)}`.trim();
      const price = acc ? Math.round((200000 + r() * 900000) / 10000) * 10000 : Math.round(m.krw * (0.9 + r() * 0.25) / 10000) * 10000;
      const mins = Math.floor(Math.pow(r(), 2) * 60 * 24 * 30) + page * 60 * 24 * 3;
      const when = mins < 60 ? `${mins + 1}분 전` : mins < 60 * 24 ? `${Math.floor(mins / 60)}시간 전` : mins < 60 * 24 * 4 ? `${Math.floor(mins / 1440)}일 전` : new Date(Date.now() - mins * 6e4).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
      out.push({ m, title, price, when, mins, box: r() < 0.45, bg: Math.floor(r() * 5) });
    }
    return out.sort((a, b) => a.mins - b.mins);
  }
  function superSearch(q) {
    const query = (q.q || '').trim();
    const models = matchModels(query);
    const base = models.length ? Math.round(160 + rng('t' + query)() * 1500) : 0;
    const counts = PLATFORMS.map(p => Math.max(models.length ? 1 : 0, Math.round(base * p.w * (0.7 + rng(p.id + query)() * 0.6))));
    const total = counts.reduce((a, b) => a + b, 0);
    app.innerHTML = `<div class="wrap">
      <header class="ss-head"><div class="eb">SUPER SEARCH</div><h1>모든 플랫폼의 매물을<br>한눈에 확인 할 수 있어요</h1></header>
      <form class="ss-bar" id="ssf"><div class="in"><input id="ssq" placeholder="검색어를 입력하세요" value="${esc(query)}" autocomplete="off"></div><button class="go" aria-label="검색">${svg(IC.search)}</button></form>
      ${query ? `<div class="jp-banner"><div>원하는 매물이 없으신가요?<br>일본에서 <b>[${esc(query)}]</b>를 검색해보세요!</div><a href="#/supersearch?q=${encodeURIComponent(query)}&region=jp">슈퍼검색 [일본] 바로가기</a></div>
      <div class="ss-count">검색된 상품 <b>${total.toLocaleString()}</b></div>
      ${total ? PLATFORMS.map((p, i) => `<section class="plat" data-p="${i}"><button class="plat-h" aria-expanded="false"><span class="pi" style="background:${p.color};color:${p.fg};${p.italic ? 'font-style:italic;font-family:Georgia,serif;' : ''}">${p.mark}</span><span><b>${p.name}</b><small>매물 <em>${counts[i]}</em></small></span><span class="tg">전체보기 ${svg(IC.chevD, 'sm')}</span></button><div class="plat-body" hidden></div></section>`).join('')
        : `<div class="empty-s">‘${esc(query)}’에 맞는 매물을 찾지 못했어요.<br>브랜드(롤렉스), 라인(데이토나), 레퍼런스(126610)로 검색해 보세요.</div>`}
      ${total ? `<button class="c24" onclick="location.hash='#/supersearch?q=${encodeURIComponent(query)}&region=global'"><span style="font-size:26px">🌐</span><span><b>글로벌 슈퍼검색</b><small>해외 시세까지 한 번에 검색</small></span></button>` : ''}`
      : `<div class="ss-count">추천 검색어</div><div class="toolbar">${['데이토나', '서브마리너', '노틸러스', '로열 오크', '산토스', '126610', '블랙베이'].map(t => `<a class="tchip" href="#/supersearch?q=${encodeURIComponent(t)}">${t}</a>`).join('')}</div>`}
    </div>`;
    $('#ssf').onsubmit = (e) => { e.preventDefault(); const v = $('#ssq').value.trim(); location.hash = '#/supersearch' + (v ? '?q=' + encodeURIComponent(v) : ''); };
    $$('.plat').forEach(sec => {
      const i = +sec.dataset.p, p = PLATFORMS[i], body = $('.plat-body', sec), btn = $('.plat-h', sec); let page = 0; const per = 30;
      const pages = Math.ceil(counts[i] / per);
      const paint = () => {
        const items = genListings(query, p, page, per, counts[i], models);
        body.innerHTML = `<div class="sgrid">${items.map(it => `<a class="scard" href="#/market/${it.m.mid}"><div class="ph ph-bg-${it.bg}"><div class="w">${watchImg(it.m)}</div></div><div class="t">${esc(it.title)}</div><div class="m"><span>${esc(it.when)}</span><b>${won(it.price)} 원</b></div></a>`).join('')}</div>
          ${pages > 1 ? `<div class="pager"><button data-pg="${page - 1}" ${page === 0 ? 'disabled' : ''} aria-label="이전 페이지">‹</button>${pagerNums(page, pages).map(n => n === '…' ? '<span style="padding:6px">…</span>' : `<button data-pg="${n}" class="${n === page ? 'on' : ''}">${n + 1}</button>`).join('')}<button data-pg="${page + 1}" ${page >= pages - 1 ? 'disabled' : ''} aria-label="다음 페이지">›</button></div>` : ''}`;
        $$('[data-pg]', body).forEach(b => b.onclick = () => { page = +b.dataset.pg; paint(); sec.scrollIntoView({ behavior: 'smooth' }); });
      };
      btn.onclick = () => { const open = body.hidden; body.hidden = !open; btn.setAttribute('aria-expanded', open); $('.tg', btn).innerHTML = (open ? '닫기 ' + svg(IC.chevU, 'sm') : '전체보기 ' + svg(IC.chevD, 'sm')); if (open) paint(); };
    });
  }
  function pagerNums(p, n) { if (n <= 7) return [...Array(n).keys()]; const s = new Set([0, 1, 2, p - 1, p, p + 1, n - 1].filter(x => x >= 0 && x < n)); const arr = [...s].sort((a, b) => a - b); const out = []; arr.forEach((x, i) => { if (i && x - arr[i - 1] > 1) out.push('…'); out.push(x); }); return out; }

  // ---------- market ----------
  function market(q) {
    const brand = q.brand || 'all', sort = q.sort || 'new';
    const mine = store.get('c_sell', []).map(x => ({ ...x, ...(MARKET.find(m => m.ref === x.ref) || MARKET[0]), krw: x.krw, mid: x.mid, mineFlag: 1 }));
    let list = [...mine, ...MARKET].filter(x => brand === 'all' || x.brand === brand);
    if (sort === 'low') list.sort((a, b) => a.krw - b.krw); else if (sort === 'high') list.sort((a, b) => b.krw - a.krw); else list.sort((a, b) => (b.mineFlag || 0) - (a.mineFlag || 0) || rng(a.mid)() - rng(b.mid)());
    const brandsPresent = RAIL.filter(r => r[0] === 'all' || MARKET.some(x => x.brand === r[0]));
    app.innerHTML = `<div class="wrap"><header class="page-h" style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap"><div><div class="eb">MARKET</div><h1>중고장터</h1><p>사고 싶은 시계도, 판매하고 싶은 시계도 더 쉽고 편리하게.</p></div><a class="btn-dark" href="#/market/new">판매하기</a></header>
      <div class="toolbar">${brandsPresent.map(r => `<a class="tchip ${brand === r[0] ? 'on' : ''}" href="#/market?brand=${r[0]}${sort !== 'new' ? '&sort=' + sort : ''}">${esc(r[1])}</a>`).join('')}
        <select id="msort" aria-label="정렬"><option value="new">최신 등록순</option><option value="low">가격 낮은순</option><option value="high">가격 높은순</option></select></div>
      <div class="pgrid">${list.map(pcard).join('') || '<div class="empty-s" style="grid-column:1/-1">매물이 없어요</div>'}</div></div>`;
    $('#msort').value = sort;
    $('#msort').onchange = (e) => location.hash = `#/market?brand=${brand}&sort=${e.target.value}`;
  }
  function marketDetail(id) {
    if (id === 'new') return sellForm();
    const mine = store.get('c_sell', []).find(x => x.mid === id);
    const x = mine ? { ...(MARKET.find(m => m.ref === mine.ref) || MARKET[0]), ...mine } : marketById[id];
    if (!x) return placeholder('/404');
    const r = rng('s' + id); const seller = mine ? '나' : WH.pick(r, SELLERS); const color = ['#0ea5e9', '#a855f7', '#f97316', '#10b981'][Math.floor(r() * 4)];
    const pro = MODELS.find(m => m.ref === x.ref);
    app.innerHTML = `<div class="wrap"><div class="detail"><div class="big ph-bg-${x.bg || 0}"><div class="w">${watchImg(x)}</div></div>
      <div><div class="b">${esc(brandKo(x.brand))}</div><h1>${esc(x.ko)}</h1><div class="ref">Ref. ${esc(x.ref)}</div><div class="price">₩${won(x.krw)}</div>
        <div class="seller"><div class="av" style="background:${color}">${esc(seller[0])}</div><div><b>${esc(seller)}</b>${mine ? '' : '<span class="vbadge">본인인증</span>'}<div style="color:var(--muted);font-size:13px">거래 후기 ${Math.floor(r() * 40)}개 · 응답 평균 ${Math.floor(5 + r() * 50)}분</div></div></div>
        <div class="spec"><div><span>상태</span><b>${mine ? esc(mine.cond) : WH.pick(r, ['S급', 'A급', '미착용', '사용감 적음'])}</b></div><div><span>구성품</span><b>${mine ? esc(mine.set) : WH.pick(r, ['풀세트', '시계 + 보증서', '시계 단품'])}</b></div><div><span>보증서 날짜</span><b>${2021 + Math.floor(r() * 5)}.${String(1 + Math.floor(r() * 12)).padStart(2, '0')}</b></div><div><span>거래 방식</span><b>직거래 · 안전결제</b></div>${pro ? `<div><span>딜러 시세 (Pro)</span><b>₩${won(pro.price * KRW)}</b></div>` : ''}</div>
        <div class="actions"><button class="btn-dark" id="chatBtn">${svg(IC.chat, 'sm')}채팅하기</button><button class="btn-line" data-heart="${x.mid}">${svg(IC.heart, 'sm')}찜</button>${pro ? `<a class="btn-line" href="pro.html#/app/explore/${pro.id}">Pro 시세 보기</a>` : ''}</div>
        <p style="color:var(--muted);font-size:12.5px;margin-top:18px">거래 전 보증서 일련번호와 실물 사진을 꼭 확인하세요. 대리구매를 이용하면 Watch HUB가 검수 후 전달해 드려요.</p></div></div>
      <section class="sec" style="padding-top:10px"><div class="sec-h"><div><h2>비슷한 매물</h2></div></div><div class="pgrid">${MARKET.filter(m => m.brand === x.brand && m.mid !== x.mid).slice(0, 4).map(pcard).join('')}</div></section></div>`;
    $('#chatBtn').onclick = () => toast('데모에서는 채팅이 열리지 않아요');
  }
  function sellForm() {
    app.innerHTML = `<div class="wrap"><header class="page-h"><div class="eb">MARKET</div><h1>판매하기</h1><p>모델을 고르고 가격을 입력하면 바로 장터에 올라가요. (이 브라우저에만 저장되는 데모)</p></header>
      <form class="form" id="sf"><div class="fld"><label>모델</label><select id="sm" required>${MARKET.map(m => `<option value="${esc(m.ref)}">${esc(brandKo(m.brand))} · ${esc(m.ko)} (${esc(m.ref)})</option>`).join('')}</select></div>
      <div class="row2"><div class="fld"><label>판매가 (원)</label><input id="sp" type="number" min="10000" step="10000" required placeholder="예: 12500000"></div><div class="fld"><label>상태</label><select id="sc"><option>미착용</option><option>S급</option><option>A급</option><option>사용감 있음</option></select></div></div>
      <div class="fld"><label>구성품</label><select id="ss"><option>풀세트</option><option>시계 + 보증서</option><option>시계 단품</option></select></div>
      <div class="fld"><label>설명</label><textarea id="sd" placeholder="구매처, 보증서 날짜, 사용 기간 등을 적어 주세요"></textarea></div>
      <button class="btn-dark">등록하기</button></form></div>`;
    $('#sf').onsubmit = (e) => { e.preventDefault(); const arr = store.get('c_sell', []); const mid = 'S' + Date.now(); arr.unshift({ mid, ref: $('#sm').value, krw: +$('#sp').value, cond: $('#sc').value, set: $('#ss').value, desc: $('#sd').value }); store.set('c_sell', arr); toast('장터에 등록했어요'); location.hash = '#/market/' + mid; };
  }
  function favorites() {
    const ids = fav.get(); const items = ids.map(id => marketById[id]).filter(Boolean);
    app.innerHTML = `<div class="wrap"><header class="page-h"><h1>즐겨찾기</h1><p>하트를 누른 매물이 여기에 모여요.</p></header><div class="pgrid">${items.map(pcard).join('') || '<div class="empty-s" style="grid-column:1/-1">아직 찜한 매물이 없어요. <a href="#/market" style="text-decoration:underline">중고장터 둘러보기</a></div>'}</div></div>`;
  }

  // ---------- concierge ----------
  function concierge() {
    const tickets = store.get('c_tickets', []);
    app.innerHTML = `<section class="cdark"><div class="wrap"><div class="eb" style="font-size:11px;letter-spacing:1px;opacity:.7;font-weight:700">WATCH HUB CONCIERGE</div><h1>찾기 어려운 시계,<br>대신 찾아드립니다.</h1><p>국내·일본·홍콩 딜러 네트워크에서 매물을 찾고, 검수와 배송까지 맡아요.</p></div></section>
      <div class="wrap" style="padding-top:40px"><div class="steps">${[['01', '신청', '원하는 모델과 예산을 알려주세요.'], ['02', '매물 탐색', '딜러 네트워크에서 조건에 맞는 매물을 찾아 제안해요.'], ['03', '검수', '정품·상태·구성품을 전문 검수사가 확인해요.'], ['04', '결제·배송', '안전결제 후 보험 배송으로 받아요.']].map(s => `<div><b>STEP ${s[0]}</b><strong>${s[1]}</strong><p>${s[2]}</p></div>`).join('')}</div>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,380px);gap:48px" class="cgrid"><form class="form" id="cf"><h2 style="margin:0 0 20px">대리구매 신청</h2>
        <div class="row2"><div class="fld"><label>브랜드</label><select id="cb">${RAIL.filter(r => !['all', 'etc'].includes(r[0])).map(r => `<option value="${r[0]}">${r[1]}</option>`).join('')}</select></div><div class="fld"><label>모델 / 레퍼런스</label><input id="cm" required placeholder="예: 데이토나 126500LN"></div></div>
        <div class="row2"><div class="fld"><label>예산 (원)</label><input id="cbud" type="number" step="100000" placeholder="예: 45000000" required></div><div class="fld"><label>서비스</label><select id="ct"><option>일반 대리구매</option><option>프리미엄 대리구매 (전담 매니저)</option></select></div></div>
        <div class="row2"><div class="fld"><label>조건</label><select id="cc"><option>신품만</option><option>신품 + 미착용</option><option>중고 포함</option></select></div><div class="fld"><label>연락처</label><input id="cp" required placeholder="010-0000-0000"></div></div>
        <div class="fld"><label>요청 사항</label><textarea id="cn" placeholder="보증서 날짜, 구성품, 희망 수령일 등"></textarea></div>
        <button class="btn-dark">신청하기</button></form>
        <aside><h3 style="margin:0 0 6px">내 신청 현황</h3><p style="color:var(--muted);font-size:13px;margin:0">이 브라우저에 저장된 데모 신청이에요.</p><div class="tickets">${tickets.map(t => `<div class="ticket"><div><b>${esc(brandKo(t.brand))} ${esc(t.model)}</b><div style="color:var(--muted);font-size:12.5px">${esc(t.type)} · 예산 ₩${won(t.budget)}</div></div><span class="st">${t.status}</span></div>`).join('') || '<div class="ticket" style="color:var(--muted)">아직 신청 내역이 없어요</div>'}</div></aside></div></div>`;
    $('#cf').onsubmit = (e) => { e.preventDefault(); const arr = store.get('c_tickets', []); arr.unshift({ brand: $('#cb').value, model: $('#cm').value, budget: +$('#cbud').value, type: $('#ct').value, status: '접수 완료' }); store.set('c_tickets', arr); toast('신청을 접수했어요. 담당자가 연락드릴게요 (데모)'); concierge(); };
    if (innerWidth < 860) $('.cgrid').style.gridTemplateColumns = '1fr';
  }

  // ---------- magazine ----------
  function magazine(q) {
    const cats = ['전체', ...new Set(ARTICLES.map(a => a.cat))]; const cat = q.cat || '전체';
    const list = ARTICLES.filter(a => cat === '전체' || a.cat === cat);
    app.innerHTML = `<div class="wrap"><header class="page-h"><div class="eb">MAGAZINE</div><h1>매거진</h1><p>시계를 알수록, 보는 기준은 달라집니다.</p></header>
      <div class="toolbar">${cats.map(c => `<a class="tchip ${c === cat ? 'on' : ''}" href="#/magazine?cat=${encodeURIComponent(c)}">${c}</a>`).join('')}</div>
      <div class="mgrid" style="row-gap:48px">${list.map(magCard).join('')}</div></div>`;
  }
  function article(id) {
    const a = ARTICLES.find(x => x.id === id); if (!a) return placeholder('/404');
    const m = modelByRef(a.model);
    app.innerHTML = `<article class="article"><a href="#/magazine" class="more">← 매거진</a><div class="cat" style="margin-top:24px">${esc(a.cat)}</div><h1>${esc(a.title)}</h1><p class="lead">${esc(a.lead)}</p>
      <div class="cv" style="background:linear-gradient(135deg,#f3f4f6,#dfe3e8)">${m ? `<div style="position:absolute;inset:0">${watchImg(m)}</div>` : ''}</div>
      ${a.body.map(([h, p]) => `${h ? `<h2>${esc(h)}</h2>` : ''}<p>${esc(p)}</p>`).join('')}
      <div style="border-top:1px solid var(--line);margin-top:40px;padding-top:24px"><div class="mgrid">${ARTICLES.filter(x => x.id !== id).slice(0, 2).map(magCard).join('')}</div></div></article>`;
  }

  // ---------- retail ----------
  function retail() {
    const brands = [...new Set(MODELS.map(m => m.brand))];
    app.innerHTML = `<div class="wrap"><header class="page-h"><div class="eb">RETAIL</div><h1>리테일</h1><p>브랜드부터 레퍼런스까지, 정가를 찾아보세요.</p></header>
      <div class="rlist" style="max-width:720px">${brands.map(id => `<a href="#/retail/${id}">${logoTile(id)}<div><b>${brandKo(id)}</b><small>${MODELS.filter(m => m.brand === id).length}개 레퍼런스 · 컬렉션 둘러보기</small></div>${svg(IC.chevR)}</a>`).join('')}</div></div>`;
  }
  function retailBrand(id) {
    const list = MODELS.filter(m => m.brand === id);
    if (!list.length) return retail();
    const lines = [...new Set(list.map(m => m.line))];
    app.innerHTML = `<div class="wrap"><header class="page-h"><a class="more" href="#/retail">← 리테일</a><h1 style="margin-top:14px">${brandKo(id)}</h1><p>국내 리테일 정가 기준 (데모 환산가)</p></header>
      ${lines.map(l => `<h2 style="font-size:18px;margin:28px 0 8px">${esc(l)}</h2><table class="retail-table"><thead><tr><th></th><th>모델</th><th>레퍼런스</th><th style="text-align:right">정가</th></tr></thead><tbody>${list.filter(m => m.line === l).map(m => `<tr><td><div class="th">${watchImg(m, { crop: 'tight' })}</div></td><td>${esc(m.name)}<div style="color:var(--muted);font-size:12.5px">${esc(m.specs)}</div></td><td style="color:var(--muted)">${esc(m.ref)}</td><td style="text-align:right;font-weight:700">₩${won(m.retail * KRW * 1.07 / 10000) === '0' ? '-' : won(Math.round(m.retail * KRW * 1.07 / 10000) * 10000)}</td></tr>`).join('')}</tbody></table>`).join('')}</div>`;
  }

  function placeholder(path) {
    const map = { '/me': ['내정보', '로그인하고 즐겨찾기, 채팅, 판매 내역을 관리하세요.'], '/chats': ['채팅', '판매자와 나눈 대화가 여기에 표시돼요.'], '/friends': ['친구', '친구를 추가하고 매물을 공유해 보세요.'], '/notifications': ['알림', '가격 알림과 채팅 알림이 여기에 표시돼요.'], '/country': ['국가 설정', '한국 · 일본 마켓을 선택할 수 있어요.'], '/language': ['언어 설정', '한국어 · English · 日本語'] };
    const [t, d] = map[path] || ['페이지를 찾을 수 없어요', '주소를 다시 확인해 주세요.'];
    app.innerHTML = `<div class="wrap"><div class="empty-s" style="padding:120px 0"><h1 style="color:var(--ink);font-size:28px;margin:0 0 10px">${t}</h1><p>${d}</p><div class="actions" style="justify-content:center;margin-top:20px"><a class="btn-dark" href="pro.html">딜러용 Watch HUB Pro</a><a class="btn-line" href="#/">홈으로</a></div></div></div>`;
  }

  // ---------- misc ----------
  let tt; function toast(t) { $$('.toast').forEach(x => x.remove()); const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); clearTimeout(tt); tt = setTimeout(() => el.remove(), 2400); }
  window.addEventListener('resize', () => paintDock((parse().path.split('/')[1]) || 'home'));
  $('#yr').textContent = new Date().getFullYear();
  route();
})();
