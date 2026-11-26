/* Watch HUB Pro — dealer market app (vanilla JS, hash router) */
(function () {
  'use strict';
  const { MODELS, modelById, BRANDS, brandById, DEALERS, dealerById, COUNTRIES, listingsFor, fmtMoney, fmtPct, ago, watchImg, esc, store } = WH;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => [...(el || document).querySelectorAll(s)];

  // ---------- icons ----------
  const I = {
    grid: '<rect x="4" y="4" width="6" height="6" rx="2"/><rect x="14" y="4" width="6" height="6" rx="2"/><rect x="4" y="14" width="6" height="6" rx="2"/><rect x="14" y="14" width="6" height="6" rx="2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    speaker: '<path d="M4 10v4a1 1 0 0 0 1 1h2l5 4V5L7 9H5a1 1 0 0 0-1 1z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M19 7a7 7 0 0 1 0 10"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    chev: '<path d="m6 9 6 6 6-6"/>',
    chevR: '<path d="m9 6 6 6-6 6"/>',
    sort: '<path d="M7 4v16M3 8l4-4 4 4M17 20V4M13 16l4 4 4-4"/>',
    filter: '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>', arrowDn: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M21.5 20a6.5 6.5 0 0 0-4-6"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    store: '<path d="M4 9 5.5 4h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
    plus: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    send: '<path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    bell: '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>',
    check: '<path d="m5 12 5 5L20 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
  };
  const ic = (n, cls) => `<svg class="i ${cls || ''}" viewBox="0 0 24 24">${I[n]}</svg>`;
  const VERIFIED = (green) => `<svg class="verified" viewBox="0 0 24 24"><path fill="${green ? '#22c55e' : 'oklch(62.04% .195 253.83)'}" d="M12 1.5 14.6 4l3.5-.4.6 3.5 3 1.9-1.5 3.2 1.5 3.2-3 1.9-.6 3.5-3.5-.4L12 22.5 9.4 20l-3.5.4-.6-3.5-3-1.9L3.8 12 2.3 8.8l3-1.9.6-3.5 3.5.4z"/><path d="m8 12 3 3 5-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- state ----------
  const kstDate = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
  const S = {
    currency: store.get('currency', 'HKD'), retailRegion: store.get('retailRegion', 'HK'), lang: store.get('lang', 'KO'),
    favorites: store.get('favorites', []), connected: store.get('connected', []), myReviews: store.get('myReviews', {}),
    wa: store.get('wa', false), history: store.get('history', []), tourDone: store.get('tourDone', false),
    theme: store.get('theme', 'dark'), name: store.get('name', 'Ruby Tern'), storeFlag: store.get('storeFlag', false), countries: store.get('countries', []),
    notifRead: store.get('notifRead', false), usage: store.get('usage', { date: kstDate(), connects: 0, sends: 0 })
  };
  if (S.usage.date !== kstDate()) S.usage = { date: kstDate(), connects: 0, sends: 0 };
  const save = (...keys) => keys.forEach(k => store.set(k, S[k]));
  const LIMITS = { connects: 5, sends: 30 };
  const money = (hkd) => fmtMoney(hkd, S.currency);
  const REGION = { HK: 1, KR: 1.07, JP: 0.94, US: 0.98, CH: 0.91 };
  const retailOf = (m) => m.retail * REGION[S.retailRegion];
  const premiumOf = (m) => m.retail ? (m.price / retailOf(m) - 1) * 100 : null;
  // merge user reviews into dealer objects
  Object.entries(S.myReviews).forEach(([did, arr]) => { const d = dealerById[did]; if (d) arr.forEach(r => d.reviews.unshift({ ...r, date: new Date(r.date), mine: true })); recalc(d); });
  function recalc(d) { if (!d) return; const rep = d.reviews.filter(x => x.replied).length; d.responseRate = d.reviews.length ? Math.round(rep / d.reviews.length * 100) : null; d.stockAccuracy = rep ? Math.round(d.reviews.filter(x => x.stock).length / rep * 100) : null; }

  document.documentElement.className = S.theme;

  // ---------- nav ----------
  const NAV = [
    { path: '/app', label: '개요', icon: 'grid' },
    { path: '/app/explore', label: 'Explore', icon: 'compass' },
    { path: '/app/broadcast', label: 'Broadcast', icon: 'speaker', beta: true },
    { path: '/app/settings', label: '설정', icon: 'gear' }
  ];
  function renderNav(path) {
    $('#nav').innerHTML = NAV.map(n => {
      const active = n.path === '/app' ? path === '/app' : path.startsWith(n.path);
      return `<a role="treeitem" href="#${n.path}" class="${active ? 'active' : ''}" data-nav="${n.path}" data-label="${n.label}" aria-label="${n.label}">${ic(n.icon)}${n.label}${n.beta ? '<span class="badge-beta">Beta</span>' : ''}</a>`;
    }).join('');
  }

  // ---------- router ----------
  function parseHash() {
    const h = location.hash.replace(/^#/, '') || '/app';
    const [p, q] = h.split('?');
    return { path: p, query: Object.fromEntries(new URLSearchParams(q || '')) };
  }
  function go(path, query) {
    const qs = query ? new URLSearchParams(Object.entries(query).filter(([, v]) => v != null && v !== '')).toString() : '';
    location.hash = path + (qs ? '?' + qs : '');
  }
  function route() {
    closePops();
    const { path, query } = parseHash();
    renderNav(path);
    const main = $('#main');
    main.innerHTML = '';
    if (window.innerWidth < 860) $('#shell').classList.remove('open');
    let m;
    if (path === '/app' || path === '/') { setTitle('개요'); pageOverview(main); }
    else if ((m = path.match(/^\/app\/explore\/(.+)$/))) { setTitle('Explore'); pageModel(main, decodeURIComponent(m[1]), query); }
    else if (path === '/app/explore') { setTitle('Explore'); pageExplore(main, query); }
    else if (path === '/app/broadcast') { setTitle('Broadcast'); pageBroadcast(main); }
    else if (path === '/app/settings') { setTitle('설정'); pageSettings(main); }
    else { setTitle('개요'); pageOverview(main); }
    window.scrollTo(0, 0);
  }
  function setTitle(t) { $('#pageTitle').textContent = t; document.title = `${t} · Watch HUB Pro`; }
  window.addEventListener('hashchange', route);

  // ---------- shared bits ----------
  const thumb = (m, cls) => `<div class="${cls || 'thumb'}">${watchImg(m, { crop: 'tight' })}</div>`;
  const chg = (p) => `<span class="chg ${p >= 0 ? 'up' : 'down'}">${ic(p >= 0 ? 'arrowUp' : 'arrowDn')}<span class="tabnum">${fmtPct(p)}</span></span>`;
  const isFav = (id) => S.favorites.includes(id);
  function toggleFav(id) {
    S.favorites = isFav(id) ? S.favorites.filter(x => x !== id) : [id, ...S.favorites]; save('favorites');
    toast(isFav(id) ? '컬렉션에 추가했어요' : '컬렉션에서 뺐어요');
  }
  function spark(m, n, cls) {
    const pts = m.hist.slice(-(n || 30)); const min = Math.min(...pts), max = Math.max(...pts), sp = (max - min) || 1;
    const W = 84, H = 28; const d = pts.map((v, i) => `${i ? 'L' : 'M'}${(i * W / (pts.length - 1)).toFixed(1)},${(H - 2 - (v - min) / sp * (H - 4)).toFixed(1)}`).join(' ');
    const up = pts[pts.length - 1] >= pts[0];
    return `<svg class="${cls || 'spark'}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" style="stroke:${up ? 'var(--success)' : 'var(--danger)'}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  }
  function modelCard(m) {
    const prem = premiumOf(m);
    return `<a class="mcard" href="#/app/explore/${m.id}" data-id="${m.id}">
      <div class="img">${watchImg(m, { crop: true })}</div>
      <button class="star-btn ${isFav(m.id) ? 'on' : ''}" data-fav="${m.id}" aria-label="컬렉션에 추가">${ic('star')}</button>
      <div class="body">
        <div class="t">${esc(m.name)}</div>
        <div class="s">${esc(m.ref)} · ${esc(m.specs)}${m.discontinued ? ' · 단종' : ''}</div>
        <div class="prow"><div class="p">${money(m.price)}</div>${spark(m)}</div>
        <div class="r">${prem == null ? '<span class="prem neg">리테일 미확인</span>' : `<span class="prem ${prem < 0 ? 'neg' : ''}">리테일 ${fmtPct(prem)}</span>`}${m.counts.wanted ? `<span class="wanted">구함 ${m.counts.wanted}</span>` : ''}</div>
      </div>
    </a>`;
  }
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-fav]');
    if (f) { e.preventDefault(); e.stopPropagation(); toggleFav(f.dataset.fav); f.classList.toggle('on', isFav(f.dataset.fav)); }
  });

  // ---------- overview ----------
  function pageOverview(main) {
    const favs = S.favorites.map(id => modelById[id]).filter(Boolean);
    const movers = [...MODELS].sort((a, b) => Math.abs(b.dayChange) - Math.abs(a.dayChange)).slice(0, 5);
    const avgChg = MODELS.reduce((a, m) => a + m.dayChange, 0) / MODELS.length; const newL = MODELS.reduce((a, m) => a + Math.round(m.counts.new / 14), 0); const wantedT = MODELS.reduce((a, m) => a + m.counts.wanted, 0); const idx = MODELS.slice(0, 30); const idxHist = { hist: idx[0].hist.map((_, i) => idx.reduce((a, m) => a + m.hist[i] / m.price, 0)) };
    main.innerHTML = `
      <section><div class="section-title">Market pulse · 오늘</div><div class="pulse">
        <div><small>Watch HUB 지수</small><b>${(idxHist.hist[399] / idxHist.hist[0] * 1000).toFixed(1)}</b><em class="${idxHist.hist[399] >= idxHist.hist[398] ? 'up' : 'down'}">${fmtPct((idxHist.hist[399] / idxHist.hist[398] - 1) * 100, { dp: 2 })}</em>${spark(idxHist, 60, 'x')}</div>
        <div><small>평균 일간 변동</small><b class="${avgChg >= 0 ? 'up' : 'down'}">${fmtPct(avgChg, { dp: 2 })}</b><em style="color:var(--muted)">${MODELS.length}개 모델</em></div>
        <div><small>오늘 신규 매물</small><b>${newL.toLocaleString()}</b><em style="color:var(--muted)">딜러 ${DEALERS.length}명</em></div>
        <div><small>구함(Wanted)</small><b>${wantedT.toLocaleString()}</b><em style="color:var(--muted)">수요 신호</em></div>
      </div></section>
      <section><div class="section-title">내 컬렉션</div>
        ${favs.length ? `<div class="card"><div class="collection-grid">${favs.map(m => `
          <a class="mover" href="#/app/explore/${m.id}" style="border:0;padding:8px">${thumb(m)}
            <div class="meta"><div class="name">${esc(m.name)}</div><div class="ref">${esc(m.ref)} · 신규 매물 ${Math.max(1, Math.round(m.counts.new / 30))}</div></div>
            <div style="text-align:right"><div class="price tabnum" style="min-width:0">${money(m.price)}</div>${chg(m.dayChange)}</div></a>`).join('')}</div></div>`
        : `<div class="card empty">${ic('star')}<h3>관심 모델을 등록해 보세요</h3><p>모델 상세의 별표(또는 카드의 별)를 누르면 일일 시세 변동과 신규 매물이 여기에 표시돼요.</p><a class="btn btn-outline" href="#/app/explore">모델 둘러보기</a></div>`}
      </section>
      <div class="grid-2">
        <section><div class="section-title">내가 연결한 딜러</div>
          <div class="card">${S.connected.length ? `<div style="padding:6px 20px">${S.connected.map((c, i) => { const d = dealerById[c.dealerId], m = modelById[c.modelId]; if (!d || !m) return ''; const reviewed = (S.myReviews[d.id] || []).some(r => r.modelId === m.id);
            return `<div class="dealer-mini"><div class="av" style="background:${d.color}">${d.initials}</div><div style="flex:1;min-width:0"><div class="dn">${esc(d.name)}${d.verified ? VERIFIED() : ''}</div><div class="dsub">${esc(m.family)} · ${esc(m.ref)} · ${new Date(c.date).toLocaleDateString('ko-KR')}</div></div>
            ${reviewed ? '<span class="pill ok">후기 완료</span>' : `<button class="btn btn-outline btn-sm" data-review="${i}">후기 남기기</button>`}</div>`; }).join('')}</div>`
          : `<div class="mini-empty"><div class="t">${ic('users')} 아직 연결한 딜러가 없어요</div><p>모델 상세의 매물에서 딜러와 연결하면 여기에 표시되고 바로 후기를 남길 수 있어요.</p><a class="btn btn-outline btn-sm" href="#/app/explore">모델 둘러보기</a></div>`}</div>
        </section>
        <section><div class="section-title">급변동 모델 · 전일 대비</div>
          <div class="card movers">${movers.map(m => `<a class="mover" href="#/app/explore/${m.id}">${thumb(m)}<div class="meta"><div class="name">${esc(m.name)}</div><div class="ref">${esc(m.ref)}</div></div>${chg(m.dayChange)}<div class="price tabnum">${money(m.price)}</div></a>`).join('')}</div>
        </section>
      </div>`;
    $$('[data-review]', main).forEach(b => b.onclick = () => reviewModal(S.connected[+b.dataset.review]));
  }

  // ---------- explore ----------
  const SORTS = [
    ['premium', '프리미엄순', (a, b) => (premiumOf(b) ?? -999) - (premiumOf(a) ?? -999)],
    ['priceDesc', '가격 높은순', (a, b) => b.price - a.price],
    ['priceAsc', '가격 낮은순', (a, b) => a.price - b.price],
    ['wanted', '구함 많은순', (a, b) => b.counts.wanted - a.counts.wanted],
    ['listings', '매물 많은순', (a, b) => b.counts.new - a.counts.new],
    ['rise', '상승률순', (a, b) => b.dayChange - a.dayChange],
    ['fall', '하락률순', (a, b) => a.dayChange - b.dayChange]
  ];
  function pageExplore(main, q) {
    const brand = q.brand && brandById[q.brand] ? q.brand : '';
    const lines = brand ? [...new Set(MODELS.filter(m => m.brand === brand).map(m => m.line))].sort((a, b) => a.localeCompare(b, 'ko')) : [];
    const line = lines.includes(q.line) ? q.line : '';
    const subs = line ? [...new Set(MODELS.filter(m => m.brand === brand && m.line === line).map(m => m.size))] : [];
    const sub = subs.includes(q.sub) ? q.sub : '';
    const sort = SORTS.find(s => s[0] === q.sort) || SORTS[0];
    let list = MODELS.filter(m => (!brand || m.brand === brand) && (!line || m.line === line) && (!sub || m.size === sub));
    list = [...list].sort(sort[2]);
    let shown = 40;
    main.innerHTML = `
      <div class="filters">
        <button class="chip-btn ${brand ? 'on' : ''}" id="fBrand">${brand ? brandById[brand].ko : '전체 브랜드'} ${ic('chev')}</button>
        <button class="chip-btn ${line ? 'on' : ''}" id="fLine" ${brand ? '' : 'disabled'}>${line || '전체 라인'} ${ic('chev')}</button>
        <button class="chip-btn ${sub ? 'on' : ''}" id="fSub" ${line ? '' : 'disabled'}>${sub || '전체 서브라인'} ${ic('chev')}</button>
        <span class="result-count">${list.length}개 모델</span>
        <div class="spacer"></div>
        <button class="sort-btn" id="fSort">${ic('sort')}${sort[1]} ${ic('chev')}</button>
      </div>
      <div class="model-grid" id="grid"></div>
      <div class="more-wrap" id="moreWrap"></div>`;
    const paint = () => {
      $('#grid').innerHTML = list.slice(0, shown).map(modelCard).join('') || '<div class="card empty" style="grid-column:1/-1"><h3>조건에 맞는 모델이 없어요</h3></div>';
      $('#moreWrap').innerHTML = shown < list.length ? '<button class="btn btn-outline" id="more">더 보기</button>' : '';
      const more = $('#more'); if (more) more.onclick = () => { shown += 40; paint(); };
    };
    paint();
    const upd = (patch) => go('/app/explore', { brand, line, sub, sort: sort[0] === 'premium' ? '' : sort[0], ...patch });
    $('#fBrand').onclick = (e) => menu(e.currentTarget, '브랜드', [['', '전체 브랜드'], ...BRANDS.slice().sort((a, b) => a.ko.localeCompare(b.ko, 'ko')).map(b => [b.id, b.ko])], brand, v => upd({ brand: v, line: '', sub: '' }));
    $('#fLine').onclick = (e) => brand && menu(e.currentTarget, '라인', [['', '전체 라인'], ...lines.map(l => [l, l])], line, v => upd({ line: v, sub: '' }));
    $('#fSub').onclick = (e) => line && menu(e.currentTarget, '서브라인', [['', '전체 서브라인'], ...subs.map(l => [l, l])], sub, v => upd({ sub: v }));
    $('#fSort').onclick = (e) => menu(e.currentTarget, '정렬', SORTS.map(s => [s[0], s[1]]), sort[0], v => upd({ sort: v === 'premium' ? '' : v }), true);
  }

  // ---------- model detail ----------
  function pageModel(main, id, q) {
    const m = modelById[id];
    if (!m) { main.innerHTML = '<div class="card empty"><h3>모델을 찾을 수 없어요</h3><a class="btn btn-outline" href="#/app/explore">Explore로</a></div>'; return; }
    const b = brandById[m.brand];
    const st = { range: '1M', tab: q.tab || 'new', verified: false, storeOnly: false, period: 'all', sortBy: 'recent', sel: 0 };
    main.innerHTML = `
      <div class="crumbs"><a href="#/app/explore?brand=${m.brand}">${b.ko}</a>${ic('chevR')}<a href="#/app/explore?brand=${m.brand}&line=${encodeURIComponent(m.line)}">${esc(m.ref)}</a><button id="copyRef" aria-label="모델번호 복사">${ic('copy')}</button></div>
      <div class="detail-top">
        <div class="card hero-card">
          <button class="star-btn ${isFav(m.id) ? 'on' : ''}" data-fav="${m.id}" style="top:16px;right:16px" aria-label="컬렉션에 추가">${ic('star')}</button>
          <div class="hero-head"><div class="img">${watchImg(m, { crop: true })}</div>
            <div><h1>${esc(m.name)}</h1><div class="s">${esc(m.specs)}</div>
              <div class="price tabnum">${money(m.price)}<small>평균가</small></div>
              <div id="rangeChg"></div></div></div>
          <div class="seg-mini" role="radiogroup">${['1M', '3M', 'All'].map(r => `<button role="radio" data-range="${r}" class="${r === st.range ? 'on' : ''}">${r}</button>`).join('')}</div>
          <div class="chart" id="chart"></div>
        </div>
        <div class="card info-card"><h2>상세 정보</h2>
          <div class="kv"><span class="k">출시</span><span class="v">${m.released.getFullYear()}년 ${m.released.getMonth() + 1}월</span></div>
          <div class="kv"><button class="k" id="regionBtn">리테일 <small>${S.retailRegion}</small>${ic('chev')}</button><span class="v tabnum">${m.retail ? money(retailOf(m)) : '—'}</span></div>
          <div class="kv"><span class="k">리테일가 대비</span><span class="v ${premiumOf(m) >= 0 ? 'up' : 'down'}">${fmtPct(premiumOf(m))}</span></div>
          <div class="kv"><span class="k">신품 최저가</span><span class="v tabnum" id="minNew"></span></div>
          <div class="kv"><span class="k">중고 최저가</span><span class="v tabnum" id="minUsed"></span></div>
          <div class="kv"><span class="k">전일 대비</span><span class="v">${chg(m.dayChange)}</span></div>
        </div>
      </div>
      <div class="tabs-row">
        <div class="seg" role="tablist">
          <button role="tab" data-tab="new">신품 <span class="n">${m.counts.new}</span></button>
          <button role="tab" data-tab="used">중고 <span class="n">${m.counts.used}</span></button>
          <button role="tab" data-tab="wanted">${ic('eye')}구함 <span class="n">${m.counts.wanted}</span></button>
        </div>
        <button class="sort-btn" id="filterBtn">${ic('filter')}필터</button>
      </div>
      <div class="list-wrap"><div class="tbl" id="tbl"></div><aside class="panel" id="panel"></aside></div>`;

    const lNew = listingsFor(m, 'new'), lUsed = listingsFor(m, 'used');
    const minOf = (arr) => arr.length ? money(Math.min(...arr.map(x => x.price))) : '—';
    $('#minNew').textContent = minOf(lNew); $('#minUsed').textContent = minOf(lUsed);
    $('#copyRef').onclick = () => { navigator.clipboard && navigator.clipboard.writeText(m.ref); toast('모델번호를 복사했어요'); };
    $('#regionBtn').onclick = (e) => menu(e.currentTarget, '리테일 가격 지역', Object.keys(REGION).map(k => [k, { HK: '홍콩', KR: '한국', JP: '일본', US: '미국', CH: '스위스' }[k] + ' ' + k]), S.retailRegion, v => { S.retailRegion = v; save('retailRegion'); route(); });

    const drawChart = () => {
      const n = st.range === '1M' ? 30 : st.range === '3M' ? 90 : m.hist.length;
      const pts = m.hist.slice(-n);
      const c = (pts[pts.length - 1] - pts[0]) / pts[0] * 100;
      $('#rangeChg').innerHTML = `${chg(c)}<span class="rng">${st.range}</span>`;
      areaChart($('#chart'), pts);
      $$('[data-range]', main).forEach(x => x.classList.toggle('on', x.dataset.range === st.range));
    };
    $$('[data-range]', main).forEach(x => x.onclick = () => { st.range = x.dataset.range; drawChart(); });
    drawChart();

    const filtered = () => {
      let arr = st.tab === 'new' ? lNew : st.tab === 'used' ? lUsed : listingsFor(m, 'wanted');
      if (st.verified) arr = arr.filter(l => l.dealer.verified);
      if (st.storeOnly) arr = arr.filter(l => l.dealer.store);
      if (st.period !== 'all' && st.tab !== 'wanted') { const y = new Date().getFullYear(); const minY = { thisYear: y, '1y': y - 1, '3y': y - 3, '5y': y - 5 }[st.period]; arr = arr.filter(l => parseInt(l.warranty, 10) >= minY); }
      arr = [...arr];
      if (st.sortBy === 'priceAsc') arr.sort((a, b) => (a.price || 0) - (b.price || 0));
      else if (st.sortBy === 'priceDesc') arr.sort((a, b) => (b.price || 0) - (a.price || 0));
      else if (st.sortBy === 'reviews') arr.sort((a, b) => b.dealer.reviews.length - a.dealer.reviews.length);
      return arr;
    };
    const paintList = () => {
      $$('[data-tab]', main).forEach(x => x.classList.toggle('on', x.dataset.tab === st.tab));
      const arr = filtered();
      if (st.sel >= arr.length) st.sel = 0;
      const third = st.tab === 'wanted' ? '상태' : '가격';
      $('#tbl').innerHTML = `<div class="tbl-head"><div><button id="sortDealer" style="display:inline-flex;align-items:center;gap:2px">딜러${ic('chev')}</button></div><div>${third}</div><div>등록</div></div>
        <div class="tbl-body" role="grid">${arr.length ? arr.map((l, i) => { const d = l.dealer; const sub = [d.responseRate != null ? `응답률 ${d.responseRate}%` : null, d.reviews.length ? `후기 ${d.reviews.length}개` : null].filter(Boolean).join(' · ');
          return `<div class="row ${i === st.sel ? 'sel' : ''}" data-i="${i}" role="row">
            <div class="dealer-cell"><div class="av" style="background:${d.color}">${d.initials}</div><div style="min-width:0"><div class="dn">${esc(d.name)}${d.verified ? VERIFIED() : VERIFIED(true)}${d.store ? `<span title="매장 보유" style="color:var(--muted)">${ic('store')}</span>` : ''}</div>${sub ? `<div class="dsub">${sub}</div>` : ''}</div></div>
            <div class="price-cell">${st.tab === 'wanted' ? `<span class="cond">${ic('spark')}신품</span>` : `<b class="tabnum">${money(l.price)}</b><span>${ic('receipt')}${esc(l.warranty)}${st.tab === 'used' ? ' · ' + esc(l.condition) : ''}</span>`}</div>
            <div class="when"><i class="dot ${l.hours > 24 * 5 ? 'old' : ''}"></i>${ago(l.hours)}</div></div>`; }).join('') : '<div style="padding:40px;text-align:center;color:var(--muted)">조건에 맞는 매물이 없어요</div>'}</div>`;
      $$('.row', $('#tbl')).forEach(r => r.onclick = () => { st.sel = +r.dataset.i; $$('.row', $('#tbl')).forEach(x => x.classList.toggle('sel', x === r)); paintPanel(arr[st.sel]); });
      $('#sortDealer').onclick = (e) => menu(e.currentTarget, '정렬', [['recent', '최신 등록순'], ['priceAsc', '가격 낮은순'], ['priceDesc', '가격 높은순'], ['reviews', '후기 많은순']], st.sortBy, v => { st.sortBy = v; st.sel = 0; paintList(); }, true);
      paintPanel(arr[st.sel]);
    };
    const paintPanel = (l) => {
      const p = $('#panel');
      if (!l) { p.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted)">매물을 선택하세요</div>'; return; }
      const d = l.dealer;
      const already = S.connected.some(c => c.dealerId === d.id && c.modelId === m.id);
      p.innerHTML = `<div class="panel-head"><div class="av lg" style="background:${d.color}">${d.initials}</div><div><div class="n">${esc(d.name)}${d.verified ? VERIFIED() : ''}</div><div class="c">${d.country[2]} ${d.country[1]}${d.store ? ' · 매장 보유' : ''}</div></div></div>
        <div class="trust"><div class="h">신뢰 지표 <small>${ic('lock')}문의 후 후기 작성 가능</small></div>
          <div class="metric"><div class="l"><span>응답률 <i class="info-tip" data-tip="문의에 응답이 왔다고 답한 후기의 비율이에요.">${ic('info')}</i></span><b>${d.responseRate == null ? '—' : d.responseRate + '%'}</b></div><div class="meter"><i style="width:${d.responseRate || 0}%"></i></div></div>
          <div class="metric"><div class="l"><span>재고 정확도 <i class="info-tip" data-tip="응답받은 문의 중 재고가 실제로 있었다고 답한 비율이에요.">${ic('info')}</i></span><b>${d.stockAccuracy == null ? '—' : d.stockAccuracy + '%'}</b></div><div class="meter"><i style="width:${d.stockAccuracy || 0}%"></i></div></div>
          <div class="reviews"><div class="cnt">후기 ${d.reviews.length}개</div>${d.reviews.slice(0, 4).map(r => `<div class="rv"><span class="pill ${r.replied ? 'ok' : ''}">${r.replied ? '응답 있음' : '응답 없음'}</span>${r.replied ? `<span class="pill">${r.stock ? '재고 있었음' : '재고 없었음'}</span>` : ''}${r.mine ? '<span class="pill">내 후기</span>' : ''}<span class="d">${r.date.toLocaleDateString('ko-KR')}</span></div>`).join('') || '<div class="rv" style="color:var(--muted)">아직 후기가 없어요</div>'}</div>
        </div>
        <button class="btn btn-success cta" id="contact">${already ? '다시 문의하기' : '문의하기'}</button>`;
      $('#contact').onclick = () => connectModal(d, m, l);
    };
    $$('[data-tab]', main).forEach(x => x.onclick = () => { st.tab = x.dataset.tab; st.sel = 0; paintList(); });
    $('#filterBtn').onclick = (e) => filterPop(e.currentTarget, st, () => { st.sel = 0; paintList(); }, () => filtered().length);
    paintList();
  }

  // ---------- chart ----------
  function areaChart(el, pts) {
    const w = el.clientWidth || 700, h = el.clientHeight || 190, pad = 6;
    const min = Math.min(...pts), max = Math.max(...pts), span = (max - min) || 1;
    const X = (i) => pad + i * (w - pad * 2) / (pts.length - 1);
    const Y = (v) => pad + (1 - (v - min) / span) * (h - pad * 2 - 20) + 10;
    const P = pts.map((v, i) => [X(i), Y(v)]);
    let d = `M${P[0][0]},${P[0][1]}`;
    for (let i = 0; i < P.length - 1; i++) { const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2; const t = 0.18; d += ` C${p1[0] + (p2[0] - p0[0]) * t},${p1[1] + (p2[1] - p0[1]) * t} ${p2[0] - (p3[0] - p1[0]) * t},${p2[1] - (p3[1] - p1[1]) * t} ${p2[0]},${p2[1]}`; }
    const area = d + ` L${P[P.length - 1][0]},${h} L${P[0][0]},${h} Z`;
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" style="stop-color:var(--accent)" stop-opacity=".30"/><stop offset="1" style="stop-color:var(--accent)" stop-opacity="0"/></linearGradient></defs>
      <path d="${area}" fill="url(#ag)"/><path d="${d}" fill="none" style="stroke:var(--accent)" stroke-width="2" stroke-linejoin="round"/>
      <line id="cx" y1="0" y2="${h}" stroke="var(--border)" stroke-dasharray="3 3" opacity="0"/><circle id="cd" r="4.5" style="fill:var(--background);stroke:var(--accent)" stroke-width="2" opacity="0"/></svg><div class="tip" id="ctip"></div>`;
    const svg = $('svg', el), cxl = $('#cx', el), cd = $('#cd', el), tip = $('#ctip', el);
    const today = new Date();
    svg.onmousemove = (e) => {
      const r = svg.getBoundingClientRect(); const x = (e.clientX - r.left) * w / r.width;
      const i = Math.max(0, Math.min(pts.length - 1, Math.round((x - pad) / (w - pad * 2) * (pts.length - 1))));
      const [px, py] = P[i];
      cxl.setAttribute('x1', px); cxl.setAttribute('x2', px); cxl.setAttribute('opacity', 1);
      cd.setAttribute('cx', px); cd.setAttribute('cy', py); cd.setAttribute('opacity', 1);
      const dt = new Date(today.getTime() - (pts.length - 1 - i) * 864e5);
      tip.innerHTML = `<b class="tabnum">${money(pts[i])}</b>${dt.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}`;
      tip.style.left = (px * r.width / w) + 'px'; tip.style.top = (py * r.height / h) + 'px'; tip.style.opacity = 1;
    };
    svg.onmouseleave = () => { cxl.setAttribute('opacity', 0); cd.setAttribute('opacity', 0); tip.style.opacity = 0; };
  }

  // ---------- popovers ----------
  let openPop = null;
  function closePops() { if (openPop) { openPop.remove(); openPop = null; } }
  function placePop(pop, anchor, alignRight) {
    document.body.appendChild(pop); openPop = pop;
    const r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = alignRight ? r.right - pw : r.left; left = Math.max(8, Math.min(left, innerWidth - pw - 8));
    let top = r.bottom + 6; if (top + ph > innerHeight - 8) top = Math.max(8, r.top - ph - 6);
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
  }
  document.addEventListener('mousedown', (e) => { if (openPop && !openPop.contains(e.target) && !e.target.closest('[data-pop-anchor]')) closePops(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closePops(); closeOverlay(); } });
  function menu(anchor, title, items, current, onPick, alignRight) {
    if (openPop && openPop._anchor === anchor) { closePops(); return; }
    closePops();
    const pop = document.createElement('div'); pop.className = 'pop'; pop.setAttribute('role', 'menu'); pop._anchor = anchor;
    pop.innerHTML = (title ? `<div class="ttl">${esc(title)}</div>` : '') + items.map(([v, l, sub]) => `<button class="mi" role="menuitemradio" aria-checked="${v === current}" data-v="${esc(v)}"><span>${esc(l)}${sub ? `<span class="sub">${esc(sub)}</span>` : ''}</span>${v === current ? `<span class="ck">${ic('check')}</span>` : ''}</button>`).join('');
    anchor.setAttribute('data-pop-anchor', '');
    placePop(pop, anchor, alignRight);
    const btns = $$('.mi', pop); let fi = Math.max(0, items.findIndex(x => x[0] === current)); btns[fi] && btns[fi].focus();
    pop.onkeydown = (e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); fi = (fi + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length; btns[fi].focus(); } };
    btns.forEach(b => b.onclick = () => { closePops(); onPick(b.dataset.v); });
  }
  function filterPop(anchor, st, onChange, count) {
    if (openPop && openPop._anchor === anchor) { closePops(); return; }
    closePops();
    const pop = document.createElement('div'); pop.className = 'pop filter-pop'; pop._anchor = anchor; anchor.setAttribute('data-pop-anchor', '');
    const paint = () => {
      pop.innerHTML = `<div class="ttl" style="padding:0 0 4px">딜러</div>
        <label class="cb"><input type="checkbox" id="fv" ${st.verified ? 'checked' : ''}><span><b>인증 딜러</b><small>Watch HUB가 인증한 딜러만 표시</small></span></label>
        <label class="cb"><input type="checkbox" id="fs" ${st.storeOnly ? 'checked' : ''}><span><b>매장 보유</b><small>오프라인 매장을 운영한다고 답한 딜러</small></span></label>
        <div class="sep"></div><div class="ttl" style="padding:6px 0">보증서 날짜</div>
        <div class="seg sm">${[['all', '전체'], ['thisYear', '올해'], ['1y', '1년'], ['3y', '3년'], ['5y', '5년']].map(([v, l]) => `<button data-p="${v}" class="${st.period === v ? 'on' : ''}">${l}</button>`).join('')}</div>
        <div style="color:var(--muted);font-size:12.5px;margin-top:10px">매물 ${count()}개</div>`;
      $('#fv', pop).onchange = (e) => { st.verified = e.target.checked; onChange(); paint(); };
      $('#fs', pop).onchange = (e) => { st.storeOnly = e.target.checked; onChange(); paint(); };
      $$('[data-p]', pop).forEach(b => b.onclick = () => { st.period = b.dataset.p; onChange(); paint(); });
    };
    paint(); placePop(pop, anchor, true);
  }

  // ---------- overlay (modal / palette) ----------
  let overlay = null;
  function openOverlay(html, cls) { closeOverlay(); overlay = document.createElement('div'); overlay.className = 'overlay'; overlay.innerHTML = `<div class="${cls}" role="dialog" aria-modal="true">${html}</div>`; overlay.onmousedown = (e) => { if (e.target === overlay) closeOverlay(); }; document.body.appendChild(overlay); return overlay.firstElementChild; }
  function closeOverlay() { if (overlay) { overlay.remove(); overlay = null; } }

  function connectModal(d, m, l) {
    const left = LIMITS.connects - S.usage.connects;
    const msg = `Hi ${d.name}, is your ${m.family} ${m.ref}${l.price ? ` at ${fmtMoney(l.price, 'HKD')}` : ''} still available? (via Watch HUB)`;
    const box = openOverlay(`<h3>딜러와 연결</h3><p>${esc(d.name)} 님에게 아래 메시지로 WhatsApp 문의를 보내요. 연결 후 개요 화면에서 후기를 남길 수 있어요.</p>
      <div class="bubble-wrap"><div class="bubble">${esc(msg)}<small>지금</small></div></div>
      <div class="quota" style="margin-top:14px"><span>오늘 남은 딜러 연결</span><b>${left} / ${LIMITS.connects}</b></div>
      <div class="actions"><button class="btn btn-ghost" id="cx">취소</button><button class="btn btn-success" id="ok" ${left <= 0 ? 'disabled' : ''}>${left <= 0 ? '오늘 한도 초과' : 'WhatsApp으로 연결'}</button></div>`, 'modal');
    $('#cx', box).onclick = closeOverlay;
    $('#ok', box).onclick = () => {
      if (left <= 0) return;
      S.usage.connects++; save('usage');
      if (!S.connected.some(c => c.dealerId === d.id && c.modelId === m.id)) { S.connected.unshift({ dealerId: d.id, modelId: m.id, date: Date.now() }); save('connected'); }
      closeOverlay(); toast('딜러와 연결했어요 (데모: 실제 메시지는 보내지 않아요)');
      $('#contact') && ($('#contact').textContent = '다시 문의하기');
    };
  }
  function reviewModal(c) {
    const d = dealerById[c.dealerId], m = modelById[c.modelId];
    const st = { replied: true, stock: true };
    const box = openOverlay(`<h3>${esc(d.name)} 후기</h3><p>${esc(m.family)} ${esc(m.ref)} 문의 결과를 알려주세요. 다른 딜러들의 신뢰 지표에 반영돼요.</p>
      <div class="ttl" style="color:var(--muted);font-size:12px;margin:6px 0">응답이 왔나요?</div><div class="seg" id="r1"><button data-v="1" class="on">응답 있음</button><button data-v="0">응답 없음</button></div>
      <div id="stockWrap"><div class="ttl" style="color:var(--muted);font-size:12px;margin:14px 0 6px">재고가 있었나요?</div><div class="seg" id="r2"><button data-v="1" class="on">재고 있었음</button><button data-v="0">재고 없었음</button></div></div>
      <div class="actions"><button class="btn btn-ghost" id="cx">취소</button><button class="btn btn-primary" id="ok">후기 등록</button></div>`, 'modal');
    const bind = (sel, key) => $$(sel + ' button', box).forEach(b => b.onclick = () => { st[key] = b.dataset.v === '1'; $$(sel + ' button', box).forEach(x => x.classList.toggle('on', x === b)); $('#stockWrap', box).style.display = st.replied ? '' : 'none'; });
    bind('#r1', 'replied'); bind('#r2', 'stock');
    $('#cx', box).onclick = closeOverlay;
    $('#ok', box).onclick = () => {
      const r = { replied: st.replied, stock: st.replied && st.stock, date: Date.now(), modelId: m.id };
      (S.myReviews[d.id] = S.myReviews[d.id] || []).push(r); save('myReviews');
      d.reviews.unshift({ ...r, date: new Date(r.date), mine: true }); recalc(d);
      closeOverlay(); toast('후기를 등록했어요'); route();
    };
  }

  // ---------- command palette ----------
  function palette() {
    const box = openOverlay(`<div class="in">${ic('search')}<input id="pq" placeholder="모델 번호 또는 이름으로 검색…" aria-label="Search commands" autocomplete="off"><span class="esc">Esc</span></div><div class="meta" id="pm"></div><div class="list" id="pl" role="menu"></div><div class="foot"><span>↑↓ 이동</span><span>↵ 열기</span></div>`, 'palette');
    const input = $('#pq', box), list = $('#pl', box), meta = $('#pm', box);
    let items = [], fi = 0;
    const hl = (t, q) => { if (!q) return esc(t); const re = new RegExp('(' + q.split(/\s+/).filter(Boolean).map(x => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'ig'); return esc(t).replace(re, '<mark>$1</mark>'); };
    const run = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) { meta.textContent = ''; list.innerHTML = `<div class="hint"><b>검색어를 입력해 보세요</b>모델 번호(예: 126610LN)나 시계 이름을 입력하세요. 한글 라인명(예: 데이토나)도 돼요.</div>`; items = []; return; }
      const terms = q.split(/\s+/);
      const all = MODELS.filter(m => { const hay = (m.name + ' ' + m.ref + ' ' + m.line + ' ' + brandById[m.brand].ko + ' ' + brandById[m.brand].en).toLowerCase(); return terms.every(t => hay.includes(t)); });
      const lineHit = [...new Set(all.map(m => m.brand + '|' + m.line))].filter(k => k.split('|')[1].toLowerCase().includes(q) || q.includes(k.split('|')[1].toLowerCase()));
      items = [...lineHit.map(k => ({ type: 'line', brand: k.split('|')[0], line: k.split('|')[1], n: all.filter(m => m.brand + '|' + m.line === k).length })), ...all.slice(0, 50).map(m => ({ type: 'model', m }))];
      meta.textContent = all.length ? `일치 ${all.length}개${all.length > 50 ? ' 중 상위 50개' : ''} 표시` : '';
      fi = 0;
      list.innerHTML = items.length ? items.map((it, i) => it.type === 'line'
        ? `<div class="it" data-i="${i}" role="menuitem"><div class="thumb" style="display:grid;place-items:center;color:var(--muted)">${ic('compass')}</div><div><div class="t">${esc(it.line)} · ${brandById[it.brand].ko}</div><div class="s">Explore에서 ${it.n}개 전체 보기</div></div></div>`
        : `<div class="it" data-i="${i}" role="menuitem"><div class="thumb">${watchImg(it.m, { crop: 'tight' })}</div><div style="min-width:0"><div class="t">${hl(it.m.name, q)}</div><div class="s">${hl(it.m.ref, q)} · ${esc(it.m.specs)}${it.m.discontinued ? ' #단종' : ''}</div></div><div class="p tabnum">${money(it.m.price)}<small>리테일가 대비 ${fmtPct(premiumOf(it.m))}${it.m.counts.wanted ? ' · 구함 ' + it.m.counts.wanted : ''}</small></div></div>`).join('')
        : `<div class="hint"><b>결과가 없어요</b>다른 모델 번호나 이름으로 검색해 보세요.</div>`;
      focus();
      $$('.it', list).forEach(el => { el.onmouseenter = () => { fi = +el.dataset.i; focus(false); }; el.onclick = () => open(+el.dataset.i); });
    };
    const focus = (scroll = true) => { $$('.it', list).forEach((el, i) => { el.classList.toggle('focus', i === fi); if (i === fi && scroll) el.scrollIntoView({ block: 'nearest' }); }); };
    const open = (i) => { const it = items[i]; if (!it) return; closeOverlay(); if (it.type === 'line') go('/app/explore', { brand: it.brand, line: it.line }); else go('/app/explore/' + it.m.id); };
    input.oninput = run;
    input.onkeydown = (e) => { if (e.key === 'ArrowDown') { e.preventDefault(); fi = Math.min(items.length - 1, fi + 1); focus(); } else if (e.key === 'ArrowUp') { e.preventDefault(); fi = Math.max(0, fi - 1); focus(); } else if (e.key === 'Enter') open(fi); };
    run(); input.focus();
  }
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay ? closeOverlay() : palette(); }
    else if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName) && !overlay) { e.preventDefault(); palette(); }
  });

  // ---------- broadcast ----------
  const GROUPS = ['HK Watch Dealers 🇭🇰', 'Rolex Only — Asia', 'Patek & AP Traders', 'Tokyo Ginza Network', 'Singapore Luxury Hub', 'Dubai Watch Market', 'KR 시계 딜러방', 'Taipei Collectors'].map((n, i) => ({ id: 'g' + i, name: n, members: 40 + ((i * 37) % 210) }));
  let qrTimer = null;
  function pageBroadcast(main) {
    clearInterval(qrTimer);
    if (!S.wa) {
      main.innerHTML = `<div style="display:flex;justify-content:flex-end;margin:8px 0 16px"><button class="btn btn-primary" disabled>${ic('plus')}새 Broadcast</button></div>
        <div class="card wa-card">
          <svg width="80" height="80" viewBox="0 0 24 24"><path fill="#25D366" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path fill="#fff" d="M17.4 14.6c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1a7.6 7.6 0 0 1-3.8-3.3c-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4a3.3 3.3 0 0 0-1 2.4c0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.9 4.3 1.8.8 2.5.8 3.4.7.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3z"/></svg>
          <h2>WhatsApp 로그인 필요</h2><div class="sub">메시지를 보내려면 WhatsApp 계정으로 로그인해 주세요</div>
          <canvas class="qr" id="qr" width="29" height="29"></canvas>
          <div class="how">WhatsApp 앱에서 설정 → 연결된 기기 → 기기 연결로 들어가 이 QR을 스캔해 주세요</div>
          <div class="warn">휴대폰 카메라 앱으로 스캔하면 연결이 안 될 수 있어요. 꼭 WhatsApp 앱 안에서 스캔해 주세요.</div>
          <div class="sub" id="qrLeft">60초 후 만료</div>
          <button class="btn btn-outline btn-sm" style="margin-top:14px" id="demoConnect">데모로 연결하기</button>
        </div>`;
      let left = 60; drawQR($('#qr'));
      qrTimer = setInterval(() => { const el = $('#qrLeft'); if (!el) return clearInterval(qrTimer); left--; if (left <= 0) { left = 60; drawQR($('#qr')); } el.textContent = `${left}초 후 만료`; }, 1000);
      $('#demoConnect').onclick = () => { S.wa = true; save('wa'); clearInterval(qrTimer); toast('WhatsApp에 연결했어요 (데모)'); route(); };
      return;
    }
    const sel = new Set();
    const fav = S.favorites.map(id => modelById[id]).filter(Boolean)[0] || MODELS[0];
    main.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin:8px 0 16px"><span class="result-count">연결됨 · +82 •••• (데모)</span><div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" id="disc">연결 해제</button><button class="btn btn-primary" id="newB">${ic('plus')}새 Broadcast</button></div></div>
      <div class="composer">
        <div class="card groups"><h3>딜러 그룹 <span class="result-count" id="selN">0개 선택</span></h3>${GROUPS.map(g => `<label class="grp"><div class="gi">${g.name.replace(/[^A-Za-z가-힣]/g, '').slice(0, 2).toUpperCase()}</div><div style="min-width:0"><div style="font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(g.name)}</div><small>멤버 ${g.members}명</small></div><input type="checkbox" data-g="${g.id}"></label>`).join('')}</div>
        <div class="card compose"><h3>메시지</h3>
          <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn btn-outline btn-sm" id="tplSell">판매 템플릿</button><button class="btn btn-outline btn-sm" id="tplBuy">구함 템플릿</button></div>
          <textarea id="msg" placeholder="딜러 그룹에 보낼 메시지를 입력하세요"></textarea>
          <div class="bubble-wrap"><div class="bubble" id="prev"><span style="color:#667781">미리보기</span><small>지금</small></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center"><span class="result-count">오늘 WA 발송 ${S.usage.sends} / ${LIMITS.sends}</span><button class="btn btn-success" id="send" disabled>${ic('send')}보내기</button></div>
          ${S.history.length ? `<div><h3 style="margin:14px 4px 4px">최근 발송</h3>${S.history.slice(0, 5).map(h => `<div class="history-item"><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:70%">${esc(h.text.split('\n')[0])}</span><span class="result-count">${h.groups}개 그룹 · ${new Date(h.at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span></div>`).join('')}</div>` : ''}
        </div></div>`;
    const msg = $('#msg'), prev = $('#prev'), send = $('#send');
    const sync = () => { prev.innerHTML = (msg.value ? esc(msg.value) : '<span style="color:#667781">미리보기</span>') + '<small>지금</small>'; send.disabled = !msg.value.trim() || !sel.size || S.usage.sends + sel.size > LIMITS.sends; $('#selN').textContent = `${sel.size}개 선택`; };
    msg.oninput = sync;
    $$('[data-g]', main).forEach(c => c.onchange = () => { c.checked ? sel.add(c.dataset.g) : sel.delete(c.dataset.g); sync(); });
    $('#tplSell').onclick = () => { msg.value = `📢 FOR SALE\n${fav.family} ${fav.dial}\nRef. ${fav.ref} · ${fav.specs}\nWarranty 2026 · Full set\nPrice: ${fmtMoney(fav.price, 'HKD')}\nDM for details`; sync(); };
    $('#tplBuy').onclick = () => { msg.value = `🔎 WANTED\n${fav.family} ${fav.dial}\nRef. ${fav.ref}\nNew / 2025+ card · HK delivery\nBest price please`; sync(); };
    $('#newB').onclick = () => { msg.value = ''; sync(); msg.focus(); };
    $('#disc').onclick = () => { S.wa = false; save('wa'); route(); };
    send.onclick = () => {
      S.usage.sends += sel.size; save('usage');
      S.history.unshift({ text: msg.value, groups: sel.size, at: Date.now() }); S.history = S.history.slice(0, 20); save('history');
      toast(`${sel.size}개 그룹에 보냈어요 (데모)`); route();
    };
  }
  function drawQR(cv) {
    if (!cv) return; const ctx = cv.getContext('2d'); const n = 29; const r = WH.rng(Date.now());
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, n, n); ctx.fillStyle = '#000';
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (r() < 0.48) ctx.fillRect(x, y, 1, 1);
    const finder = (ox, oy) => { ctx.fillStyle = '#000'; ctx.fillRect(ox, oy, 7, 7); ctx.fillStyle = '#fff'; ctx.fillRect(ox + 1, oy + 1, 5, 5); ctx.fillStyle = '#000'; ctx.fillRect(ox + 2, oy + 2, 3, 3); ctx.fillStyle = '#fff'; };
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 8, 8); ctx.fillRect(n - 8, 0, 8, 8); ctx.fillRect(0, n - 8, 8, 8);
    finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  }

  // ---------- settings ----------
  function pageSettings(main) {
    const c = S.countries.map(code => COUNTRIES.find(x => x[0] === code)).filter(Boolean);
    const trialEnd = new Date(Date.now() + 7 * 864e5);
    main.innerHTML = `<div class="settings">
      <section class="card set-card"><h2>계정</h2><div class="d">개인 계정 정보예요.</div>
        <div class="field"><label>아바타</label><div style="display:flex;align-items:center;gap:10px"><div class="avatar">${initials(S.name)}</div><button class="btn btn-outline btn-sm" id="avBtn">아바타 변경</button></div><span></span></div>
        <div class="field"><label for="nm">표시 이름</label><input type="text" id="nm" value="${esc(S.name)}"><button class="btn btn-primary btn-sm" id="saveName" disabled>저장</button></div>
        <div class="field"><label>이메일 주소</label><input type="text" value="demo@watchhub.app" disabled><span></span></div>
        <div class="field"><label>전화번호 <span class="pill ok" style="font-size:11px">인증됨</span></label><input type="text" value="+82 10-••••-••••" disabled><button class="btn btn-outline btn-sm" id="phoneBtn">번호 변경</button></div>
      </section>
      <section class="card set-card"><h2>딜러 프로필</h2><div class="d">다른 사용자에게 보이는 딜러 카드 정보예요. 리뷰는 별도로, 거래한 사람들이 남겨요.</div>
        <div class="field"><label>오프라인 매장 보유</label><small style="color:var(--muted)">매물과 딜러 카드에 매장 아이콘으로 표시돼요. 설정하지 않으면 아무것도 표시되지 않아요.</small><button class="switch ${S.storeFlag ? 'on' : ''}" id="storeSw" role="switch" aria-checked="${S.storeFlag}" aria-label="오프라인 매장 보유"></button></div>
        <div class="field"><label>거래 국가</label><small style="color:var(--muted)">해당하는 국가를 모두 선택해 주세요. 전화번호로 추정한 국가 대신 이 국기가 표시돼요.</small><button class="chip-btn" id="ctyBtn">${c.length ? c.map(x => x[2] + ' ' + x[0]).join(', ') : '미설정'} ${ic('chev')}</button></div>
      </section>
      <section class="card set-card"><h2>플랜 및 사용량</h2><div class="d">구독 플랜과 오늘의 사용 한도를 확인하세요.</div>
        <div class="plan"><span class="tag">무료 체험 · basic</span><span>체험 7일 남음</span><span class="result-count">체험 종료일 ${trialEnd.toLocaleDateString('ko-KR')}</span><span style="flex:1"></span><button class="btn btn-outline btn-sm" id="subBtn">구독 관리</button></div>
        <div class="usage"><div><small>딜러 연결</small><b class="tabnum">${S.usage.connects} / ${LIMITS.connects}</b><small>오늘 ${LIMITS.connects - S.usage.connects}회 남음</small></div><div><small>WA 발송</small><b class="tabnum">${S.usage.sends} / ${LIMITS.sends}</b><small>오늘 ${LIMITS.sends - S.usage.sends}회 남음</small></div><div><small>기기</small><b>1 / 1</b><small>사용 중</small></div></div>
        <div class="result-count" style="margin-top:10px">딜러 연결과 WA 발송은 매일 한국 자정(오전 12:00 KST)에 리셋돼요.</div>
      </section>
      <section class="card set-card"><h2>환경설정</h2><div class="d">언어, 통화, 리테일 가격 지역, 테마.</div>
        <div class="field"><label>언어</label><span></span><button class="chip-btn" id="langBtn">${S.lang === 'KO' ? '🇰🇷 KO' : '🇺🇸 EN'} ${ic('chev')}</button></div>
        <div class="field"><label>통화</label><span></span><button class="chip-btn" id="curBtn">${WH.FX[S.currency].sym} ${S.currency} ${ic('chev')}</button></div>
        <div class="field"><label>리테일 가격</label><span></span><button class="chip-btn" id="rgBtn">리테일 ${S.retailRegion} ${ic('chev')}</button></div>
        <div class="field"><label>다크 모드</label><span></span><button class="switch ${S.theme === 'dark' ? 'on' : ''}" id="themeSw" role="switch" aria-label="다크 모드"></button></div>
      </section>
      <section class="card set-card"><h2>계정 작업</h2><div class="d">결제와 세션을 관리해요.</div>
        <div class="field"><label>청구</label><span></span><button class="btn btn-outline btn-sm" id="billBtn">청구 보기</button></div>
        <div class="field"><label>데모 데이터</label><small style="color:var(--muted)">즐겨찾기, 연결, 후기, 사용량을 초기화해요.</small><button class="btn btn-outline btn-sm" id="resetBtn">초기화</button></div>
        <div class="field"><label>세션</label><span></span><button class="btn btn-outline btn-sm" id="outBtn">로그아웃</button></div>
      </section>
      <div class="foot-legal"><a href="#/app/settings">이용약관</a> · <a href="#/app/settings">개인정보보호</a> · <a href="credits.html">사진 출처</a><br>© ${new Date().getFullYear()} Watch HUB (demo). 모든 시세·딜러 데이터는 가상 데이터예요.</div>
    </div>`;
    const nm = $('#nm'); nm.oninput = () => $('#saveName').disabled = !nm.value.trim() || nm.value === S.name;
    $('#saveName').onclick = () => { S.name = nm.value.trim(); save('name'); paintUser(); toast('이름을 저장했어요'); route(); };
    $('#storeSw').onclick = (e) => { S.storeFlag = !S.storeFlag; save('storeFlag'); e.currentTarget.classList.toggle('on', S.storeFlag); };
    $('#ctyBtn').onclick = (e) => {
      closePops(); const anchor = e.currentTarget; const pop = document.createElement('div'); pop.className = 'pop'; pop._anchor = anchor; anchor.setAttribute('data-pop-anchor', '');
      pop.innerHTML = '<div class="ttl">거래 국가</div>' + COUNTRIES.map(x => `<label class="mi"><input type="checkbox" data-c="${x[0]}" ${S.countries.includes(x[0]) ? 'checked' : ''}> ${x[2]} ${x[1]}</label>`).join('');
      placePop(pop, anchor, true);
      $$('[data-c]', pop).forEach(cb => cb.onchange = () => { S.countries = $$('[data-c]', pop).filter(x => x.checked).map(x => x.dataset.c); save('countries'); const cc = S.countries.map(code => COUNTRIES.find(x => x[0] === code)); anchor.innerHTML = (cc.length ? cc.map(x => x[2] + ' ' + x[0]).join(', ') : '미설정') + ' ' + ic('chev'); });
    };
    $('#langBtn').onclick = (e) => menu(e.currentTarget, '언어', [['KO', '🇰🇷 한국어'], ['EN', '🇺🇸 English (준비 중)']], S.lang, v => { S.lang = v; save('lang'); route(); }, true);
    $('#curBtn').onclick = (e) => menu(e.currentTarget, '통화', Object.keys(WH.FX).map(k => [k, `${WH.FX[k].sym} ${k}`]), S.currency, v => { S.currency = v; save('currency'); toast(`통화를 ${v}로 바꿨어요`); route(); }, true);
    $('#rgBtn').onclick = (e) => menu(e.currentTarget, '리테일 가격 지역', Object.keys(REGION).map(k => [k, '리테일 ' + k]), S.retailRegion, v => { S.retailRegion = v; save('retailRegion'); route(); }, true);
    $('#themeSw').onclick = () => setTheme(S.theme === 'dark' ? 'light' : 'dark');
    $('#resetBtn').onclick = () => { ['favorites', 'connected', 'myReviews', 'history', 'usage', 'wa', 'tourDone', 'notifRead'].forEach(k => localStorage.removeItem('wh_' + k)); location.reload(); };
    ['avBtn', 'phoneBtn', 'subBtn', 'billBtn'].forEach(id => $('#' + id).onclick = () => toast('데모에서는 지원하지 않는 기능이에요'));
    $('#outBtn').onclick = () => { location.href = 'index.html'; };
  }
  function setTheme(t) { S.theme = t; save('theme'); document.documentElement.className = t; if (parseHash().path === '/app/settings') route(); }
  const initials = (n) => n.split(/\s+/).map(x => x[0]).join('').slice(0, 2).toUpperCase();
  function paintUser() { $('#userBtn').textContent = initials(S.name); }

  // ---------- topbar actions ----------
  $('#toggleSide').onclick = () => { const s = $('#shell'); if (innerWidth < 860) s.classList.toggle('open'); else s.classList.toggle('collapsed'); };
  $('#searchBtn').onclick = palette;
  $('#helpBtn').onclick = () => toast('도움말: ⌘K(또는 /)로 모델 검색, 별표로 관심 모델 등록');
  const NOTIFS = [
    () => { const m = [...MODELS].sort((a, b) => b.dayChange - a.dayChange)[0]; return { t: `${m.family} ${m.ref} 시세가 ${fmtPct(m.dayChange)} 올랐어요`, s: '급변동 알림 · 오늘', href: '#/app/explore/' + m.id }; },
    () => ({ t: 'Broadcast 베타가 열렸어요', s: 'WhatsApp 딜러 그룹에 한 번에 보내기', href: '#/app/broadcast' })
  ];
  function paintNotifDot() { $('#notifDot').style.display = S.notifRead ? 'none' : ''; }
  $('#notifBtn').onclick = (e) => {
    const anchor = e.currentTarget; if (openPop && openPop._anchor === anchor) return closePops(); closePops();
    const pop = document.createElement('div'); pop.className = 'pop'; pop.style.width = '320px'; pop._anchor = anchor; anchor.setAttribute('data-pop-anchor', '');
    pop.innerHTML = '<div class="ttl">알림</div>' + NOTIFS.map(f => f()).map(n => `<a class="mi" href="${n.href}">${ic('bell')}<span>${esc(n.t)}<span class="sub">${esc(n.s)}</span></span></a>`).join('');
    placePop(pop, anchor, true); pop.onclick = () => closePops();
    S.notifRead = true; save('notifRead'); paintNotifDot();
  };
  $('#userBtn').onclick = (e) => {
    const anchor = e.currentTarget; if (openPop && openPop._anchor === anchor) return closePops(); closePops();
    const pop = document.createElement('div'); pop.className = 'pop'; pop._anchor = anchor; anchor.setAttribute('data-pop-anchor', '');
    pop.innerHTML = `<div style="padding:10px 10px 6px"><b>${esc(S.name)}</b><div class="result-count">demo@watchhub.app</div></div><div class="sep"></div>
      <button class="mi" id="umTheme">${ic('moon')}다크 모드<span class="ck">${S.theme === 'dark' ? ic('check') : ''}</span></button>
      <a class="mi" href="#/app/settings">${ic('gear')}설정</a><a class="mi" href="index.html">${ic('globe')}소비자 사이트로</a><div class="sep"></div><a class="mi" href="index.html">${ic('out')}로그아웃</a>`;
    placePop(pop, anchor, true);
    $('#umTheme', pop).onclick = () => { closePops(); setTheme(S.theme === 'dark' ? 'light' : 'dark'); };
  };

  // ---------- coach marks ----------
  function coach(step) {
    $$('.coach').forEach(x => x.remove());
    if (S.tourDone) return;
    const steps = [
      { anchor: () => $('[data-nav="/app/broadcast"]'), t: '한 번 쓰고 모든 그룹에', d: 'WhatsApp을 한 번 연결하면 딜러 그룹 전체에 한 번에 보내요.', cta: ['Broadcast 열기', '#/app/broadcast'] },
      { anchor: () => $('#searchBtn'), t: '어디서든 ⌘K', d: '모델 번호나 이름으로 바로 검색하고, 별표로 관심 모델을 등록하면 개요에서 시세 변동을 볼 수 있어요.', cta: ['Explore 열기', '#/app/explore'], below: true }
    ];
    const s = steps[step]; if (!s) { S.tourDone = true; save('tourDone'); return; }
    const a = s.anchor(); if (!a) return;
    const el = document.createElement('div'); el.className = 'coach'; el.setAttribute('role', 'dialog');
    el.innerHTML = `<h4>${s.t}</h4><p>${s.d}</p><div class="row2"><span class="n">${step + 1}/${steps.length}</span><button class="btn btn-ghost btn-sm" data-a="skip">건너뛰기</button><button class="btn btn-ghost btn-sm" data-a="next">${step === steps.length - 1 ? '완료' : '다음'}</button><button class="btn btn-primary btn-sm" data-a="go">${s.cta[0]}</button></div>`;
    document.body.appendChild(el);
    const r = a.getBoundingClientRect();
    if (s.below) { el.classList.add('below'); el.style.top = (r.bottom + 12) + 'px'; el.style.left = Math.max(8, r.right - 384) + 'px'; }
    else { el.style.top = (r.top - 54) + 'px'; el.style.left = (r.right + 12) + 'px'; }
    el.onclick = (e) => { const b = e.target.closest('[data-a]'); if (!b) return; const act = b.dataset.a; if (act === 'skip') { S.tourDone = true; save('tourDone'); el.remove(); } else if (act === 'next') { el.remove(); coach(step + 1); } else { S.tourDone = true; save('tourDone'); el.remove(); location.hash = s.cta[1]; } };
  }

  // ---------- toast ----------
  let toastT;
  function toast(t) { $$('.toast').forEach(x => x.remove()); const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.appendChild(el); clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 2400); }

  // ---------- boot ----------
  (function ticker() { const arr = [...MODELS].sort((a, b) => Math.abs(b.dayChange) - Math.abs(a.dayChange)).slice(0, 24); const one = arr.map(m => `<a class="tick" href="#/app/explore/${m.id}">${esc(m.family)} <span>${esc(m.ref.split(/[.-]/)[0])}</span><b>${money(m.price)}</b><i class="${m.dayChange >= 0 ? 'u' : 'd'}">${m.dayChange >= 0 ? '▲' : '▼'} ${fmtPct(Math.abs(m.dayChange))}</i></a>`).join(''); $('#ticker').innerHTML = `<div class="ticker-in">${one}${one}</div>`; })();
  paintUser(); paintNotifDot();
  if (!location.hash) location.hash = '#/app';
  route();
  setTimeout(() => coach(0), 500);
  window.addEventListener('resize', () => { $$('.coach').forEach(x => x.remove()); });
})();
